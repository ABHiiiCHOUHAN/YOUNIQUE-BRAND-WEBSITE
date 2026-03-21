import { error } from '@sveltejs/kit';

export async function load({ fetch, params }) {
  const res = await fetch('/api/posts');
  if (!res.ok) throw error(500, 'Could not fetch posts');
  
  const posts = await res.json();
  const post = posts.find(p => p.id.toString() === params.id);
  
  if (!post) throw error(404, 'Post not found');
  
  return { post };
}
