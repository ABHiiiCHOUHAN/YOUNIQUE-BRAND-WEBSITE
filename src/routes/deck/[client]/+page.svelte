<script>
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	let showPasscode = $state(false);
	let isSubmitting = $state(false);
	let brokenMedia = $state({});

	// Thank You & Experience Feedback State
	const EXPERIENCE_OPTIONS = ['Seamless', 'Loved the Direction', 'Needs Tweaks', "Let's Discuss"];
	let expRating = $state('');
	let expComment = $state('');
	let expSubmitting = $state(false);
	let expSuccess = $state(false);
	let expError = $state('');

	function markMediaBroken(idx) {
		brokenMedia = { ...brokenMedia, [idx]: true };
	}

	async function submitExperience(e) {
		e.preventDefault();
		if (!expRating && !expComment.trim()) {
			expError = 'Please select an experience tag or leave a quick note.';
			return;
		}
		expError = '';
		expSubmitting = true;

		try {
			const res = await fetch(`/api/decks/${data.deck.slug}/feedback`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					rating: expRating,
					comment: expComment
				})
			});
			if (res.ok) {
				expSuccess = true;
				expComment = '';
				expRating = '';
			} else {
				const err = await res.json().catch(() => ({}));
				expError = err.error || 'Unable to submit feedback.';
			}
		} catch {
			expError = 'Network error. Please try again.';
		} finally {
			expSubmitting = false;
		}
	}
</script>

