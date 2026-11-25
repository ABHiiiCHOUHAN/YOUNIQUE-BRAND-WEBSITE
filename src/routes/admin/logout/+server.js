import { redirect } from '@sveltejs/kit';
import { clearSessionCookie } from '$lib/server/auth.js';

export function POST({ cookies }) {
	clearSessionCookie(cookies);
	throw redirect(303, '/admin/login');
}

export function GET({ cookies }) {
	clearSessionCookie(cookies);
	throw redirect(303, '/admin/login');
}
