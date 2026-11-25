import { json } from '@sveltejs/kit';
import path from 'path';
import { updateJson } from '$lib/server/jsonStore.js';
import { sanitizePlainText } from '$lib/sanitize.js';

const REVIEWS_PATH = path.resolve('src/lib/data/reviews.json');
const DEFAULT_PLACEHOLDER = '/assets/reviews/default-placeholder.svg';
const VALID_SHAPES = new Set(['circle', 'hexagon', 'star']);

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

export async function PUT({ params, request, locals }) {
	if (!locals.isAdmin) {
		return json({ error: 'Unauthorized: Admin authentication required.' }, { status: 401 });
	}

	const id = String(params.id || '');
	if (!id) return json({ error: 'Review ID required.' }, { status: 400 });

	try {
		const updates = await request.json();
		let found = false;

		const updated = await updateJson(
			REVIEWS_PATH,
			{ placeholderImg: DEFAULT_PLACEHOLDER, reviews: [] },
			(current) => {
				const list = Array.isArray(current?.reviews) ? [...current.reviews] : [];
				const idx = list.findIndex((r) => String(r.id) === id);
				if (idx === -1) {
					return { data: current, result: null };
				}
				found = true;
				const prev = list[idx];
				const next = {
					...prev,
					author:
						typeof updates.author === 'string'
							? sanitizePlainText(updates.author).slice(0, 120) || prev.author
							: prev.author,
					role:
						typeof updates.role === 'string'
							? sanitizePlainText(updates.role).slice(0, 140)
							: prev.role,
					text:
						typeof updates.text === 'string'
							? sanitizePlainText(updates.text).slice(0, 2000)
							: prev.text,
					stars:
						Number.isInteger(Number(updates.stars)) &&
						Number(updates.stars) >= 1 &&
						Number(updates.stars) <= 5
							? Number(updates.stars)
							: prev.stars,
					img: typeof updates.img === 'string' ? sanitizeUrl(updates.img) : prev.img,
					shape: VALID_SHAPES.has(updates.shape) ? updates.shape : prev.shape,
					color:
						typeof updates.color === 'string' && /^#[0-9a-fA-F]{6}$/.test(updates.color.trim())
							? updates.color.trim()
							: prev.color,
					live: typeof updates.live === 'boolean' ? updates.live : prev.live
				};
				list[idx] = next;
				return {
					data: {
						placeholderImg: sanitizeUrl(current?.placeholderImg) || DEFAULT_PLACEHOLDER,
						reviews: list
					},
					result: next
				};
			}
		);

		if (!found || !updated) {
			return json({ error: 'Review not found.' }, { status: 404 });
		}

		return json(updated);
	} catch (err) {
		console.error('Reviews PUT error:', err);
		return json({ error: 'Failed to update review.' }, { status: 500 });
	}
}

export async function DELETE({ params, locals }) {
	if (!locals.isAdmin) {
		return json({ error: 'Unauthorized: Admin authentication required.' }, { status: 401 });
	}

	const id = String(params.id || '');
	if (!id) return json({ error: 'Review ID required.' }, { status: 400 });

	let removed = false;
	await updateJson(
		REVIEWS_PATH,
		{ placeholderImg: DEFAULT_PLACEHOLDER, reviews: [] },
		(current) => {
			const list = Array.isArray(current?.reviews) ? current.reviews : [];
			const filtered = list.filter((r) => {
				if (String(r.id) === id) {
					removed = true;
					return false;
				}
				return true;
			});
			return {
				data: {
					placeholderImg: sanitizeUrl(current?.placeholderImg) || DEFAULT_PLACEHOLDER,
					reviews: filtered
				},
				result: removed
			};
		}
	);

	if (!removed) return json({ error: 'Review not found.' }, { status: 404 });
	return json({ success: true });
}
