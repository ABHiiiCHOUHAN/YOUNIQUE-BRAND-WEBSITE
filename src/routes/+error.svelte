<script>
	import { page } from '$app/state';
</script>

<div class="error-void">
	<div class="glitch-container">
		<h1 class="error-code" data-text="404">404</h1>
	</div>
	
	<div class="message-box">
		<header class="box-header">
			<span class="status-dot"></span>
			<span class="label">SYSTEM // ALERT</span>
		</header>
		<p class="error-desc">
			CRITICAL ERROR: The path <span class="path">{page.url.pathname}</span> has been terminated or never existed. 
			Page drift detected beyond safe parameters.
		</p>
		<a href="/" class="btn-primary">RETURN TO BASE</a>
	</div>

	<!-- Decorative background element -->
	<div class="deco-orbit">
		<div class="sun-orbit"></div>
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

	.glitch-container {
		position: relative;
		margin-bottom: 2rem;
	}

	.error-code {
		font-family: 'Rubik Mono One', sans-serif;
		font-size: clamp(6rem, 20vw, 15rem);
		line-height: 1;
		margin: 0;
		color: var(--color-1); /* Yellow */
		position: relative;
		-webkit-text-stroke: 4px #000;
		text-shadow: 12px 12px 0 #000;
		animation: glitch 3s infinite;
	}

	@keyframes glitch {
		0%, 100% { transform: none; text-shadow: 12px 12px 0 #000; }
		90% { transform: translate(-2px, -2px) skewX(2deg); text-shadow: 14px 14px 0 #000; }
		95% { transform: translate(4px, 1px); text-shadow: -8px -8px 0 var(--color-2); }
	}

	.message-box {
		background: var(--color-5);
		border: 4px solid #000;
		padding: 2.5rem;
		max-width: 500px;
		width: 100%;
		box-shadow: 15px 15px 0 #000;
		position: relative;
		z-index: 10;
		color: #1c1c1c;
	}

	.box-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 1.5rem;
		border-bottom: 2px solid #000;
		padding-bottom: 0.75rem;
	}

	.status-dot {
		display: block;
		width: 12px;
		height: 12px;
		background: #ff0044;
		border-radius: 50%;
		animation: blink 0.8s infinite;
	}

	@keyframes blink {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.3; }
	}

	.label {
		font-family: 'Rubik Mono One', sans-serif;
		font-size: 0.75rem;
		letter-spacing: 0.1em;
	}

	.error-desc {
		font-size: 1.1rem;
		font-weight: 700;
		line-height: 1.5;
		margin-bottom: 2rem;
	}

	.path {
		color: #ff0044;
		background: rgba(0,0,0,0.05);
		padding: 2px 6px;
		font-family: inherit;
	}

	.btn-primary {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: #000;
		color: var(--color-1);
		padding: 1rem 2rem;
		text-decoration: none;
		font-family: 'Rubik Mono One', sans-serif;
		font-size: 0.85rem;
		transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
		border: none;
		width: 100%;
	}

	.btn-primary:hover {
		transform: translate(-3px, -3px);
		box-shadow: 6px 6px 0 #ff0044;
	}

	.deco-orbit {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 80vh;
		height: 80vh;
		border: 1px dashed rgba(255,255,255,0.1);
		border-radius: 50%;
		pointer-events: none;
	}

	.sun-orbit {
		position: absolute;
		top: -20px;
		left: 50%;
		width: 40px;
		height: 40px;
		background: var(--color-2);
		border-radius: 50%;
		animation: orbit 20s linear infinite;
		transform-origin: 20px calc(40vh + 20px);
	}

	@keyframes orbit {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}

	:global(.dark) .message-box {
		background: #1a1a1a;
		color: #fff;
		border-color: #fff;
		box-shadow: 15px 15px 0 #000;
	}

	:global(.dark) .box-header {
		border-bottom-color: #333;
	}

	:global(.dark) .btn-primary {
		background: var(--color-1);
		color: #000;
	}
</style>
