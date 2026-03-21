import { json } from '@sveltejs/kit';
import fs from 'fs/promises';
import path from 'path';

const dataPath = path.resolve('src/lib/data/slides.json');

async function getSlides() {
  const file = await fs.readFile(dataPath, 'utf-8');
  return JSON.parse(file);
}

export async function GET() {
  const slides = await getSlides();
  return json(slides);
}

export async function POST({ request }) {
  const { img, chip, caption } = await request.json();
  const slides = await getSlides();
  const newSlide = { id: Date.now(), img, chip, caption };
  slides.push(newSlide);
  await fs.writeFile(dataPath, JSON.stringify(slides, null, 2));
  return json(newSlide, { status: 201 });
}
