<script>
  let { data } = $props();
  let post = $derived(data.post);
</script>

<svelte:head>
  <title>{post.title} - Younique</title>
</svelte:head>

<main class="page-transition">
  <article class="post-detail">
    <header class="header-section">
      <div class="meta">
        <time class="date">{post.date}</time>
      </div>
      <h1 class="title">{post.title}</h1>
    </header>

    <figure class="post-image-placeholder">
      {#if post.image}
        <img src={post.image} alt={post.title} />
      {:else}
        <!-- Brutalist placeholder graphic -->
        <div class="placeholder-graphic">
           <svg viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
             <polygon points="0,0 100,0 100,100" fill="var(--color-1)" opacity="0.8" />
             <polygon points="0,100 100,100 0,0" fill="var(--color-4)" opacity="0.8" />
             <circle cx="50" cy="50" r="20" fill="var(--color-5)" stroke="var(--color-3)" stroke-width="3" />
           </svg>
           <span class="placeholder-text">IMG // PLACEHOLDER</span>
        </div>
      {/if}
    </figure>

    <div class="content">
      {post.content || post.excerpt}
    </div>
  </article>
</main>

<style>
  .post-detail {
    max-width: 800px;
    margin: 0 auto;
    padding: 6rem 2rem;
    min-height: 80vh;
  }

  .header-section {
    margin-bottom: 3rem;
  }

  .meta {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border-bottom: 3px solid var(--color-3);
    padding-bottom: 1rem;
    margin-bottom: 3rem;
  }

  .date {
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    opacity: 0.7;
  }

  .title {
    font-family: var(--font-heading);
    font-size: clamp(3rem, 6vw, 4.5rem);
    letter-spacing: -0.03em;
    line-height: 1.1;
    margin: 0;
  }

  /* Image Placeholder */
  .post-image-placeholder {
    width: 100%;
    height: clamp(250px, 40vw, 450px);
    margin: 0 0 3rem 0;
    border: 4px solid var(--color-3);
    border-radius: 20px;
    overflow: hidden;
    position: relative;
    box-shadow: 10px 10px 0px var(--color-3);
    background: var(--color-2);
  }

  .post-image-placeholder img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .placeholder-graphic {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .placeholder-graphic svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .placeholder-text {
    position: relative;
    z-index: 10;
    font-family: var(--font-heading);
    font-size: clamp(1.5rem, 4vw, 3rem);
    font-weight: 900;
    color: var(--color-3);
    background: var(--color-5);
    padding: 0.5rem 1.5rem;
    border: 3px solid var(--color-3);
    transform: rotate(-4deg);
    box-shadow: 4px 4px 0px var(--color-3);
  }

  .content {
    font-size: 1.25rem;
    line-height: 1.8;
    white-space: pre-wrap;
    color: var(--color-3);
  }
</style>
