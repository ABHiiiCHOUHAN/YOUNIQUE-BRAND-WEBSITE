import { json } from '@sveltejs/kit';
import path from 'path';
import { readJson, updateJson } from '$lib/server/jsonStore.js';

const dataPath = path.resolve('src/lib/data/projects.json');

const DEFAULT_PROJECTS = [
	{
		id: 1,
		title: 'Brand Identity',
		tag: 'Identity',
		tone: 'yellow',
		desc: 'Logos, type, and rules that feel inevitable.'
	},
	{
		id: 2,
		title: 'UI / UX Systems',
		tag: 'Product',
		tone: 'blue',
		desc: 'Interfaces that look loud and work quietly.'
	},
	{
		id: 3,
		title: 'Launch Strategy',
		tag: 'Strategy',
		tone: 'dark',
		desc: 'Positioning, messaging, and conversion flow.'
	},
	{
		id: 4,
		title: 'Art Direction',
		tag: 'Visual',
		tone: 'blue',
		desc: 'Bold visuals with controlled chaos.'
	},
	{
		id: 5,
		title: '3D Motion',
		tag: 'Motion',
		tone: 'dark',
		desc: 'Animations that actually make sense.'
	},
	{
		id: 6,
		title: 'Editorial',
		tag: 'Print',
		tone: 'yellow',
		desc: 'Layouts that demand to be read.'
	}
];

export async function GET() {
	const projects = await readJson(dataPath, DEFAULT_PROJECTS);
	return json(projects);
}

export async function POST({ request, locals }) {
	if (!locals.isAdmin) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { title, tag, tone, desc } = await request.json();

	const newProject = {
		id: Date.now(),
		title,
		tag,
		tone: tone || 'dark',
		desc
	};

	await updateJson(dataPath, DEFAULT_PROJECTS, (projects) => {
		const list = Array.isArray(projects) ? [...projects, newProject] : [newProject];
		return { data: list, result: newProject };
	});

	return json(newProject, { status: 201 });
}
