<script>
	import '$lib/styles/fonts/about.css';
	import AboutIllustration from './AboutIllustration.svelte';
	const words = ['THE', 'MINDS', 'BEHIND', 'THE', 'CHAOS'];
</script>

<div class="about-container">
	<header class="about-header">
		<h1 class="about-title">
			{#each words as word, i}
				<span class="kinetic-word loop-{(i % 4) + 1}" data-word={word}>{word}</span>{' '}
			{/each}
		</h1>
	</header>

	<!-- Added the vector illustration to the right column -->
	<div class="illustration-col">
		<AboutIllustration />
	</div>
</div>

<style>
	.about-container {
		padding: 8rem clamp(1.5rem, 5vw, 6rem);
		max-width: 1700px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 0.8fr 1.2fr;
		align-items: flex-start;
		gap: 4rem;
		position: relative;
	}
	.illustration-col {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
	}

	.about-title {
		font-size: clamp(4rem, 11vw, 7.5rem);
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		line-height: 0.85; /* Tightened line-height */
		margin-bottom: 2rem;
		color: #3d3d3d;
		text-transform: uppercase;
		display: flex;
		flex-wrap: wrap;
		column-gap: 1.5rem; /* Slightly tighter column gap */
		row-gap: 0; /* Minimal row gap */
	}

	.kinetic-word {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		position: relative;
		color: transparent !important;
		user-select: none;
		letter-spacing: -0.01em; /* Tightened as requested */
		min-width: fit-content;
		white-space: pre; /* Ensure width is calculated accurately including trailing spaces if any */
	}

	.kinetic-word::before {
		content: attr(data-word);
		position: absolute;
		top: 50%;
		left: 50%;
		/* Absolute centering to prevent side-to-side jitter */
		transform: translate(-50%, -50%);
		color: #3d3d3d !important;
		font-family: inherit;
		display: flex;
		align-items: center;
		justify-content: center;
		white-space: nowrap;
		transition: font-family 0.1s ease;
		pointer-events: none;
	}

	/* Adjusted keyframes to include a subtle 'scale down' effect for alternate fonts */
	@keyframes wordKinetic1 {
		0%,
		70% {
			font-family: inherit;
			transform: translate(-50%, -50%) rotate(0deg) scale(1);
		}
		72% {
			font-family: 'Kinetic-LLPixel';
			transform: translate(-50%, -50%) rotate(1deg) scale(0.92);
		}
		75% {
			font-family: 'Rubik Mono One';
			transform: translate(-50%, -50%) rotate(-1.5deg) scale(0.88);
		}
		100% {
			font-family: inherit;
			transform: translate(-50%, -50%) rotate(0deg) scale(1);
		}
	}
	@keyframes wordKinetic2 {
		0%,
		73% {
			font-family: inherit;
			transform: translate(-50%, -50%) rotate(0deg) scale(1);
		}
		76% {
			font-family: 'Nauryz';
			transform: translate(-50%, -50%) rotate(1.2deg) scale(0.95);
		}
		80% {
			font-family: 'Kalamayka';
			transform: translate(-50%, -50%) rotate(-1deg) scale(0.92);
		}
		100% {
			font-family: inherit;
			transform: translate(-50%, -50%) rotate(0deg) scale(1);
		}
	}
	@keyframes wordKinetic3 {
		0%,
		65% {
			font-family: inherit;
			transform: translate(-50%, -50%) rotate(0deg) scale(1);
		}
		70% {
			font-family: 'Rubik Mono One';
			transform: translate(-50%, -50%) rotate(1.5deg) scale(0.88);
		}
		74% {
			font-family: 'Kinetic-LLPixel';
			transform: translate(-50%, -50%) rotate(-2deg) scale(0.92);
		}
		100% {
			font-family: inherit;
			transform: translate(-50%, -50%) rotate(0deg) scale(1);
		}
	}
	@keyframes wordKinetic4 {
		0%,
		78% {
			font-family: inherit;
			transform: translate(-50%, -50%) rotate(0deg) scale(1);
		}
		82% {
			font-family: 'Kalamayka';
			transform: translate(-50%, -50%) rotate(1.5deg) scale(0.92);
		}
		86% {
			font-family: 'Nauryz';
			transform: translate(-50%, -50%) rotate(-1deg) scale(0.95);
		}
		100% {
			font-family: inherit;
			transform: translate(-50%, -50%) rotate(0deg) scale(1);
		}
	}

	.loop-1::before {
		animation: wordKinetic1 9.5s infinite 0.2s;
	}
	.loop-2::before {
		animation: wordKinetic2 12s infinite 3s;
	}
	.loop-3::before {
		animation: wordKinetic3 14.5s infinite 1.5s;
	}
	.loop-4::before {
		animation: wordKinetic4 17s infinite 0.9s;
	}



	:global(.dark) .about-title {
		color: #fff;
	}
	:global(.dark) .kinetic-word::before {
		color: #fff !important;
	}
	/* Removed stacked-card overrides to keep light mode colors */

	@media (max-width: 768px) {
		.about-container {
			padding: 5rem 1.5rem;
			gap: 4rem;
			grid-template-columns: 1fr;
			text-align: center;
		}
		.about-header {
			display: flex;
			flex-direction: column;
			align-items: center;
		}
		.about-title {
			font-size: 2.5rem;
			justify-content: center;
		}
		.about-summary {
			text-align: center;
			margin: 0 auto;
		}
	}
</style>
