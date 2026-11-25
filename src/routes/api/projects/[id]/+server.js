import { json } from '@sveltejs/kit';
import path from 'path';
import { readJson, updateJson } from '$lib/server/jsonStore.js';

const dataPath = path.resolve('src/lib/data/projects.json');

export async function GET({ params }) {
	const { id } = params;
	const projects = await readJson(dataPath, []);
	const project = projects.find((p) => p.id.toString() === id);

	if (!project) return json({ error: 'Not found' }, { status: 404 });
	return json(project);
}

export async function PUT({ params, request, locals }) {
	if (!locals.isAdmin) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { id } = params;
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

	const updated = await updateJson(dataPath, [], (projects) => {
		const list = Array.isArray(projects) ? [...projects] : [];
		const index = list.findIndex((p) => p.id.toString() === id);
		if (index === -1) return { result: null };
		list[index] = {
			...list[index],
			...(title !== undefined && { title }),
			...(tag !== undefined && { tag }),
			...(year !== undefined && { year }),
			...(tone !== undefined && { tone }),
			...(desc !== undefined && { desc }),
			...(fullDesc !== undefined && { fullDesc }),
			...(challenge !== undefined && { challenge }),
			...(creativeDirection !== undefined && { creativeDirection }),
			...(resultMetric !== undefined && { resultMetric }),
			...(Array.isArray(gallery) && { gallery }),
			...(Array.isArray(stats) && { stats })
		};
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

	const deleted = await updateJson(dataPath, [], (projects) => {
		const list = Array.isArray(projects) ? projects : [];
		const filtered = list.filter((p) => p.id.toString() !== id);
		if (filtered.length === list.length) return { result: false };
		return { data: filtered, result: true };
	});

	if (!deleted) {
		return json({ error: 'Not found' }, { status: 404 });
	}

	return new Response(null, { status: 204 });
}
