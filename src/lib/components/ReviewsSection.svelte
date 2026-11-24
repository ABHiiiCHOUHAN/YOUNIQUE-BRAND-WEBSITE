<script>
	import '$lib/styles/fonts/home.css';
	import { onMount } from 'svelte';

	const reviews = [
		{
			text: "They took our complex fintech platform and gave it a soul. The visual systems they developed aren't just pretty—they're strategic assets that have fundamentally changed how our customers in Bangalore interact with us.",
			author: 'Ajay Verma',
			role: 'CTO // Bangalore, India',
			img: '/assets/reviews/ajay.png',
			shape: 'hexagon',
			color: '#FFD4E9'
		},
		{
			text: 'Most agencies just follow instructions. These guys challenge you to be better. They brought a level of design thinking that transformed our Delhi-based operations overnight.',
			author: 'Meera Kapoor',
			role: 'Executive Director // Delhi, India',
			img: '/assets/reviews/meera.png',
			shape: 'circle',
			color: '#D1E8FF'
		},
		{
			text: "The architectural clarity they brought to our tech stack's interface is astounding. We've seen a 35% increase in user retention since the rollout. Zero fluff, just high-impact results.",
			author: 'Siddharth Malhotra',
			role: 'Tech Founder // Mumbai, India',
			img: '/assets/reviews/siddharth.png',
			shape: 'star',
			color: '#FFE499'
		},
		{
			text: 'Finally, a team that understands the intersection of global aesthetics and Indian market nuances. They gave our brand a pulse in an increasingly crowded digital landscape.',
			author: 'Ananya Rao',
			role: 'Marketing Head // Chennai, India',
			img: '/assets/reviews/ananya.png',
			shape: 'hexagon',
			color: '#E2FFD1'
		},
		{
			text: "Strategic ROI is rarely this visible. We stopped being 'just another app' and started being a destination. Their work in the Hyderabad market has been nothing short of disruption.",
			author: 'Suresh Menon',
			role: 'CEO // Hyderabad, India',
			img: '/assets/reviews/suresh.png',
			shape: 'circle',
			color: '#FFFAFF'
		},
		{
			text: 'The level of sophistication they brought to our Cabo hospitality group is world-class. They captured the vibrant energy of the region while maintaining a premium executive feel.',
			author: 'Elena Rodriguez',
			role: 'Hospitality Exec // Cabo, MX',
			img: '/assets/reviews/elena.png',
			shape: 'star',
			color: '#D6FFFA'
		},
		{
			text: 'In a city like Dubai, you have to be loud to be heard. They gave us exactly the edge we needed for our flagship launch—sophisticated, fast, and visually stunning.',
			author: 'Omar Al-Sayed',
			role: 'Managing Director // Dubai, UAE',
			img: '/assets/reviews/omar.png',
			shape: 'hexagon',
			color: '#D1FFF8'
		},
		{
			text: 'The London scene is incredibly demanding. They turned our vague vision into a powerhouse brand that genuinely stands out. Their obsession with detail is what sets them apart.',
			author: 'James Harrington',
			role: 'CEO // London, UK',
			img: '/assets/reviews/james.png',
			shape: 'circle',
			color: '#E8D1FF'
		},
		{
			text: "Fantastic communication and even better output. They simplified our digital experience in Toronto in ways we didn't think possible. A highly recommended creative partner.",
			author: 'Sarah Thompson',
			role: 'Ops Lead // Toronto, CA',
			img: '/assets/reviews/sarah.png',
			shape: 'star',
			color: '#D1D5FF'
		},
		{
			text: 'Structural chaos done right. They have a unique perspective on design that feels years ahead of the curve. The Amsterdam office is absolutely wowed.',
			author: 'Lars van der Berg',
			role: 'Creative Director // Amsterdam, NL',
			img: '/assets/reviews/lars.png',
			shape: 'hexagon',
			color: '#FFD1D1'
		}
	];

	let scrollContainer;
	let activeIndex = $state(0);
	let interval;
	let isDragging = false;
	let startX;
	let scrollLeft;

	const startAutoPlay = () => {
		stopAutoPlay();
		interval = setInterval(() => {
			activeIndex = (activeIndex + 1) % reviews.length;
			scrollTo(activeIndex);
		}, 4000);
	};

	const stopAutoPlay = () => {
		if (interval) clearInterval(interval);
	};

	const scrollTo = (index) => {
		if (!scrollContainer) return;
		const items = scrollContainer.querySelectorAll('.review-slide');
		if (items[index]) {
			const item = items[index];
			const targetX = item.offsetLeft - scrollContainer.offsetWidth / 2 + item.offsetWidth / 2;
			scrollContainer.scrollTo({ left: targetX, behavior: 'smooth' });
			activeIndex = index;
		}
	};

	const next = () => {
		stopAutoPlay();
		activeIndex = (activeIndex + 1) % reviews.length;
		scrollTo(activeIndex);
		startAutoPlay();
	};

	const prev = () => {
		stopAutoPlay();
		activeIndex = (activeIndex - 1 + reviews.length) % reviews.length;
		scrollTo(activeIndex);
		startAutoPlay();
	};

	const handleScroll = () => {
		if (!scrollContainer || isDragging) return;
		const scrollPos = scrollContainer.scrollLeft;
		const index = Math.round(scrollPos / (scrollContainer.scrollWidth / reviews.length));

		if (index >= 0 && index < reviews.length && index !== activeIndex) {
			activeIndex = index;
		}
	};

	// Drag Support
	const onMouseDown = (e) => {
		isDragging = true;
		stopAutoPlay();
		scrollContainer.classList.add('dragging');
		startX = e.pageX - scrollContainer.offsetLeft;
		scrollLeft = scrollContainer.scrollLeft;
	};

	const onMouseUp = () => {
		isDragging = false;
		if (scrollContainer) scrollContainer.classList.remove('dragging');
		startAutoPlay();
	};

	const onMouseLeave = () => {
		if (isDragging) onMouseUp();
	};

	const onMouseMove = (e) => {
		if (!isDragging) return;
		e.preventDefault();
		const x = e.pageX - scrollContainer.offsetLeft;
		const walk = (x - startX) * 2;
		scrollContainer.scrollLeft = scrollLeft - walk;
	};

	onMount(() => {
		startAutoPlay();
		return () => stopAutoPlay();
	});
