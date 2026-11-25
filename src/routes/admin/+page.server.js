import { redirect } from '@sveltejs/kit';

export async function load({ fetch, locals }) {
	if (!locals.isAdmin) {
		throw redirect(303, '/admin/login');
	}

	const [postsRes, projRes, slidesRes, settingsRes, messagesRes, decksRes] = await Promise.all([
		fetch('/api/posts'),
		fetch('/api/projects'),
		fetch('/api/slides'),
		fetch('/api/settings'),
		fetch('/api/messages'),
		fetch('/api/decks')
	]);

	return {
		posts: postsRes.ok ? await postsRes.json() : [],
		projects: projRes.ok ? await projRes.json() : [],
		slides: slidesRes.ok ? await slidesRes.json() : [],
		settings: settingsRes.ok ? await settingsRes.json() : { showStickers: true },
		messages: messagesRes.ok ? await messagesRes.json() : [],
		decks: decksRes.ok ? await decksRes.json() : []
	};
}
