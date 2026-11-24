<script>
	import { onMount } from 'svelte';
	import { fly, fade } from 'svelte/transition';
	import CircularGallery from '$lib/components/CircularGallery.svelte';
	import Masonry from '$lib/components/Masonry.svelte';
	import CardSwap from '$lib/components/CardSwap.svelte';
	import InfiniteMenu from '$lib/components/InfiniteMenu.svelte';
	import PaperCrumple from '$lib/components/PaperCrumple.svelte';
	import logoData from '$lib/data/logofolio.json';

	let { data } = $props();
	let showPage = $state(false);

	// Paper Crumple (Graphics & Print - Project 9)
	let selectedPrintIndex = $state(0);
	let paperResetKey = $state(0);

	onMount(() => {
		showPage = true;
	});

	let logos = $derived(
		logoData.map((d, i) => ({
			...d,
			image: `/assets/branding/logofolio/${i + 1}.png`
		}))
	);
	let currentGroupIdx = $state(0);

	// Group images into sets of 5 for the bento carousel
	let galleryGroups = $derived.by(() => {
		const items = data.project?.gallery || [];
		const groups = [];
		for (let i = 0; i < items.length; i += 5) {
			groups.push(items.slice(i, i + 5));
		}
		return groups;
	});

	const nextGroup = () => {
		if (currentGroupIdx < galleryGroups.length - 1) currentGroupIdx++;
		else currentGroupIdx = 0;
	};

	const prevGroup = () => {
		if (currentGroupIdx > 0) currentGroupIdx--;
		else currentGroupIdx = galleryGroups.length - 1;
	};

	let currentSet = $derived(galleryGroups[currentGroupIdx] || []);
	let activeBrowserTab = $state(0);

	// Synchronized scrolling logic
	let desktopContainer = $state(null);
	let mobileContainer = $state(null);
	let activeScrollTarget = $state(null);

	const handleDesktopScroll = (e) => {
		if (!mobileContainer || activeScrollTarget === 'mobile') return;
		const target = e.target;
		const maxScroll = target.scrollHeight - target.clientHeight;
		if (maxScroll <= 0) return;
		const pct = target.scrollTop / maxScroll;

		const mobileMaxScroll = mobileContainer.scrollHeight - mobileContainer.clientHeight;
		mobileContainer.scrollTop = pct * mobileMaxScroll;
	};

	const handleMobileScroll = (e) => {
		if (!desktopContainer || activeScrollTarget === 'desktop') return;
		const target = e.target;
		const maxScroll = target.scrollHeight - target.clientHeight;
		if (maxScroll <= 0) return;
		const pct = target.scrollTop / maxScroll;

		const desktopMaxScroll = desktopContainer.scrollHeight - desktopContainer.clientHeight;
		desktopContainer.scrollTop = pct * desktopMaxScroll;
	};
</script>

<svelte:head>
	<title>{data.project?.title || 'Project'} | YOUNIQUE</title>
</svelte:head>

