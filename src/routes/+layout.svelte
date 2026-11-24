<script>
	import { onMount } from 'svelte';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import ContactSection from '$lib/components/ContactSection.svelte';
	import { inView } from '$lib/actions/inView.js';

	let { children } = $props();

	let isDark = $state(false);
	let isScrolled = $state(false);
	let isAtBottom = $state(false);

	onMount(() => {
		let ticking = false;
		let cachedDocHeight = document.documentElement.scrollHeight;
		let cachedWinHeight = window.innerHeight;

		const updateMetrics = () => {
			cachedDocHeight = document.documentElement.scrollHeight;
			cachedWinHeight = window.innerHeight;
		};

		window.addEventListener('resize', updateMetrics, { passive: true });

		const onScroll = () => {
			if (!ticking) {
				window.requestAnimationFrame(() => {
					const y = window.scrollY;
					isScrolled = y > 50;
					isAtBottom = y + cachedWinHeight >= cachedDocHeight - 50;
					ticking = false;
				});
				ticking = true;
			}
		};

		window.addEventListener('scroll', onScroll, { passive: true });

		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', updateMetrics);
		};
	});

	$effect(() => {
		if (browser) {
			const saved = localStorage.getItem('theme');
			if (
				saved === 'dark' ||
				(!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)
			) {
				isDark = true;
				document.documentElement.classList.add('dark');
			} else {
				isDark = false;
				document.documentElement.classList.remove('dark');
			}
		}
	});

	function toggleTheme() {
		isDark = !isDark;
		if (isDark) {
			document.documentElement.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		} else {
			document.documentElement.classList.remove('dark');
			localStorage.setItem('theme', 'light');
		}
	}

	const isStandalone = $derived(['/maintenance'].includes($page.url.pathname) || $page.error);
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="app">
	{#if !isStandalone}
		<header class="header" class:scrolled={isScrolled} class:header--hidden={isAtBottom}>
			<nav class="navbar" aria-label="Primary">
				<a class="brand" href="/" aria-label="Younique Design Studio home">
					<div
						class="brand-logo"
						role="img"
						aria-label="Younique Design Studio"
						style:background={isDark ? '#f4f4f4' : '#1c1c1c'}
					></div>
				</a>

				<ul class="nav-links">
					<li>
						<a
							class="nav-link"
							class:active={$page.url.hash === '#work' || $page.url.pathname === '/work'}
							href="/#work"><span class="nav-text">Work</span></a
						>
					</li>
					<li>
						<a
							class="nav-link"
							class:active={$page.url.hash === '#blog' || $page.url.pathname.startsWith('/blog')}
							href="/#blog"><span class="nav-text">Blog</span></a
						>
					</li>
					<li>
						<a class="nav-link" class:active={$page.url.hash === '#about'} href="/#about"><span class="nav-text">About</span></a>
					</li>
					<li><a class="btn-contact" href="/#contact">Contact</a></li>
					<li>
						<button
							class="theme-toggle"
							onclick={toggleTheme}
							aria-label="Toggle Dark Mode"
							title="Toggle Dark Mode"
						>
							{#if isDark}
								<svg
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line
										x1="12"
										y1="21"
										x2="12"
										y2="23"
									/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line
										x1="18.36"
										y1="18.36"
										x2="19.78"
										y2="19.78"
									/><line x1="1" y1="12" x2="3" y2="12" /><line
										x1="21"
										y1="12"
										x2="23"
										y2="12"
									/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line
										x1="18.36"
										y1="5.64"
										x2="19.78"
										y2="4.22"
									/></svg
								>
							{:else}
								<svg
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg
								>
							{/if}
						</button>
					</li>
				</ul>
			</nav>
		</header>
	{/if}

	<main
		class="main"
		class:main--hero={$page.url.pathname === '/'}
		class:main--back={$page.url.pathname !== '/' && !isStandalone}
	>
		{@render children()}
	</main>

	{#if !isStandalone}
		{#if !['/contact', '/admin', '/logofolio'].includes($page.url.pathname) && !$page.url.pathname.startsWith('/blog') && !$page.url.pathname.startsWith('/work')}
			<div id="contact" class="animate-section" use:inView={{ threshold: 0.05 }}>
				<ContactSection />
			</div>
		{/if}

		<footer class="site-footer" class:article-view={$page.url.pathname.startsWith('/blog/')}>
			<div class="footer-massive footer-massive--nauryz">
				<div class="marquee-track">
					<span class="massive-text">DEFY THE DEFAULT ● YOUNIQUE DESIGN STUDIO ● &nbsp;</span>
					<span class="massive-text">DEFY THE DEFAULT ● YOUNIQUE DESIGN STUDIO ● &nbsp;</span>
					<span class="massive-text">DEFY THE DEFAULT ● YOUNIQUE DESIGN STUDIO ● &nbsp;</span>
					<span class="massive-text">DEFY THE DEFAULT ● YOUNIQUE DESIGN STUDIO ● &nbsp;</span>
				</div>
			</div>

			<div class="footer-inner">
				<div class="footer-main-grid">
					<div class="footer-brand-box">
						<img src="/assets/3_footer_logo.png" alt="Younique Logo" class="footer-logo" />
						<p class="footer-tagline">Pushing limits and<br />breaking patterns<br />since 2024.</p>
					</div>

					<div class="footer-links-container">
						<div class="footer-nav-block">
							<h4 class="nav-block-title">NAVIGATION</h4>
							<ul class="nav-list">
								<li><a href="/">Home</a></li>
								<li><a href="/#work">Work</a></li>
								<li><a href="/#about">About</a></li>
								<li><a href="/#damage">Stats</a></li>
							</ul>
						</div>
						<div class="footer-nav-block">
							<h4 class="nav-block-title">DISCOVER</h4>
							<ul class="nav-list">
								<li><a href="/#reviews">Reviews</a></li>
								<li><a href="/#blog">Blog</a></li>
								<li><a href="/#contact">Contact</a></li>
							</ul>
						</div>
					</div>
				</div>

				<div class="footer-bottom-bar">
					<div class="copy-text">
						&copy; {new Date().getFullYear()} YOUNIQUE STUDIO // ALL RIGHTS RESERVED
					</div>
				</div>
			</div>
		</footer>
	{/if}
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		background: var(--color-5);
		color: var(--color-3);
		overflow-x: hidden;
	}

	.app {
		display: flex;
		flex-direction: column;
	}

	@keyframes dropHeader {
		from {
			opacity: 0;
			transform: translateY(-20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.header {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 50;
		background: rgba(255, 250, 244, 0.85);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		box-shadow: 0 0 0 rgba(0, 0, 0, 0);
		animation: dropHeader 0.8s cubic-bezier(0.16, 1, 0.3, 1) backwards;
		transition:
			background 0.4s ease,
			box-shadow 0.4s ease,
			transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.header--hidden {
		transform: translateY(-100%);
	}

	:global(.dark) .header {
		background: rgba(61, 61, 61, 0.85);
	}

	.header.scrolled {
		background: var(--color-5);
		box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
	}

	:global(.dark) .header.scrolled {
		background: #3d3d3d;
		box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
	}

	.navbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1.5rem;
		padding: 1.25rem clamp(1rem, 4vw, 4rem);
		transition: padding 0.4s ease;
	}

	.brand {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		text-decoration: none;
		position: relative;
		z-index: 100;
		margin-left: -1rem; /* Nudged right as requested */
	}

	.brand-logo {
		height: 70px;
		aspect-ratio: 5 / 1;
		max-width: 100%;
		display: block;
		transition:
			height 0.4s cubic-bezier(0.16, 1, 0.3, 1),
			transform 0.3s ease;
		position: relative;
		-webkit-mask-image: url('/assets/2_site_logo.svg');
		mask-image: url('/assets/2_site_logo.svg');
		-webkit-mask-size: contain;
		mask-size: contain;
		-webkit-mask-repeat: no-repeat;
		mask-repeat: no-repeat;
		-webkit-mask-position: left center;
		mask-position: left center;
	}

	.header.scrolled .brand-logo {
		height: 55px;
	}

	.nav-links {
		list-style: none;
		display: flex;
		gap: 1.25rem;
		align-items: center;
		margin: 0;
		padding: 0;
	}

	.nav-link {
		text-decoration: none;
		color: var(--color-3);
		font-weight: 800;
		text-transform: uppercase;
		font-size: 0.95rem;
		font-family: var(--font-secondary);
		letter-spacing: 0.05em;
		transition:
			color 0.3s ease,
			transform 0.3s ease;
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem 0.85rem;
	}

	:global(.dark) .nav-link {
		color: #f4f4f4;
	}

	.nav-link:hover,
	.nav-link.active {
		color: var(--color-2);
		transform: translateY(-2px);
	}

	.nav-text {
		position: relative;
		display: inline-block;
	}

	.nav-text::after {
		content: '';
		position: absolute;
		bottom: -3px;
		left: 0;
		width: 100%;
		height: 2px;
		background: var(--color-1);
		transform: scaleX(0);
		transform-origin: center;
		transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.nav-link:hover .nav-text::after,
	.nav-link.active .nav-text::after {
		transform: scaleX(1);
	}

	.btn-contact {
		background: #fd5a03;
		color: #fff;
		padding: 0.65rem 1.6rem;
		border-radius: 999px;
		border: 3px solid #1c1c1c;
		font-weight: 900;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		text-decoration: none;
		box-shadow: 6px 6px 0 #1c1c1c;
		transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	.btn-contact:hover {
		transform: translate(-3px, -3px) rotate(-1deg);
		box-shadow: 9px 9px 0 #1c1c1c;
		filter: brightness(1.1);
	}

	.btn-contact:active {
		transform: translate(4px, 4px);
		box-shadow: 0px 0px 0 #1c1c1c;
		transition: all 0.1s ease; /* Snappier response for active state */
	}

	.theme-toggle {
		background: var(--color-2);
		border: 3px solid #1c1c1c;
		color: var(--color-5);
		width: 44px;
		height: 44px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
		box-shadow: 4px 4px 0 #1c1c1c;
	}

	:global(.dark) .theme-toggle {
		background: var(--color-1);
		color: #1c1c1c;
	}

	.main {
		position: relative;
	}

	.main--back {
		background: var(--color-5);
		padding-top: 120px;
	}

	/* Footer Styles */
	.site-footer {
		background: #1c1c1c;
		color: #fff;
		padding: 0 0 3rem;
		position: relative;
		overflow: hidden;
	}

	.footer-massive {
		background: #3d3d3d;
		padding: 3rem 0; /* Broad strip feel */
		border-top: none;
		border-bottom: 4px solid #000;
		overflow: hidden;
		margin-bottom: 4rem;
	}

	.footer-massive .massive-text {
		font-family: 'Nauryz', sans-serif;
		font-size: 4rem; /* Broad strip feel */
		color: #fff;
		text-transform: uppercase;
		letter-spacing: -0.02em;
	}

	.marquee-track {
		display: flex;
		animation: footerMarquee 40s linear infinite;
		white-space: nowrap;
	}

	.massive-text {
		font-family: 'Rubik Mono One', sans-serif;
		font-size: 1.5rem;
		color: #1c1c1c;
		padding-right: 2rem;
	}

	@keyframes footerMarquee {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(-50%);
		}
	}

	.footer-inner {
		max-width: 1400px;
		margin: 0 auto;
		padding: 0 2rem;
	}

	.footer-main-grid {
		display: grid;
		grid-template-columns: 1.5fr 1fr;
		gap: 4rem;
		margin-bottom: 4rem;
	}

	.footer-brand-box {
		display: flex;
		align-items: center;
		gap: 2.5rem;
		margin-bottom: 0;
	}

	.footer-logo {
		height: 180px; /* Increased footer logo size */
		width: auto;
		object-fit: contain;
		margin: 0;
		margin-left: -1rem;
		transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
		filter: none;
		opacity: 1;
	}

	.footer-logo:hover {
		transform: scale(1.03) translateX(-5px);
	}

	.footer-tagline {
		font-family: 'Space Mono', monospace;
		font-size: 1.35rem;
		font-weight: 700;
		margin: 0;
		line-height: 1.2;
		color: #f4f4f4;
	}

	.footer-links-container {
		display: flex;
		gap: 4rem;
	}

	.nav-block-title {
		font-family: 'Rubik Mono One', sans-serif;
		font-size: 0.9rem;
		margin-bottom: 1.5rem;
		color: var(--color-1);
	}

	.nav-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.nav-list li {
		margin-bottom: 0.75rem;
	}

	.nav-list a {
		text-decoration: none;
		color: #fff;
		font-weight: 700;
		font-size: 0.95rem;
		transition: color 0.3s ease;
	}

	.nav-list a:hover {
		color: var(--color-1);
	}

	.footer-bottom-bar {
		border-top: 1px solid rgba(255, 255, 255, 0.1);
		padding-top: 2rem;
		display: flex;
		justify-content: center;
		align-items: center;
	}
 
	.copy-text {
		font-size: 0.7rem;
		font-weight: 700;
		opacity: 0.5;
		text-align: center;
	}

	@media (max-width: 768px) {
		.main--back {
			padding-top: 180px;
		}
		.navbar {
			flex-direction: column;
			padding: 1rem;
		}
		.footer-main-grid {
			grid-template-columns: 1fr;
			gap: 3rem;
		}
		.footer-links-container {
			flex-direction: row;
			justify-content: center;
			gap: 3.5rem;
		}
		.footer-brand-box {
			flex-direction: column;
			align-items: center;
			text-align: center;
			gap: 1.5rem;
			width: 100%;
		}
		.footer-logo {
			margin-left: 0;
			height: 120px;
		}
		.footer-tagline {
			font-size: 1.1rem;
			max-width: 100%;
			white-space: normal;
			text-align: center;
		}
		.article-view .footer-logo {
			display: none;
		}

		/* Mobile Header Downsizing */
		.nav-links {
			gap: 0.5rem;
		}
		.nav-link {
			font-size: 0.72rem;
			padding: 0.35rem 0.45rem;
		}
		.nav-text::after {
			bottom: -2px;
			height: 2px;
		}
		.btn-contact {
			padding: 0.5rem 1.2rem;
			font-size: 0.75rem;
			box-shadow: 4px 4px 0 #1c1c1c;
		}
		.theme-toggle {
			width: 34px;
			height: 34px;
			box-shadow: 3px 3px 0 #1c1c1c;
		}
		.theme-toggle svg {
			width: 16px;
			height: 16px;
		}
	}
</style>
