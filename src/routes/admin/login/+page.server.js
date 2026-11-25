import { fail, redirect } from '@sveltejs/kit';
import { verifyPassword, setSessionCookie } from '$lib/server/auth.js';

export async function load({ locals }) {
	if (locals.isAdmin) {
		throw redirect(303, '/admin');
	}
	return {};
}

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const password = data.get('password')?.toString();

		if (!password) {
			return fail(400, {
				error: 'Please enter the admin password.'
			});
		}

		if (!verifyPassword(password)) {
			return fail(401, {
				error: 'Invalid password. Access denied.'
			});
		}

		setSessionCookie(cookies);
		throw redirect(303, '/admin');
	}
};
