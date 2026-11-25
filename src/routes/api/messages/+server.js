import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import path from 'path';
import { checkRateLimit } from '$lib/server/rateLimit.js';
import { readJson, updateJson } from '$lib/server/jsonStore.js';

const DB_PATH = path.resolve('src/lib/data/messages.json');
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_NAME_LEN = 100;
const MAX_EMAIL_LEN = 254;
const MAX_MOBILE_LEN = 25;
const MAX_MESSAGE_LEN = 2000;
const MAX_STORED_MESSAGES = 1000;

export async function GET({ locals }) {
	if (!locals.isAdmin) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}
	try {
		const messages = await readJson(DB_PATH, []);
		const list = Array.isArray(messages) ? [...messages] : [];
		list.sort((a, b) => new Date(b.date) - new Date(a.date));
		return json(list);
	} catch (err) {
		return json([]);
	}
}

export async function POST({ request, getClientAddress }) {
	try {
		// 1. Rate Limiting (max 4 submissions per IP per 10 minutes)
		let clientIp = 'unknown';
		try {
			clientIp = getClientAddress();
		} catch {
			clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
		}

		const rate = checkRateLimit(clientIp);
		if (!rate.allowed) {
			return json(
				{ error: 'Too many submissions. Please wait a few minutes before trying again.' },
				{
					status: 429,
					headers: { 'Retry-After': String(rate.retryAfterSeconds) }
				}
			);
		}

		const body = await request.json();
		const {
			name,
			email,
			mobile,
			message,
			services,
			budget,
			timeline,
			website_url_confirm,
			turnstileToken
		} = body || {};

		// 2. Honeypot check
		if (typeof website_url_confirm === 'string' && website_url_confirm.trim().length > 0) {
			return json({ success: true });
		}

		// 3. Optional Cloudflare Turnstile verification
		if (env.TURNSTILE_SECRET_KEY) {
			if (!turnstileToken || typeof turnstileToken !== 'string') {
				return json({ error: 'Bot verification failed.' }, { status: 400 });
			}
			const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: new URLSearchParams({
					secret: env.TURNSTILE_SECRET_KEY,
					response: turnstileToken,
					remoteip: clientIp
				})
			});
			const verifyData = await verifyRes.json();
			if (!verifyData.success) {
				return json({ error: 'Bot verification failed.' }, { status: 400 });
			}
		}

		// 4. Strict Validation & Character Limits
		if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') {
			return json({ error: 'Invalid input format.' }, { status: 400 });
		}

		const cleanName = name.trim();
		const cleanEmail = email.trim();
		const cleanMobile = typeof mobile === 'string' ? mobile.trim() : '';
		const cleanMessage = message.trim();

		if (!cleanName || !cleanEmail || !cleanMessage) {
			return json({ error: 'Missing required fields.' }, { status: 400 });
		}

		if (cleanName.length > MAX_NAME_LEN) {
			return json({ error: `Name must be ${MAX_NAME_LEN} characters or less.` }, { status: 400 });
		}

		if (cleanEmail.length > MAX_EMAIL_LEN || !EMAIL_REGEX.test(cleanEmail)) {
			return json({ error: 'Please provide a valid email address.' }, { status: 400 });
		}

		if (cleanMobile.length > MAX_MOBILE_LEN) {
			return json({ error: 'Invalid mobile number length.' }, { status: 400 });
		}

		if (cleanMessage.length > MAX_MESSAGE_LEN) {
			return json(
				{ error: `Message must be ${MAX_MESSAGE_LEN} characters or less.` },
				{ status: 400 }
			);
		}

		const cleanServices = Array.isArray(services)
			? services.filter((s) => typeof s === 'string').map((s) => s.trim().slice(0, 60)).slice(0, 8)
			: [];
		const cleanBudget = typeof budget === 'string' ? budget.trim().slice(0, 50) : '';
		const cleanTimeline = typeof timeline === 'string' ? timeline.trim().slice(0, 50) : '';

		const newMessage = {
			id: Date.now().toString(),
			name: cleanName,
			email: cleanEmail,
			mobile: cleanMobile,
			services: cleanServices,
			budget: cleanBudget,
			timeline: cleanTimeline,
			message: cleanMessage,
			date: new Date().toISOString(),
			status: 'new'
		};

		await updateJson(DB_PATH, [], (current) => {
			let list = Array.isArray(current) ? [...current] : [];
			if (list.length >= MAX_STORED_MESSAGES) {
				list = list.slice(-(MAX_STORED_MESSAGES - 1));
			}
			list.push(newMessage);
			return { data: list, result: newMessage };
		});

		return json(newMessage, { status: 201 });
	} catch (err) {
		console.error('API Error:', err);
		return json({ error: 'Internal Server Error' }, { status: 500 });
	}
}

export async function DELETE({ url, locals }) {
	if (!locals.isAdmin) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const id = url.searchParams.get('id');
	if (!id) return json({ error: 'Missing ID' }, { status: 400 });

	try {
		await updateJson(DB_PATH, [], (current) => {
			const list = Array.isArray(current) ? current.filter((m) => m.id !== id) : [];
			return { data: list, result: true };
		});
		return json({ success: true });
	} catch (err) {
		return json({ error: 'Internal Server Error' }, { status: 500 });
	}
}
