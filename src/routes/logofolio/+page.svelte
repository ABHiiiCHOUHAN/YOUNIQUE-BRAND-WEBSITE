<script>
	import InfiniteMenu from '$lib/components/InfiniteMenu.svelte';
	import { onMount } from 'svelte';
	import logoData from '$lib/data/logofolio.json';

	let { data } = $props();

	let logos = $derived(
		logoData.map((d, i) => ({
			...d,
			image: `/assets/branding/logofolio/${i + 1}.png`
		}))
	);
</script>

<div class="logofolio-page">
	<header class="page-header">
		<a href="/" class="back-link">← EXIT PROJECT</a>
		<h1 class="logo-title">LOGOFOLIO | ARC</h1>
	</header>

	<section class="menu-wrap">
		{#if logos.length > 0}
			<InfiniteMenu items={logos} />
		{:else}
			<div class="loading">CALIBRATING SYSTEM...</div>
		{/if}
	</section>
</div>

<style>
	.logofolio-page {
		min-height: 100vh;
		background: #1c1c1c;
		color: #fff;
		font-family: var(--font-secondary);
		position: relative;
		overflow: hidden;
	}

	.page-header {
		position: absolute;
		top: 2rem;
		left: 2rem;
		right: 2rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		z-index: 100;
	}

	.back-link {
		font-family: 'Rubik Mono One', sans-serif;
		font-size: 0.8rem;
		color: var(--color-1);
		text-decoration: none;
		background: #000;
		padding: 0.5rem 1rem;
		border: 2px solid #000;
		box-shadow: 4px 4px 0 var(--color-1);
		transition: all 0.2s ease;
	}

	.back-link:hover {
		transform: translate(-2px, -2px);
		box-shadow: 6px 6px 0 var(--color-1);
	}

	.logo-title {
		font-family: 'Rubik Mono One', sans-serif;
		font-size: clamp(1rem, 4vw, 2rem);
		opacity: 0.4;
		text-align: right;
	}

	.menu-wrap {
		width: 100%;
		height: 100vh;
	}

	.loading {
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: 'Rubik Mono One', sans-serif;
		color: var(--color-1);
	}
</style>
