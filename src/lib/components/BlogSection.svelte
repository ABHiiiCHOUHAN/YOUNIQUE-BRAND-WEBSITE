<script>
	import '$lib/styles/fonts/blog.css';
	import { onMount } from 'svelte';
	let { postsPromise } = $props();

	let scrollTrack;
	let isDragging = false;
	let startX;
	let scrollLeft;

	// Typewriter state
	let displayText = $state('');
	let currentWordIdx = $state(0);
	const words = [
		'News',
		'Observations',
		'Insights',
		'Implications',
		'Forecasts',
		'Strategies',
		'Takeaways',
		'Actionables',
		'Trajectories',
		'Outcomes',
		'Projections',
		'Benchmarks',
		'Validations',
		'Perspectives',
		'Conclusions'
	];

	async function typeWriterLoop() {
		const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
		while (true) {
			let fullWord = words[currentWordIdx];
			let hasTypo = Math.random() < 0.1; // 10% chance

			if (hasTypo) {
				let half = Math.floor(fullWord.length / 2);
				for (let i = 0; i <= half; i++) {
					displayText = fullWord.slice(0, i);
					await sleep(70 + Math.random() * 150);
				}
				await sleep(500);
				for (let i = half; i >= 0; i--) {
					displayText = fullWord.slice(0, i);
					await sleep(50 + Math.random() * 80);
				}
				currentWordIdx =
					(currentWordIdx + Math.floor(Math.random() * (words.length - 1)) + 1) % words.length;
				fullWord = words[currentWordIdx];
				await sleep(300);
			}

			// Type current word
			for (let i = 0; i <= fullWord.length; i++) {
				displayText = fullWord.slice(0, i);
				await sleep(60 + Math.random() * 140);
			}

			// Stay visible
			await sleep(2800 + Math.random() * 1500);

			// Delete word
			for (let i = fullWord.length; i >= 0; i--) {
				displayText = fullWord.slice(0, i);
				await sleep(40 + Math.random() * 60);
			}

			await sleep(600);
			currentWordIdx = (currentWordIdx + 1) % words.length;
		}
	}

	onMount(() => {
		typeWriterLoop();
	});

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
			<h2 class="title" id="blog-title">THOUGHTS</h2>
			<span class="sub">.. {displayText}<span class="type-cursor"></span></span>
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
					<div class="post-wrapper skeleton-box">
						<article class="post">
							<div class="skeleton-img"></div>
							<div class="skeleton-line skeleton-date"></div>
							<div class="skeleton-line skeleton-title"></div>
							<div class="skeleton-line skeleton-excerpt"></div>
						</article>
					</div>
				{/each}
			{:then posts}
				{#each posts || [] as post, i}
					<div class="post-wrapper stagger-item" style:animation-delay="{i * 0.15}s">
						<article class="post">
							{#if i < 2}
								<div class="new-badge">NEW</div>
							{/if}
							{#if post.image}
								<div class="post-img-wrap" style:user-select="none">
									<img
										src={post.image}
										alt={post.title}
										class="post-img"
										loading="lazy"
										draggable="false"
									/>
								</div>
							{/if}

							<div class="post-body">
								<div class="post-header">
									<time class="date">{post.date}</time>
									<div class="post-num">#{post.id.toString().slice(-2)}</div>
								</div>
								<h3 class="post-title">{post.title}</h3>
								<p class="excerpt">{post.excerpt}</p>
								<a href="/blog/{post.id}" class="read-btn">READ FULL &rarr;</a>
							</div>
						</article>
					</div>
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
		margin-bottom: 4rem;
		padding: 0 6vw;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 0.5rem;
	}

	.title {
		font-family: 'Rubik Mono One', sans-serif;
		font-size: clamp(3rem, 10vw, 6.5rem);
		color: var(--color-3);
		letter-spacing: -0.05em;
		margin: 0;
		line-height: 0.85;
	}

	.sub {
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: clamp(1.4rem, 4vw, 3rem); /* BIG */
		color: var(--color-3);
		letter-spacing: -0.02em;
		opacity: 0.9;
		margin-top: 1rem;
		display: flex;
		align-items: center;
		gap: 0.2rem;
		text-shadow: none !important;
	}

	.type-cursor {
		display: inline-block;
		width: 3px;
		height: 1.1em;
		background: #000 !important; /* Pure black as requested */
		margin-left: 2px;
		animation: blink 0.8s infinite;
		box-shadow: none !important;
		text-shadow: none !important;
		filter: none !important;
		transform: none !important;
	}

	:global(.dark) .type-cursor {
		background: #000 !important;
	}

	@keyframes blink {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0;
		}
	}

	:global(.dark) .title,
	:global(.dark) .sub {
		color: #393839;
		opacity: 1;
	}

	.scroll-track {
		display: flex;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		scroll-padding-inline: 6vw; /* Mirror of padding for snapping */
		padding: 8rem 6vw 8rem; /* Absolute maximum padding to prevent clipping */
		gap: 3rem;
		scrollbar-width: none;
		cursor: grab;
		user-select: none;
		scroll-behavior: smooth;
		transform: translateZ(0); /* Enforce safe hardware layer to prevent clipping */
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

	.post-wrapper {
		flex: 0 0 450px;
		scroll-snap-align: start;
		transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
		z-index: 1;
		position: relative;
	}

	.post-wrapper:hover {
		transform: scale(1.02) translateY(-25px);
		z-index: 100;
	}

	.post {
		width: 100%;
		height: 100%;
		background: var(--color-5);
		border: 4px solid var(--color-3);
		border-radius: 20px;
		box-shadow: 12px 12px 0px var(--color-3);
		display: flex;
		flex-direction: column;
		/* transition handles the shadow on hover, and transform back to 0 on un-hover */
		transition:
			box-shadow 0.6s cubic-bezier(0.34, 1.56, 0.64, 1),
			transform 0.6s ease;
		overflow: visible;
		position: relative;
	}

	.post-wrapper:hover .post {
		box-shadow: 30px 30px 0px var(--color-3);
	}

	/* NEW HIGHLIGHT */
	.new-badge {
		position: absolute;
		top: -14px;
		left: 50%;
		transform: translateX(-50%);
		background: var(--color-1); /* Theme Yellow */
		color: #1c1c1c; /* Keep it dark for visibility on yellow */
		padding: 0.15rem 0.6rem;
		font-family: inherit;
		font-size: 0.75rem;
		font-weight: 900;
		letter-spacing: 0.1em;
		border: 3px solid #1c1c1c; /* Heavy brutalist border */
		z-index: 100;
		pointer-events: none;
		box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.2);
		text-shadow: none;
		text-transform: uppercase;
	}

	:global(.dark) .new-badge {
		border-color: #000;
		box-shadow: 4px 4px 0px #000;
	}

	.post-wrapper:hover .post::after {
		width: 70px;
		height: 70px;
		background: #f0f0f0;
	}

	:global(.dark) .post {
		box-shadow: 12px 12px 0px #000;
		border-color: #3d3d3d;
	}
	:global(.dark) .post-wrapper:hover .post {
		box-shadow: 18px 18px 0px #000;
	}

	.post-img-wrap {
		width: 100%;
		height: 220px;
		overflow: hidden;
		border-radius: 16px 16px 0 0;
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

	.read-btn {
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
		box-shadow: 4px 4px 0 var(--color-3);
		transition:
			transform 0.2s,
			box-shadow 0.2s;
		font-family: 'Space Mono', monospace;
	}

	.read-btn:hover {
		transform: translate(-2px, -2px);
		box-shadow: 6px 6px 0 var(--color-3);
	}

	:global(.dark) .read-btn {
		background: #facc15;
		color: #000;
		border-color: #000;
		box-shadow: 4px 4px 0 #000;
	}

	/* Skeleton */
	.skeleton-box {
		flex: 0 0 450px;
		background: rgba(0, 0, 0, 0.05);
	}

	.skeleton-img {
		height: 220px;
		background: rgba(0, 0, 0, 0.1);
	}

	.skeleton-line {
		background: rgba(0, 0, 0, 0.1);
		height: 1.5rem;
		margin: 1rem 2rem;
		border-radius: 4px;
		animation: pulse 1.5s infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 0.6;
		}
		50% {
			opacity: 0.3;
		}
	}

	@media (max-width: 768px) {
		.title {
			font-size: 2.2rem;
		}
		.post-wrapper,
		.skeleton-box {
			flex: 0 0 260px;
		}
		.post {
			min-height: 380px;
		}
		.post-img-wrap {
			height: 140px;
		}
		.post-body {
			padding: 1.25rem;
		}
		.post-title {
			font-size: 1.25rem;
		}
		.excerpt {
			font-size: 0.85rem;
			line-height: 1.4;
			margin-bottom: 1.5rem;
		}
		.blog-header {
			padding: 0 6vw;
			margin-bottom: 1.5rem;
		}
		.scroll-track {
			padding: 4rem 6vw 4rem;
		}
	}
</style>
