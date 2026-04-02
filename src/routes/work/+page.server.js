export async function load({ fetch }) {
	const res = await fetch('/api/projects');
	let projects = [];
	if (res.ok) {
		projects = await res.json();
	}
	return { projects };
}
