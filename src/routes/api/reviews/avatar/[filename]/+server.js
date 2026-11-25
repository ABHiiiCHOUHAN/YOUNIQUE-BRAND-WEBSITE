import fs from 'node:fs/promises';
import path from 'node:path';

const UPLOAD_DIR = path.resolve('src/lib/data/uploads/reviews');
const SAFE_FILENAME = /^[a-zA-Z0-9_-]+\.(png|jpg|jpeg|webp)$/;

const MIME_MAP = {
	png: 'image/png',
	jpg: 'image/jpeg',
	jpeg: 'image/jpeg',
	webp: 'image/webp'
};

export async function GET({ params }) {
	const filename = String(params.filename || '');
	if (!SAFE_FILENAME.test(filename)) {
		return new Response('Not found', { status: 404 });
	}

	const ext = filename.split('.').pop().toLowerCase();
	const filePath = path.join(UPLOAD_DIR, filename);

	try {
		const data = await fs.readFile(filePath);
		return new Response(data, {
			status: 200,
			headers: {
				'Content-Type': MIME_MAP[ext] || 'image/png',
				'Cache-Control': 'public, max-age=31536000, immutable',
				'X-Content-Type-Options': 'nosniff'
			}
		});
	} catch {
		return new Response('Not found', { status: 404 });
	}
}
