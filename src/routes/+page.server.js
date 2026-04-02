export async function load({ fetch }) {
	const [postsRes, projRes, slidesRes, settingsRes] = await Promise.all([
		fetch('/api/posts'),
		fetch('/api/projects'),
		fetch('/api/slides'),
		fetch('/api/settings')
	]);

	return {
		posts: postsRes.ok ? await postsRes.json() : [],
		projects: projRes.ok ? await projRes.json() : [],
		slides: slidesRes.ok ? await slidesRes.json() : [],
		settings: settingsRes.ok ? await settingsRes.json() : { showStickers: true }
	};
}
