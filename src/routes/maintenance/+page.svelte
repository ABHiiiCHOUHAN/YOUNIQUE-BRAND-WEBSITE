<script>
	import { onMount } from 'svelte';
	let { data } = $props();

	let links = $state({
		xLink: 'https://x.com',
		instagramLink: 'https://instagram.com',
		contactEmail: 'contact@example.com',
		telegramLink: 'https://t.me'
	});

	onMount(async () => {
		try {
			const res = await fetch('/api/settings');
			const set = await res.json();
			if (set) {
				if (set.xLink) links.xLink = set.xLink;
				if (set.instagramLink) links.instagramLink = set.instagramLink;
				if (set.contactEmail) links.contactEmail = set.contactEmail;
				if (set.telegramLink) links.telegramLink = set.telegramLink;
			}
		} catch (e) {}
	});
</script>

<div class="maintenance-void">
	<div class="marquee-back marquee-1">
		<div class="track">
			<span>SYSTEM UPGRADE IN PROGRESS ●&nbsp;</span>
			<span>SYSTEM UPGRADE IN PROGRESS ●&nbsp;</span>
			<span>SYSTEM UPGRADE IN PROGRESS ●&nbsp;</span>
			<span>SYSTEM UPGRADE IN PROGRESS ●&nbsp;</span>
			<span>SYSTEM UPGRADE IN PROGRESS ●&nbsp;</span>
			<span>SYSTEM UPGRADE IN PROGRESS ●&nbsp;</span>
			<span>SYSTEM UPGRADE IN PROGRESS ●&nbsp;</span>
			<span>SYSTEM UPGRADE IN PROGRESS ●&nbsp;</span>
			<!-- Duplicate for seamless loop -->
			<span>SYSTEM UPGRADE IN PROGRESS ●&nbsp;</span>
			<span>SYSTEM UPGRADE IN PROGRESS ●&nbsp;</span>
			<span>SYSTEM UPGRADE IN PROGRESS ●&nbsp;</span>
			<span>SYSTEM UPGRADE IN PROGRESS ●&nbsp;</span>
			<span>SYSTEM UPGRADE IN PROGRESS ●&nbsp;</span>
			<span>SYSTEM UPGRADE IN PROGRESS ●&nbsp;</span>
			<span>SYSTEM UPGRADE IN PROGRESS ●&nbsp;</span>
			<span>SYSTEM UPGRADE IN PROGRESS ●&nbsp;</span>
		</div>
	</div>

	<div class="marquee-back marquee-2">
	</div>

	<div class="hero-center">
		<header class="standalone-header">
			<div class="brand-logo" role="img" aria-label="Younique Design Studio"></div>
		</header>

		<div class="message-box">
			<div class="tape-sticker">
				<div class="bg-digits">
					<span>5</span>
					<span class="hidden">0</span>
					<span>2</span>
				</div>
				<div class="fg-digits">
					<span class="drop-char drop-5">5</span>
					<span class="twitch-0">0</span>
					<span class="drop-char drop-2">2</span>
				</div>
			</div>
			<p class="desc">
				Our website is currently undergoing a structural realignment to bring you the next
				evolution of <span class="accent">digital chaos.</span>
				We'll be back louder and sharper.
			</p>

			<div class="progress-bar">
				<div class="bar-inner"></div>
			</div>

			<div class="footer-meta">
				<span class="est">- IN CASE OF URGENCY</span>
				<div class="social-tray">
					<a href={links.xLink} aria-label="X (Twitter)" class="icon-pill">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
							<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
						</svg>
					</a>
					<a href={links.instagramLink} aria-label="Instagram" class="icon-pill">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
							<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
							<line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
						</svg>
					</a>
					<a href={`mailto:${links.contactEmail}`} aria-label="Gmail" class="icon-pill">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
							<polyline points="22,6 12,13 2,6"></polyline>
						</svg>
					</a>
					<a href={links.telegramLink} aria-label="Telegram" class="icon-pill">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<line x1="22" y1="2" x2="11" y2="13"></line>
							<polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
						</svg>
					</a>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.maintenance-void {
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

	.marquee-back {
		position: absolute;
		left: -10vw;
		width: 120vw;
		background: var(--color-1);
		padding: 0.75rem 0;
		border-top: 4px solid #000;
		border-bottom: 4px solid #000;
		overflow: hidden;
		display: flex;
		white-space: nowrap;
		z-index: 1;
	}

	.marquee-1 {
		top: 44%;
		transform: translateY(-50%) rotate(-2deg);
	}

	.marquee-2 {
		top: 62%;
		transform: translateY(-50%) rotate(3deg);
		/* Yellow and black diagonal stripes */
		background: repeating-linear-gradient(
			-45deg,
			#000,
			#000 30px,
			var(--color-1) 30px,
			var(--color-1) 60px
		);
		background-size: 85px 85px; /* Define explicit size for smooth loop */
		animation: scroll-stripes 5s linear infinite reverse; /* Move in opposite direction */
		height: 40px; /* Explicit height for tape */
	}

	.track {
		display: flex;
		animation: scroll 30s linear infinite;
		font-family: 'Rubik Mono One', sans-serif;
		font-size: 0.8rem;
		color: #000;
		width: max-content; /* Ensure width accommodates content */
	}

	@keyframes scroll {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-50%);
		}
	}

	@keyframes scroll-stripes {
		0% {
			background-position: 0 0;
		}
		100% {
			background-position: -85px 0; /* Match background-size for perfect loop */
		}
	}

	.standalone-header {
		position: absolute;
		top: 5rem;
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
		transform: rotate(-1deg);
		margin-top: 4rem; /* space for logo */
	}

	.desc {
		font-size: 1.25rem;
		font-weight: 700;
		line-height: 1.4;
		margin-bottom: 2rem;
	}

	.accent {
		color: #ff0044;
		text-decoration: underline;
		text-decoration-thickness: 3px;
		text-underline-offset: 4px;
	}

	.progress-bar {
		height: 30px;
		background: rgba(0, 0, 0, 0.3);
		border: 3px solid #000;
		margin-bottom: 2rem;
		position: relative;
		overflow: hidden;
	}

	.bar-inner {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 65%;
		background: var(--color-2);
		animation: pulse-progress 4s ease-in-out infinite alternate;
	}

	@keyframes pulse-progress {
		from {
			width: 55%;
		}
		to {
			width: 75%;
		}
	}

	.footer-meta {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.est {
		font-family: 'Rubik Mono One', sans-serif;
		font-size: 0.75rem;
		opacity: 0.6;
		letter-spacing: 0.1em;
	}

	.social-tray {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.icon-pill {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		background: #000;
		color: #f4f4f4;
		text-decoration: none;
		border-radius: 50%; /* Circle for icons */
		transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
		border: 2px solid #000;
	}

	.icon-pill:hover {
		background: #fff;
		color: #000;
		transform: translateY(-3px);
		box-shadow: 4px 4px 0 #000;
	}

	.icon-pill svg {
		width: 20px;
		height: 20px;
	}

	.tape-sticker {
		position: absolute;
		top: -45px;
		left: -15px;
		background: #ff0044;
		padding: 0.5rem 2rem;
		font-family: var(--kinetic-font-2), monospace; /* Kinetic-LLPixel */
		font-size: 2.5rem;
		font-weight: 900;
		transform: rotate(2deg);
		box-shadow: 4px 4px 0 #000;
		z-index: 50;
		border: 3px solid #000;
	}

	.bg-digits {
		color: #990025; /* Darker red footprint */
		display: flex;
		gap: 2px;
	}

	.bg-digits .hidden {
		visibility: hidden;
	}

	.fg-digits {
		position: absolute;
		top: 0.5rem;
		left: 2rem;
		bottom: 0.5rem;
		right: 2rem;
		color: #fff;
		display: flex;
		gap: 2px;
		pointer-events: none;
	}

	.drop-char {
		display: inline-block;
		animation: glitchDropOut 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
	}

	.drop-5 {
		animation-delay: 2.3s;
	}
	.drop-2 {
		animation-delay: 2s;
	}

	.twitch-0 {
		display: inline-block;
		animation: stopMotionTwitch 0.4s infinite;
		transform-origin: center;
	}

	@keyframes stopMotionTwitch {
		0%,
		49.9% {
			transform: rotate(-5deg) translate(-1px, 1px);
		}
		50%,
		100% {
			transform: rotate(5deg) translate(2px, -1px);
		}
	}

	@keyframes glitchDropOut {
		0% {
			transform: translate(0, 0) scale(1) rotate(0deg);
		}
		5% {
			transform: translate(-5px, -8px) scale(1.1) rotate(-8deg); /* POP */
			filter: drop-shadow(4px 4px 0px rgba(0, 0, 0, 0.5));
		}
		8% {
			transform: translate(4px, -5px) scale(1.15) rotate(5deg); /* GLITCH */
			filter: drop-shadow(-4px 2px 0px rgba(0, 0, 0, 0.5));
		}
		12% {
			transform: translate(-2px, -2px) scale(1.1) rotate(0deg); /* SETTLE SLIGHTLY */
		}
		15% {
			transform: translate(0, 0) scale(1.05) rotate(0deg); /* PAUSE BEFORE DROP */
		}
		100% {
			transform: translate(20px, 850px) rotate(45deg); /* MASSIVE FALL */
		}
	}

	@media (max-width: 768px) {
		.message-box {
			padding: 2rem;
			transform: none;
		}
		.standalone-header {
			top: 3.5rem;
		}
	}
</style>
