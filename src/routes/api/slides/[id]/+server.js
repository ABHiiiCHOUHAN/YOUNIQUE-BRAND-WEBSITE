import { json } from '@sveltejs/kit';
import path from 'path';
import { updateJson } from '$lib/server/jsonStore.js';

const dataPath = path.resolve('src/lib/data/slides.json');

export async function PUT({ params, request, locals }) {
	if (!locals.isAdmin) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { id } = params;
	const { img, chip, caption } = await request.json();

	const updated = await updateJson(dataPath, [], (slides) => {
		const list = Array.isArray(slides) ? [...slides] : [];
		const index = list.findIndex((s) => s.id === parseInt(id));
		if (index === -1) return { result: null };
		list[index] = { ...list[index], img, chip, caption };
		return { data: list, result: list[index] };
	});

	if (!updated) return json({ error: 'Not found' }, { status: 404 });
	return json(updated);
}

export async function DELETE({ params, locals }) {
	if (!locals.isAdmin) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { id } = params;

	await updateJson(dataPath, [], (slides) => {
		const list = Array.isArray(slides) ? slides.filter((s) => s.id !== parseInt(id)) : [];
		return { data: list, result: true };
	});

	return json({ success: true });
}
