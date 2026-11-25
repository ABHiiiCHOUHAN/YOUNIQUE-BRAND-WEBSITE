import { json } from '@sveltejs/kit';
import path from 'path';
import { readJson, updateJson } from '$lib/server/jsonStore.js';

const dataPath = path.resolve('src/lib/data/slides.json');

export async function GET() {
	const slides = await readJson(dataPath, []);
	return json(slides);
}

export async function POST({ request, locals }) {
	if (!locals.isAdmin) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { img, chip, caption } = await request.json();
	const newSlide = { id: Date.now(), img, chip, caption };

	await updateJson(dataPath, [], (slides) => {
		const list = Array.isArray(slides) ? [...slides, newSlide] : [newSlide];
		return { data: list, result: newSlide };
	});

	return json(newSlide, { status: 201 });
}
