<script>
	import { onMount } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	// Stats data
	const stats = [
		{ target: 45, suffix: '+', label: 'Brands Disrupted' },
		{ target: 100, suffix: '%', label: 'HAPPY CLIENTS' },
		{ target: 3, suffix: '+', label: 'Years Defying Defaults' }
	];

	// Tweened values for the numbers
	const count1 = tweened(0, { duration: 2500, easing: cubicOut });
	const count2 = tweened(0, { duration: 2500, easing: cubicOut });
	const count3 = tweened(0, { duration: 2500, easing: cubicOut });

	let sectionRef;
	let hasStarted = false;

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && !hasStarted) {
					hasStarted = true;
					count1.set(stats[0].target);
					count2.set(stats[1].target);
					count3.set(stats[2].target);
				}
			},
			{ threshold: 0.2 }
		);

		if (sectionRef) observer.observe(sectionRef);
		return () => observer.disconnect();
	});
</script>

<section id="damage" class="damage-wrap" bind:this={sectionRef}>
	<div class="content-limit">
		<div class="header-content">
			<span class="label-top">THE STATISTICS</span>
			<h2 class="main-title">BY THE NUMBERS</h2>
		</div>

		<div class="stats-grid">
			<div class="stat-item">
				<div class="number-wrap">
					<span class="number">{Math.floor($count1)}</span>
					<span class="suffix">{stats[0].suffix}</span>
				</div>
				<p class="stat-desc">{stats[0].label}</p>
			</div>

			<div class="stat-item">
				<div class="number-wrap">
					<span class="number">{Math.floor($count2)}</span>
					<span class="suffix">{stats[1].suffix}</span>
				</div>
				<p class="stat-desc">{stats[1].label}</p>
			</div>

			<div class="stat-item">
				<div class="number-wrap">
					<span class="number">{Math.floor($count3)}</span>
					<span class="suffix">{stats[2].suffix}</span>
				</div>
				<p class="stat-desc">{stats[2].label}</p>
			</div>
		</div>
	</div>
</section>

<style>
	.damage-wrap {
		padding: 10rem clamp(1rem, 5vw, 4rem);
		background: transparent;
		overflow: hidden;
		scroll-margin-top: 120px; /* Accounts for fixed header */
	}

	.content-limit {
		max-width: 1400px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 4rem;
	}

	.header-content {
		text-align: center;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.label-top {
		font-family: 'Rubik Mono One', sans-serif;
		font-size: 1rem;
		color: #3d3d3d;
		opacity: 0.7;
		letter-spacing: 0.15em;
	}

	:global(.dark) .label-top {
		color: #fff;
	}

	.main-title {
		font-family: 'Unbounded', sans-serif;
		font-size: clamp(2.5rem, 6vw, 4.5rem);
		font-weight: 900;
		line-height: 1;
		margin: 0;
		color: #1c1c1c;
		letter-spacing: -0.05em;
	}

	:global(.dark) .main-title {
		color: #fff;
	}

	.stats-grid {
		display: flex;
		justify-content: space-around;
		align-items: flex-start;
		width: 100%;
		gap: 2rem;
		flex-wrap: wrap;
	}

	.stat-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		flex: 1;
		min-width: 250px;
	}

	.number-wrap {
		display: flex;
		align-items: baseline;
		justify-content: center;
		font-family: 'Unbounded', sans-serif;
		font-weight: 900;
		line-height: 1;
		color: #fdd803; /* Theme yellow as requested */
	}

	:global(.dark) .number-wrap {
		color: #fdd803;
	}

	.number {
		font-size: clamp(4rem, 10vw, 8rem);
		/* Neon/Hard shadow for brutality */
		text-shadow: 6px 6px 0px #1c1c1c;
		-webkit-text-stroke: 8px #1c1c1c; /* Heavy border */
		paint-order: stroke fill;
	}

	.suffix {
		font-size: clamp(2rem, 5vw, 4rem);
		/* Matching number style: yellow fill, heavy black stroke and shadow */
		color: #fdd803;
		text-shadow: 6px 6px 0px #1c1c1c;
		-webkit-text-stroke: 6px #1c1c1c; /* Slightly thinner than numbers to avoid clumping but still heavy */
		paint-order: stroke fill;
	}

	.stat-desc {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 1.2rem;
		font-weight: 800;
		text-transform: uppercase;
		color: #3d3d3d;
		margin-top: 1rem;
		letter-spacing: 0.05em;
	}

	:global(.dark) .stat-desc {
		color: #ccc;
	}

	@media (max-width: 768px) {
		.damage-wrap {
			padding: 6rem 1.5rem;
			scroll-margin-top: 100px; /* Accounts for fixed header on mobile */
		}
		.stats-grid {
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: 4rem;
		}
		.number {
			font-size: 5rem;
		}
	}
</style>
