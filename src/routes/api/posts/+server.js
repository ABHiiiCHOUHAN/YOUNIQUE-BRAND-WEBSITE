import { json } from '@sveltejs/kit';
import path from 'path';
import { sanitizeBlogHtml } from '$lib/sanitize.js';
import { readJson, updateJson } from '$lib/server/jsonStore.js';

const dataPath = path.resolve('src/lib/data/posts.json');

export async function GET() {
	const posts = await readJson(dataPath, []);
	return json(posts);
}

export async function POST({ request, locals }) {
	if (!locals.isAdmin) {
		return json({ error: 'Unauthorized: Admin authentication required.' }, { status: 401 });
	}

	const { title, excerpt, content, date } = await request.json();
	const cleanContent = sanitizeBlogHtml(content || '');
	const cleanExcerpt = sanitizeBlogHtml(excerpt || cleanContent.substring(0, 100) + '...');

	const newPost = {
		id: Date.now(),
		title: typeof title === 'string' ? title : '',
		excerpt: cleanExcerpt,
		content: cleanContent,
		date: date || new Date().toISOString().split('T')[0]
	};

	await updateJson(dataPath, [], (posts) => {
		const list = Array.isArray(posts) ? [newPost, ...posts] : [newPost];
		return { data: list, result: newPost };
	});

	return json(newPost, { status: 201 });
}
