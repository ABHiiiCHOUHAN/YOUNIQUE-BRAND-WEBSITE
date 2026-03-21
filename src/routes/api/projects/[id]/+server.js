import { json } from '@sveltejs/kit';
import fs from 'fs/promises';
import path from 'path';

const dataPath = path.resolve('src/lib/data/projects.json');

async function getProjects() {
  const file = await fs.readFile(dataPath, 'utf-8');
  return JSON.parse(file);
}

export async function GET({ params }) {
  const { id } = params;
  const projects = await getProjects();
  const project = projects.find(p => p.id.toString() === id);
  
  if (!project) return json({ error: 'Not found' }, { status: 404 });
  return json(project);
}

export async function PUT({ params, request }) {
  const { id } = params;
  const { title, tag, tone, desc } = await request.json();
  let projects = await getProjects();
  
  const index = projects.findIndex(p => p.id.toString() === id);
  if (index === -1) return json({ error: 'Not found' }, { status: 404 });
  
  projects[index] = { ...projects[index], title, tag, tone, desc };
  await fs.writeFile(dataPath, JSON.stringify(projects, null, 2));
  
  return json(projects[index]);
}

export async function DELETE({ params }) {
  const { id } = params;
  let projects = await getProjects();
  
  const initialLength = projects.length;
  projects = projects.filter(p => p.id.toString() !== id);
  
  if (projects.length === initialLength) {
    return json({ error: 'Not found' }, { status: 404 });
  }
  
  await fs.writeFile(dataPath, JSON.stringify(projects, null, 2));
  return new Response(null, { status: 204 });
}
