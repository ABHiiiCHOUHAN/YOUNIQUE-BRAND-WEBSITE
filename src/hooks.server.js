import { json, redirect } from '@sveltejs/kit';
import { verifySessionToken, COOKIE_NAME } from '$lib/server/auth.js';

export async function handle({ event, resolve }) {
	const { pathname } = event.url;
	const method = event.request.method;

	// Check for valid signed admin session cookie
	const token = event.cookies.get(COOKIE_NAME);
	const isAuthenticated = verifySessionToken(token);
	event.locals.isAdmin = isAuthenticated;

	// 1. Route Guard for /admin pages
	if (pathname.startsWith('/admin')) {
		const isLoginPage = pathname === '/admin/login';
		const isLogoutRoute = pathname === '/admin/logout';

		if (!isAuthenticated && !isLoginPage && !isLogoutRoute) {
			throw redirect(303, '/admin/login');
		}

		if (isAuthenticated && isLoginPage) {
			throw redirect(303, '/admin');
		}
	}

	// 2. Guard Backend APIs
	if (pathname.startsWith('/api')) {
		// Reading client messages contains private customer emails and numbers
		if (pathname === '/api/messages' && method === 'GET' && !isAuthenticated) {
			return json(
				{ error: 'Unauthorized: Admin authentication required to read client inquiries.' },
				{ status: 401 }
			);
		}

		// Public contact form submission & unlocked client deck feedback submission are allowed
		const isPublicMessageSubmission = pathname === '/api/messages' && method === 'POST';
		const isDeckFeedbackSubmission =
			pathname.startsWith('/api/decks/') && pathname.endsWith('/feedback') && method === 'POST';

		// All other mutating requests (creating/updating/deleting posts, projects, settings, deleting messages)
		// strictly require authenticated admin access!
		if (
			['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) &&
			!isPublicMessageSubmission &&
			!isDeckFeedbackSubmission
		) {
			if (!isAuthenticated) {
				return json(
					{ error: 'Unauthorized: Admin authentication required for this action.' },
					{ status: 401 }
				);
			}
		}
	}

	const response = await resolve(event);

	// 3. Inject Essential Security Headers
	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
	response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');

	if (event.url.protocol === 'https:') {
		response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
	}

	if (pathname.startsWith('/admin') || pathname.startsWith('/deck/') || pathname === '/api/messages') {
		response.headers.set('Cache-Control', 'no-store');
	}

	return response;
}
