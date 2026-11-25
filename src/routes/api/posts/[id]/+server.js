import { json } from '@sveltejs/kit';
import path from 'path';
import { sanitizeBlogHtml } from '$lib/sanitize.js';
import { updateJson } from '$lib/server/jsonStore.js';

const dataPath = path.resolve('src/lib/data/posts.json');

export async function PUT({ params, request, locals }) {
	if (!locals.isAdmin) {
		return json({ error: 'Unauthorized: Admin authentication required.' }, { status: 401 });
	}

	const id = parseInt(params.id);
	const updates = await request.json();

	const sanitizedUpdates = { ...updates };
	if (typeof sanitizedUpdates.content === 'string') {
		sanitizedUpdates.content = sanitizeBlogHtml(sanitizedUpdates.content);
	}
	if (typeof sanitizedUpdates.excerpt === 'string') {
		sanitizedUpdates.excerpt = sanitizeBlogHtml(sanitizedUpdates.excerpt);
	}

	const updated = await updateJson(dataPath, [], (posts) => {
		const list = Array.isArray(posts) ? [...posts] : [];
		const index = list.findIndex((p) => p.id === id);
		if (index === -1) return { result: null };
		list[index] = { ...list[index], ...sanitizedUpdates };
		return { data: list, result: list[index] };
	});

	if (!updated) return json({ error: 'Not found' }, { status: 404 });
	return json(updated);
}

export async function DELETE({ params, locals }) {
	if (!locals.isAdmin) {
		return json({ error: 'Unauthorized: Admin authentication required.' }, { status: 401 });
	}

	const id = parseInt(params.id);

	await updateJson(dataPath, [], (posts) => {
		const list = Array.isArray(posts) ? posts.filter((p) => p.id !== id) : [];
		return { data: list, result: true };
	});

	return json({ success: true });
}
