import { json } from '@sveltejs/kit';
import path from 'path';
import { readJson, updateJson } from '$lib/server/jsonStore.js';

const dataPath = path.resolve('src/lib/data/settings.json');
const DEFAULT_SETTINGS = { contactEmail: 'theyouniquedesign@gmail.com' };

export async function GET() {
	const settings = await readJson(dataPath, DEFAULT_SETTINGS);
	return json(settings);
}

export async function POST({ request, locals }) {
	if (!locals.isAdmin) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const newSettings = await request.json();

	const updatedSettings = await updateJson(dataPath, DEFAULT_SETTINGS, (currentSettings) => {
		const merged = { ...(currentSettings || {}), ...newSettings };
		return { data: merged, result: merged };
	});

	return json(updatedSettings);
}
