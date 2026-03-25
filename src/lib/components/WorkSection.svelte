<script>
	import { onMount, onDestroy } from 'svelte';
	let { projects = [] } = $props();

	const categories = [
		{
			id: 1,
			title: 'Brand Identity',
			color: '#FD5A04',
			tabPos: '5%',
			sticker: '/assets/service-icons/3_sticker_branding.png'
		},
		{
			id: 2,
			title: 'Digital\nExperien\nces',
			color: '#5375D1',
			tabPos: '20%',
			sticker: '/assets/service-icons/2_sticker_globe.png'
		},
		{
			id: 7,
			title: 'Social\nMedia\nManage\nment',
			color: '#FFF602',
			tabPos: '35%',
			sticker: '/assets/service-icons/5_sticker_creator.png'
		},
		{
			id: 8,
			title: 'Video Editing',
			color: '#6BDAC9',
			tabPos: '50%',
			sticker: '/assets/service-icons/1_sticker_visual.png'
		},
		{
			id: 9,
			title: 'Graphics & Print',
			color: '#6FC1E3',
			tabPos: '65%',
			sticker: '/assets/service-icons/4_sticker_framework.png'
		},
		{
			id: 10,
			title: '3D Models',
			color: '#FFFAF4',
			tabPos: '80%',
			sticker: '/assets/service-icons/6_sticker_3d.png'
		}
	];

	let hoveredId = $state(null);

	onMount(() => {
		// Intersection Observer for Mobile "Center Trigger"
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const id = parseInt(entry.target.getAttribute('data-id'));
					hoveredId = id;
				}
			});
		}, {
			root: null,
			rootMargin: '-45% 0% -45% 0%',
			threshold: 0
		});

		const cards = document.querySelectorAll('.folder-card-wrap');
		cards.forEach((card) => observer.observe(card));

		return () => {
			observer.disconnect();
		};
	});
</script>

