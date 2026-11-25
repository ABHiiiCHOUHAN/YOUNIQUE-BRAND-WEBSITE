import { json } from '@sveltejs/kit';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const UPLOAD_DIR = path.resolve('src/lib/data/uploads/reviews');
const MAX_BYTES = 2 * 1024 * 1024; // 2 MB

function detectImageExt(buf) {
	if (!buf || buf.length < 12) return null;
	// PNG
	if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return 'png';
	// JPEG
	if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpg';
	// WEBP
	if (
		buf.subarray(0, 4).toString('ascii') === 'RIFF' &&
		buf.subarray(8, 12).toString('ascii') === 'WEBP'
	) {
		return 'webp';
	}
	return null;
}

export async function POST({ request, locals }) {
	if (!locals.isAdmin) {
		return json({ error: 'Unauthorized: Admin authentication required.' }, { status: 401 });
	}

	try {
		const contentType = request.headers.get('content-type') || '';
		let bytes;

		if (contentType.includes('multipart/form-data')) {
			const formData = await request.formData();
			const file = formData.get('file');
			if (!file || typeof file === 'string') {
				return json({ error: 'No image file provided.' }, { status: 400 });
			}
			if (file.size > MAX_BYTES) {
				return json({ error: 'Image must be 2MB or smaller.' }, { status: 400 });
			}
			bytes = Buffer.from(await file.arrayBuffer());
		} else {
			const body = await request.json().catch(() => ({}));
			const dataUrl = typeof body?.dataUrl === 'string' ? body.dataUrl : '';
			const match = dataUrl.match(/^data:image\/(png|jpeg|jpg|webp);base64,([A-Za-z0-9+/=]+)$/);
			if (!match) {
				return json({ error: 'Invalid image payload.' }, { status: 400 });
			}
			bytes = Buffer.from(match[2], 'base64');
		}

		if (bytes.length > MAX_BYTES) {
			return json({ error: 'Image must be 2MB or smaller.' }, { status: 400 });
		}

		const ext = detectImageExt(bytes);
		if (!ext) {
			return json({ error: 'Unsupported format. Please upload PNG, JPEG, or WebP.' }, { status: 400 });
		}

		await fs.mkdir(UPLOAD_DIR, { recursive: true });
		const filename = `avatar_${Date.now()}_${crypto.randomBytes(4).toString('hex')}.${ext}`;
		await fs.writeFile(path.join(UPLOAD_DIR, filename), bytes);

		return json({ url: `/api/reviews/avatar/${filename}` }, { status: 201 });
	} catch (err) {
		console.error('Review image upload error:', err);
		return json({ error: 'Failed to store uploaded image.' }, { status: 500 });
	}
}
