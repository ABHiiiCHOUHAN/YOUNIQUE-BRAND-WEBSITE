import { json } from '@sveltejs/kit';
import fs from 'fs/promises';
import path from 'path';

const dataPath = path.resolve('src/lib/data/posts.json');

// Initialize empty array if file is missing
async function getPosts() {
  try {
    const file = await fs.readFile(dataPath, 'utf-8');
    return JSON.parse(file);
  } catch (err) {
    if (err.code === 'ENOENT') {
      await fs.writeFile(dataPath, '[]');
      return [];
    }
    throw err;
  }
}

export async function GET() {
  const posts = await getPosts();
  return json(posts);
}

export async function POST({ request }) {
  const { title, excerpt, content, date } = await request.json();
  const posts = await getPosts();
  
  const newPost = {
    id: Date.now(),
    title,
    excerpt: excerpt || content.substring(0, 100) + '...',
    content,
    date: date || new Date().toISOString().split('T')[0]
  };
  
  posts.unshift(newPost); // Add to top
  await fs.writeFile(dataPath, JSON.stringify(posts, null, 2));
  
  return json(newPost, { status: 201 });
}
