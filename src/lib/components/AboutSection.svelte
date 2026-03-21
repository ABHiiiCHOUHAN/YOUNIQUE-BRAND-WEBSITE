<section class="wrap page-transition">
	<div class="panel">
		<header class="page-header">
			<h1 class="page-title">Younique is a design studio for brands that refuse to blend in.</h1>
			<p class="page-sub">
				We build identities, interfaces, and systems with structure-first thinking and just enough
				chaos to feel alive. If it looks bold but reads clean, we’re into it.
			</p>
		</header>

		<div class="grid">
			<div class="box tone-dark">
				<div class="label">Our Approach</div>
				<p class="text">
					We don't do fluff. We build identities and systems with a focus on impact and clean
					aesthetics.
				</p>
			</div>

			<div class="box tone-blue">
				<div class="label">Expertise</div>
				<ul class="list">
					<li>Visual Identity</li>
					<li>Digital Spaces</li>
					<li>Interactive Systems</li>
				</ul>
			</div>

			<div class="box tone-yellow">
				<div class="label">Join Us</div>
				<p class="text">Ready to defy the default? Let's build something loud together.</p>
				<a class="cta" href="/contact">Get in touch</a>
			</div>
		</div>
	</div>
</section>

<style>
	.wrap {
		padding: 2.25rem clamp(1rem, 4vw, 4rem) 4rem;
	}

	.panel {
		border-radius: 28px;
		border: 3px solid var(--color-3);
		background: var(--color-5);
		color: var(--color-3);
		box-shadow: 12px 14px 0px var(--color-3);
		padding: clamp(1.25rem, 3vw, 2rem);
	}

	.grid {
		margin-top: 1.5rem;
		display: grid;
		grid-template-columns: repeat(12, 1fr);
		gap: 1rem;
	}

	.box {
		grid-column: span 4;
		border-radius: 22px;
		border: 3px solid var(--color-3);
		padding: 1.1rem;
		background: var(--color-5);
		color: var(--color-3);
	}

	.tone-blue {
		background: var(--color-2);
		color: #1c1c1c;
	}
	.tone-yellow {
		background: var(--color-1);
		color: #1c1c1c;
	}
	.tone-dark {
		background: var(--color-3);
		color: var(--color-5);
	}

	:global(.dark) .tone-dark {
		background: #8e9294;
		border-color: #8e9294;
		color: var(--color-5);
	}

	:global(.dark) .tone-blue {
		background: color-mix(in srgb, var(--color-2) 10%, var(--color-5));
		border-color: var(--color-2);
		color: var(--color-2);
	}

	:global(.dark) .tone-yellow {
		background: color-mix(in srgb, var(--color-1) 10%, var(--color-5));
		border-color: var(--color-1);
		color: var(--color-1);
	}

	.label {
		font-weight: 900;
		letter-spacing: -0.02em;
		margin-bottom: 0.6rem;
	}

	.list {
		margin: 0;
		padding-left: 1.1rem;
		line-height: 1.7;
		opacity: 0.95;
	}

	.text {
		margin: 0;
		line-height: 1.6;
		opacity: 0.92;
	}

	.cta {
		margin-top: 0.9rem;
		display: inline-flex;
		text-decoration: none;
		border-radius: 999px;
		padding: 0.7rem 1.05rem;
		font-weight: 900;
		background: var(--color-2);
		color: var(--color-3);
		border: 2px solid var(--color-2);
	}

	:global(.dark) .cta {
		background: var(--color-5);
		color: var(--color-2);
		border-color: var(--color-2);
	}

	.cta:hover,
	.cta:focus-visible {
		transform: translateY(-1px);
		outline: none;
	}

	@media (max-width: 980px) {
		.box {
			grid-column: span 6;
		}
	}

	@media (max-width: 640px) {
		.wrap {
			padding: 1.5rem 1rem 3rem;
		}
		.grid {
			gap: 0.75rem;
		}
		.box {
			grid-column: span 12;
		}
	}
</style>
