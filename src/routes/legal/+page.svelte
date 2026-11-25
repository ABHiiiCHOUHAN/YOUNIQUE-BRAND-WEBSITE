<svelte:head>
	<title>Privacy Policy &amp; Terms — YOUNIQUE STUDIO</title>
</svelte:head>

<section class="legal-wrap page-transition">
	<div class="legal-panel">
		<header class="legal-header">
			<span class="legal-pill">LEGAL // PRIVACY &amp; TERMS</span>
			<h1 class="legal-title">Privacy Policy &amp; Terms of Service</h1>
			<p class="legal-updated">Effective Date: November 2026 // Younique Design Studio</p>
		</header>

		<div class="legal-body">
			<div class="legal-group">
				<span class="group-tag">PART I // PRIVACY POLICY</span>

				<article class="legal-section">
					<h2>01 // Information We Collect</h2>
					<p>
						When you submit a project inquiry through our website, we collect the personal details
						you voluntarily provide: your name, email address, phone number, and project message.
					</p>
				</article>

				<article class="legal-section">
					<h2>02 // How We Use Your Information</h2>
					<p>
						Your contact details are used strictly to communicate regarding your inquiry, prepare
						project proposals, and deliver contracted creative services. We never sell, rent, or
						trade your personal contact information or telephone number with third-party marketers.
					</p>
				</article>

				<article class="legal-section">
					<h2>03 // Cookies &amp; Security</h2>
					<p>
						We use strictly necessary, encrypted <code>HttpOnly</code> session cookies solely for
						authenticated private client presentation decks (<code>/deck/[client]</code>) and
						internal studio administration.
					</p>
				</article>

				<article class="legal-section">
					<h2>04 // Data Retention &amp; Your Rights</h2>
					<p>
						We retain inquiry records only for as long as needed to handle client communications and
						legal obligations. You may request access to, correction of, or deletion of your contact
						records at any time by emailing
						<a href="mailto:theyouniquedesign@gmail.com">theyouniquedesign@gmail.com</a>.
					</p>
				</article>
			</div>

			<div class="legal-divider"></div>

			<div class="legal-group">
				<span class="group-tag">PART II // TERMS OF SERVICE &amp; IP</span>

				<article class="legal-section">
					<h2>05 // Scope of Creative Services</h2>
					<p>
						All design, motion, video editing, 3D production, and web development engagements are
						governed by mutually signed project proposals or Statements of Work (SOW). Website
						inquiries serve as initial discussions and do not create a binding obligation until
						formally accepted.
					</p>
				</article>

				<article class="legal-section">
					<h2>06 // Client Trademarks &amp; Intellectual Property</h2>
					<p>
						All client trademarks, logos, brand names, and proprietary product assets showcased in
						our portfolio case studies or presentation decks remain the intellectual property of
						their respective owners. Case studies demonstrate studio craftsmanship and creative
						direction; Younique Design Studio claims no ownership over client trademarks.
					</p>
				</article>

				<article class="legal-section">
					<h2>07 // Private Client Presentation Decks</h2>
					<p>
						Password-protected links under <code>/deck/[client]</code> contain confidential draft
						revisions and strategy intended solely for the designated client. Unauthorized
						redistribution, scraping, or public sharing of private deck assets is strictly
						prohibited.
					</p>
				</article>

				<article class="legal-section">
					<h2>08 // Studio Ownership &amp; Contact</h2>
					<p>
						Original website code, design systems, and copy published on this site are copyright
						&copy; {new Date().getFullYear()} Younique Design Studio. Inquiries regarding these terms
						may be sent to
						<a href="mailto:theyouniquedesign@gmail.com">theyouniquedesign@gmail.com</a>.
					</p>
				</article>
			</div>
		</div>

		<div class="legal-actions">
			<a href="/" class="btn-back">← Back to Studio</a>
		</div>
	</div>
</section>

<style>
	.legal-wrap {
		padding: 2rem clamp(1rem, 4vw, 3rem) 5rem;
		max-width: 920px;
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
		font-size: clamp(1.85rem, 4.5vw, 3rem);
		font-weight: 900;
		margin: 0.9rem 0 0.4rem;
		letter-spacing: -0.03em;
		line-height: 1.1;
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
		gap: 2.25rem;
	}

	.legal-group {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.group-tag {
		font-size: 0.78rem;
		font-weight: 900;
		letter-spacing: 0.1em;
		opacity: 0.6;
	}

	.legal-divider {
		border-top: 2px dashed var(--color-3);
		opacity: 0.35;
	}

	.legal-section h2 {
		font-family: var(--font-heading);
		font-size: 1.15rem;
		font-weight: 900;
		margin: 0 0 0.45rem;
	}

	.legal-section p {
		margin: 0;
		font-size: 0.96rem;
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
