<script>
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';

	let {
		items = [],
		ease = 'power3.out',
		duration = 0.6,
		stagger = 0.05,
		animateFrom = 'bottom',
		scaleOnHover = true,
		hoverScale = 0.95,
		blurToFocus = true,
		colorShiftOnHover = false
	} = $props();

	let containerRef = $state();
	let width = $state(0);
	let imagesReady = $state(false);
	let columns = $state(1);
	let hasMounted = $state(false);

	// Responsive column count
	$effect(() => {
		const queries = [
			'(min-width:1500px)',
			'(min-width:1000px)',
			'(min-width:600px)',
			'(min-width:400px)'
		];
		const values = [5, 4, 3, 2];

		const update = () => {
			let matched = 1;
			for (let i = 0; i < queries.length; i++) {
				if (window.matchMedia(queries[i]).matches) {
					matched = values[i];
					break;
				}
			}
			columns = matched;
		};

		update();
		const handlers = queries.map((q) => {
			const mq = window.matchMedia(q);
			mq.addEventListener('change', update);
			return { mq, update };
		});

		return () => {
			handlers.forEach(({ mq, update }) => mq.removeEventListener('change', update));
		};
	});

	// Measure container
	$effect(() => {
		if (!containerRef) return;
		const ro = new ResizeObserver(([entry]) => {
			width = entry.contentRect.width;
		});
		ro.observe(containerRef);
		return () => ro.disconnect();
	});

	// Preload Images
	$effect(() => {
		if (items.length === 0) return;
		Promise.all(
			items.map(
				(i) =>
					new Promise((resolve) => {
						const img = new Image();
						img.src = i.url || i.img;
						img.onload = img.onerror = () => resolve();
					})
			)
		).then(() => {
			imagesReady = true;
		});
	});

	let { grid, maxHeight } = $derived.by(() => {
		if (!width || !columns) return { grid: [], maxHeight: 0 };

		const colHeights = new Array(columns).fill(0);
		const gap = 16; // Use the gap from React Bits logic
		const columnWidth = (width - (columns - 1) * gap) / columns;

		const mapped = items.map((item, index) => {
			const col = colHeights.indexOf(Math.min(...colHeights));
			const x = col * (columnWidth + gap);

			const h_val = item.height || (index % 2 === 0 ? 600 : 400);
			const height = h_val / 2;
			const y = colHeights[col];

			colHeights[col] += height + gap;

			return { ...item, x, y, w: columnWidth, h: height };
		});

		return { grid: mapped, maxHeight: Math.max(...colHeights) };
	});

	// GSAP Animations
	$effect(() => {
		if (!imagesReady || !grid.length) return;

		grid.forEach((item, index) => {
			const key = item.id || `m-${index}`;
			const selector = `[data-key="${key}"]`;
			const animProps = { x: item.x, y: item.y, width: item.w, height: item.h };

			if (!hasMounted) {
				// Initial entry
				let startX = item.x;
				let startY = item.y + 100;

				if (animateFrom === 'bottom') startY = window.innerHeight + 200;
				else if (animateFrom === 'top') startY = -200;

				gsap.fromTo(
					selector,
					{
						opacity: 0,
						x: startX,
						y: startY,
						width: item.w,
						height: item.h,
						...(blurToFocus && { filter: 'blur(10px)' })
					},
					{
						opacity: 1,
						...animProps,
						filter: 'blur(0px)',
						duration: 0.8,
						ease: 'power3.out',
						delay: index * stagger,
						overwrite: 'auto'
					}
				);
			} else {
				// Responsive update
				gsap.to(selector, {
					...animProps,
					duration,
					ease,
					overwrite: 'auto'
				});
			}
		});

		if (!hasMounted) hasMounted = true;
	});

	function handleMouseEnter(e, item) {
		const key = item.id || items.indexOf(item);
		if (scaleOnHover) {
			gsap.to(`[data-key="${key}"]`, { scale: hoverScale, duration: 0.3, ease: 'power2.out' });
		}
		if (colorShiftOnHover) {
			const overlay = e.currentTarget.querySelector('.color-overlay');
			if (overlay) gsap.to(overlay, { opacity: 0.3, duration: 0.3 });
		}
	}

	function handleMouseLeave(e, item) {
		const key = item.id || items.indexOf(item);
		if (scaleOnHover) {
			gsap.to(`[data-key="${key}"]`, { scale: 1, duration: 0.3, ease: 'power2.out' });
		}
		if (colorShiftOnHover) {
			const overlay = e.currentTarget.querySelector('.color-overlay');
			if (overlay) gsap.to(overlay, { opacity: 0, duration: 0.3 });
		}
	}
</script>

<div bind:this={containerRef} class="masonry-container" style="height: {maxHeight}px;">
	{#each grid as item, i}
		<div
			data-key={item.id || `m-${i}`}
			class="masonry-item"
			role="presentation"
			onmouseenter={(e) => handleMouseEnter(e, item)}
			onmouseleave={(e) => handleMouseLeave(e, item)}
		>
			<div class="item-img" style="background-image: url({item.url || item.img});">
				{#if colorShiftOnHover}
					<div class="color-overlay"></div>
				{/if}
			</div>
		</div>
	{/each}
</div>

<style>
	.masonry-container {
		position: relative;
		width: 100%;
		/* No fixed height, children are absolute */
		min-height: 80vh;
	}

	.masonry-item {
		position: absolute;
		background: none;
		border: none;
		padding: 8px; /* Gap logic integrated into padding */
		overflow: visible;
		display: block;
		box-sizing: border-box;
		will-change: transform, width, height, opacity;
	}

	.item-img {
		width: 100%;
		height: 100%;
		background-size: cover;
		background-position: center;
		border-radius: 12px;
		box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.15);
		position: relative;
		overflow: hidden;
	}

	.color-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(45deg, rgba(255, 0, 150, 0.5), rgba(0, 150, 255, 0.5));
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.3s;
	}
</style>
