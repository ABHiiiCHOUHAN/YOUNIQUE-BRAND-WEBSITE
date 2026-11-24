<script>
	import '$lib/styles/fonts/home.css';
	import KineticDecor from '$lib/components/KineticDecor.svelte';
	import WorkSection from '$lib/components/WorkSection.svelte';
	import SkillsSection from '$lib/components/SkillsSection.svelte';
	import AboutSection from '$lib/components/AboutSection.svelte';
	import ReviewsSection from '$lib/components/ReviewsSection.svelte';
	import BlogSection from '$lib/components/BlogSection.svelte';
	import { inView } from '$lib/actions/inView.js';

	let { data } = $props();

	let scrollY = $state(0);
	let isTripping = $state(false);
</script>

<svelte:window bind:scrollY />

<main class="neo-hero page-transition">
	<section class="hero-void">
		<div class="hero-bg"></div>
		<KineticDecor />

		<div class="hero-void__content">
			<div class="hero-title-group">
				<!-- Decorative elements (Refined Layering & Randomness) -->
				<!-- Big Constant Elements (Consolidated to one behind D) -->

				<div class="box-defy">
					<div
						class="hero-deco deco-big-sun is-constant pc-d-sun"
						style="--deco-url: url('/assets/hero-kinetic-elements/sun-rectangle.svg'); --deco-color: var(--color-sun); --deco-size: clamp(180px, 22vw, 260px);"
					></div>
					<svg class="trim-path-svg"><rect rx="4" class="trim-path-rect" /></svg>
					<span
						class="kinetic-char loop-1"
						style="--rot: -8; --color: #A855F7; --f1: var(--kinetic-font-1); --f2: var(--kinetic-font-2); --f3: var(--kinetic-font-3)"
						data-char="D">D</span
					><span
						class="kinetic-char loop-4"
						style="--rot: 5; --color: #EC4899; --f1: var(--kinetic-font-4); --f2: var(--kinetic-font-5); --f3: var(--kinetic-font-6)"
						data-char="E">E</span
					><span
						class="kinetic-char loop-3"
						style="--rot: -3; --color: #FACC15; --f1: var(--kinetic-font-2); --f2: var(--kinetic-font-4); --f3: var(--kinetic-font-1)"
						data-char="F">F</span
					><span
						class="kinetic-char loop-2"
						style="--rot: 10; --color: #0EA5E9; --f1: var(--kinetic-font-6); --f2: var(--kinetic-font-3); --f3: var(--kinetic-font-5)"
						data-char="Y">Y</span
					>
				</div>
				<div class="the-group">
					<div
						class="hero-deco deco-big-explosion is-constant-slow"
						style="--deco-url: url('/assets/hero-kinetic-elements/explosion.svg'); --deco-color: var(--color-explosion); --deco-size: clamp(200px, 28vw, 300px);"
					></div>
					<span class="text-the">THE</span>
				</div>
				<div class="default-group">
					<div class="box-default" style="white-space: nowrap;">
						<svg class="trim-path-svg"><rect rx="4" class="trim-path-rect" /></svg>
						<span
							class="kinetic-char loop-3"
							style="--rot: -5; --color: #EC4899; --f1: var(--kinetic-font-5); --f2: var(--kinetic-font-3); --f3: var(--kinetic-font-2)"
							data-char="D">D</span
						><span
							class="kinetic-char loop-4"
							style="--rot: 8; --color: #A855F7; --f1: var(--kinetic-font-2); --f2: var(--kinetic-font-3); --f3: var(--kinetic-font-5)"
							data-char="E">E</span
						><span
							class="kinetic-char loop-1"
							style="--rot: -12; --color: #EC4899; --f1: var(--kinetic-font-4); --f2: var(--kinetic-font-6); --f3: var(--kinetic-font-1)"
							data-char="F">F</span
						><span
							class="kinetic-char loop-3"
							style="--rot: 4; --color: #FACC15; --f1: var(--kinetic-font-5); --f2: var(--kinetic-font-2); --f3: var(--kinetic-font-4)"
							data-char="A">A</span
						><span
							class="kinetic-char loop-4"
							style="--rot: -6; --color: #0EA5E9; --f1: var(--kinetic-font-3); --f2: var(--kinetic-font-1); --f3: var(--kinetic-font-2)"
							data-char="U">U</span
						><span
							class="kinetic-char loop-2"
							style="--rot: 15; --color: #2DD4BF; --f1: var(--kinetic-font-6); --f2: var(--kinetic-font-5); --f3: var(--kinetic-font-3)"
							data-char="L">L</span
						><span
							class="kinetic-char loop-1"
							style="--rot: -9; --color: #A855F7; --f1: var(--kinetic-font-1); --f2: var(--kinetic-font-3); --f3: var(--kinetic-font-6)"
							data-char="T">T</span
						>
					</div>
					<div class="punctuation-group">
						<span
							class="kinetic-char loop-3"
							style="--rot: 4; --color: #FFF602; --f1: var(--kinetic-font-1); --f2: var(--kinetic-font-3); --f3: var(--kinetic-font-5)"
							data-char=".">.</span
						><span class="blinking-cursor"></span>
					</div>
				</div>
			</div>
			<p class="hero-subtext">
				We do things differently—crafting visual identities and digital spaces that actually stop
				the scroll.
			</p>

			<div class="hero-cta">
				<a class="btn btn--solid" href="#work">See the work</a>
				<a class="btn btn--ghost" href="#contact">Let’s talk</a>
			</div>
		</div>
	</section>

	<div id="work" use:inView={{ threshold: 0.05 }}>
		<WorkSection projects={data?.projects} />
	</div>

	<div id="skills" use:inView={{ threshold: 0.05 }}>
		<SkillsSection />
	</div>

	<div id="reviews" use:inView={{ threshold: 0.05 }}>
		<ReviewsSection />
	</div>

	<div id="blog" use:inView={{ threshold: 0.05 }}>
		<BlogSection postsPromise={Promise.resolve(data?.posts || [])} />
	</div>

	<div id="about" use:inView={{ threshold: 0.05 }}>
		<AboutSection aboutBoxes={data?.about} />
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
		background-image: url('/assets/BG 2.avif');
		background-size: cover;
		background-position: center;
		z-index: -1;
	}

	:global(.dark) .hero-bg {
		filter: brightness(0.3);
	}

	.hero-void__content {
		max-width: 800px;
		width: 100%;
		margin: 0 auto;
		transform: translateX(-8%); /* Shifted slightly right (less left) */
		position: relative;
		z-index: 10;
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
		--color-the: #facc15;
		--color-sun: #3d3d3d; /* Dark charcoal */
		--color-explosion: #7ed9cc;
	}

	:global(.dark) .hero-title-group {
		--base-text: #faf7f5;
		--hero-box-bg: rgba(255, 255, 255, 0.1); 
		--hero-char-color: #faf7f5;
		/* Dark mode Defaults */
		--color-the: #e2e2e2;
		--color-sun: #faf7f5;
		--color-explosion: #ffd670;
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
		from {
			stroke-dashoffset: 0;
		}
		to {
			stroke-dashoffset: -85;
		} /* Matches total dasharray sum for loop */
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
		filter: drop-shadow(4px 4px 0px rgba(0, 0, 0, 0.8));
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
		from {
			transform: var(--sun-translate, translate(-30%, -50%)) rotate(0deg);
		}
		to {
			transform: var(--sun-translate, translate(-30%, -50%)) rotate(360deg);
		}
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
		0%,
		100% {
			transform: scale(0);
			opacity: 0;
		}
		10%,
		80% {
			transform: scale(1);
			opacity: 0.9;
		}
		90% {
			transform: scale(0);
			opacity: 0;
		}
	}

	@keyframes rotateDeco {
		from {
			rotate: 0deg;
		}
		to {
			rotate: 360deg;
		}
	}

	@keyframes rotateDecoCCW {
		from {
			transform: translate(-50%, -50%) rotate(0deg);
		}
		to {
			transform: translate(-50%, -50%) rotate(-360deg);
		}
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
		color: var(--color, #fff) !important;
		font-family: var(--f1, inherit) !important;
	}

	/* Random infinite glitch animations on pseudo-elements (Cycling through 3 fonts) */
	@keyframes pulseKinetic1 {
		0%,
		78% {
			transform: none;
			font-family: inherit;
			color: var(--char-base-color, var(--base-text));
		}
		80% {
			transform: translateY(-3px) scale(0.95) rotate(calc(var(--rot) * 0.8deg));
			font-family: var(--f1);
			color: var(--color);
		}
		85% {
			transform: translateY(-2px) rotate(calc(var(--rot) * -0.5deg));
			font-family: var(--f2);
		}
		90% {
			transform: translateY(-4px) scale(1.05) rotate(calc(var(--rot) * 1.2deg));
			font-family: var(--f3);
		}
		100% {
			transform: none;
			font-family: inherit;
			color: var(--char-base-color, var(--base-text));
		}
	}
	@keyframes pulseKinetic2 {
		0%,
		82% {
			transform: none;
			font-family: inherit;
			color: var(--char-base-color, var(--base-text));
		}
		84% {
			transform: translateY(4px) scale(0.9) rotate(calc(var(--rot) * -1deg));
			font-family: var(--f2);
			color: var(--color);
			filter: hue-rotate(90deg);
		}
		88% {
			transform: translateY(2px) rotate(calc(var(--rot) * 0.5deg));
			font-family: var(--f3);
		}
		92% {
			transform: translateY(5px) scale(0.95) rotate(calc(var(--rot) * -0.8deg));
			font-family: var(--f1);
		}
		100% {
			transform: none;
			font-family: inherit;
			color: var(--char-base-color, var(--base-text));
		}
	}
	@keyframes pulseKinetic3 {
		0%,
		85% {
			transform: none;
			font-family: inherit;
			color: var(--char-base-color, var(--base-text));
		}
		87% {
			transform: translateY(-2px) scale(1.05) rotate(calc(var(--rot) * 1.5deg));
			font-family: var(--f3);
			color: var(--color);
		}
		91% {
			transform: translateY(-1px) rotate(calc(var(--rot) * -1deg));
			font-family: var(--f1);
		}
		95% {
			transform: translateY(-3px) scale(0.9) rotate(calc(var(--rot) * 1.2deg));
			font-family: var(--f2);
		}
		100% {
			transform: none;
			font-family: inherit;
			color: var(--char-base-color, var(--base-text));
		}
	}
	@keyframes pulseKinetic4 {
		0%,
		88% {
			transform: none;
			font-family: inherit;
			color: var(--char-base-color, var(--base-text));
		}
		90% {
			transform: scale(0.85) rotate(calc(var(--rot) * -0.5deg));
			font-family: var(--f1);
			color: var(--color);
		}
		94% {
			transform: scale(1.1) rotate(calc(var(--rot) * 0.8deg));
			font-family: var(--f2);
		}
		98% {
			transform: scale(0.95) rotate(calc(var(--rot) * -1.2deg));
			font-family: var(--f3);
		}
		100% {
			transform: none;
			font-family: inherit;
			color: var(--char-base-color, var(--base-text));
		}
	}

	/* Randomly staggered, holding for ~2s */
	.loop-1::before {
		animation: pulseKinetic1 9s infinite 0.1s;
	}
	.loop-2::before {
		animation: pulseKinetic2 11s infinite 2.5s;
	}
	.loop-3::before {
		animation: pulseKinetic3 13s infinite 1.2s;
	}
	.loop-4::before {
		animation: pulseKinetic4 17s infinite 0.7s;
	}

	.hero-subtext {
		font-family: var(--font-secondary);
		font-size: clamp(0.9rem, 1.8vw, 1rem);
		line-height: 1.4;
		max-width: 650px;
		opacity: 0.95;
		margin: 0 auto 2.5rem;
		color: #2d2d2d;
		font-weight: 500;
		text-align: center;
		letter-spacing: 0.05em;
	}

	:global(.dark) .hero-subtext {
		color: #faf7f5;
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
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0;
		}
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
		.hero-bg {
			background-size: cover;
			background-position: center center; /* Reset to center to ensure no edges are visible */
		}
		.hero-void__content {
			transform: none;
			padding: 0 1rem;
		}
		.hero-title-group {
			align-items: center;
			margin-bottom: 2rem; /* Reverted to smaller gap to keep items grouped */
		}
		.the-group {
			margin: -0.5rem auto; /* Reset margins to center on mobile */
			transform: translateX(45%); /* Pushed further to the right, even larger offset */
		}
		.the-group .text-the {
			font-size: clamp(3.5rem, 10vw, 6rem);
			text-shadow: 3px 3px 0 #000;
		}
		.box-defy {
			margin-left: -12%;
			transform: rotate(-10deg) translateY(0); /* Increased tilt for mobile */
		}
		.default-group {
			margin-left: 0;
			justify-content: center;
		}
		.kinetic-char::before {
			text-shadow: 3px 3px 0 #000;
			-webkit-text-stroke: 1px #000;
		}
		.hero-subtext {
			font-size: 0.85rem;
			margin-top: 3.5rem; /* Reduced gap slightly too */
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
		/* Show sun on mobile but smaller */
		.box-defy .deco-big-sun.pc-d-sun {
			--deco-size: 100px !important;
			--sun-translate: translate(-20%, -50%); /* Specific offset for mobile */
			transform-origin: center center !important;
			animation: rotateSunOffset 25s linear infinite !important;
		}
		.the-group .deco-big-explosion {
			--deco-size: clamp(140px, 20vw, 200px) !important;
			top: 40% !important; /* Shift slight upwards from center 50% */
		}
	}

	/* --- 5. SECTION ANCHORS --- */
	#work,
	#skills,
	#reviews,
	#blog,
	#about {
		scroll-margin-top: 100px;
	}
</style>
