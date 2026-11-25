<svelte:head>
	<title>Privacy Policy — YOUNIQUE STUDIO</title>
</svelte:head>

<section class="legal-wrap page-transition">
	<div class="legal-panel">
		<header class="legal-header">
			<span class="legal-pill">LEGAL // DATA PROTECTION</span>
			<h1 class="legal-title">Privacy Policy</h1>
			<p class="legal-updated">Effective Date: November 2026 // Younique Design Studio</p>
		</header>

		<div class="legal-body">
			<article class="legal-section">
				<h2>01 // Information We Collect</h2>
				<p>
					When you submit a project inquiry or book a discovery call through our website, we collect
					the personal details you voluntarily provide: your name, email address, phone number,
					selected service scope, estimated budget range, timeline, and project brief.
				</p>
			</article>

			<article class="legal-section">
				<h2>02 // How We Use Your Information</h2>
				<p>
					Your contact details and project scoping information are used strictly to evaluate project
					fit, communicate regarding your inquiry, schedule discovery calls, and deliver contracted
					creative services. We never sell, rent, or trade your personal information or phone number
					with third-party marketers.
				</p>
			</article>

			<article class="legal-section">
				<h2>03 // Cookies & Security</h2>
				<p>
					We use strictly necessary, encrypted <code>HttpOnly</code> session cookies solely for
					authenticated private client presentation decks (<code>/deck/[client]</code>) and internal
					studio administration. We do not deploy invasive cross-site advertising trackers.
				</p>
			</article>

			<article class="legal-section">
				<h2>04 // Data Retention & Your Rights</h2>
				<p>
					We retain project inquiry records only for as long as needed to handle client
					communications and legal obligations. You may request access to, correction of, or
					permanent deletion of your submitted contact records at any time by emailing
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
