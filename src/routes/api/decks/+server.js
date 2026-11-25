import { json } from '@sveltejs/kit';
import path from 'path';
import { readJson, updateJson } from '$lib/server/jsonStore.js';
import { hashDeckPasscode } from '$lib/server/deckAuth.js';

const DB_PATH = path.resolve('src/lib/data/decks.json');

function sanitizeDeckForAdmin(deck) {
	const { passcodeHash, ...rest } = deck;
	return {
		...rest,
		hasPasscode: Boolean(passcodeHash)
	};
}

export async function GET({ locals }) {
	if (!locals.isAdmin) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}
	const decks = await readJson(DB_PATH, []);
	return json((Array.isArray(decks) ? decks : []).map(sanitizeDeckForAdmin));
}

export async function POST({ request, locals }) {
	if (!locals.isAdmin) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { slug, clientName, clientCompany, title, version, passcode, notes, deliverables } =
			await request.json();

		const cleanSlug = String(slug || '')
			.trim()
			.toLowerCase()
			.replace(/[^a-z0-9-]+/g, '-')
			.replace(/^-+|-+$/g, '');

		if (!cleanSlug || !clientName || !title || !passcode) {
			return json(
				{ error: 'Client slug, client name, title, and passcode are required.' },
				{ status: 400 }
			);
		}

		const newDeck = {
			slug: cleanSlug,
			clientName: String(clientName).trim(),
			clientCompany: typeof clientCompany === 'string' ? clientCompany.trim() : '',
			title: String(title).trim(),
			version: String(version || 'v1.0 | Draft Review').trim(),
			updatedAt: new Date().toISOString().split('T')[0],
			passcodeHash: hashDeckPasscode(String(passcode)),
			notes: typeof notes === 'string' ? notes.trim() : '',
			deliverables: Array.isArray(deliverables)
				? deliverables
						.filter((d) => d && (d.title || d.url))
						.map((d) => ({
							title: String(d.title || 'Deliverable').trim(),
							type: ['image', 'video', 'link'].includes(d.type) ? d.type : 'link',
							url: String(d.url || '').trim(),
							notes: String(d.notes || '').trim()
						}))
				: []
		};

		const result = await updateJson(DB_PATH, [], (decks) => {
			const list = Array.isArray(decks) ? [...decks] : [];
			if (list.some((d) => d.slug === cleanSlug)) {
				return { result: { error: 'A deck with this client URL slug already exists.' } };
			}
			list.unshift(newDeck);
			return { data: list, result: { deck: sanitizeDeckForAdmin(newDeck) } };
		});

		if (result.error) {
			return json({ error: result.error }, { status: 409 });
		}

		return json(result.deck, { status: 201 });
	} catch (err) {
		console.error('Decks POST error:', err);
		return json({ error: 'Failed to create client deck.' }, { status: 500 });
	}
}