{#if !data.project}
	<div class="not-found">
		<h1>Project not found.</h1>
		<a href="/">Back to home</a>
	</div>
{:else if showPage}
	<a href="/#work" class="minimal-back-btn" aria-label="Back to Portfolio" in:fade={{ duration: 800, delay: 100 }} out:fade>
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
			<line x1="19" y1="12" x2="5" y2="12"></line>
			<polyline points="12 19 5 12 12 5"></polyline>
		</svg>
	</a>
	<article class="deck-page" in:fly={{ y: 50, duration: 800, delay: 100 }} out:fade>
		<!-- Section 1: Minimal Intro -->
		<section class="slide slide--intro">
			<div class="grid">
				<div class="col-left">
					<h1 class="huge-title">{data.project.title.toUpperCase()}</h1>
				</div>
				<div class="col-right">
					<div class="summary">
						<span class="asterisk">*</span>
						{data.project.desc}
						<p class="p-rich">
							{data.project.fullDesc}
						</p>
					</div>

					{#if data.project.id === 1}
						<div class="quick-nav-pills">
							<a href="#logofolio" class="nav-pill">
								<span class="pill-num">01</span>
								<span class="pill-text">LOGOFOLIO</span>
							</a>
							<a href="#rebrands" class="nav-pill">
								<span class="pill-num">02</span>
								<span class="pill-text">REBRANDING</span>
							</a>
						</div>
					{/if}
				</div>
			</div>
		</section>

		<!-- Section 2: Carousel Bento Gallery -->
		<section class="slide slide--gallery">
			{#if data.project.id === 7}
				<div class="gallery-circular">
					<CircularGallery
						items={data.project.gallery}
						bend={3}
						textColor="#FFFFFF"
						borderRadius={0.02}
					/>
				</div>
			{:else if data.project.id === 1}
				<!-- Special Split Content for Branding -->
				<div id="logofolio" class="logofolio-3d-wrap">
					<div class="gallery-label-header">
						<h2 class="sub-label">01 // LOGOFOLIO</h2>
					</div>

					<div class="infinite-menu-embed">
						<InfiniteMenu items={logos} />
					</div>
				</div>

				<div id="rebrands" class="gallery-label-header" style="margin-top: 10rem;">
					<h2 class="sub-label">02 // FULL REBRANDS</h2>
				</div>
				<div class="gallery-bento layout-1">
					{#each data.project.gallery.slice(0, 5) as item, i}
						<div class="gallery-cell cell-{i}">
							<img src={item.url} alt={item.title} class="gallery-img" />
							<div class="cell-overlay">{item.title}</div>
						</div>
					{/each}
				</div>

				<div class="gallery-header" style="margin-top: 4rem;">
					<div class="nav-btns">
						<button class="nav-btn" onclick={prevGroup} aria-label="Previous">←</button>
						<button class="nav-btn" onclick={nextGroup} aria-label="Next">→</button>
					</div>
				</div>
			{:else if data.project.id === 8}
				<!-- Masonry Layout for Video Editing -->
				<div class="gallery-label-header">
					<h2 class="sub-label">DYNAMIC EDITS // CUTS</h2>
				</div>
				<div class="masonry-wrap">
					<Masonry
						items={data.project.gallery}
						animateFrom="bottom"
						stagger={0.08}
						scaleOnHover={true}
						blurToFocus={true}
					/>
				</div>
			{:else if data.project.id === 2}
				<!-- Browser Mockup for Digital Experiences -->
				<div class="gallery-label-header">
					<h2 class="sub-label">DIGITAL // EXPERIENCES</h2>
				</div>
				<div class="browser-mockup-wrapper">
					<!-- Desktop Browser Mockup -->
					<div class="browser-element">
						<!-- Browser Header with Tabs -->
						<div class="browser-head">
							<div class="browser-tabs">
								{#each ['Concept', 'Design', 'Launch'] as tabLabel, i}
									<button
										class="browser-tab {activeBrowserTab === i ? 'is-active' : ''}"
										onclick={() => (activeBrowserTab = i)}
									>
										<span class="tab-text">{tabLabel}</span>
									</button>
								{/each}
							</div>
							<div class="browser-controls">
								<span class="ctrl-min"></span>
								<span class="ctrl-max"></span>
								<span class="ctrl-close">×</span>
							</div>
						</div>

						<!-- Browser Toolbar -->
						<div class="browser-toolbar">
							<div class="nav-arrows">
								<span>←</span>
								<span>→</span>
								<span class="reload">↻</span>
							</div>
							<div class="address-bar">
								<div class="search-btn">
									<svg
										width="14"
										height="14"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2.5"
										stroke-linecap="round"
										stroke-linejoin="round"
										><circle cx="11" cy="11" r="8"></circle><line
											x1="21"
											y1="21"
											x2="16.65"
											y2="16.65"
										></line></svg
									>
								</div>
								<div class="url-input">
									younique.design/{['concept', 'design', 'launch'][activeBrowserTab]}
								</div>
							</div>
						</div>

						<!-- Browser Screen / Content Area -->
						<div
							class="browser-screen-container"
							bind:this={desktopContainer}
							onscroll={handleDesktopScroll}
							onmouseenter={() => (activeScrollTarget = 'desktop')}
							ontouchstart={() => (activeScrollTarget = 'desktop')}
							role="presentation"
						>
							{#each [1, 2, 3] as _, i}
								<img
									src="https://picsum.photos/1200/3000?random={i + 10}"
									alt="Desktop layout mockup"
									class="browser-screen-img {activeBrowserTab === i ? 'is-visible' : ''}"
								/>
							{/each}
						</div>
					</div>

					<!-- Mobile Browser Mockup -->
					<div class="mobile-browser-element">
						<div class="mobile-browser-head">
							<div class="mobile-address-bar">
								younique.design/{['concept', 'design', 'launch'][activeBrowserTab]}
							</div>
						</div>
						<div
							class="mobile-screen-container"
							bind:this={mobileContainer}
							onscroll={handleMobileScroll}
							onmouseenter={() => (activeScrollTarget = 'mobile')}
							ontouchstart={() => (activeScrollTarget = 'mobile')}
							role="presentation"
						>
							{#each [1, 2, 3] as _, i}
								<img
									src="https://picsum.photos/600/2000?random={i + 20}"
									alt="Mobile layout mockup"
									class="mobile-screen-img {activeBrowserTab === i ? 'is-visible' : ''}"
								/>
							{/each}
						</div>
					</div>
				</div>
			{:else if data.project.id === 9}
				<!-- Interactive Paper Crumple Studio for Graphics & Print -->
				<div class="paper-studio-container">
					<!-- Main Paper Crumple Stage -->
					{#key selectedPrintIndex}
						<div class="paper-stage-wrapper">
							<PaperCrumple
								src={data.project.gallery[selectedPrintIndex]?.url || '/assets/graphics/1.jpg'}
								alt={data.project.gallery[selectedPrintIndex]?.title || 'Print Art'}
								width={340}
								height={460}
								sceneHeight={580}
								releaseBehavior="restore"
								crumpleAmount={0.75}
								crumpleDuration={0.65}
								releaseDuration={0.55}
								foldCount={9}
								foldSharpness={0.7}
								wrinkleDepth={0.7}
								creaseStrength={0.22}
								paperColor="#f4f0e8"
								paperTexture={0.3}
								draggable={true}
								returnToOrigin={true}
								lightIntensity={2.2}
								shadowOpacity={0.22}
								dragRotation={18}
								seed={selectedPrintIndex * 13 + 7}
								detail={56}
								resetKey={paperResetKey}
							/>

							<div class="stage-hint">
								<span>✋ CLICK & DRAG TO CRUMPLE</span>
							</div>
						</div>
					{/key}

					<!-- Active Print Details & Gallery Selector -->
					<div class="print-meta-bar">
						<div class="print-info">
							<span class="print-number">ARCHIVE 09.{String(selectedPrintIndex + 1).padStart(2, '0')}</span>
							<h3 class="print-title">{data.project.gallery[selectedPrintIndex]?.title || 'Print Design'}</h3>
						</div>
						<div class="print-nav">
							<button
								class="nav-btn"
								onclick={() => {
									selectedPrintIndex =
										(selectedPrintIndex - 1 + data.project.gallery.length) %
										data.project.gallery.length;
									paperResetKey += 1;
								}}
								aria-label="Previous Print"
							>
								←
							</button>
							<span class="print-counter">{selectedPrintIndex + 1} / {data.project.gallery.length}</span>
							<button
								class="nav-btn"
								onclick={() => {
									selectedPrintIndex =
										(selectedPrintIndex + 1) % data.project.gallery.length;
									paperResetKey += 1;
								}}
								aria-label="Next Print"
							>
								→
							</button>
						</div>
					</div>

					<!-- Thumbnails Strip -->
					<div class="print-thumbnails-grid">
						{#each data.project.gallery as item, idx}
							<button
								class="print-thumb-card {selectedPrintIndex === idx ? 'is-selected' : ''}"
								onclick={() => {
									selectedPrintIndex = idx;
									paperResetKey += 1;
								}}
							>
								<div class="thumb-preview">
									<img src={item.url} alt={item.title} />
									{#if selectedPrintIndex === idx}
										<div class="thumb-badge">ACTIVE</div>
									{/if}
								</div>
								<span class="thumb-title">{item.title}</span>
							</button>
						{/each}
					</div>
				</div>
			{:else}
				<div class="gallery-bento layout-{data.project.id}">
					{#each currentSet as item, i}
						<div class="gallery-cell cell-{i}">
							<img src={item.url} alt={item.title} class="gallery-img" />
							<div class="cell-overlay">{item.title}</div>
						</div>
					{/each}
				</div>
				{#if data.project.id !== 8 && data.project.id !== 7 && data.project.id !== 9}
					<div class="gallery-header">
						<div class="nav-btns">
							<button class="nav-btn" onclick={prevGroup} aria-label="Previous">←</button>
							<button class="nav-btn" onclick={nextGroup} aria-label="Next">→</button>
						</div>
					</div>
				{/if}
			{/if}
		</section>

		<!-- Section 3: Stats -->
		{#if (data.project.stats || []).length > 0}
			<section class="slide slide--stats">
				<div class="stats-grid">
					{#each data.project.stats as stat}
						<div class="stat-card">
							<span class="small-icon">*</span>
							<div class="val">{stat.val}</div>
							<div class="label">{stat.label}</div>
						</div>
					{/each}
				</div>
			</section>
		{:else}
			<div class="spacer-bottom-filler" style="height: 10vh;"></div>
		{/if}
	</article>
{/if}

<style>
	:root {
		--bg-light: var(--color-5, #f4f4f4);
		--bg-dark: var(--color-3, #1c1c1c);
		--text-dark: var(--color-3, #1c1c1c);
		--text-light: var(--color-5, #f4f4f4);
	}

	.deck-page {
		background: var(--bg-light);
		color: var(--text-dark);
		min-height: 100vh;
		font-family: 'Unbounded', sans-serif;
	}

	.slide {
		min-height: 80vh;
		width: 100%;
		position: relative;
		padding: 10rem 2rem 6rem; /* Top padding for header clearance */
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.slide--intro {
		background: var(--bg-light);
	}

	.grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 4rem;
		max-width: 1400px;
		margin: 0 auto;
		width: 100%;
	}

	.huge-title {
		font-size: clamp(4rem, 12vw, 9rem);
		line-height: 0.85;
		font-weight: 900;
		margin: 0;
		letter-spacing: -0.04em;
	}

	.summary {
		font-size: 1.5rem;
		line-height: 1.4;
		max-width: 600px;
	}
	.asterisk {
		color: var(--bg-dark);
		font-weight: 900;
	}
	.p-rich {
		margin-top: 2rem;
		opacity: 0.8;
		font-size: 1.15rem;
	}

	/* Gallery Section */
	.slide--gallery {
		background: var(--bg-dark);
		color: var(--text-light);
		min-height: 100vh;
		padding-top: 6rem;
		padding-bottom: 6rem;
	}

	.gallery-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		max-width: 1400px;
		margin: 0 auto 2rem;
		width: 100%;
	}

	.set-indicator {
		font-weight: 800;
		text-transform: uppercase;
		font-size: 0.9rem;
		letter-spacing: 0.1em;
	}

	.gallery-circular {
		width: 100vw;
		height: 80vh;
		margin-left: calc(-50vw + 50%);
		position: relative;
		overflow: hidden;
		margin-top: -12rem;
	}

	.nav-btns {
		display: flex;
		gap: 1rem;
	}

	.nav-btn {
		background: var(--color-5, #fff);
		color: var(--text-dark);
		border: 3px solid var(--text-dark);
		width: 50px;
		height: 50px;
		border-radius: 50%;
		font-size: 1.5rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 4px 4px 0 var(--text-dark);
		transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
	}
	.nav-btn:hover {
		transform: translate(-3px, -3px);
		box-shadow: 7px 7px 0 var(--text-dark);
		background: var(--color-1, #ffd200);
	}
	.nav-btn:active {
		transform: translate(2px, 2px);
		box-shadow: 0px 0px 0 var(--text-dark);
	}

	.gallery-bento {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		grid-template-rows: repeat(2, 450px); /* Taller for 9:16 feel */
		gap: 0;
		width: 100%;
		max-width: 1400px;
		margin: 0 auto;
	}

	.gallery-cell {
		position: relative;
		border-radius: 0;
		overflow: hidden;
		background: var(--color-1, #ffd200); /* Neo brutalist pop color placeholder */
		border: 4px solid var(--text-dark); /* Thicker neo brutal border */
		margin: -2px; /* Overlap borders */
		box-shadow: 4px 4px 0 var(--text-dark);
		transition:
			transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
			box-shadow 0.3s;
	}

	.layout-1 .gallery-cell {
		border: none;
		margin: 0;
		box-shadow: none;
	}

	.gallery-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.gallery-cell:hover .gallery-img {
		transform: scale(1.05);
	}

	.cell-overlay {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 1.5rem;
		background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
		color: #fff;
		font-size: 0.8rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.gallery-cell:hover .cell-overlay {
		opacity: 1;
	}

	/* ── BENTO LAYOUTS BY SERVICE ── */

	/* 1. Branding (The Baseline) */
	.layout-1 .cell-0 {
		grid-column: span 2;
		grid-row: span 2;
	}
	.layout-1 .cell-1,
	.layout-1 .cell-2,
	.layout-1 .cell-3,
	.layout-1 .cell-4 {
		grid-column: span 1;
		grid-row: span 1;
	}

	/* 7. Social Media (Portrait / Phone Focus) */
	.layout-7 {
		grid-template-columns: repeat(5, 1fr);
		grid-template-rows: repeat(1, 700px);
	}
	.layout-7 .cell-0,
	.layout-7 .cell-1,
	.layout-7 .cell-2,
	.layout-7 .cell-3,
	.layout-7 .cell-4 {
		grid-column: span 1;
		grid-row: span 1;
	}

	/* 8. Video Editing (Cinematic Horizontal + Vertical Reels) */
	.layout-8 {
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: repeat(2, 400px);
	}
	.layout-8 .cell-0 {
		grid-column: span 2;
		grid-row: span 1;
	} /* Horizontal Feature */
	.layout-8 .cell-1 {
		grid-column: span 1;
		grid-row: span 2;
	} /* Vertical Reel Feature */
	.layout-8 .cell-2 {
		grid-column: span 1;
		grid-row: span 1;
	}
	.layout-8 .cell-3 {
		grid-column: span 1;
		grid-row: span 1;
	}
	.layout-8 .cell-4 {
		display: none;
	} /* Focus on the 4 key slots per set */

	/* 9. Graphics & Print — Interactive Paper Crumple Studio */
	.paper-studio-container {
		max-width: 1200px;
		margin: 2rem auto 0;
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.paper-stage-wrapper {
		position: relative;
		width: 100%;
		border-radius: 20px;
		border: 3px solid var(--color-3);
		background: radial-gradient(circle at 50% 40%, rgba(255, 255, 255, 0.95) 0%, rgba(235, 230, 220, 0.7) 100%);
		box-shadow: 12px 12px 0 var(--color-3);
		overflow: hidden;
		transition: border-color 0.3s ease, box-shadow 0.3s ease;
	}

	:global(.dark) .paper-stage-wrapper {
		border-color: #f4f4f4;
		background: radial-gradient(circle at 50% 40%, #2f2f2f 0%, #1a1a1a 100%);
		box-shadow: 12px 12px 0 #000;
	}

	.stage-hint {
		position: absolute;
		bottom: 1.25rem;
		right: 1.25rem;
		z-index: 10;
		padding: 0.35rem 0.85rem;
		background: rgba(28, 28, 28, 0.8);
		color: var(--color-1, #fdd803);
		border-radius: 999px;
		font-family: 'Space Mono', monospace;
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		pointer-events: none;
		backdrop-filter: blur(6px);
	}

	.print-meta-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 1.5rem;
		padding: 0.5rem 0.5rem;
	}

	.print-number {
		font-family: 'Space Mono', monospace;
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--color-1, #fd5a04);
		letter-spacing: 0.1em;
		display: block;
		margin-bottom: 0.25rem;
	}

	.print-title {
		font-size: clamp(1.4rem, 3vw, 2.2rem);
		font-weight: 900;
		text-transform: uppercase;
		margin: 0;
		letter-spacing: -0.02em;
	}

	.print-nav {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.print-counter {
		font-family: 'Space Mono', monospace;
		font-size: 0.9rem;
		font-weight: 700;
	}

	.print-thumbnails-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
		gap: 1rem;
		width: 100%;
	}

	.print-thumb-card {
		background: transparent;
		border: 2px solid rgba(28, 28, 28, 0.15);
		border-radius: 12px;
		padding: 0.5rem;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		text-align: left;
		transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
		color: inherit;
	}

	:global(.dark) .print-thumb-card {
		border-color: rgba(255, 255, 255, 0.15);
	}

	.print-thumb-card:hover {
		transform: translateY(-4px);
		border-color: var(--color-3);
		box-shadow: 4px 4px 0 var(--color-3);
	}

	:global(.dark) .print-thumb-card:hover {
		border-color: #f4f4f4;
		box-shadow: 4px 4px 0 #000;
	}

	.print-thumb-card.is-selected {
		border-color: var(--color-1, #fdd803);
		background: rgba(253, 216, 3, 0.08);
		box-shadow: 4px 4px 0 var(--color-3);
		transform: translateY(-2px);
	}

	:global(.dark) .print-thumb-card.is-selected {
		border-color: var(--color-1, #fdd803);
		background: rgba(253, 216, 3, 0.12);
		box-shadow: 4px 4px 0 #000;
	}

	.thumb-preview {
		position: relative;
		width: 100%;
		aspect-ratio: 3 / 4;
		border-radius: 8px;
		overflow: hidden;
		border: 1px solid rgba(0, 0, 0, 0.1);
		background: #f4f0e8;
	}

	.thumb-preview img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.thumb-badge {
		position: absolute;
		bottom: 4px;
		right: 4px;
		background: var(--color-1, #fdd803);
		color: #1c1c1c;
		font-family: 'Space Mono', monospace;
		font-size: 0.6rem;
		font-weight: 900;
		padding: 2px 6px;
		border-radius: 4px;
		border: 1px solid #1c1c1c;
	}

	.thumb-title {
		font-size: 0.72rem;
		font-weight: 800;
		text-transform: uppercase;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	@media (max-width: 640px) {
		.print-thumbnails-grid {
			grid-template-columns: repeat(3, 1fr);
			gap: 0.6rem;
		}
		.stage-hint {
			font-size: 0.55rem;
			bottom: 0.75rem;
			right: 0.75rem;
		}
	}

	/* 10. 3D Models (Sculptural Layout) */
	.layout-10 {
		grid-template-columns: repeat(4, 1fr);
		grid-template-rows: repeat(2, 450px);
	}
	.layout-10 .cell-0 {
		grid-column: span 2;
		grid-row: span 2;
	} /* Removed arched feature for square look */
	.layout-10 .cell-1 {
		grid-column: span 2;
		grid-row: span 1;
	}
	.layout-10 .cell-2,
	.layout-10 .cell-3 {
		grid-column: span 1;
		grid-row: span 1;
	}
	.layout-10 .cell-4 {
		grid-column: span 2;
		grid-row: span 1;
		visibility: hidden;
	}

	/* 11. Packaging Design (Showcase Layout) */
	.layout-11 {
		grid-template-columns: repeat(4, 1fr);
		grid-template-rows: repeat(2, 450px);
	}
	.layout-11 .cell-0 {
		grid-column: span 2;
		grid-row: span 2;
	}
	.layout-11 .cell-1,
	.layout-11 .cell-2,
	.layout-11 .cell-3,
	.layout-11 .cell-4 {
		grid-column: span 1;
		grid-row: span 1;
	}

	/* 3. Neo-Brutalist Interactive Browser */
	.interactive-wrap {
		width: 100%;
		max-width: 1400px;
		margin: 0 auto 10rem;
		padding: 0 2rem;
	}

	.browser-mockup-wrapper {
		padding: 6rem 2rem 10rem;
		display: flex;
		justify-content: center;
		align-items: flex-end; /* Bottom-align side-by-side elements */
		gap: 3rem;
		width: 100%;
		position: relative;
	}

	.browser-element {
		flex: 1; /* Takes available space */
		width: 100%;
		min-width: 0;
		max-width: 1100px;
		background: var(--color-5);
		border: 4px solid var(--color-3);
		border-radius: 12px;
		overflow: hidden;
		position: relative;
		/* Brutalist shadow */
		box-shadow: 20px 20px 0px var(--color-3);
		z-index: 2;
		display: flex;
		flex-direction: column;
	}

	.browser-head {
		background: var(--color-5); /* Neutral minimal background */
		border-bottom: 4px solid var(--color-3);
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		padding: 1rem 1rem 0 1.5rem;
	}

	.browser-tabs {
		display: flex;
		gap: 0.5rem;
	}

	.browser-tab {
		background: var(--color-5);
		border: 4px solid var(--color-3);
		border-bottom: none;
		padding: 0.7rem 2.5rem;
		border-radius: 12px 12px 0 0;
		font-weight: normal;
		font-family: 'Kinetic-LLPixel', sans-serif;
		font-size: 1.25rem;
		color: var(--color-3);
		cursor: pointer;
		position: relative;
		margin-bottom: -4px;
		z-index: 1;
		transform: perspective(100px) rotateX(10deg);
		transform-origin: bottom;
		transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.browser-tab .tab-text {
		display: inline-block;
		transform: perspective(100px) rotateX(-10deg);
		letter-spacing: 0.05em;
	}

	.browser-tab:hover {
		background: color-mix(in srgb, var(--color-1) 50%, var(--color-5));
	}

	.browser-tab.is-active {
		background: var(--color-5); 
		z-index: 5;
		padding-bottom: 0.9rem;
		border-bottom: 4px solid var(--color-5); /* Blends with header but stands out by structure */
	}

	.browser-controls {
		display: flex;
		gap: 1rem;
		align-items: center;
		padding-bottom: 0.8rem;
	}

	.ctrl-min {
		width: 16px;
		height: 3px;
		background: var(--color-3);
		border-radius: 2px;
	}
	.ctrl-max {
		width: 14px;
		height: 14px;
		border: 3px solid var(--color-3);
		border-radius: 2px;
	}
	.ctrl-close {
		font-size: 2rem;
		line-height: 0.5;
		font-weight: 900;
		color: var(--color-3);
		margin-top: -2px;
	}

	.browser-toolbar {
		background: var(--color-5); /* Neutral minimal toolbar */
		border-bottom: 4px solid var(--color-3);
		padding: 0.8rem 1.5rem;
		display: flex;
		gap: 1.5rem;
		align-items: center;
	}

	.nav-arrows {
		display: flex;
		gap: 1.2rem;
		font-size: 1.5rem;
		font-weight: 900;
		color: var(--color-3);
	}

	.nav-arrows .reload {
		translate: 0 1px;
	}

	.address-bar {
		flex: 1;
		height: 40px;
		display: flex;
		border: 3px solid var(--color-3);
		border-radius: 6px;
		background: var(--color-5);
		overflow: hidden;
	}

	.search-btn {
		width: 50px;
		background: var(--color-5); /* Neutral search button */
		border-right: 3px solid var(--color-3);
		display: flex;
		justify-content: center;
		align-items: center;
		color: var(--color-3);
	}

	.url-input {
		padding: 0 1rem;
		display: flex;
		align-items: center;
		font-weight: normal;
		color: var(--color-3);
		font-family: 'Kinetic-LLPixel', monospace;
		font-size: 1.15rem;
		letter-spacing: 0.05em;
	}

	.browser-screen-container {
		width: 100%;
		height: 650px;
		background: #fff;
		position: relative;
		overflow-y: auto; /* Enable native scrolling */
		overflow-x: hidden;
		display: block; /* Allows natural flow height from active image */
	}

	/* Native Neo-Brutalist Scrollbar Integration */
	.browser-screen-container::-webkit-scrollbar,
	.mobile-screen-container::-webkit-scrollbar {
		width: 25px; /* Matches the tracker style */
	}

	/* Mobile thinner scrollbar */
	.mobile-screen-container::-webkit-scrollbar {
		width: 18px;
	}

	.browser-screen-container::-webkit-scrollbar-track,
	.mobile-screen-container::-webkit-scrollbar-track {
		background: var(--color-5);
		border-left: 4px solid var(--color-3);
	}

	.browser-screen-container::-webkit-scrollbar-thumb,
	.mobile-screen-container::-webkit-scrollbar-thumb {
		background: var(--color-3); /* Dark minimal scrollbar */
		border: 4px solid var(--color-3);
		border-radius: 12px;
	}

	.browser-screen-img,
	.mobile-screen-img {
		position: absolute; /* Default hidden ones stack absolutely */
		top: 0;
		left: 0;
		width: 100%;
		height: auto;
		display: block;
		opacity: 0;
		visibility: hidden;
		transform: translateY(20px) scale(0.98);
		transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
		z-index: 1;
	}

	.browser-screen-img.is-visible,
	.mobile-screen-img.is-visible {
		opacity: 1;
		visibility: visible;
		transform: translateY(0) scale(1);
		position: relative; /* Active image drives container height natively */
		z-index: 5;
	}

	/* --- MOBILE BROWSER MOCKUP --- */
	.mobile-browser-element {
		width: 280px;
		height: 550px;
		flex-shrink: 0; /* Prevents squishing */
		background: var(--color-5);
		border: 4px solid var(--color-3);
		border-radius: 30px;
		overflow: hidden;
		box-shadow: 16px 16px 0px var(--color-3);
		z-index: 10;
		display: flex;
		flex-direction: column;
	}

	.mobile-browser-head {
		background: var(--color-5); /* Neutral minimal mobile header */
		border-bottom: 4px solid var(--color-3);
		padding: 1.2rem 1rem 0.8rem;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.mobile-address-bar {
		width: 100%;
		background: var(--color-5);
		border: 3px solid var(--color-3);
		border-radius: 12px;
		padding: 0.4rem 0.8rem;
		font-family: 'Kinetic-LLPixel', monospace;
		font-size: 0.9rem;
		color: var(--color-3);
		text-align: center;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		letter-spacing: 0.05em;
	}

	.mobile-screen-container {
		flex: 1;
		position: relative;
		background: #fff;
		overflow-y: auto; /* Enable native scrolling */
		overflow-x: hidden;
	}

	.placeholder-bg {
		width: 100%;
		height: 100%;
		background: linear-gradient(135deg, #e0e0e0 0%, #d0d0d0 100%);
	}

	/* Branding 3D Section */
	.logofolio-3d-wrap {
		width: 100vw;
		margin-left: calc(-50vw + 50%);
		position: relative;
		background: #1c1c1c;
		padding-bottom: 4rem;
	}

	.infinite-menu-embed {
		width: 100%;
		height: 80vh;
		position: relative;
		overflow: hidden;
	}

	/* Stats Section */
	.slide--stats {
		background: var(--bg-light);
		transition: background-color 0.3s ease;
	}

	:global(.dark) .slide--stats {
		background: var(--color-5, #3d3d3d);
	}

	.stats-grid {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 6rem;
		max-width: 1400px;
		margin: 0 auto;
		width: 100%;
		padding: 4rem 2rem;
	}

	.stat-card {
		background: transparent;
		padding: 0;
		border-radius: 0;
		min-height: auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		border: none;
		text-align: center;
	}

	.stat-card:first-child {
		background: transparent;
		color: inherit;
	}

	.small-icon {
		display: none; /* Removed for hyper-minimalism */
	}

	.val {
		font-family: 'Space Mono', monospace;
		font-size: 2.2rem;
		font-weight: 700;
		margin-top: 0;
		color: var(--color-3, #1c1c1c);
		letter-spacing: -0.02em;
		transition: color 0.3s ease;
	}

	:global(.dark) .val {
		color: var(--color-1, #fdd803) !important;
	}

	.label {
		font-family: 'Unbounded', sans-serif; /* Standard grotesk look */
		font-size: 0.75rem;
		opacity: 0.65;
		margin-top: 0.5rem;
		text-transform: uppercase;
		font-weight: 700;
		letter-spacing: 0.1em;
		color: var(--color-3, #1c1c1c);
		transition: color 0.3s ease, opacity 0.3s ease;
	}

	:global(.dark) .label {
		color: #fffaf4 !important;
		opacity: 0.85 !important;
	}

	.minimal-back-btn {
		position: fixed;
		top: 8.5rem; /* Moved further down below the main header */
		left: 1.5rem;
		width: 44px;
		height: 44px;
		background: var(--color-5); /* Always matches light mode theme or paper bg */
		color: var(--color-3);
		border: 3px solid var(--color-3);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		box-shadow: 4px 4px 0 var(--color-3);
		transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
		text-decoration: none;
	}

	:global(.dark) .minimal-back-btn {
		background: var(--color-1); /* Pop yellow on dark mode back icon */
		color: #1c1c1c; /* Force dark icon color for contrast */
		border-color: #1c1c1c;
		box-shadow: 4px 4px 0 #1c1c1c;
	}

	:global(.dark) .minimal-back-btn:hover {
		box-shadow: 7px 7px 0 #1c1c1c;
	}

	:global(.dark) .minimal-back-btn:active {
		box-shadow: 0px 0px 0 #1c1c1c;
	}

	.minimal-back-btn:hover {
		transform: translate(-3px, -3px);
		box-shadow: 7px 7px 0 var(--color-3);
		background: var(--color-4); /* Green pop on hover */
	}

	.minimal-back-btn:active {
		transform: translate(2px, 2px);
		box-shadow: 0px 0px 0 var(--color-3);
	}

	.minimal-back-btn svg {
		width: 20px;
		height: 20px;
	}

	/* --- QUICK NAVIGATION PILLS --- */
	.quick-nav-pills {
		display: flex;
		gap: 1rem;
		margin-top: 3rem;
	}

	.nav-pill {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.4rem 0.5rem 0.4rem 1.2rem;
		background: var(--bg-dark);
		color: var(--text-light);
		border-radius: 99px;
		text-decoration: none;
		font-weight: 700;
		transition:
			transform 0.2s cubic-bezier(0.16, 1, 0.3, 1),
			background-color 0.2s;
	}

	.nav-pill:hover {
		transform: translateY(-2px);
		background: #000;
	}

	.pill-num {
		opacity: 0.5;
		font-family: 'Space Grotesk', monospace;
	}

	.pill-text {
		background: #fff;
		color: #000;
		padding: 0.2rem 1rem;
		border-radius: 99px;
	}

	@media (max-width: 768px) {
		.quick-nav-pills {
			gap: 0.5rem;
			flex-wrap: wrap;
		}
		.nav-pill {
			font-size: 0.85rem;
			padding: 0.3rem 0.4rem 0.3rem 1rem;
		}
	}

	.gallery-label-header {
		max-width: 1400px;
		margin: 0 auto 3rem;
		width: 100%;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		padding-bottom: 1rem;
	}

	.sub-label {
		font-size: 1.2rem;
		font-weight: 900;
		letter-spacing: 0.2em;
		opacity: 0.8;
	}

	.masonry-wrap {
		width: 100%;
		max-width: 1400px;
		margin: 0 auto;
		padding: 0 1rem;
		position: relative;
		min-height: 80vh;
	}

	@media (max-width: 900px) {
		.grid {
			grid-template-columns: 1fr;
			gap: 2rem;
		}
		.huge-title {
			font-size: 3.5rem;
		}
		.summary {
			font-size: 1.1rem;
		}

		.gallery-bento {
			grid-template-columns: 1fr !important;
			grid-template-rows: auto !important;
			gap: 1.5rem;
			padding: 0 1rem;
		}

		.gallery-cell {
			grid-column: span 1 !important;
			grid-row: span 1 !important;
			height: 350px !important;
			box-shadow: 6px 6px 0 var(--text-dark);
			margin: 0;
		}

		.stats-grid {
			flex-direction: column;
			gap: 3rem;
			padding: 2rem;
		}
		.stat-card {
			padding: 0;
			min-height: auto;
		}
		.val {
			font-size: 2rem;
		}
		.label {
			font-size: 0.6rem;
		}

		/* Browser Mobile Scaling */
		.browser-mockup-wrapper {
			padding: 4rem 1rem 8rem;
			flex-direction: column;
			align-items: center;
			gap: 2rem;
		}
		.browser-head {
			padding: 0.5rem 0.5rem 0 0.5rem;
		}
		.browser-tab {
			padding: 0.4rem 1.2rem;
			font-size: 0.8rem;
			margin-bottom: -4px;
		}
		.browser-controls {
			display: none;
		}
		.browser-toolbar {
			padding: 0.5rem 1rem;
			gap: 0.8rem;
		}
		.nav-arrows {
			font-size: 1.2rem;
			gap: 0.6rem;
		}
		.url-input {
			font-size: 0.8rem;
		}
		.browser-screen-container {
			height: 400px;
		}
		.mobile-browser-element {
			width: 100%;
			max-width: 320px;
			height: 500px;
		}
		.mobile-screen-container {
			height: auto;
		}
	}
</style>
