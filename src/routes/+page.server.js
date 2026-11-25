export async function load({ fetch }) {
	const [postsRes, projRes, slidesRes, settingsRes, reviewsRes] = await Promise.all([
		fetch('/api/posts'),
		fetch('/api/projects'),
		fetch('/api/slides'),
		fetch('/api/settings'),
		fetch('/api/reviews')
	]);

	return {
		posts: postsRes.ok ? await postsRes.json() : [],
		projects: projRes.ok ? await projRes.json() : [],
		slides: slidesRes.ok ? await slidesRes.json() : [],
		settings: settingsRes.ok ? await settingsRes.json() : { showStickers: true },
		reviewsData: reviewsRes.ok
			? await reviewsRes.json()
			: { placeholderImg: '/assets/reviews/default-placeholder.svg', reviews: [] }
	};
}
