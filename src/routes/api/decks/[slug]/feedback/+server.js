import { json } from '@sveltejs/kit';
import path from 'path';
import { readJson, updateJson } from '$lib/server/jsonStore.js';
import { deckCookieName, deckLockCookieName, verifyDeckToken } from '$lib/server/deckAuth.js';
import { checkRateLimit } from '$lib/server/rateLimit.js';
import { sanitizePlainText } from '$lib/sanitize.js';

const DECKS_PATH = path.resolve('src/lib/data/decks.json');
const REVIEWS_PATH = path.resolve('src/lib/data/reviews.json');
const DEFAULT_PLACEHOLDER = '/assets/reviews/default-placeholder.svg';
const NOTE_COLORS = ['#FFE499', '#D1E8FF', '#FFD4E9', '#E2FFD1', '#E8D1FF', '#D6FFFA'];

export async function POST({ params, request, cookies, locals, getClientAddress }) {
	const slug = String(params.slug || '').toLowerCase();
	const isManuallyLocked = cookies.get(deckLockCookieName(slug)) === '1';
	const token = cookies.get(deckCookieName(slug));
	const isUnlocked = !isManuallyLocked && Boolean(locals.isAdmin || verifyDeckToken(slug, token));

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
		const { stars, comment, reviewerName, reviewerRole, kind, reviewId } = await request.json();
		const parsedStars =
			typeof stars === 'number' && Number.isInteger(stars) && stars >= 1 && stars <= 5
				? stars
				: null;
		const cleanComment = sanitizePlainText(comment || '').trim().slice(0, 2000);
		const cleanReviewer = sanitizePlainText(reviewerName || '').trim().slice(0, 120);
		const cleanRole = sanitizePlainText(reviewerRole || '').trim().slice(0, 140);
		const entryKind = kind === 'review' ? 'review' : 'rating';

		if (!cleanComment && !parsedStars) {
			return json(
				{ error: 'Please select a star rating or leave a brief note on your experience.' },
				{ status: 400 }
			);
		}

		const decks = await readJson(DECKS_PATH, []);
		const deck = (Array.isArray(decks) ? decks : []).find((d) => d.slug === slug);
		if (!deck) {
			return json({ error: 'Deck not found.' }, { status: 404 });
		}

		const resolvedRole = cleanRole || deck.clientCompany || 'Client Partner';
		const authorName = cleanReviewer || deck.clientName || 'Client Partner';

		const saved = await updateJson(
			REVIEWS_PATH,
			{ placeholderImg: DEFAULT_PLACEHOLDER, reviews: [] },
			(current) => {
				const list = Array.isArray(current?.reviews) ? [...current.reviews] : [];
				const placeholderImg = current?.placeholderImg || DEFAULT_PLACEHOLDER;

				// If submitting a follow-up testimonial immediately after a star rating, update that entry
				if (reviewId && typeof reviewId === 'string') {
					const idx = list.findIndex(
						(r) => String(r.id) === reviewId && r.deckSlug === slug
					);
					if (idx !== -1) {
						const prev = list[idx];
						const next = {
							...prev,
							author: authorName || prev.author,
							role: cleanRole || deck.clientCompany || prev.role || 'Client Partner',
							text: cleanComment || prev.text,
							stars: parsedStars || prev.stars,
							kind: entryKind
						};
						list[idx] = next;
						return {
							data: { placeholderImg, reviews: list },
							result: next
						};
					}
				}

				const newEntry = {
					id: `rev_${Date.now()}`,
					author: authorName,
					role: resolvedRole,
					text: cleanComment,
					stars: parsedStars || 5,
					img: '',
					shape: 'circle',
					color: NOTE_COLORS[list.length % NOTE_COLORS.length],
					live: false,
					source: 'deck',
					kind: entryKind,
					deckSlug: slug,
					deckTitle: deck.title,
					createdAt: new Date().toISOString()
				};

				list.unshift(newEntry);
				return {
					data: { placeholderImg, reviews: list },
					result: newEntry
				};
			}
		);

		return json({ success: true, reviewId: saved.id }, { status: 201 });
	} catch (err) {
		console.error('Deck feedback error:', err);
		return json({ error: 'Failed to submit feedback.' }, { status: 500 });
	}
}
