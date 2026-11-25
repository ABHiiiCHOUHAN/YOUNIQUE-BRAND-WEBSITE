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

	const {
		title,
		tag,
		year,
		tone,
		desc,
		fullDesc,
		challenge,
		creativeDirection,
		resultMetric,
		gallery,
		stats
	} = await request.json();

	const newProject = {
		id: Date.now(),
		title,
		tag,
		year: year || '2024',
		tone: tone || 'dark',
		desc,
		fullDesc: fullDesc || '',
		challenge: challenge || '',
		creativeDirection: creativeDirection || '',
		resultMetric: resultMetric || '',
		gallery: Array.isArray(gallery) ? gallery : [],
		stats: Array.isArray(stats) ? stats : []
	};

	await updateJson(dataPath, DEFAULT_PROJECTS, (projects) => {
		const list = Array.isArray(projects) ? [...projects, newProject] : [newProject];
		return { data: list, result: newProject };
	});

	return json(newProject, { status: 201 });
}
