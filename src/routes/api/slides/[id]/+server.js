import { json } from '@sveltejs/kit';
import fs from 'fs/promises';
import path from 'path';

const dataPath = path.resolve('src/lib/data/slides.json');

async function getSlides() {
	const file = await fs.readFile(dataPath, 'utf-8');
	return JSON.parse(file);
}

export async function PUT({ params, request }) {
	const { id } = params;
	const { img, chip, caption } = await request.json();
	const slides = await getSlides();
	const index = slides.findIndex((s) => s.id === parseInt(id));
	if (index === -1) return json({ error: 'Not found' }, { status: 404 });
	slides[index] = { ...slides[index], img, chip, caption };
	await fs.writeFile(dataPath, JSON.stringify(slides, null, 2));
	return json(slides[index]);
}

export async function DELETE({ params }) {
	const { id } = params;
	let slides = await getSlides();
	slides = slides.filter((s) => s.id !== parseInt(id));
	await fs.writeFile(dataPath, JSON.stringify(slides, null, 2));
	return json({ success: true });
}
