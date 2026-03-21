<script>
	let { postsPromise } = $props();
</script>

<section class="wrap page-transition">
	<header class="page-header">
		<h1 class="page-title">Thoughts, rants & rules.</h1>
	</header>

	<div class="grid">
		{#await postsPromise}
			{#each Array(3) as _}
				<article class="post skeleton-box">
					<div class="skeleton-line skeleton-date"></div>
					<div class="skeleton-line skeleton-title"></div>
					<div class="skeleton-line skeleton-excerpt"></div>
					<div class="skeleton-line skeleton-button"></div>
				</article>
			{/each}
		{:then posts}
			{#each posts || [] as post}
				<article class="post">
					<time class="date">{post.date}</time>
					<h2 class="post-title">{post.title}</h2>
					<p class="excerpt">{post.excerpt}</p>
					<a class="read-more" href="/blog/{post.id}" target="_blank" rel="noopener noreferrer"
						>Read more &rarr;</a
					>
				</article>
			{/each}
		{/await}
	</div>
</section>

<style>
	.wrap {
		padding: 2.25rem clamp(1rem, 4vw, 4rem) 4rem;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1.5rem;
	}

	.post {
		border-radius: 22px;
		border: 3px solid var(--color-3);
		background: var(--color-5);
		color: var(--color-3);
		box-shadow: 8px 8px 0px var(--color-3);
		padding: 1.5rem;
		transition:
			transform 0.2s,
			box-shadow 0.2s;
	}

	.post:hover {
		transform: translate(-4px, -4px);
		box-shadow: 12px 12px 0px var(--color-3);
	}

	.date {
		font-size: 0.85rem;
		font-weight: 700;
		opacity: 0.8;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.post-title {
		margin: 0.5rem 0;
		font-size: 1.75rem;
		font-family: var(--font-heading);
		letter-spacing: -0.02em;
	}

	.excerpt {
		margin: 0.75rem 0 1.5rem;
		line-height: 1.5;
		opacity: 0.9;
	}

	.read-more {
		display: inline-flex;
		text-decoration: none;
		font-weight: 900;
		color: var(--color-1);
		background: var(--color-3);
		padding: 0.5rem 1rem;
		border-radius: 999px;
		border: 2px solid var(--color-3);
	}

	:global(.dark) .read-more {
		background: var(--color-5);
		border-color: var(--color-1);
	}

	.skeleton-line {
		background: color-mix(in srgb, var(--color-3) 15%, transparent);
		border-radius: 4px;
		animation: pulse 1.5s infinite ease-in-out;
	}
	.skeleton-date {
		width: 30%;
		height: 1rem;
		margin-bottom: 0.5rem;
	}
	.skeleton-title {
		width: 85%;
		height: 2rem;
		margin-bottom: 0.75rem;
	}
	.skeleton-excerpt {
		width: 100%;
		height: 4rem;
		margin-bottom: 1.5rem;
	}
	.skeleton-button {
		width: 45%;
		height: 2.5rem;
		border-radius: 999px;
	}

	@keyframes pulse {
		0% {
			opacity: 0.7;
		}
		50% {
			opacity: 0.3;
		}
		100% {
			opacity: 0.7;
		}
	}

	@media (max-width: 640px) {
		.wrap {
			padding: 1.5rem 1rem 3rem;
		}
	}
</style>
