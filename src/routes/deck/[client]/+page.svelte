<script>
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	let showPasscode = $state(false);
	let isSubmitting = $state(false);
	let brokenMedia = $state({});

	// Step 1: Star rating first -> Step 2 (if > 3 stars): gentle follow-up review modal
	const STAR_LABELS = {
		1: 'Needs Significant Revision',
		2: 'Below Expectations',
		3: 'Meets Expectations',
		4: 'Strong Creative Direction',
		5: 'Exceptional Delivery'
	};

	let selectedStars = $state(0);
	let hoverStars = $state(0);
	let ratingNote = $state('');
	let ratingSubmitting = $state(false);
	let ratingDone = $state(false);
	let ratingError = $state('');
	let submittedReviewId = $state('');

	let showReviewModal = $state(false);
	let reviewerName = $state('');
	let reviewerRole = $state('');
	let reviewText = $state('');
	let reviewSubmitting = $state(false);
	let reviewDone = $state(false);
	let reviewError = $state('');

	const activeStars = $derived(hoverStars || selectedStars);

	function markMediaBroken(idx) {
		brokenMedia = { ...brokenMedia, [idx]: true };
	}

	async function submitRating(e) {
		e.preventDefault();
		if (!selectedStars) {
			ratingError = 'Please select a star rating first.';
			return;
		}
		ratingError = '';
		ratingSubmitting = true;

		try {
			const res = await fetch(`/api/decks/${data.deck.slug}/feedback`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					stars: selectedStars,
					comment: selectedStars <= 3 ? ratingNote : '',
					kind: 'rating'
				})
			});
			if (res.ok) {
				const payload = await res.json().catch(() => ({}));
				submittedReviewId = payload.reviewId || '';
				ratingDone = true;
				if (selectedStars > 3) {
					reviewerName = data.deck.clientName || '';
					reviewerRole = data.deck.clientCompany || '';
					showReviewModal = true;
				}
			} else {
				const err = await res.json().catch(() => ({}));
				ratingError = err.error || 'Unable to save rating.';
			}
		} catch {
			ratingError = 'Network error. Please try again.';
		} finally {
			ratingSubmitting = false;
		}
	}

	function closeReviewModal() {
		showReviewModal = false;
		reviewError = '';
	}

	function handleWindowKeydown(e) {
		if (e.key === 'Escape' && showReviewModal) {
			closeReviewModal();
		}
	}

	async function submitReview(e) {
		e.preventDefault();
		if (!reviewText.trim()) {
			reviewError = 'Please write a short sentence or choose "No thanks".';
			return;
		}
		reviewError = '';
		reviewSubmitting = true;

		try {
			const res = await fetch(`/api/decks/${data.deck.slug}/feedback`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					stars: selectedStars,
					reviewerName,
					reviewerRole,
					comment: reviewText,
					kind: 'review',
					reviewId: submittedReviewId
				})
			});
			if (res.ok) {
				reviewDone = true;
				showReviewModal = false;
				reviewText = '';
			} else {
				const err = await res.json().catch(() => ({}));
				reviewError = err.error || 'Unable to send review.';
			}
		} catch {
			reviewError = 'Network error. Please try again.';
		} finally {
			reviewSubmitting = false;
		}
	}
</script>

