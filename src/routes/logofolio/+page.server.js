export async function load({ fetch }) {
	const res = await fetch('/api/projects');
	if (!res.ok) return { projects: [] };
	const projects = await res.json();
	return { projects };
}
