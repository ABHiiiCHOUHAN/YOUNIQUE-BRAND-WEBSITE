<script>
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import './DepthCarousel.css';

	const DEFAULT_ITEMS = [
		{ image: 'https://picsum.photos/seed/depth1/800/1000', alt: 'Slide 1' },
		{ image: 'https://picsum.photos/seed/depth2/800/1000', alt: 'Slide 2' },
		{ image: 'https://picsum.photos/seed/depth3/800/1000', alt: 'Slide 3' },
		{ image: 'https://picsum.photos/seed/depth4/800/1000', alt: 'Slide 4' },
		{ image: 'https://picsum.photos/seed/depth5/800/1000', alt: 'Slide 5' },
		{ image: 'https://picsum.photos/seed/depth6/800/1000', alt: 'Slide 6' }
	];

	const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
	const normalizeItem = (it) => (typeof it === 'string' ? { image: it, alt: '' } : it);

	let {
		items = DEFAULT_ITEMS,
		cardWidth = 300,
		cardHeight = 380,
		radius = 18,
		tint = '#05060a',
		depth = 220,
		spread = 90,
		tilt = 22,
		tiltDirection = 'right',
		perspective = 1400,
		visibleCards = 4,
		falloff = 0.2,
		blur = 6,
		duration = 700,
		ease = 'power3.out',
		autoplay = false,
		autoplayDelay = 3200,
		loop = true,
		showControls = true,
		showIndicators = true,
		onChange = undefined,
		selectedIndex = undefined,
		className = ''
	} = $props();

	const data = $derived((Array.isArray(items) ? items : []).map(normalizeItem));
	const count = $derived(data.length);

	let rootRef = $state(null);
	let cardRefs = $state([]);
	let overlayRefs = $state([]);
	let active = $state(0);

	let posVal = 0;
	let focusVal = $state(0);
	let tween = null;
	let scaleVal = 1;
	let isMobile = false;

	let drag = null;
	let wheelTimer = null;
	let autoTimer = null;
	let reducedMotion = false;

	function layout(pos) {
		const n = count;
		if (!n) return;
		const dir = tiltDirection === 'left' ? -1 : 1;
		const sc = scaleVal;
		const effectiveSpread = isMobile ? Math.min(spread * 0.52, 75) : spread;
		const effectiveDepth = isMobile ? Math.min(depth * 0.65, 110) : depth;

		for (let i = 0; i < n; i++) {
			const el = cardRefs[i];
			if (!el) continue;

			let d = i - pos;
			if (loop && n > 1) {
				d = ((d % n) + n) % n;
				if (d > n / 2) d -= n;
			}

			const back = Math.max(0, d);
			const az = Math.abs(d);
			const shown = az <= visibleCards + 0.5;

			const tz = -effectiveDepth * d;
			const tx = dir * effectiveSpread * d;
			const ry = dir * tilt * clamp(d, 0, 1);

			let opacity = d < 0 ? Math.max(0, 1 + d) : 1;
			if (!shown) opacity = 0;

			const brightness = Math.max(0.15, 1 - back * falloff);
			const blurPx = blur > 0 ? Math.min(blur, (back / Math.max(1, visibleCards)) * blur) : 0;
			const zi = Math.round(2000 - d * 20);

			el.style.transform = `translate(-50%, -50%) scale(${sc}) translateX(${tx.toFixed(2)}px) translateZ(${tz.toFixed(2)}px) rotateY(${ry.toFixed(3)}deg)`;
			el.style.opacity = opacity.toFixed(3);
			el.style.filter = `brightness(${brightness.toFixed(3)}) blur(${blurPx.toFixed(2)}px)`;
			el.style.zIndex = String(zi);
			el.style.pointerEvents = shown && opacity > 0.05 ? 'auto' : 'none';

			const ov = overlayRefs[i];
			if (ov) ov.style.opacity = clamp(back * falloff * 1.25, 0, 0.86).toFixed(3);
		}
	}

	function notify(idx) {
		active = idx;
		onChange?.(idx, data[idx]);
	}

	function tweenTo(target, animate) {
		tween?.kill();
		const proxy = { p: posVal };
		const dur = animate && !reducedMotion ? duration / 1000 : 0;
		tween = gsap.to(proxy, {
			p: target,
			duration: dur,
			ease: ease,
			onUpdate: () => {
				posVal = proxy.p;
				layout(proxy.p);
			},
			onComplete: () => {
				const n = count;
				if (n > 0) posVal = ((posVal % n) + n) % n;
				layout(posVal);
			}
		});
	}

	function setFocus(rawIndex, animate = true) {
		const n = count;
		if (!n) return;
		const idx = loop ? ((rawIndex % n) + n) % n : clamp(rawIndex, 0, n - 1);
		let delta = idx - posVal;
		if (loop && n > 1) {
			delta = ((delta % n) + n) % n;
			if (delta > n / 2) delta -= n;
		}
		tweenTo(posVal + delta, animate);
		if (idx !== focusVal) {
			focusVal = idx;
			notify(idx);
		}
	}

	function navigateBy(step) {
		setFocus(focusVal + step, true);
	}

	function onPointerDown(e) {
		if (count < 2) return;
		tween?.kill();
		drag = {
			x: e.clientX,
			startPos: posVal,
			lastX: e.clientX,
			lastT: performance.now(),
			v: 0,
			moved: false,
			id: e.pointerId
		};
	}

	function onPointerMove(e) {
		if (!drag) return;
		const stepPx = Math.max(cardWidth * 0.55 * scaleVal, 40);
		const dx = e.clientX - drag.x;
		if (!drag.moved && Math.abs(dx) > 4) {
			drag.moved = true;
			rootRef?.setPointerCapture(drag.id);
		}
		if (!drag.moved) return;
		const now = performance.now();
		const dt = Math.max(now - drag.lastT, 1);
		drag.v = (e.clientX - drag.lastX) / dt;
		drag.lastX = e.clientX;
		drag.lastT = now;
		posVal = drag.startPos - dx / stepPx;
		layout(posVal);
	}

	function onPointerEnd() {
		if (!drag) return;
		const wasMoved = drag.moved;
		const v = drag.v;
		drag = null;
		if (!wasMoved) return;
		const stepPx = Math.max(cardWidth * 0.55 * scaleVal, 40);
		const projected = posVal - (v * 180) / stepPx;
		setFocus(Math.round(projected), true);
	}

	function onKeyDown(e) {
		if (e.key === 'ArrowLeft') {
			e.preventDefault();
			navigateBy(-1);
		} else if (e.key === 'ArrowRight') {
			e.preventDefault();
			navigateBy(1);
		}
	}

	function onCardClick(index) {
		if (drag?.moved) return;
		setFocus(index, true);
	}

	onMount(() => {
		const root = rootRef;
		if (!root) return;

		reducedMotion =
			typeof window !== 'undefined' &&
			window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		const ro = new ResizeObserver((entries) => {
			const w = entries[0].contentRect.width;
			isMobile = w < 640;
			if (isMobile) {
				const targetCardWidth = Math.min(270, w * 0.7);
				scaleVal = clamp(targetCardWidth / cardWidth, 0.45, 1);
			} else {
				const needed = cardWidth + Math.abs(spread) * 1.5 + 80;
				scaleVal = clamp(w / needed, 0.55, 1);
			}
			layout(posVal);
		});
		ro.observe(root);

		const onWheel = (e) => {
			if (count < 2) return;
			e.preventDefault();
			tween?.kill();
			const raw = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
			const delta = e.deltaMode === 1 ? raw * 24 : raw;
			const step = clamp(delta / (cardWidth * 0.9), -0.6, 0.6);
			posVal += step;
			layout(posVal);
			if (wheelTimer) clearTimeout(wheelTimer);
			wheelTimer = setTimeout(() => setFocus(Math.round(posVal), true), 130);
		};
		root.addEventListener('wheel', onWheel, { passive: false });

		let hovered = false;
		let focused = false;

		const stopAuto = () => {
			if (autoTimer) clearInterval(autoTimer);
			autoTimer = null;
		};

		const startAuto = () => {
			stopAuto();
			if (!autoplay || reducedMotion || count < 2) return;
			autoTimer = window.setInterval(
				() => {
					if (!hovered && !focused) navigateBy(1);
				},
				Math.max(autoplayDelay, 600)
			);
		};

		const onEnter = () => {
			hovered = true;
		};
		const onLeave = () => {
			hovered = false;
		};
		const onFocusIn = () => {
			focused = true;
		};
		const onFocusOut = () => {
			focused = false;
		};

		root.addEventListener('mouseenter', onEnter);
		root.addEventListener('mouseleave', onLeave);
		root.addEventListener('focusin', onFocusIn);
		root.addEventListener('focusout', onFocusOut);

		startAuto();
		layout(posVal);

		return () => {
			tween?.kill();
			if (wheelTimer) clearTimeout(wheelTimer);
			stopAuto();
			ro.disconnect();
			root.removeEventListener('wheel', onWheel);
			root.removeEventListener('mouseenter', onEnter);
			root.removeEventListener('mouseleave', onLeave);
			root.removeEventListener('focusin', onFocusIn);
			root.removeEventListener('focusout', onFocusOut);
		};
	});

	$effect(() => {
		// Re-layout when props change
		depth;
		spread;
		tilt;
		tiltDirection;
		visibleCards;
		falloff;
		blur;
		cardWidth;
		cardHeight;
		radius;
		count;
		layout(posVal);
	});

	$effect(() => {
		if (selectedIndex !== undefined && selectedIndex !== null && selectedIndex !== focusVal) {
			setFocus(selectedIndex, true);
		}
	});
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
	bind:this={rootRef}
	class="depth-carousel {className}"
	style="--dc-perspective: {perspective}px;"
	role="group"
	aria-roledescription="carousel"
	aria-label="Depth carousel"
	tabindex="0"
	onpointerdown={onPointerDown}
	onpointermove={onPointerMove}
	onpointerup={onPointerEnd}
	onpointercancel={onPointerEnd}
	onkeydown={onKeyDown}
