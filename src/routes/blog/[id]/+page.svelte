<script>
  let { data } = $props();
  let post = $derived(data.post);
  
  // Reading Progress Logic
  let scrollY = $state(0);
  let pageHeight = $state(0);
  let progress = $derived(Math.min(100, (scrollY / (pageHeight - 800)) * 100));

  import { onMount } from 'svelte';
  onMount(() => {
    pageHeight = document.documentElement.scrollHeight;
  });
</script>

<svelte:window bind:scrollY />

<svelte:head>
  <title>{post.title} // YOUNIQUE</title>
</svelte:head>

<!-- Reading Progress Bar -->
<div class="reading-progress" style="width: {progress}%"></div>

<div class="grain-overlay"></div>

<nav class="blog-nav">
  <a href="/#blog" class="back-btn">&larr; BACK TO FEED</a>
</nav>

<main class="page-transition">
  <article class="post-detail">
    <header class="header-section">
      <div class="meta">
        <span class="category">DESIGN // MANIFESTO</span>
        <time class="date">{post.date}</time>
      </div>
      <h1 class="title">{post.title}</h1>
    </header>

    <div class="image-hero">
      {#if post.image}
        <img src={post.image} alt={post.title} class="hero-img" />
      {/if}
      <div class="id-tag">ID: {post.id.toString().slice(-4)}</div>
    </div>

    <div class="content">
      {post.content || post.excerpt}
    </div>

    <footer class="post-footer">
        <div class="footer-line"></div>
        <p class="end-text">END OF RECORD // DEFY THE DEFAULT</p>
    </footer>
  </article>
</main>

<style>
  .reading-progress {
    position: fixed;
    top: 0;
    left: 0;
    height: 6px;
    background: var(--color-1);
    z-index: 2000;
    transition: width 0.1s;
    border-bottom: 2px solid #000;
  }

  .grain-overlay {
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    opacity: 0.05;
    pointer-events: none;
    z-index: 1000;
  }

  .blog-nav {
    position: fixed;
    top: 8rem; /* Moved down to clear the main header logo */
    left: 2rem;
    z-index: 1500;
  }

  .back-btn {
    background: var(--color-5);
    border: 3px solid #000;
    padding: 0.8rem 1.5rem;
    font-weight: 900;
    text-decoration: none;
    color: #000;
    box-shadow: 6px 6px 0px #000;
    transition: all 0.2s;
    font-size: 0.9rem;
    display: inline-block;
  }

  .back-btn:hover {
    transform: translate(-2px, -2px);
    box-shadow: 10px 10px 0px #000;
    background: var(--color-1);
  }

  .post-detail {
    max-width: 900px;
    margin: 0 auto;
    padding: 8rem 2rem;
    background: var(--color-5);
    min-height: 100vh;
    border-left: 4px solid #000;
    border-right: 4px solid #000;
    box-shadow: 30px 0 0 rgba(0,0,0,0.05), -30px 0 0 rgba(0,0,0,0.05);
  }

  .header-section {
    margin-bottom: 4rem;
  }

  .meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 4px solid #000;
    padding-bottom: 1.5rem;
    margin-bottom: 2rem;
  }

  .category {
    font-weight: 900;
    background: #000;
    color: var(--color-1);
    padding: 0.2rem 0.8rem;
    font-size: 0.8rem;
  }

  .date {
    font-weight: 700;
    font-size: 0.9rem;
    opacity: 0.6;
  }

  .title {
    font-family: var(--font-heading);
    font-size: clamp(2.5rem, 8vw, 5rem);
    line-height: 0.9;
    letter-spacing: -0.04em;
    margin: 0;
    color: var(--color-3);
    text-transform: uppercase;
  }

  .image-hero {
    width: 100%;
    margin: 0 0 5rem 0;
    position: relative;
    border: 4px solid #000;
    box-shadow: 15px 15px 0px var(--color-4);
    background: #000;
    overflow: hidden;
  }

  .hero-img {
    width: 100%;
    height: auto;
    display: block;
    filter: contrast(1.1) brightness(0.9);
  }

  .id-tag {
    position: absolute;
    bottom: 20px;
    right: 20px;
    background: var(--color-1);
    color: #000;
    padding: 0.5rem 1rem;
    font-weight: 900;
    border: 3px solid #000;
    font-family: monospace;
  }

  .content {
    font-size: clamp(1.1rem, 2vw, 1.4rem);
    line-height: 1.6;
    white-space: pre-wrap;
    color: var(--color-3);
    font-family: var(--font-secondary);
    font-weight: 500;
    column-count: 1;
    margin-bottom: 6rem;
  }

  .content::first-letter {
    font-size: 4rem;
    font-weight: 900;
    float: left;
    line-height: 0.8;
    margin-right: 0.5rem;
    background: #000;
    color: #fff;
    padding: 0.5rem;
    border: 3px solid var(--color-1);
    transform: rotate(-3deg);
  }

  .post-footer {
    padding-top: 4rem;
    text-align: center;
  }

  .footer-line {
      height: 4px;
      background: #000;
      margin-bottom: 2rem;
  }

  .end-text {
      font-weight: 900;
      font-size: 0.8rem;
      letter-spacing: 0.2em;
      opacity: 0.4;
  }

  @media (max-width: 768px) {
    .post-detail {
        padding: 6rem 1.5rem;
        border: none;
        box-shadow: none;
    }
    .title { font-size: 3rem; }
    .blog-nav { top: 1rem; left: 1rem; }
    .back-btn { padding: 0.5rem 1rem; font-size: 0.8rem; }
  }
</style>
