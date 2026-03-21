import { json } from '@sveltejs/kit';
import fs from 'fs/promises';
import path from 'path';

const dataPath = path.resolve('src/lib/data/posts.json');

export async function PUT({ params, request }) {
  const id = parseInt(params.id);
  const updates = await request.json();
  
  const file = await fs.readFile(dataPath, 'utf-8');
  const posts = JSON.parse(file);
  
  const index = posts.findIndex(p => p.id === id);
  if (index === -1) return json({ error: 'Not found' }, { status: 404 });
  
  posts[index] = { ...posts[index], ...updates };
  await fs.writeFile(dataPath, JSON.stringify(posts, null, 2));
  
  return json(posts[index]);
}

export async function DELETE({ params }) {
  const id = parseInt(params.id);
  
  const file = await fs.readFile(dataPath, 'utf-8');
  let posts = JSON.parse(file);
  
  posts = posts.filter(p => p.id !== id);
  await fs.writeFile(dataPath, JSON.stringify(posts, null, 2));
  
  return json({ success: true });
}