>
	<div class="depth-carousel__stage">
		{#each data as item, i}
			<div
				class="depth-carousel__card"
				bind:this={cardRefs[i]}
				style="width: {cardWidth}px; height: {cardHeight}px; border-radius: {radius}px;"
				aria-roledescription="slide"
				aria-label="{i + 1} of {count}"
				aria-hidden={active !== i}
				onclick={() => onCardClick(i)}
			>
				{#if item.video}
					<video
						class="depth-carousel__video"
						src={item.video}
						poster={item.image}
						muted
						loop
						playsinline
						autoplay={active === i}
						preload="metadata"
						onerror={(e) => {
							e.currentTarget.style.display = 'none';
							const fallback = e.currentTarget.parentElement?.querySelector('.depth-carousel__img--fallback');
							if (fallback) fallback.style.display = 'block';
						}}
					></video>
					<img
						class="depth-carousel__img depth-carousel__img--fallback"
						src={item.image}
						alt={item.alt || ''}
						draggable="false"
						style="display: none;"
					/>
				{:else}
					<img class="depth-carousel__img" src={item.image} alt={item.alt || ''} draggable="false" />
				{/if}

				<!-- Card Overlay & Meta -->
				<div class="depth-carousel__card-overlay">
					<span class="depth-carousel__card-badge">
						<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
							<path d="M8 5v14l11-7z" />
						</svg>
						{item.video ? 'VIDEO' : 'MOTION REEL'}
					</span>
					{#if item.title}
						<span class="depth-carousel__card-title">{item.title}</span>
					{/if}
				</div>

				<span
					class="depth-carousel__tint"
					bind:this={overlayRefs[i]}
					style="background: {tint};"
				></span>
			</div>
		{/each}
	</div>

	{#if showControls && count > 1}
		<button
			type="button"
			class="depth-carousel__arrow depth-carousel__arrow--prev"
			aria-label="Previous slide"
			onclick={() => navigateBy(-1)}
		>
			<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
				<path
					d="M15 5l-7 7 7 7"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</button>
		<button
			type="button"
			class="depth-carousel__arrow depth-carousel__arrow--next"
			aria-label="Next slide"
			onclick={() => navigateBy(1)}
		>
			<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
				<path
					d="M9 5l7 7-7 7"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</button>
	{/if}

	{#if showIndicators && count > 1}
		<div class="depth-carousel__dots" role="tablist" aria-label="Slides">
			{#each data as _, i}
				<button
					type="button"
					role="tab"
					aria-selected={active === i}
					aria-label="Go to slide {i + 1}"
					class="depth-carousel__dot {active === i ? 'is-active' : ''}"
					onclick={() => setFocus(i, true)}
				></button>
			{/each}
		</div>
	{/if}
</div>
