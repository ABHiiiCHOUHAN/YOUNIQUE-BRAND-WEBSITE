<script>
	let { postsPromise } = $props();

	let scrollTrack;
	let isDragging = false;
	let startX;
	let scrollLeft;

	const onMouseDown = (e) => {
		isDragging = true;
		scrollTrack.classList.add('dragging');
		startX = e.pageX - scrollTrack.offsetLeft;
		scrollLeft = scrollTrack.scrollLeft;
	};

	const onMouseUp = () => {
		isDragging = false;
		scrollTrack.classList.remove('dragging');
	};

	const onMouseMove = (e) => {
		if (!isDragging) return;
		e.preventDefault();
		const x = e.pageX - scrollTrack.offsetLeft;
		const walk = (x - startX) * 2; // Scroll speed
		scrollTrack.scrollLeft = scrollLeft - walk;
	};
</script>

<section class="blog-wrap">
	<div class="yellow-bg"></div>
	
	<div class="content">
		<header class="blog-header">
			<h2 class="title" id="blog-title">THOUGHTS // RULES</h2>
			<span class="sub">DESIGN, CHAOS & LOGIC</span>
		</header>

		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div 
			class="scroll-track" 
			bind:this={scrollTrack}
			onmousedown={onMouseDown}
			onmouseleave={onMouseUp}
			onmouseup={onMouseUp}
			onmousemove={onMouseMove}
			aria-labelledby="blog-title"
		>
			{#await postsPromise}
				{#each Array(3) as _}
					<article class="post skeleton-box">
						<div class="skeleton-img"></div>
						<div class="skeleton-line skeleton-date"></div>
						<div class="skeleton-line skeleton-title"></div>
						<div class="skeleton-line skeleton-excerpt"></div>
					</article>
				{/each}
			{:then posts}
				{#each posts || [] as post}
					<article class="post">
						{#if post.image}
							<div class="post-img-wrap" style="user-select: none;">
								<img src={post.image} alt={post.title} class="post-img" loading="lazy" draggable="false" />
							</div>
						{/if}
						
						<div class="post-body">
							<div class="post-header">
								<time class="date">{post.date}</time>
								<div class="post-num">#{post.id.toString().slice(-2)}</div>
							</div>
							<h3 class="post-title">{post.title}</h3>
							<p class="excerpt">{post.excerpt}</p>
							<a class="read-more" href="/blog/{post.id}" target="_blank" rel="noopener noreferrer">
								READ FULL &rarr;
							</a>
						</div>
					</article>
				{/each}
			{/await}
		</div>
	</div>
</section>

<style>
	.blog-wrap {
		padding: 0;
		position: relative;
		overflow: hidden;
		background: var(--color-1); /* Use the yellow directly or via the bg div */
	}

	.yellow-bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: var(--color-1);
		z-index: 1;
	}

	.content {
		position: relative;
		z-index: 10;
		width: 100%;
		padding: 8rem 0; /* Add padding to content instead of wrap */
	}

	.blog-header {
		max-width: 1200px;
		margin: 0 auto 4rem;
		padding: 0 4rem;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.5rem;
	}

	.title {
		font-family: 'Rubik Mono One', sans-serif;
		font-size: clamp(2.5rem, 6vw, 4.5rem);
		color: var(--color-3);
		letter-spacing: -0.05em;
		margin: 0;
		line-height: 0.9;
	}

	.sub {
		font-family: var(--font-secondary);
		font-weight: 800;
		font-size: 1.1rem;
		color: var(--color-3);
		letter-spacing: 0.1em;
		opacity: 0.8;
	}

	:global(.dark) .title,
	:global(.dark) .sub {
		color: #393839;
		opacity: 1;
	}

	.sub {
		font-family: 'Space Mono', monospace;
		font-weight: 700;
	}

	.scroll-track {
		display: flex;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		padding: 2rem 4rem 0;
		gap: 3rem;
		scrollbar-width: none;
		cursor: grab;
		user-select: none;
		scroll-behavior: smooth;
	}

	.scroll-track::-webkit-scrollbar {
		display: none;
	}

	.scroll-track:active {
		cursor: grabbing;
	}

	:global(.scroll-track.dragging) {
		scroll-snap-type: none !important;
		scroll-behavior: auto !important;
	}

	.post {
		flex: 0 0 450px;
		scroll-snap-align: start;
		background: var(--color-5);
		border: 4px solid var(--color-3);
		box-shadow: 12px 12px 0px var(--color-3);
		display: flex;
		flex-direction: column;
		transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
		overflow: hidden;
	}

	.post:hover {
		transform: translate(-6px, -6px);
		box-shadow: 18px 18px 0px var(--color-3);
	}

	:global(.dark) .post {
		box-shadow: 12px 12px 0px #000;
		border-color: #3d3d3d;
	}
	:global(.dark) .post:hover {
		box-shadow: 18px 18px 0px #000;
	}

	.post-img-wrap {
		width: 100%;
		height: 220px;
		overflow: hidden;
		border-bottom: 4px solid var(--color-3);
		background: #000;
	}
	:global(.dark) .post-img-wrap {
		border-bottom-color: #3d3d3d;
	}

	.post-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.5s ease;
		filter: contrast(1.1) grayscale(0.2);
	}

	.post:hover .post-img {
		transform: scale(1.05) rotate(1deg);
		filter: contrast(1.2) grayscale(0);
	}

	.post-body {
		padding: 2rem;
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.post-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.date {
		font-size: 0.85rem;
		font-weight: 700;
		color: var(--color-3);
		text-transform: uppercase;
		font-family: 'Space Mono', monospace;
	}

	.post-num {
		font-family: 'moon-get', sans-serif;
		font-size: 1.1rem;
		opacity: 0.2;
	}

	.post-title {
		font-family: var(--font-heading);
		font-size: 1.75rem;
		line-height: 1.1;
		margin: 0 0 1rem 0;
		color: var(--color-3);
		letter-spacing: -0.02em;
	}

	.excerpt {
		font-family: 'Space Mono', monospace;
		font-size: 0.9rem;
		line-height: 1.5;
		color: var(--color-3);
		opacity: 0.8;
		margin-bottom: 2rem;
	}

	.read-more {
		display: inline-flex;
		align-items: center;
		text-decoration: none;
		font-weight: 700;
		font-size: 0.8rem;
		background: var(--color-1);
		color: var(--color-3);
		padding: 0.6rem 1.2rem;
		border: 3px solid var(--color-3);
		border-radius: 999px;
		width: fit-content;
		box-shadow: 4px 4px 0px var(--color-3);
		transition: all 0.2s;
		font-family: 'Space Mono', monospace;
	}

	.read-more:hover {
		transform: scale(1.05);
		background: #fff;
	}

	:global(.dark) .read-more {
		color: #000;
		border-color: #000;
		box-shadow: 4px 4px 0px #000;
	}

	/* Skeleton */
	.skeleton-box {
		flex: 0 0 450px;
		background: rgba(0,0,0,0.05);
	}

	.skeleton-img {
		height: 220px;
		background: rgba(0,0,0,0.1);
	}

	.skeleton-line {
		background: rgba(0,0,0,0.1);
		height: 1.5rem;
		margin: 1rem 2rem;
		border-radius: 4px;
		animation: pulse 1.5s infinite;
	}

	@keyframes pulse {
		0%, 100% { opacity: 0.6; }
		50% { opacity: 0.3; }
	}

	@media (max-width: 900px) {
		.blog-header { padding: 0 2rem; }
		.scroll-track {
			padding: 2rem 2rem 0;
			gap: 1.5rem;
		}
		.post {
			flex: 0 0 320px;
		}
		.post-img-wrap { height: 180px; }
		.post-body { padding: 1.5rem; }
		.post-title { font-size: 1.5rem; }
	}
</style>

