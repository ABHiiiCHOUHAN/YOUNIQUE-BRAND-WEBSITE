<script>
	import KineticDecor from '$lib/components/KineticDecor.svelte';
	import WorkSection from '$lib/components/WorkSection.svelte';
	import AboutSection from '$lib/components/AboutSection.svelte';
	import BlogSection from '$lib/components/BlogSection.svelte';
	import ContactSection from '$lib/components/ContactSection.svelte';
	import { inView } from '$lib/actions/inView.js';

	let { data } = $props();

	let scrollY = $state(0);
	let scatter = $derived(Math.min(1, scrollY / 400));
	let activeSticker = $state(null);
	let isTripping = $state(false);
</script>

<svelte:window bind:scrollY />

<main class="neo-hero page-transition">
	<section class="hero-void">
		<div class="hero-bg"></div>
		<KineticDecor />
		
		{#if data.settings?.showStickers}
			<div class="stickers-container">
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
				<img
					class="sticker-flat sticker--1 {activeSticker === 1
						? 'is-active'
						: activeSticker !== null
							? 'is-inactive'
							: ''}"
					src="/assets/4_sticker_visual.png"
					alt="Visual Language Acquired"
					aria-hidden="true"
					onclick={() => (activeSticker = activeSticker === 1 ? null : 1)}
					style="--blur: calc({scatter} * 8px); transform: translate(calc({scatter} * -120px), calc({scatter} * -100px)) rotate(calc(12deg + {scrollY *
						0.05}deg)) scale(calc((1 + {scatter} * 0.5) * var(--active-scale, 1)));"
				/>

				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
				<img
					class="sticker-flat sticker--2 {activeSticker === 2
						? 'is-active'
						: activeSticker !== null
							? 'is-inactive'
							: ''}"
					src="/assets/5_sticker_globe.png"
					alt="Digital Presence Established"
					aria-hidden="true"
					onclick={() => (activeSticker = activeSticker === 2 ? null : 2)}
					style="--blur: calc({scatter} * 12px); transform: translate(calc({scatter} * 150px), calc({scatter} * -80px)) rotate(calc(-8deg + {scrollY *
						-0.08}deg)) scale(calc((1 + {scatter} * 0.4) * var(--active-scale, 1)));"
				/>

				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
				<img
					class="sticker-flat sticker--3 {activeSticker === 3
						? 'is-active'
						: activeSticker !== null
							? 'is-inactive'
							: ''}"
					src="/assets/6_sticker_branding.png"
					alt="Branding Completed"
					aria-hidden="true"
					onclick={() => (activeSticker = activeSticker === 3 ? null : 3)}
					style="--blur: calc({scatter} * 10px); transform: translate(calc({scatter} * -60px), calc({scatter} * 150px)) rotate(calc(-5deg + {scrollY *
						0.06}deg)) scale(calc((1 + {scatter} * 0.8) * var(--active-scale, 1)));"
				/>

				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
				<img
					class="sticker-flat sticker--4 {activeSticker === 4
						? 'is-active'
						: activeSticker !== null
							? 'is-inactive'
							: ''}"
					src="/assets/7_sticker_framework.png"
					alt="Content Framework"
					aria-hidden="true"
					onclick={() => (activeSticker = activeSticker === 4 ? null : 4)}
					style="--blur: calc({scatter} * 5px); transform: translate(calc({scatter} * -180px), calc({scatter} * 60px)) rotate(calc(-12deg + {scrollY *
						-0.09}deg)) scale(calc((1 + {scatter} * 0.6) * var(--active-scale, 1)));"
				/>

				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
				<img
					class="sticker-flat sticker--5 {activeSticker === 5
						? 'is-active'
						: activeSticker !== null
							? 'is-inactive'
							: ''}"
					src="/assets/8_sticker_creator.png"
					alt="Original Content Creator"
					aria-hidden="true"
					onclick={() => (activeSticker = activeSticker === 5 ? null : 5)}
					style="--blur: calc({scatter} * 15px); transform: translate(calc({scatter} * 180px), calc({scatter} * 160px)) rotate(calc(18deg + {scrollY *
						0.1}deg)) scale(calc((1 + {scatter} * 0.3) * var(--active-scale, 1)));"
				/>
			</div>
		{/if}

		<div class="hero-void__content">
			<div class="hero-title-group">
				<!-- Decorative elements (Refined Layering & Randomness) -->
				<!-- Big Constant Elements (Consolidated to one behind D) -->

				<div class="box-defy">
					<div class="hero-deco deco-big-sun is-constant pc-d-sun" style="--deco-url: url('/assets/hero-kinetic-elements/sun-rectangle.svg'); --deco-color: var(--color-sun); --deco-size: clamp(180px, 22vw, 260px);"></div>
					<svg class="trim-path-svg"><rect rx="4" class="trim-path-rect" /></svg>
					<span class="kinetic-char loop-1" style="--rot: -8; --color: #A855F7; --f1: var(--kinetic-font-1); --f2: var(--kinetic-font-2); --f3: var(--kinetic-font-3)" data-char="D">D</span><span class="kinetic-char loop-4" style="--rot: 5; --color: #EC4899; --f1: var(--kinetic-font-4); --f2: var(--kinetic-font-5); --f3: var(--kinetic-font-6)" data-char="E">E</span><span class="kinetic-char loop-3" style="--rot: -3; --color: #FACC15; --f1: var(--kinetic-font-2); --f2: var(--kinetic-font-4); --f3: var(--kinetic-font-1)" data-char="F">F</span><span class="kinetic-char loop-2" style="--rot: 10; --color: #0EA5E9; --f1: var(--kinetic-font-6); --f2: var(--kinetic-font-3); --f3: var(--kinetic-font-5)" data-char="Y">Y</span>
				</div>
				<div class="the-group">
					<div class="hero-deco deco-big-explosion is-constant-slow" style="--deco-url: url('/assets/hero-kinetic-elements/explosion.svg'); --deco-color: var(--color-explosion); --deco-size: clamp(200px, 28vw, 300px);"></div>
					<span class="text-the">THE</span>
				</div>
				<div class="default-group">
					<div class="box-default" style="white-space: nowrap;">
						<svg class="trim-path-svg"><rect rx="4" class="trim-path-rect" /></svg>
						<span class="kinetic-char loop-3" style="--rot: -5; --color: #EC4899; --f1: var(--kinetic-font-5); --f2: var(--kinetic-font-3); --f3: var(--kinetic-font-2)" data-char="D">D</span><span class="kinetic-char loop-4" style="--rot: 8; --color: #A855F7; --f1: var(--kinetic-font-2); --f2: var(--kinetic-font-3); --f3: var(--kinetic-font-5)" data-char="E">E</span><span class="kinetic-char loop-1" style="--rot: -12; --color: #EC4899; --f1: var(--kinetic-font-4); --f2: var(--kinetic-font-6); --f3: var(--kinetic-font-1)" data-char="F">F</span><span class="kinetic-char loop-3" style="--rot: 4; --color: #FACC15; --f1: var(--kinetic-font-5); --f2: var(--kinetic-font-2); --f3: var(--kinetic-font-4)" data-char="A">A</span><span class="kinetic-char loop-4" style="--rot: -6; --color: #0EA5E9; --f1: var(--kinetic-font-3); --f2: var(--kinetic-font-1); --f3: var(--kinetic-font-2)" data-char="U">U</span><span class="kinetic-char loop-2" style="--rot: 15; --color: #2DD4BF; --f1: var(--kinetic-font-6); --f2: var(--kinetic-font-5); --f3: var(--kinetic-font-3)" data-char="L">L</span><span class="kinetic-char loop-1" style="--rot: -9; --color: #A855F7; --f1: var(--kinetic-font-1); --f2: var(--kinetic-font-3); --f3: var(--kinetic-font-6)" data-char="T">T</span>
					</div>
					<div class="punctuation-group">
						<span class="kinetic-char loop-3" style="--rot: 4; --color: #FFF602; --f1: var(--kinetic-font-1); --f2: var(--kinetic-font-3); --f3: var(--kinetic-font-5)" data-char=".">.</span><span class="blinking-cursor"></span>
					</div>
				</div>
			</div>
			<p class="hero-subtext">
				WE DON’T DO THE SAME. WE CRAFT <em>VISUAL IDENTITIES</em>, DIGITAL SPACES, AND 
				<mark>STRUCTURED CHAOS</mark> THAT ACTUALLY MAKES PEOPLE STOP SCROLLING.
			</p>

			<div class="hero-cta">
				<a class="btn btn--solid" href="#work">See the work</a>
				<a class="btn btn--ghost" href="#contact">Let’s talk</a>
			</div>
		</div>
	</section>

	<div id="work" class="animate-section" use:inView={{ threshold: 0.05 }}>
		<WorkSection projects={data?.projects} />
	</div>

	<div id="about" class="animate-section" use:inView={{ threshold: 0.05 }}>
		<AboutSection aboutBoxes={data?.about} />
	</div>

	<div id="blog" class="animate-section" use:inView={{ threshold: 0.05 }}>
		<BlogSection postsPromise={Promise.resolve(data?.posts || [])} />
	</div>

	<div id="contact" class="animate-section" use:inView={{ threshold: 0.05 }}>
		<ContactSection />
	</div>
