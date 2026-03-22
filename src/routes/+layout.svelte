<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';

	let { children } = $props();

	let isDark = $state(false);
	let scrollY = $state(0);

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
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<svelte:window bind:scrollY />
<div class="app">
	<header class="header" class:scrolled={scrollY > 50}>
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
				<li><a class="nav-link" href="/#work">Work</a></li>
				<li><a class="nav-link" href="/#about">About</a></li>
				<li><a class="nav-link" href="/#blog">Blog</a></li>
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

	<main
		class="main"
		class:main--hero={$page.url.pathname === '/'}
		class:main--back={$page.url.pathname !== '/'}
	>
		{@render children()}
	</main>

	<footer class="site-footer">
		<div class="footer-massive">
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
					<p class="footer-tagline">Pushing limits and breaking patterns since 2024.</p>
				</div>
				
				<div class="footer-links-container">
					<div class="footer-nav-block">
						<h4 class="nav-block-title">NAVIGATION</h4>
						<ul class="nav-list">
							<li><a href="/">Home</a></li>
							<li><a href="/#work">Work</a></li>
							<li><a href="/#about">About</a></li>
							<li><a href="/#skills">Skills</a></li>
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
				<div class="footer-status">
					<span class="status-dot"></span> SYSTEM ONLINE
				</div>
			</div>
		</div>
	</footer>
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
		background: rgba(255, 250, 244, 0.85); /* Glass effect for visibility */
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		box-shadow: 0 0 0 rgba(0, 0, 0, 0);
		animation: dropHeader 0.8s cubic-bezier(0.16, 1, 0.3, 1) backwards;
		transition:
			background 0.4s ease,
			box-shadow 0.4s ease;
	}

	:global(.dark) .header {
		background: rgba(61, 61, 61, 0.85); /* Dark glass effect */
	}

	.header.scrolled {
		background: var(--color-5);
		box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
	}

	:global(.dark) .header.scrolled {
		background: #3d3d3d;
		box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
	}

	.header.scrolled .navbar {
		padding: 0.75rem clamp(1rem, 4vw, 4rem);
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
		margin-left: -2.5rem; /* Shifted further left */
	}

	.brand-logo {
		height: 70px; /* Reduced for PC */
		aspect-ratio: 5 / 1;
		max-width: 100%;
		display: block;
		transition:
			height 0.4s cubic-bezier(0.16, 1, 0.3, 1),
			transform 0.3s ease;
		position: relative;

		/* Mask properties */
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
		height: 55px; /* Clean shrink */
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
		font-size: 0.85rem;
		letter-spacing: 0.1em;
		transition: all 0.3s ease;
		position: relative;
		padding: 0.5rem 0;
	}

	:global(.dark) .nav-link {
		color: #f4f4f4;
	}

	.nav-link:hover {
		color: var(--color-2);
		transform: translateY(-2px);
	}

	.nav-link::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 2px;
		background: var(--color-1);
		transform: scaleX(0);
		transform-origin: right;
		transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.nav-link:hover::after {
		transform: scaleX(1);
		transform-origin: left;
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

	:global(.dark) .btn-contact {
		border-color: #1c1c1c;
		box-shadow: 6px 6px 0 #1c1c1c;
	}

	.btn-contact:hover {
		transform: translate(-3px, -3px) rotate(-1deg);
		box-shadow: 9px 9px 0 #1c1c1c;
		filter: brightness(1.1);
	}

	.btn-contact:active {
		transform: translate(-1px, -1px);
		box-shadow: 3px 3px 0 #1c1c1c;
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
		border-color: #1c1c1c;
		box-shadow: 4px 4px 0 #1c1c1c;
	}

	.theme-toggle:hover {
		transform: scale(1.1) rotate(15deg);
		box-shadow: 7px 7px 0 #1c1c1c;
	}

	.main {
		position: relative;
	}

	.main--back {
		background: var(--color-5);
		padding-top: 120px;
	}

	@media (max-width: 768px) {
		.main--back {
			padding-top: 180px;
		}
		.navbar {
			flex-direction: column;
			align-items: center;
			padding: 1rem;
			padding-bottom: 1.5rem;
			gap: 1rem;
		}
		.header.scrolled .navbar {
			padding: 0.75rem 1rem;
		}
		.brand {
			margin-left: 0; /* Reset desktop negative margin to prevent clipping off-screen */
		}
		.brand-logo {
			height: 50px;
			margin-bottom: 0;
		}
		.header.scrolled .brand-logo {
			height: 40px;
		}
		.nav-links {
			gap: 0.6rem 0.8rem;
			flex-wrap: wrap;
			justify-content: center;
			width: 100%;
		}
		.nav-link {
			font-size: 0.75rem;
			padding: 0.25rem 0.5rem;
		}
		.btn-contact {
			padding: 0.5rem 1rem;
			font-size: 0.75rem;
			box-shadow: 4px 4px 0 #1c1c1c;
		}
		.theme-toggle {
			width: 38px;
			height: 38px;
		}
		.theme-toggle svg {
			width: 16px;
			height: 16px;
		}
	}

	@media (max-width: 400px) {
		.brand-logo {
			height: 40px;
		}
		.header.scrolled .brand-logo {
			height: 32px;
		}
		.nav-links {
			gap: 0.4rem;
		}
		.nav-link {
			font-size: 0.7rem;
		}
	}
</style>
