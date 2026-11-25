<script>
	import { enhance } from '$app/forms';

	let { form } = $props();

	let showPassword = $state(false);
	let isSubmitting = $state(false);
</script>

<svelte:head>
	<title>Admin Login - Younique</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<section class="wrap page-transition">
	<div class="panel login-panel">
		<header class="page-header">
			<h1 class="page-title">Admin Access</h1>
			<p class="subtitle">Enter password to unlock dashboard</p>
		</header>

		{#if form?.error}
			<div class="status error-status" role="alert">
				{form.error}
			</div>
		{/if}

		<form
			method="POST"
			use:enhance={() => {
				isSubmitting = true;
				return async ({ update }) => {
					isSubmitting = false;
					await update();
				};
			}}
			class="form"
		>
			<label class="field">
				<span class="label">Password</span>
				<div class="input-wrap">
					<input
						id="password"
						name="password"
						type={showPassword ? 'text' : 'password'}
						placeholder="••••••••••••"
						required
						autocomplete="current-password"
						disabled={isSubmitting}
					/>
					<button
						type="button"
						class="toggle-btn"
						onclick={() => (showPassword = !showPassword)}
						aria-label={showPassword ? 'Hide password' : 'Show password'}
						tabindex="-1"
					>
						{#if showPassword}
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
								<path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
								<path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
								<line x1="2" y1="2" x2="22" y2="22" />
							</svg>
						{/if}
					</button>
				</div>
			</label>

			<div class="actions">
				<button type="submit" class="btn" disabled={isSubmitting}>
					{isSubmitting ? 'Verifying...' : 'Log In'}
				</button>
				<a href="/" class="btn btn--outline">Cancel</a>
			</div>
		</form>
	</div>
</section>

<style>
	.wrap {
		padding: 2.5rem clamp(1rem, 4vw, 3rem);
		width: 100%;
		margin: 0 auto;
		min-height: calc(85vh - 70px);
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
	}

	.login-panel {
		width: 100%;
		border-radius: 28px;
		border: 3px solid var(--color-3);
		background: var(--color-5);
		color: var(--color-3);
		box-shadow: 12px 14px 0px var(--color-3);
		padding: clamp(1.5rem, 4vw, 3rem);
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	/* PC Version: width is exactly 1.6x of height (672px / 420px = 1.6) */
	@media (min-width: 680px) {
		.wrap {
			max-width: 800px;
		}

		.login-panel {
			width: 672px;
			height: 420px;
			aspect-ratio: 1.6 / 1;
			padding: 2.75rem 3.5rem;
		}
	}

	/* Mobile Version */
	@media (max-width: 679px) {
		.wrap {
			max-width: 100%;
			padding: 1.25rem 0.85rem 2.5rem;
			min-height: calc(80vh - 60px);
		}

		.login-panel {
			width: 100%;
			max-width: 100%;
			height: auto;
			aspect-ratio: auto;
			border-radius: 20px;
			border-width: 2.5px;
			box-shadow: 6px 6px 0px var(--color-3);
			padding: 1.5rem 1.15rem;
		}

		.page-title {
			font-size: 1.7rem;
		}

		.subtitle {
			font-size: 0.85rem;
		}

		input {
			padding: 0.85rem 3.2rem 0.85rem 0.95rem;
			font-size: 16px;
			box-shadow: 3px 3px 0px var(--color-3);
		}

		.actions {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 0.75rem;
			width: 100%;
		}

		.actions .btn,
		.actions .btn--outline {
			width: 100%;
			padding: 0.85rem 0.5rem;
			font-size: 0.95rem;
			text-align: center;
			justify-content: center;
			box-sizing: border-box;
		}
	}

	.page-header {
		margin-bottom: 1.5rem;
	}

	.page-title {
		font-family: var(--font-heading);
		font-size: clamp(1.75rem, 3.5vw, 2.25rem);
		font-weight: 900;
		margin: 0 0 0.4rem;
		letter-spacing: -0.03em;
		color: var(--color-3);
	}

	.subtitle {
		font-size: 0.95rem;
		font-weight: 700;
		opacity: 0.65;
		margin: 0;
	}

	.error-status {
		margin-bottom: 1.5rem;
		background: #ff5252;
		color: #ffffff;
		border: 2px solid var(--color-3);
		box-shadow: 4px 4px 0px var(--color-3);
		padding: 0.65rem 1rem;
		border-radius: 10px;
		font-weight: 800;
		font-size: 0.9rem;
	}

	.form {
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
		font-size: 0.9rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.input-wrap {
		position: relative;
		display: flex;
		align-items: center;
	}

	input {
		width: 100%;
		border-radius: 12px;
		border: 2px solid var(--color-3);
		background: var(--color-5);
		color: var(--color-3);
		padding: 0.9rem 3.8rem 0.9rem 1rem;
		font: inherit;
		font-size: 1rem;
		font-weight: 700;
		outline: none;
		box-shadow: 4px 4px 0px var(--color-3);
		transition: transform 0.1s;
		appearance: none;
	}

	input:focus {
		border-color: var(--color-1);
		box-shadow: 0 0 0 4px var(--color-1);
	}

	.toggle-btn {
		position: absolute;
		right: 14px;
		top: 50%;
		transform: translateY(-50%);
		background: transparent;
		border: none;
		padding: 4px;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 8px;
		color: var(--color-3);
		opacity: 0.8;
		outline: none;
		transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.15s ease;
	}

	.toggle-btn:hover {
		opacity: 1;
		transform: translateY(-50%) scale(1.15);
	}

	.toggle-btn:active {
		transform: translateY(-50%) scale(0.92);
	}

	.eye-icon {
		width: 22px;
		height: 22px;
		display: block;
		stroke: var(--color-3);
		stroke-width: 2.2px;
		animation: eyeIconPop 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	@keyframes eyeIconPop {
		0% {
			transform: scale(0.8);
			opacity: 0.5;
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}

	.actions {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-top: 0.5rem;
	}

	.btn {
		font-family: inherit;
		border-radius: 999px;
		padding: 0.85rem 1.8rem;
		font-weight: 900;
		font-size: 1rem;
		border: 2px solid var(--color-3);
		background: var(--color-1);
		color: var(--color-3);
		cursor: pointer;
		text-decoration: none;
		box-shadow: 4px 4px 0px var(--color-3);
		transition:
			transform 120ms ease,
			box-shadow 120ms ease;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		white-space: nowrap;
		line-height: 1;
	}

	.btn:hover,
	.btn:focus-visible {
		transform: translate(-2px, -2px);
		box-shadow: 6px 6px 0px var(--color-3);
	}

	.btn:active {
		transform: translate(2px, 2px);
		box-shadow: 2px 2px 0px var(--color-3);
	}

	.btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.btn--outline {
		font-family: inherit;
		background: transparent;
		box-shadow: none;
		color: var(--color-3);
		white-space: nowrap;
		line-height: 1;
	}

	.btn--outline:hover {
		background: rgba(0, 0, 0, 0.05);
		box-shadow: none;
		transform: none;
	}

	:global(.dark) .btn--outline:hover {
		background: rgba(255, 255, 255, 0.08);
	}
</style>
