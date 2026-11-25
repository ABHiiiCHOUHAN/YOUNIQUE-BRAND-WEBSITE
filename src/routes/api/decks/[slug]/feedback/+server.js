import { json } from '@sveltejs/kit';
import path from 'path';
import { readJson, updateJson } from '$lib/server/jsonStore.js';
import { deckCookieName, verifyDeckToken } from '$lib/server/deckAuth.js';
import { checkRateLimit } from '$lib/server/rateLimit.js';

const DECKS_PATH = path.resolve('src/lib/data/decks.json');
const MESSAGES_PATH = path.resolve('src/lib/data/messages.json');

export async function POST({ params, request, cookies, locals, getClientAddress }) {
	const slug = String(params.slug || '').toLowerCase();
	const token = cookies.get(deckCookieName(slug));
	const isUnlocked = Boolean(locals.isAdmin || verifyDeckToken(slug, token));

	if (!isUnlocked) {
		return json({ error: 'Unauthorized: Please unlock the presentation deck first.' }, { status: 401 });
	}

	let clientIp = 'unknown';
	try {
		clientIp = getClientAddress();
	} catch {
		clientIp = 'unknown';
	}
	const rate = checkRateLimit(`deck-feedback:${clientIp}`);
	if (!rate.allowed) {
		return json({ error: 'Please wait a moment before submitting more feedback.' }, { status: 429 });
	}

	try {
		const { rating, comment } = await request.json();
		const cleanComment = typeof comment === 'string' ? comment.trim().slice(0, 2000) : '';
		const cleanRating = typeof rating === 'string' ? rating.trim().slice(0, 40) : '';

		if (!cleanComment && !cleanRating) {
			return json({ error: 'Please share a rating or brief note on your experience.' }, { status: 400 });
		}

		const decks = await readJson(DECKS_PATH, []);
		const deck = (Array.isArray(decks) ? decks : []).find((d) => d.slug === slug);
		if (!deck) {
			return json({ error: 'Deck not found.' }, { status: 404 });
		}

		const clientDisplay = deck.clientCompany
			? `${deck.clientName} (${deck.clientCompany})`
			: deck.clientName;

		const newFeedback = {
			id: Date.now().toString(),
			name: `[DECK REVIEW] ${clientDisplay}`,
			email: `deck/${slug}`,
			mobile: '',
			services: [`Deck: ${deck.title}`],
			budget: cleanRating ? `Experience: ${cleanRating}` : '',
			timeline: deck.version || '',
			message: cleanComment || `Submitted experience rating: ${cleanRating}`,
			date: new Date().toISOString(),
			status: 'new'
		};

		await updateJson(MESSAGES_PATH, [], (current) => {
			const list = Array.isArray(current) ? [...current] : [];
			if (list.length >= 1000) list.splice(0, list.length - 999);
			list.push(newFeedback);
			return { data: list, result: newFeedback };
		});

		return json({ success: true }, { status: 201 });
	} catch (err) {
		console.error('Deck feedback error:', err);
		return json({ error: 'Failed to submit feedback.' }, { status: 500 });
	}
}
