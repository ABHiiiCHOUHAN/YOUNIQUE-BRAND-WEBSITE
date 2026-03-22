	<div class="about-container">
		<header class="about-header">
			<h1 class="about-title">
				THE MINDS BEHIND <span class="highlight">THE CHAOS.</span>
			</h1>
			<p class="about-summary">
				We build identities, interfaces, and systems with structure-first thinking and just enough
				chaos to feel alive. If it looks bold but reads clean, we’re into it.
			</p>
		</header>

		<div class="cards-stack">
			<div class="stacked-card card--approach stagger-item" style="--rot: -2deg; --bg: var(--color-3); animation-delay: 0.1s;">
				<div class="card-label">OUR APPROACH</div>
				<p class="card-text">
					We don't do fluff. We build identities and systems with a focus on impact and clean aesthetics.
				</p>
			</div>

			<div class="stacked-card card--expertise stagger-item" style="--rot: 1.5deg; --bg: var(--color-2); animation-delay: 0.25s;">
				<div class="card-label">EXPERTISE</div>
				<ul class="card-list">
					<li>Visual Identity</li>
					<li>Digital Spaces</li>
					<li>Interactive Systems</li>
				</ul>
			</div>

			<div class="stacked-card card--join stagger-item" style="--rot: -1deg; --bg: var(--color-1); animation-delay: 0.4s;">
				<div class="card-label">JOIN US</div>
				<p class="card-text">Ready to defy the default? Let's build something loud together.</p>
				<a class="btn-primary" href="#contact">Get in touch</a>
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
		border: 4px solid var(--color-3);
		padding: 2.5rem;
		box-shadow: 12px 12px 0px var(--color-3);
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
		box-shadow: 20px 20px 0px var(--color-3);
	}

	.card--approach { color: var(--color-5); }
	.card--expertise, .card--join { color: var(--color-3); }

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

	:global(.dark) .stacked-card {
		border-color: #fff;
		box-shadow: 12px 12px 0px #000;
	}
	
	:global(.dark) .about-title { color: #fff; }
	:global(.dark) .card-text, :global(.dark) .card-list { color: inherit; }

	@media (max-width: 768px) {
		.about-container { 
			padding: 5rem 1.5rem; 
			gap: 4rem; 
			grid-template-columns: 1fr;
		}
		.about-title { font-size: 2.5rem; }
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