<section class="wrap page-transition">
	<div class="bg-brand-text">W O R K</div>
	<header class="page-header"></header>

	<div class="folder-grid">
		{#each categories as cat, i}
			<a
				href="/work/{cat.id}"
				class="folder-card-wrap stagger-item"
				style:animation-delay="{i * 0.15}s"
				onmouseenter={() => (hoveredId = cat.id)}
				onmouseleave={() => (hoveredId = null)}
				data-id={cat.id}
			>
				<div
					class="folder-card-solo"
					style:--folder-bg={cat.color}
					class:is-active={hoveredId === cat.id}
				>
					<div class="folder-tab">
						<span class="tab-label">Archive No. {cat.id}</span>
					</div>

					<div class="folder-main">
						<div class="folder-content">
							<h2 class="folder-title">{cat.title}</h2>
							<p class="folder-meta">View Project Deck</p>
						</div>
						{#if cat.sticker}
							<div class="folder-visual">
								<img src={cat.sticker} alt="" />
							</div>
						{/if}
					</div>
				</div>
			</a>
		{/each}
	</div>
</section>

<style>
	.wrap {
		padding: 2.25rem clamp(1rem, 4vw, 4rem) 4rem;
		position: relative;
		overflow: hidden;
	}

	.bg-brand-text {
		position: absolute;
		top: 45%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-size: clamp(5rem, 22vw, 30rem);
		font-family: 'Rubik Mono One', sans-serif;
		color: var(--color-3);
		opacity: 0.05;
		z-index: 1;
		pointer-events: none;
		white-space: nowrap;
		letter-spacing: 0.1em;
	}

	.page-header {
		margin-bottom: 1.5rem;
	}
	/* ── SEPARATE FOLDER GRID ── */
	.folder-grid {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 2rem 3rem;
		margin: 6rem 0;
		padding: 0 1rem;
	}

	.folder-card-wrap {
		position: relative;
		width: 320px;
		height: 320px; /* Square-ish */
		margin-top: 36px;
		display: block;
		text-decoration: none;
	}

	/* Expand hit area to prevent hover glitch */
	.folder-card-wrap::after {
		content: '';
		position: absolute;
		top: -50px;
		left: -20px;
		right: -20px;
		bottom: -30px;
		z-index: 10;
	}

	.folder-card-solo {
		position: absolute;
		inset: 0;
		background: var(--folder-bg);
		border: 3px solid #1c1c1c;
		border-radius: 0 16px 16px 16px;
		transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
		box-shadow: 12px 12px 0px rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: column;
		overflow: visible;
		z-index: 2;
	}

	/* Zigzag & Rotation */
	.folder-card-wrap:nth-child(4n + 1) { margin-top: 50px; }
	.folder-card-wrap:nth-child(4n + 1) .folder-card-solo { transform: rotate(-3deg); }

	.folder-card-wrap:nth-child(4n + 2) { margin-top: 20px; }
	.folder-card-wrap:nth-child(4n + 2) .folder-card-solo { transform: rotate(2deg); }

	.folder-card-wrap:nth-child(4n + 3) { margin-top: 60px; }
	.folder-card-wrap:nth-child(4n + 3) .folder-card-solo { transform: rotate(-1.5deg); }

	.folder-card-wrap:nth-child(4n + 4) { margin-top: 30px; }
	.folder-card-wrap:nth-child(4n + 4) .folder-card-solo { transform: rotate(4deg); }

	.folder-tab {
		position: absolute;
		top: -36px;
		left: -3px;
		height: 38px;
		width: 160px;
		background: var(--folder-bg);
		border: 3px solid #1c1c1c;
		border-bottom: none;
		border-radius: 12px 24px 0 0;
		display: flex;
		align-items: center;
		padding: 0 1.2rem;
		z-index: 2;
	}

	.tab-label {
		font-size: 0.65rem;
		font-weight: 900;
		text-transform: uppercase;
		color: #1c1c1c;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		opacity: 0.7;
		font-family: var(--font-primary);
	}

	.folder-main {
		flex: 1;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		position: relative;
		z-index: 3;
	}

	.folder-content {
		display: flex;
		flex-direction: column;
	}

	.folder-title {
		font-family: 'moon-get', sans-serif;
		font-weight: 900;
		font-size: 2.8rem;
		margin: 0;
		color: #1c1c1c;
		-webkit-text-stroke: 1.5px color-mix(in srgb, var(--folder-bg) 70%, black);
		line-height: 1.05;
		letter-spacing: -0.04em;
		transition: all 0.3s ease;
		text-transform: uppercase;
		white-space: pre-line;
	}

	/* Shift Graphics & Print slightly left */
	.folder-card-wrap:nth-child(5) .folder-title {
		margin-left: -8px;
	}

	.folder-meta {
		font-weight: 800;
		text-transform: uppercase;
		font-size: 0.75rem;
		color: #1c1c1c;
		opacity: 0.6;
		margin-top: 0.6rem;
		letter-spacing: 0.05em;
	}

	.folder-visual {
		width: 100px;
		height: 100px;
		align-self: flex-end;
		transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
		filter: drop-shadow(4px 4px 0px rgba(0, 0, 0, 0.1));
	}

	.folder-visual img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	/* Keep sticker-creator inside the folder */
	.folder-card-wrap:nth-child(3) .folder-visual {
		transform: translateY(-50px);
	}

	/* Keep sticker-globe inside the folder */
	.folder-card-wrap:nth-child(2) .folder-visual {
		transform: translateY(-30px);
	}

	/* Interactive States & Scroll Center State */
	.folder-card-wrap:hover .folder-card-solo,
	.folder-card-solo.is-active {
		transform: translateY(-15px) scale(1.05) rotate(0deg) !important;
		box-shadow: 20px 20px 0px rgba(0, 0, 0, 0.15);
		z-index: 10;
	}
	
	.folder-card-wrap:hover,
	.folder-card-wrap:has(.is-active) {
		z-index: 10;
	}

	.folder-card-wrap:hover .folder-title,
	.folder-card-solo.is-active .folder-title {
		color: #fff;
		-webkit-text-stroke: 1.5px #1c1c1c;
		text-shadow: 3px 3px 0px #1c1c1c;
	}

	.folder-card-wrap:hover .folder-visual,
	.folder-card-solo.is-active .folder-visual {
		transform: rotate(25deg) scale(1.3) translateY(-10px);
		z-index: 5;
	}

	/* Keep sticker-creator inside folder on hover too */
	.folder-card-wrap:nth-child(3):hover .folder-visual,
	.folder-card-wrap:nth-child(3) .folder-card-solo.is-active .folder-visual {
		transform: rotate(15deg) scale(1.15) translateY(-55px);
	}

	/* Keep sticker-globe inside folder on hover too */
	.folder-card-wrap:nth-child(2):hover .folder-visual,
	.folder-card-wrap:nth-child(2) .folder-card-solo.is-active .folder-visual {
		transform: rotate(25deg) scale(1.3) translateY(-35px);
	}

	/* Responsive */
	@media (max-width: 980px) {
		.folder-card-wrap {
			width: 280px;
			height: 280px;
		}
		.folder-title {
			font-size: 2.2rem;
		}
	}

	@media (max-width: 640px) {
		.folder-grid {
			gap: 3rem 1rem;
		}
		.folder-card-wrap {
			width: 100%;
			height: 240px;
			margin-top: 36px !important;
		}
		.folder-card-solo {
			transform: none !important;
		}
		.folder-title {
			font-size: 2rem;
		}
		.folder-card-wrap:nth-child(2) .folder-visual {
			transform: translateY(-70px);
		}
		.folder-card-wrap:nth-child(2):hover .folder-visual,
		.folder-card-wrap:nth-child(2) .folder-card-solo.is-active .folder-visual {
			transform: rotate(15deg) scale(1.15) translateY(-75px) !important;
		}
		.folder-card-wrap:nth-child(3) .folder-visual {
			transform: translateY(-90px);
		}
		.folder-card-wrap:nth-child(3):hover .folder-visual,
		.folder-card-wrap:nth-child(3) .folder-card-solo.is-active .folder-visual {
			transform: rotate(15deg) scale(1.15) translateY(-95px) !important;
		}
	}
</style>
