<script>
	import { page } from '$app/state';
</script>

<div class="error-void">
	<header class="standalone-header">
		<a href="/" aria-label="Younique Design Studio home">
			<div class="brand-logo" role="img" aria-label="Younique Design Studio"></div>
		</a>
	</header>

	<div class="message-box">
		<div class="tape-sticker">404</div>
		<header class="box-header">
			<span class="status-dot"></span>
			<span class="label">SYSTEM // ALERT</span>
		</header>
		<p class="error-desc">
			SYSTEM NOTE: This link is dead or missing. Let's redirect you to the real work.
		</p>
		<a href="/" class="btn-primary">RETURN TO BASE</a>
	</div>
</div>

<style>
	.error-void {
		min-height: 100vh;
		background: #3d3d3d;
		color: #fff;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		position: relative;
		overflow: hidden;
		font-family: var(--font-secondary);
	}

	.standalone-header {
		position: absolute;
		top: 2rem;
		left: 0;
		width: 100%;
		display: flex;
		justify-content: center;
		z-index: 50;
	}

	.brand-logo {
		width: 350px;
		height: 70px;
		background: #fff;
		display: block;
		-webkit-mask-image: url('/assets/2_site_logo.svg');
		mask-image: url('/assets/2_site_logo.svg');
		-webkit-mask-size: contain;
		mask-size: contain;
		-webkit-mask-repeat: no-repeat;
		mask-repeat: no-repeat;
		-webkit-mask-position: center;
		mask-position: center;
	}

	.message-box {
		background: #4f4f4f;
		border: 4px solid #000;
		padding: 2.5rem;
		max-width: 500px;
		width: 100%;
		box-shadow: 15px 15px 0 #000;
		position: relative;
		z-index: 10;
		color: #fff;
	}

	.box-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		border-bottom: 2px solid rgba(255,255,255,0.1);
		padding-bottom: 1rem;
		margin-bottom: 1.5rem;
	}

	.status-dot {
		width: 10px;
		height: 10px;
		background: #ff0044;
		border-radius: 50%;
		box-shadow: 0 0 10px #ff0044;
	}

	.label {
		font-family: 'Rubik Mono One', sans-serif;
		font-size: 0.7rem;
		letter-spacing: 0.1em;
		opacity: 0.7;
	}

	.tape-sticker {
		position: absolute;
		top: -30px;
		left: -15px;
		background: var(--color-1); /* Yellow */
		color: #000;
		padding: 0.5rem 2rem;
		font-family: var(--kinetic-font-2), monospace; /* LLPixel */
		font-size: 2.5rem;
		font-weight: 900;
		transform: rotate(-3deg);
		box-shadow: 4px 4px 0 #000;
		z-index: 50;
		border: 3px solid #000;
	}

	.error-desc {
		font-size: 1.25rem;
		font-weight: 700;
		line-height: 1.4;
		margin-bottom: 2rem;
	}

	.btn-primary {
		display: inline-flex;
		align-items: center;
		padding: 1rem 2rem;
		background: var(--color-1);
		color: #000;
		text-decoration: none;
		font-weight: 900;
		font-size: 0.9rem;
		letter-spacing: 0.05em;
		border: 3px solid #000;
		box-shadow: 4px 4px 0 #000;
		transition: all 0.2s cubic-bezier(0.165, 0.84, 0.44, 1);
	}

	.btn-primary:hover {
		transform: translate(-3px, -3px);
		box-shadow: 7px 7px 0 #000;
		background: #fff;
	}
</style>