</main>

<style>
	/* --- 2. LAYOUT --- */
	.neo-hero {
		display: flex;
		flex-direction: column;
		position: relative;
	}

	.hero-void {
		color: var(--color-5);
		padding: calc(6rem + 80px) 4rem 10rem; /* Shifted up while keeping clearance */
		position: relative;
		z-index: 2;
		min-height: 95vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center; /* keep horizontal centering as base */
	}

	.hero-bg {
		position: absolute;
		inset: 0;
		background-color: var(--color-3);
		background-image: url('/assets/1_hero_bg.png');
		background-size: cover;
		background-position: center;
		z-index: -1;
	}

	.hero-void__content {
		max-width: 800px;
		width: 100%;
		margin: 0 auto;
		transform: translateX(-8%); /* Shifted slightly right (less left) */
		position: relative;
		z-index: 10;
	}

	/* --- STICKERS --- */
	.stickers-container {
		position: absolute;
		inset: 0; /* Removed top gap */
		pointer-events: none;
		z-index: 2;
		overflow: hidden;
	}

	.sticker-flat {
		position: absolute;
		/* Basic drop shadow + dynamic blur */
		filter: drop-shadow(2px 2px 0px var(--color-3)) blur(var(--blur, 0px));
		will-change: transform, filter;
		cursor: pointer;
		transition:
			transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
			z-index 0s;
	}

	.sticker-flat.is-active {
		--active-scale: 1.35;
		z-index: 50 !important;
	}

	.sticker-flat.is-inactive {
		--active-scale: 0.8;
		opacity: 0.8;
	}

	/* Base Pile Positions (Spread out on the right side) */
	.sticker--1 {
		top: 15%;
		right: 28%;
		z-index: 1;
		width: 120px;
	}
	.sticker--2 {
		top: 20%;
		right: 10%;
		z-index: 2;
		width: 140px;
	}
	.sticker--3 {
		top: 35%;
		right: 18%;
		z-index: 3;
		width: 160px;
	}
	.sticker--4 {
		top: 48%;
		right: 28%;
		z-index: 4;
		width: 130px;
	}
	.sticker--5 {
		top: 55%;
		right: 12%;
		z-index: 5;
		width: 100px;
	}

	/* --- 3. TYPOGRAPHY --- */
	.hero-title-group,
	.hero-subtext {
		text-rendering: geometricPrecision;
	}

	.hero-title-group {
		--base-text: #f4f4f4;
		font-family: var(--font-erica);
		font-weight: normal;
		line-height: 0.9;
		margin: 0 0 3rem 0;
		color: var(--base-text);
		letter-spacing: -0.02em;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		position: relative;
		/* Theme-aware Hero Box Variables */
		--hero-box-bg: rgba(0, 0, 0, 0.4); /* Dark transparent in white mode */
		--hero-char-color: #f4f4f4;
		/* Light mode: the text = yellow, sun rect = dark charcoal, explosion = teal */
		--color-the: #FACC15;
		--color-sun: #063C53; /* Dark teal from user reference */
		--color-explosion: #7ED9CC;
	}

	:global(.dark) .hero-title-group {
		--base-text: #3d3d3d;
		--hero-box-bg: rgba(255, 255, 255, 0.4); /* Transparent in dark mode */
		--hero-char-color: #3d3d3d;
		/* Dark mode Defaults */
		--color-the: #FAF7F5;
		--color-sun: #FAF7F5;
		--color-explosion: #FFD670;
	}

	.box-defy {
		font-size: clamp(4rem, 12vw, 9rem);
		border: clamp(3px, 0.4vw, 5px) solid transparent; /* Invis placeholder for layout */
		padding: 0.25em 0.3em 0.1em; /* More top padding to push text lower in box */
		transform: rotate(-10deg) translateY(18px); /* Slightly more down */
		margin-bottom: 0.5rem;
		margin-left: 12%; /* Shifted more to the right */
		background: transparent;
		display: inline-block;
		position: relative;
	}

	.box-defy,
	.box-default,
	.punctuation-group {
		z-index: 5;
		--char-base-color: var(--hero-char-color);
	}

	.the-group {
		position: relative;
		margin: -0.5rem 0 -0.5rem 60%; /* Positioned further right */
		z-index: 3; /* Lower than DEFY (5) and DEFAULT (5) to stay behind */
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.text-the {
		font-family: var(--font-nauryz);
		font-size: clamp(3.5rem, 9vw, 7rem);
		color: var(--color-the);
		line-height: 1;
		position: relative;
		z-index: 2;
		-webkit-text-stroke: 1.5px #000;
		text-shadow: 5px 5px 0 #000;
	}

	.default-group {
		display: flex;
		align-items: flex-end;
		gap: 0.5rem;
		margin-left: 5%; /* Slight indent as seen in wireframe */
	}

	.box-default {
		font-size: clamp(3rem, 10vw, 8rem);
		border: clamp(3px, 0.4vw, 5px) solid transparent; /* Invis placeholder */
		padding: 0.25em 0.3em 0.1em; /* More top padding to push text lower in box */
		background: transparent;
		display: inline-block;
		position: relative;
	}

	.punctuation-group {
		font-size: clamp(3rem, 10vw, 8rem);
		display: flex;
		align-items: baseline;
	}

	/* --- SVG TRIM PATH (ALWAYS ON) --- */
	.trim-path-svg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		overflow: visible;
	}

	.trim-path-rect {
		width: 100%;
		height: 100%;
		fill: none;
		stroke: var(--base-text);
		stroke-width: clamp(3px, 0.4vw, 5px);
		stroke-dasharray: 40 15 15 15; /* Long dash, gap, short dash, gap */
		/* Path length is roughly the perimeter, dashoffset moves it */
		animation: dashTravel 3s linear infinite;
	}

	@keyframes dashTravel {
		from { stroke-dashoffset: 0; }
		to { stroke-dashoffset: -85; } /* Matches total dasharray sum for loop */
	}

	/* --- DECORATIVE ELEMENTS --- */
	.hero-deco {
		position: absolute;
		pointer-events: none;
		z-index: 1; /* Explicitly behind boxes */
		width: var(--deco-size, 30px);
		height: var(--deco-size, 30px);
		background-color: var(--deco-color, #fff);
		-webkit-mask-image: var(--deco-url);
		mask-image: var(--deco-url);
		-webkit-mask-size: contain;
		mask-size: contain;
		-webkit-mask-repeat: no-repeat;
		mask-repeat: no-repeat;
		opacity: 0;
		/* Neo-brutal shadow */
		filter: drop-shadow(4px 4px 0px rgba(0,0,0,0.8));
		transition: opacity 0.3s ease;
	}

	.hero-deco.is-constant {
		opacity: 0.9;
		animation: rotateDeco 25s linear infinite;
	}

	/* Big Elements (Persistent & Rotating) */
	.deco-big-sun {
		top: -10%;
		left: 12%;
		z-index: -1; /* Even further back */
	}

	.pc-d-sun {
		position: absolute !important;
		top: 50% !important;
		left: 0% !important;
		transform-origin: center center !important;
		animation: rotateSunOffset 25s linear infinite !important;
		z-index: -1 !important;
	}

	@keyframes rotateSunOffset {
		from { transform: var(--sun-translate, translate(-30%, -50%)) rotate(0deg); }
		to { transform: var(--sun-translate, translate(-30%, -50%)) rotate(360deg); }
	}

	.deco-big-explosion {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: -1; /* Behind THE text locally */
		pointer-events: none;
	}

	.hero-deco.is-constant-slow {
		opacity: 0.9;
		animation: rotateDecoCCW 45s linear infinite;
	}

	@keyframes popOutCycle {
		0%, 100% { transform: scale(0); opacity: 0; }
		10%, 80% { transform: scale(1); opacity: 0.9; }
		90% { transform: scale(0); opacity: 0; }
	}

	@keyframes rotateDeco {
		from { rotate: 0deg; }
		to { rotate: 360deg; }
	}

	@keyframes rotateDecoCCW {
		from { transform: translate(-50%, -50%) rotate(0deg); }
		to { transform: translate(-50%, -50%) rotate(-360deg); }
	}

	.box-defy,
	.box-default {
		z-index: 5; /* Ensure boxes sit on top of deco */
	}

	.kinetic-char {
		display: inline-block;
		position: relative;
		color: transparent !important; /* Keeps layout absolutely stable */
		user-select: none;
	}

	.kinetic-char::before {
		content: attr(data-char);
		position: absolute;
		inset: 0;
		color: var(--char-base-color, var(--base-text));
		font-family: inherit;
		transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
		display: flex;
		align-items: center;
		justify-content: center;
		transform-origin: center;
		pointer-events: none;
		-webkit-text-stroke: 1.5px #000;
		text-shadow: 5px 5px 0 #000;
	}

	.kinetic-char:hover::before {
		transform: translateY(-8px) scale(0.95) rotate(calc(var(--rot, 0) * 1deg)) !important;
		color: var(--color, #FFF) !important;
		font-family: var(--f1, inherit) !important;
	}

	/* Random infinite glitch animations on pseudo-elements (Cycling through 3 fonts) */
	@keyframes pulseKinetic1 {
		0%, 78% { transform: none; font-family: inherit; color: var(--char-base-color, var(--base-text)); }
		80% { transform: translateY(-3px) scale(0.95) rotate(calc(var(--rot) * 0.8deg)); font-family: var(--f1); color: var(--color); }
		85% { transform: translateY(-2px) rotate(calc(var(--rot) * -0.5deg)); font-family: var(--f2); }
		90% { transform: translateY(-4px) scale(1.05) rotate(calc(var(--rot) * 1.2deg)); font-family: var(--f3); }
		100% { transform: none; font-family: inherit; color: var(--char-base-color, var(--base-text)); }
	}
	@keyframes pulseKinetic2 {
		0%, 82% { transform: none; font-family: inherit; color: var(--char-base-color, var(--base-text)); }
		84% { transform: translateY(4px) scale(0.9) rotate(calc(var(--rot) * -1deg)); font-family: var(--f2); color: var(--color); filter: hue-rotate(90deg); }
		88% { transform: translateY(2px) rotate(calc(var(--rot) * 0.5deg)); font-family: var(--f3); }
		92% { transform: translateY(5px) scale(0.95) rotate(calc(var(--rot) * -0.8deg)); font-family: var(--f1); }
		100% { transform: none; font-family: inherit; color: var(--char-base-color, var(--base-text)); }
	}
	@keyframes pulseKinetic3 {
		0%, 85% { transform: none; font-family: inherit; color: var(--char-base-color, var(--base-text)); }
		87% { transform: translateY(-2px) scale(1.05) rotate(calc(var(--rot) * 1.5deg)); font-family: var(--f3); color: var(--color); }
		91% { transform: translateY(-1px) rotate(calc(var(--rot) * -1deg)); font-family: var(--f1); }
		95% { transform: translateY(-3px) scale(0.9) rotate(calc(var(--rot) * 1.2deg)); font-family: var(--f2); }
		100% { transform: none; font-family: inherit; color: var(--char-base-color, var(--base-text)); }
	}
	@keyframes pulseKinetic4 {
		0%, 88% { transform: none; font-family: inherit; color: var(--char-base-color, var(--base-text)); }
		90% { transform: scale(0.85) rotate(calc(var(--rot) * -0.5deg)); font-family: var(--f1); color: var(--color); }
		94% { transform: scale(1.1) rotate(calc(var(--rot) * 0.8deg)); font-family: var(--f2); }
		98% { transform: scale(0.95) rotate(calc(var(--rot) * -1.2deg)); font-family: var(--f3); }
		100% { transform: none; font-family: inherit; color: var(--char-base-color, var(--base-text)); }
	}

	/* Randomly staggered, holding for ~2s */
	.loop-1::before { animation: pulseKinetic1 9s infinite 0.1s; }
	.loop-2::before { animation: pulseKinetic2 11s infinite 2.5s; }
	.loop-3::before { animation: pulseKinetic3 13s infinite 1.2s; }
	.loop-4::before { animation: pulseKinetic4 17s infinite 0.7s; }

	.hero-subtext {
		font-family: var(--font-secondary);
		font-size: clamp(1.1rem, 2.5vw, 1.4rem);
		line-height: 1.4;
		max-width: 650px;
		opacity: 0.9;
		margin: 0 auto 2.5rem;
		color: #3d3d3d;
		font-weight: 500;
		text-align: center;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.hero-subtext em {
		font-style: italic;
		font-weight: 800;
		color: var(--color-3);
	}

	.hero-subtext mark {
		background: var(--color-1); /* Using existing theme vibrant yellow */
		color: #000;
		padding: 0 0.3rem;
		font-weight: 800;
	}

	:global(.dark) .hero-subtext {
		color: #f4f4f4;
	}
	:global(.dark) .hero-subtext em {
		color: #f4f4f4;
	}
	:global(.dark) .hero-subtext mark {
		color: #000; /* Keep it dark on bright color */
	}

	.blinking-cursor {
		display: inline-block;
		width: 0.12em;
		height: 0.85em;
		background-color: var(--color-1); /* Vibrant Yellow */
		vertical-align: baseline;
		animation: blink 1.2s step-end infinite;
		transform: translateY(2px);
		border-radius: 2px;
	}

	@keyframes blink {
		0%, 100% { opacity: 1; }
		50% { opacity: 0; }
	}



	:global(.dark) .hero-subtext {
		color: #f4f4f4;
	}

	/* --- 4. COMPONENTS: BUTTONS --- */
	.hero-cta {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		justify-content: center; /* Centered content */
		margin: 0 auto;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		text-decoration: none;
		font-weight: 800;
		letter-spacing: 0.02em;
		border-radius: 999px; /* pill shape */
		padding: 0.8rem 1.8rem;
		border: 3px solid var(--color-3); /* bold outline */
		transition: all 0.2s cubic-bezier(0.25, 1, 0.5, 1);
		cursor: pointer;
		box-shadow: 4px 4px 0px var(--color-3); /* hard shadow */
		font-family: inherit;
	}

	.btn:active {
		transform: translate(4px, 4px) !important;
		box-shadow: 0px 0px 0px var(--color-3) !important;
	}

	.btn--solid {
		background: var(--color-1); /* vibrant primary */
		color: var(--color-3);
	}

	.btn--solid:hover,
	.btn--solid:focus-visible {
		transform: translate(-4px, -4px);
		box-shadow: 8px 8px 0px var(--color-3);
		outline: none;
	}

	.btn--ghost {
		background: var(--color-5); /* base background */
		color: var(--color-3);
	}

	.btn--ghost:hover,
	.btn--ghost:focus-visible {
		transform: translate(-4px, -4px);
		box-shadow: 8px 8px 0px var(--color-3);
		outline: none;
	}

	/* Neo-brutalist dark mode */
	:global(.dark) .btn {
		border-color: var(--color-5);
		box-shadow: 4px 4px 0px var(--color-5);
		color: #3d3d3d;
	}
	:global(.dark) .btn:active {
		box-shadow: 0px 0px 0px var(--color-5) !important;
	}
	
	:global(.dark) .btn--solid {
		background: var(--color-1); 
		color: #3d3d3d; /* keep dark text for readability on bright color */
	}
	:global(.dark) .btn--solid:hover,
	:global(.dark) .btn--solid:focus-visible {
		box-shadow: 8px 8px 0px var(--color-5);
	}

	:global(.dark) .btn--ghost {
		background: var(--color-3);
		color: var(--color-5);
	}
	:global(.dark) .btn--ghost:hover,
	:global(.dark) .btn--ghost:focus-visible {
		box-shadow: 8px 8px 0px var(--color-5);
	}

	/* Media queries */
	@media (max-width: 768px) {
		.hero-void {
			padding: calc(14rem + 80px) 1.5rem 8rem; /* Pushed whole block down more */
			min-height: 100vh; /* Set to full viewport height to prevent gaps */
			overflow: hidden; 
		}
		.stickers-container {
			inset: 0;
		}
		.hero-bg {
			background-size: cover;
			background-position: center center; /* Reset to center to ensure no edges are visible */
		}
		.hero-void__content {
			transform: translateX(-4%); /* Brought closer to horizontal center */
		}
		.hero-title-group {
			align-items: center;
			margin-bottom: 2rem; /* Reverted to smaller gap to keep items grouped */
		}
		.the-group {
			margin: -0.5rem 0 -0.5rem 35%; /* Slightly adjusted shift */
		}
		.the-group .text-the {
			font-size: clamp(2.5rem, 7vw, 5rem); /* Smaller "THE" on mobile */
			text-shadow: 3px 3px 0 #000;
			-webkit-text-stroke: 1px #000;
		}
		.box-defy {
			margin-left: -5%; /* Pull DEFY slightly to the left on mobile */
			transform: rotate(-10deg) translateY(5px);
		}
		.default-group {
			margin-left: 5%; /* Shift DEFAULT slightly to the right on mobile */
		}
		.kinetic-char::before {
			text-shadow: 3px 3px 0 #000;
			-webkit-text-stroke: 1px #000;
		}
		.hero-subtext {
			font-size: 0.95rem; /* Smaller subtext on mobile */
			margin-top: 5rem; /* Pushes subtext down specifically */
			margin-bottom: 2.5rem;
			color: #3d3d3d;
			font-weight: 600;
			line-height: 1.4;
		}
		.hero-cta {
			flex-direction: column;
			gap: 1.25rem;
			width: 100%;
			max-width: 280px;
			margin: 0 auto;
		}
		.hero-cta .btn {
			width: 100%;
			text-align: center;
		}
		.sticker--1 {
			width: 80px;
			top: 15%;
			right: 12%;
			transform: rotate(-12deg);
			z-index: 5;
		}
		/* Show sun on mobile but smaller */
		.box-defy .deco-big-sun.pc-d-sun {
			--deco-size: 100px !important;
			--sun-translate: translate(-20%, -50%); /* Specific offset for mobile */
			transform-origin: center center !important;
			animation: rotateSunOffset 25s linear infinite !important;
		}
		/* Keep explosion at original mobile size */
		.the-group .deco-big-explosion {
			--deco-size: clamp(120px, 18vw, 180px) !important;
		}
		.sticker--2 {
			width: 90px;
			top: 12%;
			right: 2%;
			transform: rotate(15deg);
			z-index: 4;
		}
		.sticker--3 {
			display: block;
			width: 95px;
			top: 18%;
			right: 5%;
			transform: rotate(-5deg);
			z-index: 3;
		}
		.sticker--4 {
			display: block;
			width: 85px;
			top: 23%;
			right: 10%;
			transform: rotate(10deg);
			z-index: 2;
		}
		.sticker--5 {
			width: 75px;
			top: 16%;
			right: -1%;
			transform: rotate(-20deg);
			z-index: 1;
		}
	}

	/* --- 5. SCROLL ANIMATIONS --- */
	.animate-section {
		scroll-margin-top: 120px; /* Fix Sticky header offset overlap */
		opacity: 0;
		transform: translateY(40px);
		transition:
			opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
			transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
		will-change: opacity, transform;
	}

	#work {
		scroll-margin-top: 80px;
	}

	:global(.animate-section.is-visible) {
		opacity: 1;
		transform: translateY(0);
	}

	@media (max-width: 768px) {
		.animate-section {
			scroll-margin-top: 100px;
		}
	}
</style>
