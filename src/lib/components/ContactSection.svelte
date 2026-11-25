<script>
	import { onMount } from 'svelte';
	import { PUBLIC_CONTACT_EMAIL } from '$env/static/public';

	let name = $state('');
	let email = $state('');
	let countryCode = $state('91');
	let mobile = $state('');
	let message = $state('');
	let websiteUrlConfirm = $state('');
	let status = $state('');
	let submitError = $state('');
	let showSuccessPopup = $state(false);
	let popupTimeout;
	let showValidation = $state(false);
	let validationErrors = $state({ name: '', email: '', mobile: '', message: '' });
	let contactEmail = $state(PUBLIC_CONTACT_EMAIL || 'hello@younique.studio');
	let socialLinks = $state({
		xLink: '#twitter',
		linkedinLink: '#linkedin',
		instagramLink: '#instagram',
		whatsappLink: '#whatsapp'
	});

	// 3-4-3 Formatter for mobile digits
	function formatMobile(val) {
		const raw = val.replace(/\D/g, '').slice(0, 10);
		if (raw.length <= 3) return raw;
		if (raw.length <= 7) return `${raw.slice(0, 3)} ${raw.slice(3)}`;
		return `${raw.slice(0, 3)} ${raw.slice(3, 7)} ${raw.slice(7)}`;
	}

	onMount(async () => {
		try {
			const res = await fetch('/api/settings');
			const settings = await res.json();
			if (settings.contactEmail) {
				contactEmail = settings.contactEmail;
			}
			if (settings.xLink) socialLinks.xLink = settings.xLink;
			if (settings.linkedinLink) socialLinks.linkedinLink = settings.linkedinLink;
			if (settings.instagramLink) socialLinks.instagramLink = settings.instagramLink;
			if (settings.whatsappLink) socialLinks.whatsappLink = settings.whatsappLink;
		} catch (err) {}
	});

	async function onSubmit(e) {
		e.preventDefault();

		// Reset errors
		validationErrors = { name: '', email: '', mobile: '', message: '' };
		submitError = '';
		let hasError = false;
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

		if (!name.trim()) {
			validationErrors.name = 'REQUIRED';
			hasError = true;
		} else if (name.trim().length > 100) {
			validationErrors.name = 'TOO LONG';
			hasError = true;
		}

		if (!email.trim()) {
			validationErrors.email = 'REQUIRED';
			hasError = true;
		} else if (!emailRegex.test(email.trim())) {
			validationErrors.email = 'INVALID EMAIL';
			hasError = true;
		}

		const digitsOnly = mobile.replace(/\D/g, '');
		if (!mobile || !countryCode) {
			validationErrors.mobile = 'REQUIRED';
			hasError = true;
		} else if (digitsOnly.length !== 10) {
			validationErrors.mobile = 'INVALID NO.';
			hasError = true;
		}

		if (!message.trim()) {
			validationErrors.message = 'REQUIRED';
			hasError = true;
		} else if (message.trim().length > 2000) {
			validationErrors.message = 'MAX 2000 CHARS';
			hasError = true;
		}

		if (hasError) {
			showValidation = true;
			return;
		}

		showValidation = false;
		status = 'waiting';

		const fullMobile = `+${countryCode} ${mobile}`;

		// Construct the mailto link
		const subject = `Project Inquiry: ${name}`;
		const body = `New inquiry received:\n\nName: ${name}\nEmail: ${email}\nMobile: ${fullMobile}\n\nMessage:\n${message}`;
		const to = contactEmail;
		const mailLink = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

		// 1. Log the message to our internal API (Admin manage section)
		try {
			const res = await fetch('/api/messages', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name,
					email,
					mobile: fullMobile,
					message,
					website_url_confirm: websiteUrlConfirm
				})
			});
			if (!res.ok) {
				const errData = await res.json().catch(() => ({}));
				submitError = errData.error || 'Unable to send inquiry right now.';
				status = '';
				return;
			}
		} catch (err) {
			console.error('Failed to log message internally:', err);
			submitError = 'Network error. Please try again.';
			status = '';
			return;
		}

		// 2. Open mail client in background / non-navigation
		const tempLink = document.createElement('a');
		tempLink.href = mailLink;
		tempLink.style.display = 'none';
		document.body.appendChild(tempLink);
		tempLink.click();
		tempLink.remove();

		// 3. Transition to success UI and show popup
		status = 'success';
		showSuccessPopup = true;

		if (popupTimeout) clearTimeout(popupTimeout);
		popupTimeout = setTimeout(() => {
			showSuccessPopup = false;
		}, 5000);

		// Reset form
		setTimeout(() => {
			status = '';
			name = '';
			email = '';
			mobile = '';
			message = '';
		}, 3000);
	}

	function closePopup() {
		showSuccessPopup = false;
		if (popupTimeout) clearTimeout(popupTimeout);
	}
