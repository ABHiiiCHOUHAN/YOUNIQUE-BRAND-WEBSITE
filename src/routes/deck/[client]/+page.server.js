import { error, fail } from '@sveltejs/kit';
import path from 'path';
import { readJson } from '$lib/server/jsonStore.js';
import {
	deckCookieName,
	deckLockCookieName,
	verifyDeckPasscode,
	verifyDeckToken,
	setDeckCookie,
	clearDeckCookie
} from '$lib/server/deckAuth.js';

const DB_PATH = path.resolve('src/lib/data/decks.json');

export async function load({ params, cookies, locals }) {
	const slug = params.client.toLowerCase();
	const decks = await readJson(DB_PATH, []);
	const deck = (Array.isArray(decks) ? decks : []).find((d) => d.slug === slug);

	if (!deck) {
		throw error(404, 'Presentation deck not found.');
	}

	const isManuallyLocked = cookies.get(deckLockCookieName(slug)) === '1';
	const token = cookies.get(deckCookieName(slug));
	const isUnlocked = !isManuallyLocked && Boolean(locals.isAdmin || verifyDeckToken(slug, token));

	if (!isUnlocked) {
		return {
			unlocked: false,
			slug: deck.slug,
			clientName: deck.clientName,
			title: deck.title
		};
	}

	const { passcodeHash, ...safeDeck } = deck;
	return {
		unlocked: true,
		deck: safeDeck
	};
}

export const actions = {
	unlock: async ({ request, params, cookies }) => {
		const slug = params.client.toLowerCase();
		const formData = await request.formData();
		const passcode = formData.get('passcode');

		if (!passcode || typeof passcode !== 'string') {
			return fail(400, { error: 'Please enter the client access code.' });
		}

		const decks = await readJson(DB_PATH, []);
		const deck = (Array.isArray(decks) ? decks : []).find((d) => d.slug === slug);

		if (!deck) {
			return fail(404, { error: 'Presentation deck not found.' });
		}

		if (!verifyDeckPasscode(passcode, deck.passcodeHash)) {
			return fail(401, { error: 'Invalid access code. Please check your invitation.' });
		}

		setDeckCookie(cookies, slug);
		return { unlocked: true };
	},
	lock: async ({ params, cookies }) => {
		const slug = params.client.toLowerCase();
		clearDeckCookie(cookies, slug);
		return { locked: true };
	}
};