<svelte:head>
	<title
		>{data.unlocked
			? `${data.deck.title} — Client Deck`
			: `${data.clientName} — Private Deck`} | YOUNIQUE</title
	>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<section class="wrap page-transition">
	{#if !data.unlocked}
		<div class="sheet gate-sheet">
			<span class="eyebrow">PRIVATE CLIENT PRESENTATION</span>
			<header class="gate-header">
				<h1 class="gate-title">{data.clientName}</h1>
				<p class="gate-sub">{data.title}</p>
			</header>

			{#if form?.error}
				<div class="error-banner" role="alert">{form.error}</div>
			{/if}

			<form
				method="POST"
				action="?/unlock"
				class="gate-form"
				use:enhance={() => {
					isSubmitting = true;
					return async ({ update }) => {
						isSubmitting = false;
						await update();
					};
				}}
			>
				<label class="field">
					<span class="label">Client Access Code</span>
					<div class="input-wrap">
						<input
							name="passcode"
							type={showPasscode ? 'text' : 'password'}
							placeholder="Enter access code"
							required
							disabled={isSubmitting}
							autocomplete="off"
						/>
						<button
							type="button"
							class="toggle-btn"
							onclick={() => (showPasscode = !showPasscode)}
							aria-label={showPasscode ? 'Hide access code' : 'Show access code'}
							tabindex="-1"
						>
							{#if showPasscode}
								<svg
									class="eye-icon"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2.2"
									stroke-linecap="round"
									stroke-linejoin="round"
									aria-hidden="true"
								>
									<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
									<circle cx="12" cy="12" r="3" />
								</svg>
							{:else}
								<svg
									class="eye-icon"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2.2"
									stroke-linecap="round"
									stroke-linejoin="round"
									aria-hidden="true"
								>
									<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
									<path
										d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"
									/>
									<path
										d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"
									/>
									<line x1="2" y1="2" x2="22" y2="22" />
								</svg>
							{/if}
						</button>
					</div>
				</label>

				<div class="actions">
					<button type="submit" class="btn-solid" disabled={isSubmitting}>
						{isSubmitting ? 'Verifying...' : 'Unlock Deck'}
					</button>
					<a href="/" class="btn-ghost">Return Home</a>
				</div>
			</form>
		</div>
	{:else}
		<div class="sheet deck-sheet">
			<header class="deck-header">
				<div class="deck-topbar">
					<div class="deck-fields-row">
						<div class="meta-field">
							<span class="field-caption">CLIENT &amp; COMPANY</span>
							<span class="field-val field-val--primary">
								{data.deck.clientName}{data.deck.clientCompany
									? ` · ${data.deck.clientCompany}`
									: ''}
							</span>
						</div>
						<div class="meta-field">
							<span class="field-caption">STAGE</span>
							<span class="field-val">{data.deck.version}</span>
						</div>
						<div class="meta-field">
							<span class="field-caption">UPDATED</span>
							<span class="field-val">{data.deck.updatedAt}</span>
						</div>
					</div>

					<form method="POST" action="?/lock" class="lock-form" use:enhance>
						<button type="submit" class="btn-lock-icon" aria-label="Lock Deck" title="Lock Deck">
							<svg
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2.2"
								stroke-linecap="round"
								stroke-linejoin="round"
								aria-hidden="true"
							>
								<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
								<path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
							</svg>
						</button>
					</form>
				</div>

				<div class="project-title-block">
					<span class="field-caption">PROJECT / DECK</span>
					<h1 class="deck-title">{data.deck.title}</h1>
				</div>
			</header>

			{#if (data.deck.deliverables || []).length > 0}
				<div class="deliverables-section">
					{#each data.deck.deliverables as item, i}
						<article class="deliverable-item">
							<div class="deliverable-meta-row">
								<span class="deliverable-index">DELIVERABLE {String(i + 1).padStart(2, '0')}</span>
								<span class="deliverable-type">TYPE · {item.type.toUpperCase()}</span>
							</div>

							<div class="deliverable-fields">
								<div class="labeled-block">
									<span class="field-caption">TITLE</span>
									<h2 class="deliverable-title">{item.title}</h2>
								</div>

								{#if item.notes}
									<div class="labeled-block">
										<span class="field-caption">DESCRIPTION</span>
										<p class="deliverable-notes">{item.notes}</p>
									</div>
								{/if}

								{#if item.url}
									<div class="labeled-block">
										<span class="field-caption">ASSET</span>
										{#if item.type === 'video' && !brokenMedia[i]}
											<div class="media-frame">
												<!-- svelte-ignore a11y_media_has_caption -->
												<video
													src={item.url}
													controls
													playsinline
													class="media-video"
													onerror={() => markMediaBroken(i)}
												></video>
											</div>
										{:else if item.type === 'image' && !brokenMedia[i]}
											<div class="media-frame">
												<img
													src={item.url}
													alt={item.title}
													class="media-img"
													loading="lazy"
													onerror={() => markMediaBroken(i)}
												/>
											</div>
										{/if}

										<div class="deliverable-footer">
											<a
												href={item.url}
												target="_blank"
												rel="noopener noreferrer"
												class="btn-open-asset"
											>
												Open Asset ↗
											</a>
											{#if item.type === 'link' || brokenMedia[i]}
												<span class="asset-url-hint">{item.url}</span>
											{/if}
										</div>
									</div>
								{/if}
							</div>
						</article>
					{/each}
				</div>
			{:else}
				<div class="empty-deliverables">No deliverables uploaded to this deck yet.</div>
			{/if}

			{#if data.deck.notes}
				<footer class="creator-notes-footer">
					<span class="notes-caption">CREATOR NOTES</span>
					<p class="notes-body">{data.deck.notes}</p>
				</footer>
			{/if}
		</div>

		<!-- Below the deck: Thank You & Experience Feedback -->
		<section class="thankyou-box" aria-label="Client Experience Feedback">
			<div class="thankyou-header">
				<span class="field-caption">THANK YOU FOR PARTNERING WITH YOUNIQUE</span>
				<h2 class="thankyou-title">Tell us about your experience</h2>
				<p class="thankyou-sub">
					How did this revision feel? Share a quick reaction or note directly with our creative team.
				</p>
			</div>

			{#if expSuccess}
				<div class="feedback-success" role="status">
					Thank you! Your experience note has been received by our studio.
				</div>
			{:else}
				<form class="feedback-form" onsubmit={submitExperience}>
					<div class="exp-pills">
						{#each EXPERIENCE_OPTIONS as opt}
							<button
								type="button"
								class="exp-pill {expRating === opt ? 'is-selected' : ''}"
								onclick={() => (expRating = expRating === opt ? '' : opt)}
							>
								{opt}
							</button>
						{/each}
					</div>

					<label class="field">
						<span class="field-caption">YOUR THOUGHTS</span>
						<textarea
							bind:value={expComment}
							rows="3"
							maxlength="2000"
							placeholder="Share your thoughts on pacing, creative direction, or your overall experience..."
						></textarea>
					</label>

					{#if expError}
						<p class="exp-error" role="alert">{expError}</p>
					{/if}

					<div class="feedback-actions">
						<button type="submit" class="btn-solid" disabled={expSubmitting}>
							{expSubmitting ? 'Sending...' : 'Send Experience Note'}
						</button>
					</div>
				</form>
			{/if}
		</section>
	{/if}
</section>

<style>
	.wrap {
		padding: 2.5rem clamp(1rem, 4vw, 3rem) 5rem;
		max-width: 960px;
		width: 100%;
		margin: 0 auto;
		min-height: 75vh;
		display: flex;
		flex-direction: column;
		gap: 2.5rem;
		justify-content: center;
		box-sizing: border-box;
	}

	/* Single presentation sheet */
	.sheet {
		width: 100%;
		border-radius: 22px;
		border: 2.5px solid var(--color-3);
		background: var(--color-5);
		color: var(--color-3);
		box-shadow: 8px 8px 0px var(--color-3);
		padding: clamp(1.5rem, 4vw, 3rem);
		box-sizing: border-box;
	}

	.gate-sheet {
		max-width: 620px;
		margin: 0 auto;
	}

	.eyebrow {
		display: inline-block;
		font-size: 0.72rem;
		font-weight: 900;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		opacity: 0.65;
	}

	.gate-header {
		margin: 0.85rem 0 1.75rem;
	}

	.gate-title {
		font-family: var(--font-heading);
		font-size: clamp(1.85rem, 4vw, 2.5rem);
		font-weight: 900;
		margin: 0 0 0.4rem;
		letter-spacing: -0.03em;
		line-height: 1.1;
	}

	.gate-sub {
		margin: 0;
		font-size: 0.98rem;
		font-weight: 600;
		opacity: 0.7;
	}

	.error-banner {
		margin-bottom: 1.25rem;
		background: #d93838;
		color: #ffffff;
		border: 2px solid var(--color-3);
		padding: 0.75rem 1rem;
		border-radius: 10px;
		font-weight: 800;
		font-size: 0.9rem;
	}

	.gate-form {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.label {
		font-weight: 900;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		opacity: 0.8;
	}

	.input-wrap {
		position: relative;
		display: flex;
		align-items: center;
	}

	input,
	textarea {
		width: 100%;
		border-radius: 12px;
		border: 2px solid var(--color-3);
		background: var(--color-5);
		color: var(--color-3);
		padding: 0.9rem 1rem;
		font: inherit;
		font-size: 16px;
		font-weight: 600;
		outline: none;
		box-shadow: 3px 3px 0px var(--color-3);
		transition: box-shadow 0.15s ease;
		box-sizing: border-box;
	}

	.input-wrap input {
		padding-right: 3.5rem;
	}

	input:focus,
	textarea:focus {
		box-shadow: 0 0 0 3px rgba(28, 28, 28, 0.25);
	}

	:global(.dark) input:focus,
	:global(.dark) textarea:focus {
		box-shadow: 0 0 0 3px rgba(244, 244, 244, 0.25);
	}

	.toggle-btn {
		position: absolute;
		right: 12px;
		top: 50%;
		transform: translateY(-50%);
		background: transparent;
		border: none;
		padding: 4px;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		color: var(--color-3);
		opacity: 0.75;
	}

	.toggle-btn:hover {
		opacity: 1;
	}

	.eye-icon {
		width: 22px;
		height: 22px;
		stroke: var(--color-3);
	}

	.actions {
		display: flex;
		gap: 0.85rem;
		flex-wrap: wrap;
		margin-top: 0.25rem;
	}

	.btn-solid {
		font-family: inherit;
		border-radius: 999px;
		padding: 0.85rem 1.75rem;
		font-weight: 800;
		font-size: 0.92rem;
		border: 2px solid var(--color-3);
		background: var(--color-3);
		color: var(--color-5);
		cursor: pointer;
		text-decoration: none;
		transition: transform 0.15s ease, opacity 0.15s ease;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		white-space: nowrap;
	}

	.btn-solid:hover:not(:disabled) {
		transform: translateY(-2px);
		opacity: 0.92;
	}

	.btn-solid:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.btn-ghost {
		font-family: inherit;
		border-radius: 999px;
		padding: 0.85rem 1.5rem;
		font-weight: 800;
		font-size: 0.92rem;
		border: 2px solid var(--color-3);
		background: transparent;
		color: var(--color-3);
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	/* Visible field captions */
	.field-caption {
		display: block;
		font-size: 0.68rem;
		font-weight: 900;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		opacity: 0.52;
		margin-bottom: 0.25rem;
	}

	/* Unlocked Deck Header */
	.deck-header {
		padding-bottom: 1.75rem;
	}

	.deck-topbar {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1.25rem;
		margin-bottom: 1.75rem;
	}

	.deck-fields-row {
		display: flex;
		flex-wrap: wrap;
		gap: 1.5rem 2.5rem;
	}

	.meta-field {
		display: flex;
		flex-direction: column;
	}

	.field-val {
		font-size: 0.9rem;
		font-weight: 800;
		color: var(--color-3);
	}

	.field-val--primary {
		font-weight: 900;
	}

	/* Lock icon button (no text) */
	.btn-lock-icon {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		border: 2px solid var(--color-3);
		background: transparent;
		color: var(--color-3);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: background 0.15s ease, color 0.15s ease, transform 0.15s ease;
		flex-shrink: 0;
	}

	.btn-lock-icon:hover {
		background: var(--color-3);
		color: var(--color-5);
		transform: translateY(-1px);
	}

	.project-title-block {
		display: flex;
		flex-direction: column;
	}

	.deck-title {
		font-family: var(--font-heading);
		font-size: clamp(2rem, 4.5vw, 3.1rem);
		font-weight: 900;
		margin: 0;
		letter-spacing: -0.03em;
		line-height: 1.08;
	}

	/* Deliverables inside single box */
	.deliverables-section {
		display: flex;
		flex-direction: column;
	}

	.deliverable-item {
		border-top: 1.5px solid rgba(28, 28, 28, 0.16);
		padding-top: 2rem;
		margin-top: 2rem;
	}

	.deliverable-item:first-child {
		margin-top: 0;
	}

	:global(.dark) .deliverable-item {
		border-top-color: rgba(244, 244, 244, 0.16);
	}

	.deliverable-meta-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.15rem;
		font-size: 0.72rem;
		font-weight: 900;
		letter-spacing: 0.08em;
		opacity: 0.55;
	}

	.deliverable-fields {
		display: flex;
		flex-direction: column;
		gap: 1.1rem;
	}

	.labeled-block {
		display: flex;
		flex-direction: column;
	}

	.deliverable-title {
		font-family: var(--font-heading);
		font-size: clamp(1.3rem, 2.5vw, 1.65rem);
		font-weight: 900;
		margin: 0;
		letter-spacing: -0.02em;
	}

	.deliverable-notes {
		margin: 0;
		font-size: 0.96rem;
		line-height: 1.55;
		opacity: 0.85;
		max-width: 68ch;
	}

	.media-frame {
		margin-top: 0.25rem;
		margin-bottom: 0.85rem;
		border: 1.5px solid rgba(28, 28, 28, 0.2);
		border-radius: 12px;
		overflow: hidden;
		background: rgba(0, 0, 0, 0.04);
	}

	:global(.dark) .media-frame {
		border-color: rgba(244, 244, 244, 0.2);
	}

	.media-img,
	.media-video {
		width: 100%;
		max-height: 580px;
		object-fit: contain;
		display: block;
		background: #141414;
	}

	.deliverable-footer {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 1rem;
		margin-top: 0.2rem;
	}

	/* Yellow ONLY for Open Asset CTA */
	.btn-open-asset {
		font-family: inherit;
		border-radius: 999px;
		padding: 0.7rem 1.45rem;
		font-weight: 900;
		font-size: 0.88rem;
		border: 2px solid var(--color-3);
		background: var(--color-1, #ffd600);
		color: #1c1c1c;
		cursor: pointer;
		text-decoration: none;
		box-shadow: 3px 3px 0px var(--color-3);
		transition: transform 0.15s ease, box-shadow 0.15s ease;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		white-space: nowrap;
	}

	.btn-open-asset:hover {
		transform: translate(-2px, -2px);
		box-shadow: 5px 5px 0px var(--color-3);
	}

	.asset-url-hint {
		font-family: monospace;
		font-size: 0.8rem;
		opacity: 0.55;
		word-break: break-all;
	}

	.empty-deliverables {
		border-top: 1.5px solid rgba(28, 28, 28, 0.16);
		padding-top: 2rem;
		font-size: 0.95rem;
		font-weight: 700;
		opacity: 0.6;
	}

	/* Creator notes placed below deliverables, understated */
	.creator-notes-footer {
		margin-top: 2.25rem;
		padding-top: 1.35rem;
		border-top: 1px dashed rgba(28, 28, 28, 0.2);
		opacity: 0.68;
	}

	:global(.dark) .creator-notes-footer {
		border-top-color: rgba(244, 244, 244, 0.2);
	}

	.notes-caption {
		display: block;
		font-size: 0.68rem;
		font-weight: 800;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		margin-bottom: 0.35rem;
	}

	.notes-body {
		margin: 0;
		font-size: 0.92rem;
		line-height: 1.6;
		font-weight: 500;
		max-width: 72ch;
	}

	/* Thank You & Experience Box below the deck */
	.thankyou-box {
		width: 100%;
		border-radius: 20px;
		border: 2px solid rgba(28, 28, 28, 0.2);
		background: var(--color-5);
		color: var(--color-3);
		padding: clamp(1.5rem, 3.5vw, 2.5rem);
		box-sizing: border-box;
	}

	:global(.dark) .thankyou-box {
		border-color: rgba(244, 244, 244, 0.2);
	}

	.thankyou-header {
		margin-bottom: 1.5rem;
	}

	.thankyou-title {
		font-family: var(--font-heading);
		font-size: clamp(1.4rem, 3vw, 2rem);
		font-weight: 900;
		margin: 0.25rem 0 0.4rem;
		letter-spacing: -0.02em;
	}

	.thankyou-sub {
		margin: 0;
		font-size: 0.95rem;
		opacity: 0.75;
		line-height: 1.5;
	}

	.feedback-form {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.exp-pills {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
	}

	.exp-pill {
		font-family: inherit;
		padding: 0.5rem 1rem;
		border-radius: 999px;
		border: 1.5px solid var(--color-3);
		background: transparent;
		color: var(--color-3);
		font-weight: 700;
		font-size: 0.85rem;
		cursor: pointer;
		transition: background 0.15s ease, color 0.15s ease;
	}

	.exp-pill.is-selected {
		background: var(--color-3);
		color: var(--color-5);
	}

	.exp-error {
		margin: 0;
		color: #d93838;
		font-weight: 800;
		font-size: 0.88rem;
	}

	.feedback-success {
		padding: 1rem 1.25rem;
		border-radius: 12px;
		border: 2px solid var(--color-3);
		background: rgba(28, 28, 28, 0.05);
		font-weight: 800;
		font-size: 0.95rem;
	}

	@media (max-width: 680px) {
		.wrap {
			padding: 1.5rem 0.9rem 3.5rem;
			gap: 1.75rem;
		}
		.sheet {
			border-radius: 18px;
			box-shadow: 5px 5px 0px var(--color-3);
			padding: 1.35rem 1.1rem;
		}
		.deck-fields-row {
			gap: 1rem 1.5rem;
		}
		.deliverable-item {
			padding-top: 1.5rem;
			margin-top: 1.5rem;
		}
	}
</style>