</script>

<section id="reviews" class="reviews-wrap">
	<div class="header-overlay">
		<h2
			class="title"
			style="color: var(--color-5); opacity: 0.1; position: absolute; left: 0; top: 2rem; transform: rotate(-90deg); transform-origin: left top;"
		>
			FEEDBACK
		</h2>
		<h2 class="title">CLIENT // VOICES</h2>
	</div>

	<div class="slideshow-container">
		<button class="nav-btn prev" onclick={prev} aria-label="Previous">&larr;</button>
		<button class="nav-btn next" onclick={next} aria-label="Next">&rarr;</button>

		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="slides-inner"
			bind:this={scrollContainer}
			onscroll={handleScroll}
			onmousedown={onMouseDown}
			onmouseup={onMouseUp}
			onmousemove={onMouseMove}
			onmouseleave={onMouseLeave}
		>
			{#each reviews as review, i}
				<div
					class="review-slide stagger-item"
					style:animation-delay="{i * 0.1}s"
					class:active={i === activeIndex}
				>
					<div class="paper-note" style="background: {review.color};">
						<img src="/assets/paperclip.jpg" alt="clip" class="paper-clip" />

						<div class="client-photo {review.shape}">
							<img src={review.img} alt={review.author} />
						</div>

						<div class="review-content">
							<p class="review-text">"{review.text}"</p>
							<div class="review-meta">
								<span class="author">{review.author}</span>
								<span class="role">{review.role}</span>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<div class="dots">
		{#each reviews as _, i}
			<button
				class="dot"
				class:active={i === activeIndex}
				onclick={() => {
					stopAutoPlay();
					scrollTo(i);
					startAutoPlay();
				}}
				aria-label="Go to review {i + 1}"
			></button>
		{/each}
	</div>
</section>

<style>
	.reviews-wrap {
		padding: 10rem 0; /* No side padding to allow full-width scroll */
		background: #3d3d3d;
		position: relative;
		overflow: hidden;
		min-height: 80vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.header-overlay {
		margin-bottom: 4rem;
		text-align: center;
		width: 100%;
		padding: 0 1.5rem;
	}

	.title {
		font-family: 'Rubik Mono One', sans-serif;
		font-size: clamp(2.5rem, 6vw, 5rem);
		color: var(--color-5);
		line-height: 1;
		letter-spacing: -0.05em;
		margin: 0;
		text-transform: uppercase;
	}

	:global(.dark) .title {
		color: var(--color-1);
	}

	.slideshow-container {
		position: relative;
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 0;
	}

	.slides-inner {
		display: flex;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		scroll-behavior: smooth;
		gap: 4rem;
		padding: 4rem calc(50% - 275px); /* Center based on 550px width */
		-ms-overflow-style: none; /* Hide scrollbar IE/Edge */
		scrollbar-width: none; /* Hide scrollbar Firefox */
		cursor: grab;
		user-select: none;
	}

	.slides-inner:active {
		cursor: grabbing;
	}

	/* Force instant scrolling during drag for smoothness */
	.slides-inner.dragging {
		scroll-behavior: auto !important;
		scroll-snap-type: none !important;
	}

	.slides-inner::-webkit-scrollbar {
		display: none; /* Hide scrollbar Chrome/Safari */
	}

	.review-slide {
		flex: 0 0 550px; /* Reduced from 700px */
		scroll-snap-align: center;
		transition:
			transform 0.6s cubic-bezier(0.16, 1, 0.3, 1),
			opacity 0.4s;
		opacity: 0.4;
		transform: scale(0.9);
	}

	.review-slide.active {
		opacity: 1;
		transform: scale(1) rotate(1deg);
	}

	.paper-note {
		padding: 4.5rem 2.5rem 2.5rem; /* Increased top padding to clear the clip */
		border: 4px solid #1c1c1c;
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 1.5rem;
		filter: brightness(0.96) contrast(1.02); /* Seamless tint */
	}

	.paper-clip {
		position: absolute;
		top: -45px; /* Moved higher */
		left: 20px; /* Moved more to the edge */
		width: 100px;
		transform: rotate(-15deg);
		z-index: 20;
		pointer-events: none;
		mix-blend-mode: multiply;
	}

	.client-photo {
		width: 120px;
		height: 120px;
		position: absolute;
		top: -40px;
		right: -40px;
		z-index: 15;
		overflow: hidden;
		filter: grayscale(1) contrast(1.1) opacity(0.9); /* Premium minimal tint */
	}

	.client-photo img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		pointer-events: none; /* Let drag events pass to container */
		user-select: none;
		-webkit-user-drag: none;
	}

	/* Photo Shapes */
	.client-photo.circle {
		border-radius: 50%;
	}
	.client-photo.hexagon {
		clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);
		border-radius: 20%;
	}
	.client-photo.star {
		clip-path: polygon(
			50% 2%,
			68% 35%,
			98% 38%,
			78% 62%,
			88% 98%,
			50% 82%,
			12% 98%,
			22% 62%,
			2% 38%,
			32% 35%
		);
		border-radius: 35%;
	}

	.review-text {
		font-family: 'ShadowsIntoLight', cursive;
		font-size: clamp(1.4rem, 2.8vw, 2.2rem); /* Significantly smaller as requested */
		font-weight: 400;
		line-height: 1.2;
		color: #1c1c1c;
		margin: 0 0 1.5rem 0;
	}

	.review-meta {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		border-top: 3px solid #1c1c1c;
		padding-top: 1.5rem;
		width: 100%;
	}

	.author {
		font-weight: 900;
		font-size: 1.2rem;
		text-transform: uppercase;
		color: #1c1c1c;
		letter-spacing: 0.05em;
	}

	.role {
		font-size: 0.9rem;
		font-weight: 700;
		color: #1c1c1c;
		opacity: 0.7;
	}

	.nav-btn {
		background: #fff;
		border: 3px solid #1c1c1c;
		width: 60px;
		height: 60px;
		font-size: 1.5rem;
		font-weight: 900;
		cursor: pointer;
		position: absolute;
		top: 50%;
		translate: 0 -50%;
		z-index: 100;
		display: flex;
		justify-content: center;
		align-items: center;
		box-shadow: 6px 6px 0px #1c1c1c;
		transition: all 0.2s;
	}

	.nav-btn.prev {
		left: 40px;
	}
	.nav-btn.next {
		right: 40px;
	}

	.dots {
		display: flex;
		gap: 1rem;
		margin-top: 2rem;
	}

	.dot {
		width: 16px;
		height: 16px;
		border: 3px solid #fff;
		background: transparent;
		cursor: pointer;
		padding: 0;
		transition: all 0.3s;
	}

	.dot.active {
		background: #fdd803;
		width: 30px;
	}

	@media (max-width: 900px) {
		.slides-inner {
			padding: 4rem 1.5rem;
			gap: 2rem;
		}
		.review-slide {
			flex: 0 0 280px;
		}
		.paper-note {
			padding: 3rem 2rem;
			aspect-ratio: 1 / 1.1;
			justify-content: center;
		}
		.client-photo {
			width: 80px;
			height: 80px;
			top: -30px;
			right: 10px;
		}
		.paper-clip {
			width: 60px;
			left: 10px;
			top: -20px;
		}
		.review-text {
			font-size: 1.1rem;
			line-height: 1.4;
			margin-bottom: 1rem;
		}
		.nav-btn {
			display: none;
		}
	}
</style>
