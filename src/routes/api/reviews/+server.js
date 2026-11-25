import { json } from '@sveltejs/kit';
import path from 'path';
import { readJson, updateJson } from '$lib/server/jsonStore.js';
import { sanitizePlainText } from '$lib/sanitize.js';

const REVIEWS_PATH = path.resolve('src/lib/data/reviews.json');
const DEFAULT_PLACEHOLDER = '/assets/reviews/default-placeholder.svg';
const VALID_SHAPES = new Set(['circle', 'hexagon', 'star']);
const DEFAULT_COLORS = [
	'#FFD4E9',
	'#D1E8FF',
	'#FFE499',
	'#E2FFD1',
	'#FFFAFF',
	'#D6FFFA',
	'#E8D1FF',
	'#FFD1D1'
];

function sanitizeUrl(val) {
	if (typeof val !== 'string') return '';
	const trimmed = val.trim().slice(0, 500);
	if (!trimmed) return '';
	if (trimmed.startsWith('/')) return trimmed;
	try {
		const u = new URL(trimmed);
		if (u.protocol === 'https:' || u.protocol === 'http:') return u.href;
	} catch {
		return '';
	}
	return '';
}

export async function GET({ url, locals }) {
	const store = await readJson(REVIEWS_PATH, {
		placeholderImg: DEFAULT_PLACEHOLDER,
		reviews: []
	});
	const placeholderImg = sanitizeUrl(store?.placeholderImg) || DEFAULT_PLACEHOLDER;
	const list = Array.isArray(store?.reviews) ? store.reviews : [];
	const includeAll = url.searchParams.get('scope') === 'admin' && Boolean(locals.isAdmin);

	return json({
		placeholderImg,
		reviews: includeAll ? list : list.filter((r) => Boolean(r.live) && Boolean(r.text?.trim()))
	});
}

export async function POST({ request, locals }) {
	if (!locals.isAdmin) {
		return json({ error: 'Unauthorized: Admin authentication required.' }, { status: 401 });
	}

	try {
		const body = await request.json();

		if (body?.action === 'setPlaceholder') {
			const cleanPlaceholder = sanitizeUrl(body.placeholderImg) || DEFAULT_PLACEHOLDER;
			const result = await updateJson(
				REVIEWS_PATH,
				{ placeholderImg: DEFAULT_PLACEHOLDER, reviews: [] },
				(current) => {
					const next = {
						placeholderImg: cleanPlaceholder,
						reviews: Array.isArray(current?.reviews) ? current.reviews : []
					};
					return { data: next, result: { placeholderImg: cleanPlaceholder } };
				}
			);
			return json(result);
		}

		const author = sanitizePlainText(body?.author || '').slice(0, 120);
		const role = sanitizePlainText(body?.role || '').slice(0, 140);
		const text = sanitizePlainText(body?.text || '').slice(0, 2000);
		const parsedStars = Number(body?.stars);
		const stars =
			Number.isInteger(parsedStars) && parsedStars >= 1 && parsedStars <= 5 ? parsedStars : 5;
		const img = sanitizeUrl(body?.img || '');
		const shape = VALID_SHAPES.has(body?.shape) ? body.shape : 'circle';
		const color =
			typeof body?.color === 'string' && /^#[0-9a-fA-F]{6}$/.test(body.color.trim())
				? body.color.trim()
				: DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)];
		const live = Boolean(body?.live);

		if (!author || !text) {
			return json({ error: 'Author name and review text are required.' }, { status: 400 });
		}

		const newReview = {
			id: `rev_${Date.now()}`,
			author,
			role: role || 'Verified Client',
			text,
			stars,
			img,
			shape,
			color,
			live,
			source: 'admin',
			createdAt: new Date().toISOString()
		};

		await updateJson(
			REVIEWS_PATH,
			{ placeholderImg: DEFAULT_PLACEHOLDER, reviews: [] },
			(current) => {
				const list = Array.isArray(current?.reviews) ? [newReview, ...current.reviews] : [newReview];
				return {
					data: {
						placeholderImg: sanitizeUrl(current?.placeholderImg) || DEFAULT_PLACEHOLDER,
						reviews: list
					},
					result: newReview
				};
			}
		);

		return json(newReview, { status: 201 });
	} catch (err) {
		console.error('Reviews POST error:', err);
		return json({ error: 'Failed to save review.' }, { status: 500 });
	}
}
