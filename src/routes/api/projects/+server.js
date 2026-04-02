import { json } from '@sveltejs/kit';
import fs from 'fs/promises';
import path from 'path';

const dataPath = path.resolve('src/lib/data/projects.json');

async function getProjects() {
	try {
		const file = await fs.readFile(dataPath, 'utf-8');
		return JSON.parse(file);
	} catch (err) {
		if (err.code === 'ENOENT') {
			const initial = [
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
			await fs.mkdir(path.dirname(dataPath), { recursive: true });
			await fs.writeFile(dataPath, JSON.stringify(initial, null, 2));
			return initial;
		}
		throw err;
	}
}

export async function GET() {
	const projects = await getProjects();
	return json(projects);
}

export async function POST({ request }) {
	const { title, tag, tone, desc } = await request.json();
	const projects = await getProjects();

	const newProject = {
		id: Date.now(),
		title,
		tag,
		tone: tone || 'dark',
		desc
	};

	projects.push(newProject);
	await fs.writeFile(dataPath, JSON.stringify(projects, null, 2));

	return json(newProject, { status: 201 });
}
