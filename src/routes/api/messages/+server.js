import { json } from '@sveltejs/kit';
import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.resolve('src/lib/data/messages.json');

export async function GET() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    const messages = JSON.parse(data);
    // Sort by date (newest first)
    messages.sort((a, b) => new Date(b.date) - new Date(a.date));
    return json(messages);
  } catch (err) {
    return json([]);
  }
}

export async function POST({ request }) {
  try {
    const { name, email, mobile, message } = await request.json();
    if (!name || !email || !message) {
      return json({ error: 'Missing required fields' }, { status: 400 });
    }

    let messages = [];
    try {
      const data = await fs.readFile(DB_PATH, 'utf-8');
      messages = JSON.parse(data);
    } catch (e) {
      // File doesn't exist or is invalid, start with empty array
    }

    const newMessage = {
      id: Date.now().toString(),
      name,
      email,
      mobile: mobile || '',
      message,
      date: new Date().toISOString(),
      status: 'new'
    };

    messages.push(newMessage);
    await fs.writeFile(DB_PATH, JSON.stringify(messages, null, 2));

    return json(newMessage);
  } catch (err) {
    console.error('API Error:', err);
    return json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE({ url }) {
  const id = url.searchParams.get('id');
  if (!id) return json({ error: 'Missing ID' }, { status: 400 });

  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    let messages = JSON.parse(data);
    messages = messages.filter(m => m.id !== id);
    await fs.writeFile(DB_PATH, JSON.stringify(messages, null, 2));
    return json({ success: true });
  } catch (err) {
    return json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
