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
		<div class="tape-sticker">
			<span class="glitch-text">404</span>
		</div>
		<header class="box-header">
			<span class="status-dot"></span>
			<span class="label">ERROR // ALERT</span>
		</header>
		<p class="error-desc">
			ERROR NOTE: This link is dead or missing. Let's redirect you to the real work.
		</p>
		<a href="/" class="btn-primary">RETURN TO HOME</a>
	</div>
</div>

<style>
	.error-void {
		min-height: 100vh;
		background: #3d3d3d;
		color: #fff;
		display: flex;
		flex-direction: column;
		align-items: center; /* Move box back to center */
		justify-content: center;
		padding: 2rem;
		position: relative;
		overflow: hidden;
		font-family: var(--font-secondary);
	}

	.standalone-header {
		position: absolute;
		top: 4rem; /* Higher for a cleaner look */
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
		padding: 3rem;
		max-width: 650px; /* Bigger box */
		width: 100%;
		box-shadow: 20px 20px 0 #000;
		position: relative;
		z-index: 10;
		color: #fff;
		transform: rotate(1deg); /* Slight tilt for neo-brutalist look */
	}

	.box-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		border-bottom: 2px solid rgba(255, 255, 255, 0.1);
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
		right: -15px;
		background: var(--color-1); /* Yellow */
		color: #000;
		padding: 0.5rem 2rem;
		font-family: var(--kinetic-font-2), monospace; /* LLPixel */
		font-size: 2.5rem;
		font-weight: 900;
		transform: rotate(3deg); /* Changed rotation to match right side */
		box-shadow: 4px 4px 0 #000;
		z-index: 50;
		border: 3px solid #000;
	}

	.glitch-text {
		display: inline-block;
		animation: glitch-text-anim 5s infinite; /* Every 5s loop */
	}

	@keyframes glitch-text-anim {
		0%, 90%, 100% {
			transform: translate(0) rotate(0) skew(0);
			opacity: 1;
		}
		92% {
			transform: translate(-3px, 2px) rotate(-4deg) skewX(-10deg);
			opacity: 0.8;
		}
		94% {
			transform: translate(4px, -3px) rotate(6deg) skewX(10deg);
			opacity: 0.9;
		}
		96% {
			transform: translate(-2px, 2px) rotate(-2deg) skewX(-5deg);
		}
		98% {
			transform: translate(1px, -1px) rotate(2deg) skewX(0);
		}
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
	@media (max-width: 768px) {
		.error-void {
			align-items: center; /* Center on mobile */
			padding: 8rem 1.5rem 2rem; /* More top padding for absolute header logo */
		}

		.brand-logo {
			width: 250px;
			height: 50px;
		}

		.standalone-header {
			top: 2.5rem;
		}

		.message-box {
			padding: 2rem 1.5rem;
			margin-top: 0;
			max-width: 95%;
			transform: none; /* remove tilt on mobile for better visibility */
			box-shadow: 10px 10px 0 #000;
		}

		.error-desc {
			font-size: 1.1rem;
		}

		.tape-sticker {
			font-size: 1.5rem;
			top: -20px;
			right: -5px;
			left: auto;
			padding: 0.3rem 1rem;
		}
	}
</style>
