<script>
	import { enhance } from '$app/forms';

	let { form } = $props();

	let showPassword = $state(false);
	let isSubmitting = $state(false);
</script>

<svelte:head>
	<title>Admin Sign In - Younique</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<section class="wrap page-transition">
	<div class="panel login-panel">
		<header class="page-header">
			<h1 class="page-title">Admin Sign In</h1>
			<p class="subtitle">Enter your password to access the dashboard</p>
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
						placeholder="Enter admin password"
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
								stroke-width="2"
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
								stroke-width="2"
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
				<button type="submit" class="btn" disabled={isSubmitting}>
					{isSubmitting ? 'Signing in...' : 'Log In'}
				</button>
				<a href="/" class="btn btn--outline">Cancel</a>
			</div>
		</form>
	</div>
</section>

<style>
	.wrap {
		--adm-surface: var(--color-5, #fffaf4);
		--adm-input-bg: #ffffff;
		--adm-subtle-bg: #f1eadf;
		--adm-border: #1c1c1c;
		--adm-shadow-ink: #1c1c1c;
		--adm-text: #1c1c1c;
		--adm-muted: #57534e;
		--adm-accent: var(--color-1, #fdd803);
		--adm-accent-ink: #111111;

		font-family: var(--font-heading, system-ui, -apple-system, sans-serif);
		padding: 2.5rem clamp(1rem, 4vw, 3rem);
		width: 100%;
		margin: 0 auto;
		min-height: calc(85vh - 70px);
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
	}

	:global(.dark) .wrap {
		--adm-surface: #242424;
		--adm-input-bg: #181818;
		--adm-subtle-bg: #323232;
		--adm-border: #c9c4bc;
		--adm-shadow-ink: #111111;
		--adm-text: #fffaf4;
		--adm-muted: #b8b3ac;
		--adm-accent: #fdd803;
		--adm-accent-ink: #111111;
	}

	.login-panel {
		width: 100%;
		border-radius: 16px;
		border: 2px solid var(--adm-border);
		background: var(--adm-surface);
		color: var(--adm-text);
		box-shadow: 5px 5px 0px var(--adm-shadow-ink);
		padding: clamp(1.5rem, 4vw, 3rem);
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	/* PC Version: width is 1.6x of height (672px / 420px = 1.6) */
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

	@media (max-width: 679px) {
		.wrap {
			max-width: 100%;
			padding: 1.25rem 0.9rem 2.5rem;
			min-height: calc(80vh - 60px);
		}

		.login-panel {
			width: 100%;
			height: auto;
			aspect-ratio: auto;
			padding: 1.5rem 1.25rem;
			box-shadow: 4px 4px 0px var(--adm-shadow-ink);
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
			box-sizing: border-box;
		}
	}

	.page-header {
		margin-bottom: 1.5rem;
	}

	.page-title {
		font-family: var(--font-heading, inherit);
		font-size: 1.75rem;
		font-weight: 800;
		margin: 0 0 0.35rem;
		letter-spacing: -0.025em;
		color: var(--adm-text);
	}

	.subtitle {
		font-size: 0.94rem;
		font-weight: 500;
		color: var(--adm-muted);
		margin: 0;
	}

	.error-status {
		margin-bottom: 1.25rem;
		background: #dc2626;
		color: #ffffff;
		border: 2px solid var(--adm-border);
		box-shadow: 2px 2px 0px var(--adm-shadow-ink);
		padding: 0.65rem 0.95rem;
		border-radius: 10px;
		font-weight: 700;
		font-size: 0.88rem;
	}

	.form {
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
		font-size: 0.86rem;
		color: var(--adm-text);
	}

	.input-wrap {
		position: relative;
		display: flex;
		align-items: center;
	}

	input {
		width: 100%;
		border-radius: 10px;
		border: 1.5px solid var(--adm-border);
		background: var(--adm-input-bg);
		color: var(--adm-text);
		padding: 0.78rem 3.2rem 0.78rem 0.95rem;
		font: inherit;
		font-size: 16px;
		font-weight: 600;
		outline: none;
		box-shadow: 2px 2px 0px var(--adm-shadow-ink);
		transition:
			border-color 0.15s ease,
			box-shadow 0.15s ease;
		appearance: none;
		box-sizing: border-box;
	}

	input::placeholder {
		color: var(--adm-muted);
		opacity: 0.75;
	}

	input:focus {
		border-color: var(--adm-accent);
		box-shadow: 3px 3px 0px var(--adm-accent);
	}

	.toggle-btn {
		position: absolute;
		right: 10px;
		top: 50%;
		transform: translateY(-50%);
		background: transparent;
		border: none;
		padding: 6px;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 6px;
		color: var(--adm-muted);
		outline: none;
		box-shadow: none;
		transition: color 0.15s ease;
	}

	.toggle-btn:hover,
	.toggle-btn:active,
	.toggle-btn:focus-visible {
		color: var(--adm-text);
		transform: translateY(-50%);
		box-shadow: none;
		outline: none;
	}

	.eye-icon {
		width: 20px;
		height: 20px;
		display: block;
		stroke: currentColor;
	}

	.actions {
		display: flex;
		align-items: center;
		gap: 0.85rem;
		margin-top: 0.35rem;
	}

	.btn {
		font-family: inherit;
		border-radius: 999px;
		padding: 0.75rem 1.6rem;
		font-weight: 800;
		font-size: 0.92rem;
		border: 2px solid #111111;
		background: var(--adm-accent);
		color: var(--adm-accent-ink);
		cursor: pointer;
		text-decoration: none;
		outline: none;
		box-shadow: 3px 3px 0px var(--adm-shadow-ink);
		transition:
			background-color 120ms ease,
			transform 100ms ease,
			box-shadow 100ms ease;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		white-space: nowrap;
		line-height: 1.2;
	}

	.btn:hover:not(:disabled) {
		background: #ffe234;
	}

	.btn:active:not(:disabled) {
		transform: translate(2px, 2px);
		box-shadow: 1px 1px 0px var(--adm-shadow-ink);
	}

	.btn:disabled {
		opacity: 0.55;
		cursor: not-allowed;
	}

	.btn--outline {
		background: var(--adm-surface);
		border: 2px solid var(--adm-border);
		color: var(--adm-text);
		box-shadow: 3px 3px 0px var(--adm-shadow-ink);
	}

	.btn--outline:hover {
		background: var(--adm-subtle-bg);
	}
</style>
