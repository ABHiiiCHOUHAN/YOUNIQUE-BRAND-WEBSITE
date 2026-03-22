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
    <h1 class="logo-title">LOGOFOLIO // ARC</h1>
  </header>

  <section class="menu-wrap">
    {#if logos.length > 0}
      <InfiniteMenu items={logos} />
    {:else}
      <div class="loading">CALIBRATING SYSTEM...</div>
    {/if}
  </section>

  <footer class="page-footer">
    <div class="status-box">
      <span class="dot"></span>
      <span class="label">LIVE 3D RECONSTRUCTION</span>
    </div>
    <div class="instruction">DRAG TO ROTATE // INTERACT TO FOCUS</div>
  </footer>
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

  .page-footer {
    position: absolute;
    bottom: 2rem;
    left: 2rem;
    right: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 100;
    pointer-events: none;
  }

  .status-box {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(0,0,0,0.8);
    padding: 0.5rem 1rem;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .dot {
    width: 8px;
    height: 8px;
    background: var(--color-1);
    border-radius: 50%;
    box-shadow: 0 0 10px var(--color-1);
    animation: blink 1s infinite;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  .label {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.1em;
  }

  .instruction {
    font-size: 0.7rem;
    opacity: 0.5;
    font-weight: 700;
    letter-spacing: 0.05em;
  }
</style>
