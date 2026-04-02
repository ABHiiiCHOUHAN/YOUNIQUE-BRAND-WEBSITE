<script>
	import { onMount, onDestroy } from 'svelte';
	import { gsap } from 'gsap';

	/** @type {{ cards: any[], cardDistance?: number, verticalDistance?: number, skewAmount?: number, delay?: number, pauseOnHover?: boolean }} */
	let {
		cards = [],
		cardDistance = 100,
		verticalDistance = 90,
		skewAmount = 11,
		delay = 4500,
		pauseOnHover = true
	} = $props();

	let container = $state();
	let cardElements = $state([]);
	let currentIndices = $state([]); // Initialize empty for reactivity safety
	let interval;
	let timeline;

	const makeSlot = (i) => ({
		x: i * cardDistance,
		y: -i * verticalDistance,
		z: -i * cardDistance * 1.5,
		zIndex: cards.length - i
	});

	const updatePositions = (instant = false) => {
		currentIndices.forEach((dataIdx, slotIdx) => {
			const el = cardElements[dataIdx];
			if (!el) return;

			const { x, y, z, zIndex } = makeSlot(slotIdx);

			if (instant) {
				gsap.set(el, { x, y, z, zIndex, opacity: 1, skewX: 0 });
			} else {
				gsap.to(el, {
					x,
					y,
					z,
					zIndex,
					duration: 0.8,
					ease: 'power3.out'
				});
			}
		});
	};

	const swap = () => {
		const frontIdx = currentIndices[0];
		const frontEl = cardElements[frontIdx];

		timeline = gsap.timeline({
			onComplete: () => {
				// Shift indices: move 0 to end
				currentIndices = [...currentIndices.slice(1), frontIdx];
				updatePositions();
			}
		});

		// 1. Animate front card out
		timeline.to(frontEl, {
			y: -verticalDistance * 2.5,
			x: cardDistance * 2,
			skewX: -skewAmount,
			opacity: 0,
			duration: 0.5,
			ease: 'power2.in'
		});

		// 2. Hide and move to back immediately after out
		timeline.set(frontEl, {
			...makeSlot(cards.length - 1),
			opacity: 0
		});

		// 3. Fade back in at final slot
		timeline.to(frontEl, {
			opacity: 1,
			duration: 0.3,
			delay: 0.2
		});
	};

	onMount(() => {
		// Correctly initialize indices from props on mount
		currentIndices = cards.map((_, i) => i);
		updatePositions(true);

		interval = setInterval(() => {
			if (pauseOnHover && container?.matches(':hover')) return;
			swap();
		}, delay);
	});

	onDestroy(() => {
		clearInterval(interval);
		if (timeline) timeline.kill();
	});
</script>

<div
	class="card-swap-container"
	bind:this={container}
	style="--card-dist: {cardDistance}px; --vert-dist: {verticalDistance}px;"
>
	{#each cards as card, i}
		<div class="swap-card" bind:this={cardElements[i]} style="background: {card.bg || '#fff'}">
			<!-- Browser-like header bar -->
			<div class="card-browser-bar">
				<div class="window-controls">
					<span class="dot"></span>
					<span class="dot"></span>
					<span class="dot"></span>
				</div>
				<div class="tab-label">{card.title.toUpperCase()}</div>
			</div>

			<div class="card-inner">
				{@render card.content?.()}
				{#if !card.content}
					<div class="browser-content">
						{#if card.image}
							<img src={card.image} alt={card.title} class="full-img" />
						{:else}
							<div class="placeholder-content">
								<h3>{card.title}</h3>
								<p>{card.desc}</p>
							</div>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	{/each}
</div>

<style>
	.card-swap-container {
		position: relative;
		width: 100%;
		height: 600px;
		perspective: 1500px;
		display: flex;
		justify-content: center;
		align-items: center;
		transform-style: preserve-3d;
	}

	.swap-card {
		position: absolute;
		/* Rectangular web screen shape */
		width: clamp(450px, 55vw, 850px);
		height: clamp(300px, 40vh, 500px);
		border: 3px solid #000;
		border-radius: 12px;
		background: #fff;
		/* 'Paper like' flat style - no shadows as requested */
		box-shadow: none;
		overflow: hidden;
		backface-visibility: hidden;
		will-change: transform, opacity;
		display: flex;
		flex-direction: column;
	}

	.card-browser-bar {
		background: #fff;
		border-bottom: 3px solid #000;
		padding: 0.75rem 1.25rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
	}

	.window-controls {
		display: flex;
		gap: 0.5rem;
	}

	.dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		border: 2px solid #000;
	}

	.tab-label {
		font-family: 'Space Mono', monospace;
		font-size: 0.7rem;
		font-weight: 800;
		letter-spacing: 0.1em;
		opacity: 0.7;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}

	.card-inner {
		flex: 1;
		width: 100%;
		position: relative;
		background: #000;
	}

	.browser-content {
		width: 100%;
		height: 100%;
	}

	.full-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.placeholder-content {
		padding: 2rem;
		color: #fff;
		display: flex;
		flex-direction: column;
		justify-content: center;
		height: 100%;
	}

	.placeholder-content h3 {
		font-family: 'Rubik Mono One', sans-serif;
		font-size: 2rem;
		margin: 0;
	}
</style>