<svelte:window onkeydown={handleWindowKeydown} />

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
									? ` | ${data.deck.clientCompany}`
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
								<span class="deliverable-type">TYPE: {item.type.toUpperCase()}</span>
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

		<!-- Below the deck: Client Experience Rating -->
		<section class="thankyou-box" aria-label="Client Experience Rating">
			<div class="thankyou-header">
				<span class="field-caption">CLIENT EXPERIENCE | FEEDBACK</span>
				<h2 class="thankyou-title">How has your experience been so far?</h2>
				<p class="thankyou-sub">
					We value your perspective. Please take a moment to rate the clarity, direction, and delivery of this presentation.
				</p>
			</div>

			{#if ratingDone}
				<div class="feedback-success" role="status">
					<div class="success-badge" aria-hidden="true">
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="3"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<polyline points="20 6 9 17 4 12"></polyline>
						</svg>
					</div>
					<div class="success-copy">
						<p class="success-main">
							{#if reviewDone}
								Thank you for your {selectedStars}/5 rating and testimonial. Your endorsement means a great deal to our studio.
							{:else if selectedStars <= 3}
								Thank you for your candid rating ({selectedStars}/5). Your feedback has been logged for our creative leads.
							{:else}
								Thank you for rating your experience {selectedStars}/5. We sincerely appreciate your partnership.
							{/if}
						</p>
						{#if selectedStars > 3 && !reviewDone && !showReviewModal}
							<button
								type="button"
								class="link-leave-review"
								onclick={() => (showReviewModal = true)}
							>
								Share a brief client testimonial (Optional)
							</button>
						{/if}
					</div>
				</div>
			{:else}
				<form class="feedback-form" onsubmit={submitRating}>
					<div class="star-selector-bar">
						<div class="star-row" role="radiogroup" aria-label="Experience rating out of 5 stars">
							{#each [1, 2, 3, 4, 5] as star}
								<button
									type="button"
									class="star-btn {activeStars >= star ? 'is-filled' : ''}"
									onclick={() => {
										selectedStars = star;
										ratingError = '';
									}}
									onmouseenter={() => (hoverStars = star)}
									onmouseleave={() => (hoverStars = 0)}
									aria-label="{star} {star === 1 ? 'star' : 'stars'} — {STAR_LABELS[star]}"
									aria-checked={selectedStars === star}
									role="radio"
								>
									<svg
										viewBox="0 0 24 24"
										width="22"
										height="22"
										fill={activeStars >= star ? 'currentColor' : 'none'}
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										aria-hidden="true"
									>
										<polygon
											points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
										></polygon>
									</svg>
								</button>
							{/each}
						</div>

						<span class="rating-readout {activeStars > 0 ? 'has-value' : ''}">
							{#if activeStars > 0}
								{activeStars} / 5 | {STAR_LABELS[activeStars]}
							{:else}
								Select a rating
							{/if}
						</span>
					</div>

					{#if selectedStars > 0 && selectedStars <= 3}
						<label class="field">
							<span class="field-caption">AREAS FOR REFINEMENT (OPTIONAL)</span>
							<textarea
								bind:value={ratingNote}
								rows="3"
								maxlength="2000"
								placeholder="Let us know where the creative direction, pacing, or deliverables fell short so we can address them promptly..."
							></textarea>
						</label>
					{/if}

					{#if ratingError}
						<p class="exp-error" role="alert">{ratingError}</p>
					{/if}

					<div class="feedback-actions">
						<button type="submit" class="btn-solid" disabled={ratingSubmitting || !selectedStars}>
							{ratingSubmitting ? 'Submitting...' : 'Submit Rating'}
						</button>
					</div>
				</form>
			{/if}
		</section>
	{/if}
</section>

<!-- Gentle Follow-up Testimonial Modal (only triggered after > 3 star rating, completely optional) -->
{#if showReviewModal}
	<div
		class="modal-backdrop"
		role="presentation"
		onclick={(e) => {
			if (e.target === e.currentTarget) closeReviewModal();
		}}
	>
		<div
			class="review-modal sheet"
			role="dialog"
			aria-modal="true"
			aria-labelledby="review-modal-title"
		>
			<div class="modal-topbar">
				<span class="eyebrow">
					CLIENT ENDORSEMENT | {selectedStars}/5 RATING
				</span>
				<button
					type="button"
					class="modal-close"
					onclick={closeReviewModal}
					aria-label="Close popup"
					title="Close"
				>
					×
				</button>
			</div>

			<h3 id="review-modal-title" class="modal-title">Thank you for the positive rating</h3>
			<p class="modal-sub">
				If you have a brief moment, a one- or two-sentence testimonial on our collaboration would be sincerely appreciated.
			</p>

			<form class="feedback-form" onsubmit={submitReview}>
				<label class="field">
					<span class="field-caption">YOUR NAME (OPTIONAL)</span>
					<input
						type="text"
						bind:value={reviewerName}
						maxlength="120"
						placeholder="e.g. Jordan Lee"
					/>
				</label>

				<label class="field">
					<span class="field-caption">COMPANY / ROLE (OPTIONAL)</span>
					<input
						type="text"
						bind:value={reviewerRole}
						maxlength="140"
						placeholder="e.g. Head of Brand at Acme"
					/>
				</label>

				<label class="field">
					<span class="field-caption">YOUR TESTIMONIAL</span>
					<textarea
						bind:value={reviewText}
						rows="3"
						maxlength="2000"
						placeholder="Comment on the creative process, communication, or final deliverables..."
					></textarea>
				</label>

				{#if reviewError}
					<p class="exp-error" role="alert">{reviewError}</p>
				{/if}

				<div class="modal-actions">
					<button type="submit" class="btn-open-asset" disabled={reviewSubmitting}>
						{reviewSubmitting ? 'Submitting...' : 'Submit Testimonial'}
					</button>
					<button type="button" class="btn-ghost" onclick={closeReviewModal}>
						No thanks
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<style>
	.wrap,
	.modal-backdrop {
		--dk-surface: var(--color-5, #fffaf4);
		--dk-input-bg: #ffffff;
		--dk-subtle-bg: #f1eadf;
		--dk-border: #1c1c1c;
		--dk-divider: rgba(28, 28, 28, 0.18);
		--dk-shadow-ink: #1c1c1c;
		--dk-text: #1c1c1c;
		--dk-muted: #57534e;
		--dk-accent: var(--color-1, #fdd803);
		--dk-accent-ink: #111111;

		font-family: var(--font-heading, system-ui, -apple-system, sans-serif);
		color: var(--dk-text);
	}

	.wrap {
		padding: 2.5rem clamp(1rem, 4vw, 3rem) 5rem;
		max-width: 960px;
		width: 100%;
		margin: 0 auto;
		min-height: 75vh;
		display: flex;
		flex-direction: column;
		gap: 2rem;
		justify-content: center;
		box-sizing: border-box;
	}

	:global(.dark) .wrap,
	:global(.dark) .modal-backdrop {
		--dk-surface: #242424;
		--dk-input-bg: #181818;
		--dk-subtle-bg: #323232;
		--dk-border: #c9c4bc;
		--dk-divider: rgba(255, 250, 244, 0.16);
		--dk-shadow-ink: #111111;
		--dk-text: #fffaf4;
		--dk-muted: #b8b3ac;
		--dk-accent: #fdd803;
		--dk-accent-ink: #111111;
	}

	/* Single presentation sheet */
	.sheet {
		width: 100%;
		border-radius: 16px;
		border: 2px solid var(--dk-border);
		background: var(--dk-surface);
		color: var(--dk-text);
		box-shadow: 4px 4px 0px var(--dk-shadow-ink);
		padding: clamp(1.5rem, 4vw, 2.75rem);
		box-sizing: border-box;
	}

	.gate-sheet {
		max-width: 620px;
		margin: 0 auto;
	}

	.eyebrow {
		display: inline-block;
		font-size: 0.72rem;
		font-weight: 800;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--dk-muted);
	}

	.gate-header {
		margin: 0.75rem 0 1.65rem;
	}

	.gate-title {
		font-family: var(--font-heading);
		font-size: clamp(1.75rem, 4vw, 2.35rem);
		font-weight: 800;
		margin: 0 0 0.4rem;
		letter-spacing: -0.025em;
		line-height: 1.12;
		color: var(--dk-text);
	}

	.gate-sub {
		margin: 0;
		font-size: 0.96rem;
		font-weight: 500;
		color: var(--dk-muted);
	}

	.error-banner {
		margin-bottom: 1.25rem;
		background: #dc2626;
		color: #ffffff;
		border: 2px solid #111111;
		box-shadow: 2px 2px 0px var(--dk-shadow-ink);
		padding: 0.72rem 1rem;
		border-radius: 10px;
		font-weight: 700;
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
		gap: 0.45rem;
	}

	.label {
		font-weight: 700;
		font-size: 0.84rem;
		color: var(--dk-text);
	}

	.input-wrap {
		position: relative;
		display: flex;
		align-items: center;
	}

	input,
	textarea {
		width: 100%;
		border-radius: 10px;
		border: 2px solid var(--dk-border);
		background: var(--dk-input-bg);
		color: var(--dk-text);
		padding: 0.85rem 1rem;
		font: inherit;
		font-size: 16px;
		font-weight: 500;
		outline: none;
		box-shadow: 2px 2px 0px var(--dk-shadow-ink);
		transition:
			border-color 0.15s ease,
			box-shadow 0.15s ease;
		appearance: none;
		box-sizing: border-box;
	}

	input::placeholder,
	textarea::placeholder {
		color: var(--dk-muted);
		opacity: 0.75;
	}

	.input-wrap input {
		padding-right: 3.5rem;
	}

	input:focus,
	textarea:focus {
		border-color: var(--dk-accent);
		box-shadow: 3px 3px 0px var(--dk-accent);
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
		color: var(--dk-muted);
		box-shadow: none;
		transition: color 0.15s ease;
	}

	.toggle-btn:hover,
	.toggle-btn:active,
	.toggle-btn:focus-visible {
		color: var(--dk-text);
		transform: translateY(-50%);
		box-shadow: none;
		outline: none;
	}

	.eye-icon {
		width: 21px;
		height: 21px;
		stroke: currentColor;
	}

	.actions {
		display: flex;
		gap: 0.8rem;
		flex-wrap: wrap;
		margin-top: 0.25rem;
	}

	.btn-solid {
		font-family: inherit;
		border-radius: 999px;
		padding: 0.78rem 1.65rem;
		font-weight: 800;
		font-size: 0.92rem;
		border: 2px solid #111111;
		background: var(--dk-accent);
		color: var(--dk-accent-ink);
		cursor: pointer;
		text-decoration: none;
		outline: none;
		box-shadow: 3px 3px 0px var(--dk-shadow-ink);
		transition:
			background-color 0.12s ease,
			transform 0.1s ease,
			box-shadow 0.1s ease;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		white-space: nowrap;
	}

	.btn-solid:hover:not(:disabled) {
		background: #ffe234;
	}

	.btn-solid:active:not(:disabled) {
		transform: translate(2px, 2px);
		box-shadow: 1px 1px 0px var(--dk-shadow-ink);
	}

	.btn-solid:focus-visible {
		outline: 2px solid var(--dk-accent);
		outline-offset: 2px;
	}

	.btn-solid:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-ghost {
		font-family: inherit;
		border-radius: 999px;
		padding: 0.78rem 1.45rem;
		font-weight: 700;
		font-size: 0.92rem;
		border: 2px solid var(--dk-border);
		background: var(--dk-surface);
		color: var(--dk-text);
		text-decoration: none;
		outline: none;
		box-shadow: 3px 3px 0px var(--dk-shadow-ink);
		cursor: pointer;
		transition:
			background-color 0.12s ease,
			transform 0.1s ease,
			box-shadow 0.1s ease;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	.btn-ghost:hover {
		background: var(--dk-subtle-bg);
	}

	.btn-ghost:active {
		transform: translate(2px, 2px);
		box-shadow: 1px 1px 0px var(--dk-shadow-ink);
	}

	/* Visible field captions */
	.field-caption {
		display: block;
		font-size: 0.7rem;
		font-weight: 800;
		letter-spacing: 0.09em;
		text-transform: uppercase;
		color: var(--dk-muted);
		margin-bottom: 0.25rem;
	}

	/* Unlocked Deck Header */
	.deck-header {
		padding-bottom: 1.65rem;
	}

	.deck-topbar {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1.25rem;
		margin-bottom: 1.5rem;
	}

	.deck-fields-row {
		display: flex;
		flex-wrap: wrap;
		gap: 1.35rem 2.25rem;
	}

	.meta-field {
		display: flex;
		flex-direction: column;
	}

	.field-val {
		font-size: 0.92rem;
		font-weight: 700;
		color: var(--dk-text);
	}

	.field-val--primary {
		font-weight: 800;
	}

	/* Lock icon button (no text) */
	.btn-lock-icon {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		border: 2px solid var(--dk-border);
		background: var(--dk-surface);
		color: var(--dk-text);
		box-shadow: 2px 2px 0px var(--dk-shadow-ink);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		outline: none;
		transition:
			background-color 0.12s ease,
			color 0.12s ease,
			transform 0.1s ease,
			box-shadow 0.1s ease;
		flex-shrink: 0;
	}

	.btn-lock-icon:hover {
		background: var(--dk-subtle-bg);
	}

	.btn-lock-icon:active {
		transform: translate(1px, 1px);
		box-shadow: 1px 1px 0px var(--dk-shadow-ink);
	}

	.project-title-block {
		display: flex;
		flex-direction: column;
	}

	.deck-title {
		font-family: var(--font-heading);
		font-size: clamp(1.85rem, 4vw, 2.75rem);
		font-weight: 800;
		margin: 0;
		letter-spacing: -0.025em;
		line-height: 1.1;
		color: var(--dk-text);
	}

	/* Deliverables inside single box */
	.deliverables-section {
		display: flex;
		flex-direction: column;
	}

	.deliverable-item {
		border-top: 1.5px solid var(--dk-divider);
		padding-top: 1.85rem;
		margin-top: 1.85rem;
	}

	.deliverable-item:first-child {
		margin-top: 0;
	}

	.deliverable-meta-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
		font-size: 0.72rem;
		font-weight: 800;
		letter-spacing: 0.08em;
		color: var(--dk-muted);
	}

	.deliverable-fields {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.labeled-block {
		display: flex;
		flex-direction: column;
	}

	.deliverable-title {
		font-family: var(--font-heading);
		font-size: clamp(1.25rem, 2.5vw, 1.55rem);
		font-weight: 800;
		margin: 0;
		letter-spacing: -0.015em;
		color: var(--dk-text);
	}

	.deliverable-notes {
		margin: 0;
		font-size: 0.95rem;
		line-height: 1.55;
		color: var(--dk-muted);
		max-width: 68ch;
	}

	.media-frame {
		margin-top: 0.25rem;
		margin-bottom: 0.85rem;
		border: 2px solid var(--dk-border);
		border-radius: 12px;
		overflow: hidden;
		background: #141414;
		box-shadow: 2px 2px 0px var(--dk-shadow-ink);
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

	/* Yellow ONLY for primary action CTA */
	.btn-open-asset {
		font-family: inherit;
		border-radius: 999px;
		padding: 0.72rem 1.45rem;
		font-weight: 800;
		font-size: 0.88rem;
		border: 2px solid #111111;
		background: var(--dk-accent);
		color: var(--dk-accent-ink);
		cursor: pointer;
		text-decoration: none;
		outline: none;
		box-shadow: 3px 3px 0px var(--dk-shadow-ink);
		transition:
			background-color 0.12s ease,
			transform 0.1s ease,
			box-shadow 0.1s ease;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		white-space: nowrap;
	}

	.btn-open-asset:hover:not(:disabled) {
		background: #ffe234;
	}

	.btn-open-asset:active:not(:disabled) {
		transform: translate(2px, 2px);
		box-shadow: 1px 1px 0px var(--dk-shadow-ink);
	}

	.btn-open-asset:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.asset-url-hint {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 0.8rem;
		color: var(--dk-muted);
		word-break: break-all;
	}

	.empty-deliverables {
		border-top: 1.5px solid var(--dk-divider);
		padding-top: 2rem;
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--dk-muted);
	}

	/* Creator notes placed below deliverables, understated */
	.creator-notes-footer {
		margin-top: 2rem;
		padding-top: 1.25rem;
		border-top: 1.5px dashed var(--dk-divider);
	}

	.notes-caption {
		display: block;
		font-size: 0.68rem;
		font-weight: 800;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--dk-muted);
		margin-bottom: 0.35rem;
	}

	.notes-body {
		margin: 0;
		font-size: 0.92rem;
		line-height: 1.6;
		font-weight: 500;
		color: var(--dk-muted);
		max-width: 72ch;
	}

	/* Client Experience Rating Card (Unified Theme + Refined Professional Layout) */
	.thankyou-box {
		width: 100%;
		border-radius: 16px;
		border: 2px solid var(--dk-border);
		background: var(--dk-surface);
		color: var(--dk-text);
		box-shadow: 4px 4px 0px var(--dk-shadow-ink);
		padding: clamp(1.5rem, 3.5vw, 2.25rem);
		box-sizing: border-box;
	}

	.thankyou-header {
		padding-bottom: 1.15rem;
		margin-bottom: 1.25rem;
		border-bottom: 1.5px solid var(--dk-divider);
	}

	.thankyou-title {
		font-family: var(--font-heading);
		font-size: clamp(1.35rem, 2.8vw, 1.75rem);
		font-weight: 800;
		margin: 0.25rem 0 0.4rem;
		letter-spacing: -0.02em;
		color: var(--dk-text);
	}

	.thankyou-sub {
		margin: 0;
		font-size: 0.92rem;
		color: var(--dk-muted);
		line-height: 1.5;
		max-width: 60ch;
	}

	.feedback-form {
		display: flex;
		flex-direction: column;
		gap: 1.15rem;
	}

	.star-selector-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 1rem;
		background: var(--dk-subtle-bg);
		border: 2px solid var(--dk-border);
		border-radius: 12px;
		padding: 0.75rem 1rem;
		box-shadow: 2px 2px 0px var(--dk-shadow-ink);
	}

	.star-row {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
	}

	.star-btn {
		appearance: none;
		background: var(--dk-surface);
		border: 2px solid var(--dk-border);
		border-radius: 9px;
		width: 40px;
		height: 40px;
		padding: 0;
		color: var(--dk-muted);
		cursor: pointer;
		outline: none;
		box-shadow: 2px 2px 0px var(--dk-shadow-ink);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		transition:
			background-color 0.12s ease,
			border-color 0.12s ease,
			color 0.12s ease,
			transform 0.1s ease,
			box-shadow 0.1s ease;
	}

	.star-btn:hover {
		border-color: var(--dk-accent);
		color: var(--dk-text);
	}

	.star-btn:active {
		transform: translate(1px, 1px);
		box-shadow: 1px 1px 0px var(--dk-shadow-ink);
	}

	.star-btn.is-filled {
		color: #111111;
		background: var(--dk-accent);
		border-color: #111111;
		box-shadow: 2px 2px 0px var(--dk-shadow-ink);
	}

	.rating-readout {
		font-size: 0.86rem;
		font-weight: 700;
		color: var(--dk-muted);
		padding: 0.3rem 0.75rem;
		border-radius: 999px;
		border: 1.5px solid var(--dk-divider);
		background: var(--dk-surface);
	}

	.rating-readout.has-value {
		color: var(--dk-text);
		border-color: var(--dk-border);
		font-weight: 800;
	}

	.exp-error {
		margin: 0;
		color: #dc2626;
		font-weight: 700;
		font-size: 0.88rem;
	}

	:global(.dark) .exp-error {
		color: #fca5a5;
	}

	.feedback-success {
		padding: 1.1rem 1.25rem;
		border-radius: 12px;
		border: 2px solid var(--dk-border);
		background: var(--dk-subtle-bg);
		box-shadow: 2px 2px 0px var(--dk-shadow-ink);
		display: flex;
		align-items: flex-start;
		gap: 0.9rem;
	}

	.success-badge {
		width: 30px;
		height: 30px;
		border-radius: 50%;
		background: var(--dk-accent);
		color: #111111;
		border: 2px solid #111111;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		margin-top: 0.1rem;
	}

	.success-copy {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.45rem;
	}

	.success-main {
		margin: 0;
		font-weight: 700;
		font-size: 0.94rem;
		line-height: 1.45;
		color: var(--dk-text);
	}

	.link-leave-review {
		background: transparent;
		border: none;
		padding: 0;
		font: inherit;
		font-size: 0.86rem;
		font-weight: 700;
		color: var(--dk-text);
		text-decoration: underline;
		cursor: pointer;
		opacity: 0.85;
	}

	.link-leave-review:hover {
		opacity: 1;
	}

	/* Follow-up Testimonial Modal (> 3 stars) */
	.modal-backdrop {
		position: fixed;
		inset: 0;
		z-index: 200;
		background: rgba(18, 18, 18, 0.58);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.25rem;
	}

	.review-modal {
		max-width: 520px;
		width: 100%;
		max-height: calc(100dvh - 2rem);
		overflow-y: auto;
		padding: clamp(1.5rem, 3.5vw, 2.25rem);
	}

	.modal-topbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding-bottom: 0.75rem;
		margin-bottom: 0.9rem;
		border-bottom: 1.5px solid var(--dk-divider);
	}

	.modal-close {
		width: 34px;
		height: 34px;
		border-radius: 50%;
		border: 2px solid var(--dk-border);
		background: var(--dk-surface);
		color: var(--dk-text);
		box-shadow: 2px 2px 0px var(--dk-shadow-ink);
		font-size: 1.2rem;
		line-height: 1;
		font-weight: 700;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		outline: none;
		transition:
			background-color 0.12s ease,
			transform 0.1s ease,
			box-shadow 0.1s ease;
	}

	.modal-close:hover {
		background: var(--dk-subtle-bg);
	}

	.modal-close:active {
		transform: translate(1px, 1px);
		box-shadow: 1px 1px 0px var(--dk-shadow-ink);
	}

	.modal-title {
		font-family: var(--font-heading);
		font-size: clamp(1.35rem, 3vw, 1.7rem);
		font-weight: 800;
		margin: 0 0 0.4rem;
		letter-spacing: -0.02em;
		color: var(--dk-text);
	}

	.modal-sub {
		margin: 0 0 1.25rem;
		font-size: 0.92rem;
		line-height: 1.5;
		color: var(--dk-muted);
	}

	.modal-actions {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-top: 0.25rem;
	}

	@media (max-width: 680px) {
		.wrap {
			padding: 1.5rem 0.9rem 3.5rem;
			gap: 1.5rem;
		}
		.sheet,
		.thankyou-box {
			border-radius: 14px;
			box-shadow: 3px 3px 0px var(--dk-shadow-ink);
			padding: 1.25rem 1.05rem;
		}
		.deck-fields-row {
			gap: 1rem 1.5rem;
		}
		.deliverable-item {
			padding-top: 1.5rem;
			margin-top: 1.5rem;
		}
		.star-selector-bar {
			padding: 0.7rem 0.85rem;
		}
	}
</style>