</script>

<section class="wrap page-transition">
	<div class="panel">
		<header class="page-header">
			<h1 class="page-title">
				<span class="pc-text">Let’s create something unforgettable.</span>
				<span class="mobile-text">SAY HELLO!</span>
			</h1>
			<p class="page-sub">Let us know what you're working on and how we can collaborate.</p>
		</header>

		<form class="form" onsubmit={onSubmit} novalidate>
			<div class="hp-field" aria-hidden="true">
				<label for="website_url_confirm">Website</label>
				<input
					id="website_url_confirm"
					type="text"
					name="website_url_confirm"
					bind:value={websiteUrlConfirm}
					tabindex="-1"
					autocomplete="off"
				/>
			</div>
			<div class="form-left">
				<label class="field">
					<span class="label">Name</span>
					<div class="input-wrap">
						<input bind:value={name} name="name" placeholder="Your name" autocomplete="name" maxlength="100" />
						{#if showValidation && validationErrors.name}<span class="error-hint"
								>{validationErrors.name}</span
							>{/if}
					</div>
				</label>

				<div class="field">
					<span class="label">Mobile</span>
					<div class="mobile-row">
						<input
							type="tel"
							bind:value={countryCode}
							class="country-input"
							placeholder="+91"
							maxlength="4"
						/>
						<div class="mobile-input-wrap">
							<input
								type="tel"
								value={mobile}
								oninput={(e) => (mobile = formatMobile(e.target.value))}
								placeholder="123 4567 890"
								maxlength="12"
							/>
							{#if showValidation && validationErrors.mobile}<span class="error-hint"
									>{validationErrors.mobile}</span
								>{/if}
						</div>
					</div>
				</div>

				<label class="field">
					<span class="label">Email</span>
					<div class="input-wrap">
						<input type="email" bind:value={email} placeholder="you@example.com" maxlength="254" />
						{#if showValidation && validationErrors.email}<span class="error-hint"
								>{validationErrors.email}</span
							>{/if}
					</div>
				</label>
			</div>

			<div class="form-right">
				<label class="field field--full">
					<span class="label">Message</span>
					<div class="input-wrap">
						<textarea bind:value={message} placeholder="Talk to us about your vision..." rows="6" maxlength="2000"
						></textarea>
						{#if showValidation && validationErrors.message}<span class="error-hint"
								>{validationErrors.message}</span
							>{/if}
					</div>
				</label>

				{#if submitError}
					<div class="submit-error-banner" role="alert">{submitError}</div>
				{/if}

				<button
					class="btn btn--submit"
					type="submit"
					class:btn--waiting={status === 'waiting'}
					class:btn--success={status === 'success'}
					disabled={status !== ''}
				>
					{#if status === 'waiting'}
						<div class="btn-content">
							<span>wait a sec..</span>
						</div>
					{:else if status === 'success'}
						<div class="btn-content success-pop">
							<svg class="checkmark" width="22" height="22" viewBox="0 0 24 24">
								<path
									d="M4 12l6 6L20 6"
									fill="none"
									stroke="currentColor"
									stroke-width="4"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
							<span>Sent successfully</span>
						</div>
					{:else}
						Send inquiry
					{/if}
				</button>
			</div>
		</form>
	</div>

	<div class="social-outer">
		<span class="social-label">OR CONTACT VIA</span>
		<div class="social-tray">
			<a href={socialLinks.xLink} class="social-pill social-pill--x" aria-label="X (Twitter)">
				<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"
					><path
						d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z"
					/></svg
				>
			</a>
			<a
				href={socialLinks.linkedinLink}
				class="social-pill social-pill--linkedin"
				aria-label="LinkedIn"
			>
				<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"
					><path
						d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.238 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
					/></svg
				>
			</a>
			<a
				href={socialLinks.instagramLink}
				class="social-pill social-pill--instagram"
				aria-label="Instagram"
			>
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path
						d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
					></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg
				>
			</a>
			<a
				href={socialLinks.whatsappLink}
				class="social-pill social-pill--whatsapp"
				aria-label="WhatsApp"
			>
				<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"
					><path
						d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.81 9.81 0 017.001 2.895 9.81 9.81 0 012.887 7.001c-.001 5.451-4.436 9.884-9.886 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
					/></svg
				>
			</a>
		</div>
	</div>

	{#if showSuccessPopup}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<div class="popup-backdrop" onclick={closePopup} role="presentation">
			<div
				class="popup-card"
				role="dialog"
				aria-modal="true"
				tabindex="-1"
				aria-labelledby="popup-title"
				onclick={(e) => e.stopPropagation()}
			>
				<button class="popup-close-btn" onclick={closePopup} aria-label="Close notification">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
				</button>

				<div class="popup-icon-wrap">
					<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
						<polyline points="20 6 9 17 4 12"></polyline>
					</svg>
				</div>

				<div class="popup-body">
					<h3 id="popup-title" class="popup-title">Message Sent!</h3>
					<p class="popup-desc">your message has been sent , we will contact you asap!</p>
				</div>

				<div class="popup-timer-bar"></div>
			</div>
		</div>
	{/if}
</section>

<style>
	.wrap {
		padding: 4rem clamp(2rem, 10vw, 8rem) 4rem; /* Added top padding */
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem; /* Reduced gap */
	}

	.panel {
		max-width: 950px;
		width: 100%;
		border-radius: 28px;
		border: 3px solid #1c1c1c;
		background: #fffaf4;
		padding: clamp(1.5rem, 4vw, 3rem); /* Reduced padding */
		position: relative;
		box-shadow: 10px 12px 0px #1c1c1c;
	}

	.page-header {
		margin-bottom: 2.5rem;
	}

	.page-title {
		font-size: clamp(2rem, 5.5vw, 4rem);
		font-family: 'Rubik Mono One', sans-serif;
		font-weight: 900;
		margin-bottom: 1rem;
		color: #1c1c1c;
		line-height: 1.1;
		letter-spacing: -0.06em;
		text-transform: uppercase;
	}

	.pc-text {
		display: block;
	}
	.mobile-text {
		display: none;
	}

	@media (max-width: 768px) {
		.pc-text {
			display: none;
		}
		.mobile-text {
			display: block;
		}
		.page-title {
			margin-bottom: 0.5rem;
		}
	}

	.page-sub {
		font-size: 1.15rem;
		opacity: 0.9;
		max-width: 60ch;
		color: #1c1c1c;
		font-weight: 500;
	}

	.form {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 3.5rem;
		width: 100%;
	}

	@media (max-width: 850px) {
		.form {
			grid-template-columns: 1fr;
			gap: 2.5rem;
		}
	}

	.form-left,
	.form-right {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
	}

	.field--full {
		flex: 1;
	}

	.label {
		font-family: 'Unbounded', sans-serif;
		font-weight: 800;
		font-size: 1.15rem;
		color: #3d3d3d;
	}

	.input-wrap {
		position: relative;
		width: 100%;
	}

	.field--full .input-wrap {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	input,
	textarea {
		width: 100%;
		border-radius: 18px;
		border: 3px solid #1c1c1c;
		background: #fff;
		color: #1c1c1c;
		padding: 1.1rem 1.4rem;
		font-family: inherit;
		font-size: 1.1rem;
		outline: none;
		box-shadow: 6px 7px 0px #1c1c1c;
		transition: all 0.2s;
	}

	input:focus,
	textarea:focus {
		transform: translate(2px, 2px);
		box-shadow: 4px 5px 0px #1c1c1c;
	}

	textarea {
		min-height: 150px;
		resize: none;
		flex: 1;
	}

	@media (max-width: 768px) {
		input,
		textarea {
			padding: 0.65rem 0.9rem;
			font-size: 0.95rem;
		}
		textarea {
			min-height: 85px;
		}
		.country-input {
			width: 75px !important;
			padding-left: 0.25rem !important;
			padding-right: 0.25rem !important;
		}
	}

	.mobile-row {
		display: flex;
		gap: 1.25rem;
		align-items: flex-start;
	}

	.country-input {
		width: 100px !important;
		text-align: center;
		padding-left: 0.5rem !important;
		padding-right: 0.5rem !important;
	}

	.mobile-input-wrap {
		flex: 1;
		position: relative;
	}

	.btn--submit {
		width: 100%;
		border-radius: 40px;
		padding: 1.1rem; /* Adjusted to match label height roughly */
		font-family: 'Unbounded', sans-serif;
		font-weight: 800; /* Match label weight */
		font-size: 1.15rem; /* Match label size */
		border: 3px solid #1c1c1c;
		background: #ffd600;
		color: #1c1c1c;
		cursor: pointer;
		box-shadow: 7px 8px 0px #1c1c1c;
		transition: all 0.2s;
		margin-top: auto;
		text-transform: capitalize;
	}

	.btn--submit:hover {
		transform: translate(-2px, -2px);
		box-shadow: 9px 10px 0px #1c1c1c;
	}

	.social-outer {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		margin-top: 2rem; /* Reduced margin */
	}

	.social-label {
		font-family: 'Unbounded', sans-serif;
		font-size: 1.1rem;
		font-weight: 800;
		letter-spacing: 0.05em;
		color: #1c1c1c;
		text-transform: uppercase;
		opacity: 0.9;
	}

	.social-tray {
		display: flex;
		gap: 1.5rem;
	}

	.social-pill {
		background: #fff;
		color: #1c1c1c;
		width: 62px;
		height: 62px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		text-decoration: none;
		border: 3px solid #1c1c1c;
		box-shadow: 5px 6px 0 #1c1c1c;
		transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.social-pill:hover {
		transform: translate(-3px, -4px);
		box-shadow: 8px 10px 0 #1c1c1c;
		color: #fff !important;
	}

	@media (max-width: 768px) {
		.wrap {
			padding: 4rem 1.5rem 6rem;
			gap: 1rem;
		}
		.panel {
			padding: 2.5rem 1.25rem 1.5rem;
			border-radius: 18px;
			width: 92%;
			margin: 0 auto;
		}
		.page-title {
			margin-bottom: 0.25rem;
			font-size: 3rem;
			letter-spacing: -0.04em;
		}
		.page-sub {
			font-size: 0.85rem;
			line-height: 1.2;
		}
		.page-header {
			margin-bottom: 2.5rem;
		}
		.label {
			font-size: 0.85rem;
		}
		.field {
			gap: 0.4rem;
		}
		.form {
			gap: 1.1rem;
		}
		.form-left,
		.form-right {
			gap: 1.1rem;
		}
		.social-outer {
			margin-top: 4rem;
			margin-bottom: 4rem;
			gap: 1.5rem;
		}
		.social-label {
			font-size: 0.95rem;
		}
		.social-pill {
			width: 48px;
			height: 48px;
		}
		.btn--submit {
			padding: 0.75rem;
			font-size: 1rem;
			margin-top: 0.25rem;
		}
	}

	/* Brand color fills only on hover */
	.social-pill--x:hover {
		background: #000 !important;
	}
	.social-pill--linkedin:hover {
		background: #0077b5 !important;
	}
	.social-pill--instagram:hover {
		background: #e1306c !important;
	}
	.social-pill--whatsapp:hover {
		background: #128c7e !important;
	}

	.error-hint {
		position: absolute;
		top: -1.35rem;
		right: 0.25rem;
		font-size: 0.75rem;
		font-family: 'Space Grotesk', sans-serif;
		font-weight: 900;
		color: #ff4d4d;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		pointer-events: none;
		z-index: 10;
	}

	:global(.dark) .panel {
		background: #2a2a2a;
		border-color: #fff;
		box-shadow: 12px 14px 0px #000;
	}

	:global(.dark) .page-title,
	:global(.dark) .page-sub,
	:global(.dark) .label,
	:global(.dark) .social-label {
		color: #fff;
	}

	:global(.dark) input,
	:global(.dark) textarea {
		background: #3d3d3d;
		color: #fff;
		border-color: #fff;
		/* User: shadow for country code should be same in both dark/lioght mode */
		box-shadow: 6px 7px 0px #1c1c1c;
	}

	:global(.dark) .btn--submit {
		border-color: #fff;
		box-shadow: 7px 8px 0px #000;
	}

	:global(.dark) .social-pill {
		background: #3d3d3d;
		color: #fff;
		border-color: #fff;
		box-shadow: 5px 6px 0 #000;
	}

	:global(.dark) .social-pill:hover {
		box-shadow: 8px 10px 0 #000;
	}

	:global(.dark) .error-hint {
		color: #ff6e6e;
	}

	.btn--waiting,
	.btn--success {
		cursor: default;
	}
	.btn--success {
		background: #4ade80 !important;
	}

	.btn-content {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
	}

	/* Success Popup Styles */
	.popup-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.45);
		backdrop-filter: blur(4px);
		-webkit-backdrop-filter: blur(4px);
		z-index: 9999;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.5rem;
		animation: popupFadeIn 0.25s ease-out;
	}

	.popup-card {
		position: relative;
		background: #fffaf4;
		border: 3.5px solid #1c1c1c;
		border-radius: 24px;
		box-shadow: 8px 10px 0px #1c1c1c;
		padding: 2.5rem 2rem 2rem;
		max-width: 460px;
		width: 100%;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		overflow: hidden;
		animation: popupSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.popup-close-btn {
		position: absolute;
		top: 1rem;
		right: 1rem;
		background: transparent;
		border: 2px solid #1c1c1c;
		border-radius: 50%;
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		color: #1c1c1c;
		transition: all 0.15s ease;
	}

	.popup-close-btn:hover {
		background: #1c1c1c;
		color: #fff;
		transform: scale(1.05);
	}

	.popup-icon-wrap {
		width: 64px;
		height: 64px;
		border-radius: 50%;
		background: #4ade80;
		color: #1c1c1c;
		border: 3px solid #1c1c1c;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 1.25rem;
		box-shadow: 4px 4px 0px #1c1c1c;
	}

	.popup-title {
		font-family: 'Unbounded', sans-serif;
		font-size: 1.45rem;
		font-weight: 800;
		color: #1c1c1c;
		margin-bottom: 0.75rem;
		text-transform: uppercase;
		letter-spacing: -0.02em;
	}

	.popup-desc {
		font-family: inherit;
		font-size: 1.05rem;
		line-height: 1.5;
		color: #3d3d3d;
		font-weight: 600;
		margin: 0;
	}

	.popup-timer-bar {
		position: absolute;
		bottom: 0;
		left: 0;
		height: 5px;
		background: #ffd600;
		width: 100%;
		animation: popupTimer 5s linear forwards;
	}

	@keyframes popupFadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes popupSlideUp {
		from {
			opacity: 0;
			transform: scale(0.92) translateY(20px);
		}
		to {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}

	@keyframes popupTimer {
		from {
			width: 100%;
		}
		to {
			width: 0%;
		}
	}

	/* Dark mode styling for popup */
	:global(.dark) .popup-card {
		background: #2a2a2a;
		border-color: #fff;
		box-shadow: 10px 12px 0px #000;
	}

	:global(.dark) .popup-close-btn {
		border-color: #fff;
		color: #fff;
	}

	:global(.dark) .popup-close-btn:hover {
		background: #fff;
		color: #1c1c1c;
	}

	:global(.dark) .popup-icon-wrap {
		border-color: #fff;
		box-shadow: 4px 4px 0px #000;
	}

	:global(.dark) .popup-title {
		color: #fff;
	}

	:global(.dark) .popup-desc {
		color: #e5e5e5;
	}

	:global(.dark) .popup-timer-bar {
		background: #4ade80;
	}

	.hp-field {
		position: absolute;
		left: -9999px;
		top: -9999px;
		width: 1px;
		height: 1px;
		overflow: hidden;
		opacity: 0;
		pointer-events: none;
	}

	.submit-error-banner {
		background: #ff5252;
		color: #ffffff;
		border: 2px solid var(--color-3);
		box-shadow: 4px 4px 0px var(--color-3);
		padding: 0.75rem 1rem;
		border-radius: 12px;
		font-weight: 800;
		font-size: 0.9rem;
		margin-bottom: 0.5rem;
	}
</style>
