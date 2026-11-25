import { json } from '@sveltejs/kit';
import path from 'path';
import { updateJson } from '$lib/server/jsonStore.js';
import { hashDeckPasscode } from '$lib/server/deckAuth.js';

const DB_PATH = path.resolve('src/lib/data/decks.json');

export async function PUT({ params, request, locals }) {
	if (!locals.isAdmin) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { slug } = params;
	const { clientName, clientCompany, title, version, passcode, notes, deliverables } =
		await request.json();

	const updated = await updateJson(DB_PATH, [], (decks) => {
		const list = Array.isArray(decks) ? [...decks] : [];
		const index = list.findIndex((d) => d.slug === slug);
		if (index === -1) return { result: null };

		const existing = list[index];
		const nextDeck = {
			...existing,
			...(clientName !== undefined && { clientName: String(clientName).trim() }),
			...(clientCompany !== undefined && { clientCompany: String(clientCompany).trim() }),
			...(title !== undefined && { title: String(title).trim() }),
			...(version !== undefined && { version: String(version).trim() }),
			...(notes !== undefined && { notes: String(notes).trim() }),
			updatedAt: new Date().toISOString().split('T')[0],
			...(passcode && String(passcode).trim()
				? { passcodeHash: hashDeckPasscode(String(passcode).trim()) }
				: {}),
			...(Array.isArray(deliverables) && {
				deliverables: deliverables
					.filter((d) => d && (d.title || d.url))
					.map((d) => ({
						title: String(d.title || 'Deliverable').trim(),
						type: ['image', 'video', 'link'].includes(d.type) ? d.type : 'link',
						url: String(d.url || '').trim(),
						notes: String(d.notes || '').trim()
					}))
			})
		};

		list[index] = nextDeck;
		const { passcodeHash, ...safeDeck } = nextDeck;
		return { data: list, result: { ...safeDeck, hasPasscode: Boolean(passcodeHash) } };
	});

	if (!updated) return json({ error: 'Deck not found' }, { status: 404 });
	return json(updated);
}

export async function DELETE({ params, locals }) {
	if (!locals.isAdmin) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { slug } = params;

	const deleted = await updateJson(DB_PATH, [], (decks) => {
		const list = Array.isArray(decks) ? decks : [];
		const filtered = list.filter((d) => d.slug !== slug);
		if (filtered.length === list.length) return { result: false };
		return { data: filtered, result: true };
	});

	if (!deleted) return json({ error: 'Deck not found' }, { status: 404 });
	return json({ success: true });
}
