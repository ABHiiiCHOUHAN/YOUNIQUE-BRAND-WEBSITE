	<script>
	const words = ["THE", "MINDS", "BEHIND", "THE", "CHAOS"];
</script>

<div class="about-container">
	<header class="about-header">
		<h1 class="about-title">
			{#each words as word, i}
				<span class="kinetic-word loop-{(i % 4) + 1}" data-word={word}>{word}</span>{' '}
			{/each}
		</h1>
		<p class="about-summary">
			We build identities, interfaces, and systems with structure-first thinking and just enough
			chaos to feel alive. If it looks bold but reads clean, we’re into it.
		</p>
	</header>

	<div class="cards-stack">
		<div class="stacked-card card--approach stagger-item" style="--rot: -2deg; --bg: #393839; animation-delay: 0.1s;">
			<div class="card-label">OUR APPROACH</div>
			<p class="card-text">
				We don't do fluff. We build identities and systems with a focus on impact and clean aesthetics.
			</p>
		</div>

		<div class="stacked-card card--expertise stagger-item" style="--rot: 1.5deg; --bg: #6EB0CA; animation-delay: 0.25s;">
			<div class="card-label">EXPERTISE</div>
			<ul class="card-list">
				<li>Visual Identity</li>
				<li>Digital Spaces</li>
				<li>Interactive Systems</li>
			</ul>
		</div>

		<div class="stacked-card card--join stagger-item" style="--rot: -1deg; --bg: #FDD803; animation-delay: 0.4s;">
			<div class="card-label">JOIN US</div>
			<p class="card-text">Ready to defy the default? Let's build something loud together.</p>
		</div>
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
		0%, 70% { font-family: inherit; transform: translate(-50%, -50%) rotate(0deg) scale(1); }
		72% { font-family: 'Kinetic-LLPixel'; transform: translate(-50%, -50%) rotate(1deg) scale(0.92); }
		75% { font-family: 'Rubik Mono One'; transform: translate(-50%, -50%) rotate(-1.5deg) scale(0.88); }
		100% { font-family: inherit; transform: translate(-50%, -50%) rotate(0deg) scale(1); }
	}
	@keyframes wordKinetic2 {
		0%, 73% { font-family: inherit; transform: translate(-50%, -50%) rotate(0deg) scale(1); }
		76% { font-family: 'Nauryz'; transform: translate(-50%, -50%) rotate(1.2deg) scale(0.95); }
		80% { font-family: 'Kalamayka'; transform: translate(-50%, -50%) rotate(-1deg) scale(0.92); }
		100% { font-family: inherit; transform: translate(-50%, -50%) rotate(0deg) scale(1); }
	}
	@keyframes wordKinetic3 {
		0%, 65% { font-family: inherit; transform: translate(-50%, -50%) rotate(0deg) scale(1); }
		70% { font-family: 'Rubik Mono One'; transform: translate(-50%, -50%) rotate(1.5deg) scale(0.88); }
		74% { font-family: 'Kinetic-LLPixel'; transform: translate(-50%, -50%) rotate(-2deg) scale(0.92); }
		100% { font-family: inherit; transform: translate(-50%, -50%) rotate(0deg) scale(1); }
	}
	@keyframes wordKinetic4 {
		0%, 78% { font-family: inherit; transform: translate(-50%, -50%) rotate(0deg) scale(1); }
		82% { font-family: 'Kalamayka'; transform: translate(-50%, -50%) rotate(1.5deg) scale(0.92); }
		86% { font-family: 'Nauryz'; transform: translate(-50%, -50%) rotate(-1deg) scale(0.95); }
		100% { font-family: inherit; transform: translate(-50%, -50%) rotate(0deg) scale(1); }
	}

	.loop-1::before { animation: wordKinetic1 9.5s infinite 0.2s; }
	.loop-2::before { animation: wordKinetic2 12s infinite 3s; }
	.loop-3::before { animation: wordKinetic3 14.5s infinite 1.5s; }
	.loop-4::before { animation: wordKinetic4 17s infinite 0.9s; }


	.cards-stack {
		display: flex;
		flex-direction: row;
		gap: 2rem;
		position: relative;
		align-items: stretch;
	}

	.stacked-card {
		flex: 1;
		background: var(--bg);
		border: 4px solid #393839;
		padding: 2.5rem;
		box-shadow: 12px 12px 0px #393839;
		transform: rotate(var(--rot, 0deg));
		transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
		will-change: transform, opacity;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		min-height: 380px;
	}

	.stacked-card:hover {
		transform: rotate(0) scale(1.05) translateY(-10px);
		z-index: 10;
		box-shadow: 20px 20px 0px #393839;
	}

	.card--approach { color: #FFFAF4; }
	.card--expertise, .card--join { color: #393839; }

	.card-label {
		font-family: 'Rubik Mono One', sans-serif;
		font-size: 0.8rem;
		opacity: 0.6;
		letter-spacing: 0.1em;
		margin-bottom: 0.5rem;
	}

	.card-text {
		font-family: var(--font-secondary);
		font-size: 1.2rem;
		font-weight: 700;
		line-height: 1.4;
		margin: 0;
	}

	.card-list {
		list-style: none;
		padding: 0;
		margin: 0;
		font-family: var(--font-heading);
		font-size: 2.2rem;
		font-weight: 900;
		text-transform: uppercase;
		line-height: 0.9;
		letter-spacing: -0.02em;
	}

	.card-list li {
		margin-bottom: 1rem;
	}

	.btn-primary {
		margin-top: auto;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: var(--color-3);
		color: var(--color-5);
		padding: 0.85rem 1.8rem;
		border-radius: 999px;
		text-decoration: none;
		font-weight: 900;
		text-transform: uppercase;
		font-size: 0.85rem;
		letter-spacing: 0.1em;
		border: 3px solid var(--color-3);
		transition: all 0.3s;
		box-shadow: 6px 6px 0 rgba(0,0,0,0.1);
	}

	.btn-primary:hover {
		background: var(--color-1);
		color: var(--color-3);
		transform: translate(-3px, -3px);
		box-shadow: 9px 9px 0 var(--color-3);
	}

	:global(.dark) .about-title { color: #fff; }
	:global(.dark) .kinetic-word::before { color: #fff !important; }
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
		.cards-stack {
			flex-direction: column;
		}
		.stacked-card {
			transform: none !important;
			min-height: auto;
			padding: 2.5rem;
			box-shadow: 8px 8px 0px var(--color-3);
		}
		.card-list { font-size: 1.8rem; }
	}
</style>
