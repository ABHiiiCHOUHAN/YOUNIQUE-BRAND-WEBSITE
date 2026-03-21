import { json } from '@sveltejs/kit';
import fs from 'fs/promises';
import path from 'path';

const dataPath = path.resolve('src/lib/data/settings.json');

async function getSettings() {
  try {
    const file = await fs.readFile(dataPath, 'utf-8');
    return JSON.parse(file);
  } catch (err) {
    if (err.code === 'ENOENT') {
      const defaultSettings = { showStickers: true };
      await fs.mkdir(path.dirname(dataPath), { recursive: true });
      await fs.writeFile(dataPath, JSON.stringify(defaultSettings, null, 2));
      return defaultSettings;
    }
    throw err;
  }
}

export async function GET() {
  const settings = await getSettings();
  return json(settings);
}

export async function POST({ request }) {
  const newSettings = await request.json();
  const currentSettings = await getSettings();
  
  const updatedSettings = { ...currentSettings, ...newSettings };
  await fs.writeFile(dataPath, JSON.stringify(updatedSettings, null, 2));
  
  return json(updatedSettings);
}
