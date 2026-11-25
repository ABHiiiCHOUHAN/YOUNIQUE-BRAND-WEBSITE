<svelte:head>
	<title>Terms of Service — YOUNIQUE STUDIO</title>
</svelte:head>

<section class="legal-wrap page-transition">
	<div class="legal-panel">
		<header class="legal-header">
			<span class="legal-pill">LEGAL // TERMS & IP</span>
			<h1 class="legal-title">Terms of Service</h1>
			<p class="legal-updated">Effective Date: November 2026 // Younique Design Studio</p>
		</header>

		<div class="legal-body">
			<article class="legal-section">
				<h2>01 // Scope of Creative Services</h2>
				<p>
					All design, motion, video editing, 3D production, and web development engagements are
					governed by mutually signed project proposals or Statements of Work (SOW). Submissions
					through our website contact flow serve as initial project scoping inquiries and do not
					constitute a binding contract until formally accepted.
				</p>
			</article>

			<article class="legal-section">
				<h2>02 // Intellectual Property & Client Trademarks</h2>
				<p>
					All client trademarks, logos, brand names, and proprietary product imagery displayed across
					our portfolio case studies and presentation decks remain the sole intellectual property of
					their respective owners. Case study presentations demonstrate studio craftsmanship and
					creative direction; Younique Design Studio claims no ownership over client marks.
				</p>
			</article>

			<article class="legal-section">
				<h2>03 // Private Presentation Decks</h2>
				<p>
					Password-protected links under <code>/deck/[client]</code> contain confidential pre-release
					revisions, drafts, and internal creative strategy intended solely for the designated
					client. Unauthorized redistribution, scraping, or public sharing of private deck materials
					is strictly prohibited.
				</p>
			</article>

			<article class="legal-section">
				<h2>04 // Studio Ownership & Contact</h2>
				<p>
					Original website code, visual systems, copy, and experimental tools published on this site
					are copyright &copy; {new Date().getFullYear()} Younique Design Studio. Questions regarding
					these terms may be sent to
					<a href="mailto:theyouniquedesign@gmail.com">theyouniquedesign@gmail.com</a>.
				</p>
			</article>
		</div>

		<div class="legal-actions">
			<a href="/" class="btn-back">← Back to Studio</a>
		</div>
	</div>
</section>

<style>
	.legal-wrap {
		padding: 2rem clamp(1rem, 4vw, 3rem) 5rem;
		max-width: 900px;
		margin: 0 auto;
	}

	.legal-panel {
		border-radius: 28px;
		border: 3px solid var(--color-3);
		background: var(--color-5);
		color: var(--color-3);
		box-shadow: 10px 12px 0px var(--color-3);
		padding: clamp(1.5rem, 4vw, 3rem);
	}

	.legal-pill {
		display: inline-block;
		background: var(--color-1);
		color: #1c1c1c;
		border: 2px solid var(--color-3);
		border-radius: 999px;
		padding: 0.3rem 0.9rem;
		font-size: 0.75rem;
		font-weight: 900;
		letter-spacing: 0.06em;
	}

	.legal-header {
		border-bottom: 2px dashed var(--color-3);
		padding-bottom: 1.5rem;
		margin-bottom: 2rem;
	}

	.legal-title {
		font-family: var(--font-heading);
		font-size: clamp(2rem, 5vw, 3.25rem);
		font-weight: 900;
		margin: 0.9rem 0 0.4rem;
		letter-spacing: -0.03em;
	}

	.legal-updated {
		margin: 0;
		font-size: 0.85rem;
		font-weight: 700;
		opacity: 0.65;
	}

	.legal-body {
		display: flex;
		flex-direction: column;
		gap: 1.75rem;
	}

	.legal-section h2 {
		font-family: var(--font-heading);
		font-size: 1.2rem;
		font-weight: 900;
		margin: 0 0 0.5rem;
	}

	.legal-section p {
		margin: 0;
		font-size: 0.98rem;
		line-height: 1.65;
		opacity: 0.9;
	}

	.legal-section a {
		color: inherit;
		font-weight: 800;
		text-decoration: underline;
	}

	.legal-actions {
		margin-top: 2.5rem;
		padding-top: 1.5rem;
		border-top: 2px dashed var(--color-3);
	}

	.btn-back {
		display: inline-flex;
		align-items: center;
		padding: 0.8rem 1.6rem;
		border-radius: 999px;
		border: 2px solid var(--color-3);
		background: var(--color-1);
		color: #1c1c1c;
		font-weight: 900;
		text-decoration: none;
		box-shadow: 4px 4px 0px var(--color-3);
	}
</style>
