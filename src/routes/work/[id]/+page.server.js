export async function load({ fetch, params }) {
	const res = await fetch(`/api/projects/${params.id}`);
	if (!res.ok) return { project: null };
	const project = await res.json();
	return { project };
}
