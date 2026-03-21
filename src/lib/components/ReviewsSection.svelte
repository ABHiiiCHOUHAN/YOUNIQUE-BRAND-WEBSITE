<script>
  import { onMount } from 'svelte';
  
  const reviews = [
    { text: "Younique didn't just design our brand; they gave us a pulse. Loud, effective, and perfectly chaotic.", author: "Marcus Thorne", role: "CEO, TechVibe", img: "https://i.pravatar.cc/150?u=marcus", shape: "hexagon", color: "#FFD4E9" },
    { text: "The video edits are next level. They understand rhythm better than most musicians.", author: "Sarah Jenkins", role: "Creative Director", img: "https://i.pravatar.cc/150?u=sarah", shape: "circle", color: "#D1E8FF" },
    { text: "Finally, a studio that doesn't follow the safe path. The DEFY mantra is real.", author: "Leo Ricci", role: "Founder, Ricci & Co", img: "https://i.pravatar.cc/150?u=leo", shape: "star", color: "#E2FFD1" },
    { text: "Dynamic, fast, and visually stunning. Our conversion rates are up by 40%.", author: "Amina K.", role: "Marketing Lead", img: "https://i.pravatar.cc/150?u=amina", shape: "hexagon", color: "#FFFAFF" },
    { text: "The energy they bring to every project is infectious. They truly care about the outcome.", author: "James Wilson", role: "Product Manager", img: "https://i.pravatar.cc/150?u=james", shape: "circle", color: "#FFF8D1" },
    { text: "They pushed us to think bigger and bolder. The results speak for themselves.", author: "Elena Rossi", role: "Design Lead", img: "https://i.pravatar.cc/150?u=elena", shape: "star", color: "#D6FFFA" }
  ];

  let scrollContainer;
  let activeIndex = $state(0);
  let interval;
  let isDragging = false;
  let startX;
  let scrollLeft;

  const startAutoPlay = () => {
    stopAutoPlay();
    interval = setInterval(() => {
      activeIndex = (activeIndex + 1) % reviews.length;
      scrollTo(activeIndex);
    }, 4000);
  };

  const stopAutoPlay = () => {
    if (interval) clearInterval(interval);
  };

  const scrollTo = (index) => {
    if (!scrollContainer) return;
    const items = scrollContainer.querySelectorAll('.review-slide');
    if (items[index]) {
      const item = items[index];
      const targetX = item.offsetLeft - (scrollContainer.offsetWidth / 2) + (item.offsetWidth / 2);
      scrollContainer.scrollTo({ left: targetX, behavior: 'smooth' });
      activeIndex = index;
    }
  };

  const next = () => {
    stopAutoPlay();
    activeIndex = (activeIndex + 1) % reviews.length;
    scrollTo(activeIndex);
    startAutoPlay();
  };

  const prev = () => {
    stopAutoPlay();
    activeIndex = (activeIndex - 1 + reviews.length) % reviews.length;
    scrollTo(activeIndex);
    startAutoPlay();
  };

  const handleScroll = () => {
    if (!scrollContainer || isDragging) return;
    const scrollPos = scrollContainer.scrollLeft;
    const index = Math.round(scrollPos / (scrollContainer.scrollWidth / reviews.length));
    
    if (index >= 0 && index < reviews.length && index !== activeIndex) {
      activeIndex = index;
    }
  };

  // Drag Support
  const onMouseDown = (e) => {
    isDragging = true;
    stopAutoPlay();
    scrollContainer.classList.add('dragging');
    startX = e.pageX - scrollContainer.offsetLeft;
    scrollLeft = scrollContainer.scrollLeft;
  };

  const onMouseUp = () => {
    isDragging = false;
    if (scrollContainer) scrollContainer.classList.remove('dragging');
    startAutoPlay();
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainer.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainer.scrollLeft = scrollLeft - walk;
  };

  onMount(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  });
</script>

<section id="reviews" class="reviews-wrap">
  <div class="header-overlay">
    <h2 class="title" style="color: var(--color-5); opacity: 0.1; position: absolute; left: 0; top: 2rem; transform: rotate(-90deg); transform-origin: left top;">FEEDBACK</h2>
    <h2 class="title">CLIENT // VOICES</h2>
  </div>

  <div class="slideshow-container">
    <button class="nav-btn prev" onclick={prev} aria-label="Previous">&larr;</button>
    <button class="nav-btn next" onclick={next} aria-label="Next">&rarr;</button>

    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div 
      class="slides-inner" 
      bind:this={scrollContainer} 
      onscroll={handleScroll}
      onmousedown={onMouseDown}
      onmouseleave={onMouseUp}
      onmouseup={onMouseUp}
      onmousemove={onMouseMove}
    >
      {#each reviews as review, i}
        <div class="review-slide" class:active={i === activeIndex}>
          <div class="paper-note" style="background: {review.color};">
            <img src="/assets/paperclip.jpg" alt="clip" class="paper-clip" />
            
            <div class="client-photo {review.shape}">
               <img src={review.img} alt={review.author} />
            </div>

            <div class="review-content">
              <p class="review-text">"{review.text}"</p>
              <div class="review-meta">
                <span class="author">{review.author}</span>
                <span class="role">{review.role}</span>
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <div class="dots">
    {#each reviews as _, i}
      <button 
        class="dot" 
        class:active={i === activeIndex} 
        onclick={() => { stopAutoPlay(); scrollTo(i); startAutoPlay(); }} 
        aria-label="Go to review {i + 1}"
      ></button>
    {/each}
  </div>
</section>

<style>
  .reviews-wrap {
    padding: 10rem 0; /* No side padding to allow full-width scroll */
    background: var(--color-3);
    position: relative;
    overflow: hidden;
    min-height: 80vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .header-overlay {
    margin-bottom: 4rem;
    text-align: center;
    width: 100%;
    padding: 0 1.5rem;
  }

  .title {
    font-family: 'moon-get', sans-serif;
    font-size: clamp(2.5rem, 6vw, 5rem);
    color: var(--color-5);
    line-height: 1;
    letter-spacing: -0.02em;
    margin: 0;
    text-transform: uppercase;
  }

  .slideshow-container {
    position: relative;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 0;
  }

  .slides-inner {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    gap: 4rem;
    padding: 4rem calc(50% - 350px); /* Center the first/last items */
    -ms-overflow-style: none; /* Hide scrollbar IE/Edge */
    scrollbar-width: none; /* Hide scrollbar Firefox */
    cursor: grab;
    user-select: none;
  }

  .slides-inner:active {
    cursor: grabbing;
    scroll-snap-type: none; /* Disable snap while dragging */
  }

  .slides-inner::-webkit-scrollbar {
    display: none; /* Hide scrollbar Chrome/Safari */
  }

  .review-slide {
    flex: 0 0 700px;
    scroll-snap-align: center;
    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s;
    opacity: 0.4;
    transform: scale(0.9);
    pointer-events: none;
  }

  .review-slide.active {
    opacity: 1;
    transform: scale(1) rotate(1deg);
  }

  .paper-note {
    padding: 4rem 3rem 3rem;
    border: 3px solid #1c1c1c;
    box-shadow: 20px 20px 0px #FDD803;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2rem;
  }

  .paper-clip {
    position: absolute;
    top: -30px;
    left: 40px;
    width: 100px;
    transform: rotate(-15deg);
    z-index: 20;
    pointer-events: none;
    mix-blend-mode: multiply;
  }

  .client-photo {
    width: 120px;
    height: 120px;
    position: absolute;
    top: -40px;
    right: -40px;
    border: 6px solid #fff;
    box-shadow: 8px 8px 0px #1c1c1c, 0 10px 20px rgba(0,0,0,0.1);
    background: #fff;
    z-index: 15;
    overflow: hidden;
  }

  .client-photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* Photo Shapes */
  .client-photo.circle { border-radius: 50%; }
  .client-photo.hexagon { clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%); border-radius: 0; }
  .client-photo.star { clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%); border-radius: 0; }

  .review-text {
    font-size: clamp(1.1rem, 2.5vw, 1.8rem);
    font-weight: 800;
    line-height: 1.3;
    color: #1c1c1c;
    margin: 0 0 2.5rem 0;
    font-style: italic;
    font-family: 'Nauryz', sans-serif;
  }

  .review-meta {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    border-top: 3px solid #1c1c1c;
    padding-top: 1.5rem;
    width: 100%;
  }

  .author {
    font-weight: 900;
    font-size: 1.2rem;
    text-transform: uppercase;
    color: #1c1c1c;
    letter-spacing: 0.05em;
  }

  .role {
    font-size: 0.9rem;
    font-weight: 700;
    color: #1c1c1c;
    opacity: 0.7;
  }

  .nav-btn {
    background: #fff;
    border: 3px solid #1c1c1c;
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
    font-weight: 900;
    cursor: pointer;
    position: absolute;
    top: 50%;
    translate: 0 -50%;
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 6px 6px 0px #1c1c1c;
    transition: all 0.2s;
  }

  .nav-btn.prev { left: 40px; }
  .nav-btn.next { right: 40px; }

  .dots {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
  }

  .dot {
    width: 16px;
    height: 16px;
    border: 3px solid #fff;
    background: transparent;
    cursor: pointer;
    padding: 0;
    transition: all 0.3s;
  }

  .dot.active {
    background: #FDD803;
    width: 30px;
  }

  @media (max-width: 900px) {
    .slides-inner {
      padding: 4rem 1.5rem;
      gap: 2rem;
    }
    .review-slide {
      flex: 0 0 calc(100vw - 3rem);
    }
    .paper-note { padding: 3rem 2rem 2rem; }
    .client-photo { width: 80px; height: 80px; top: -30px; right: 10px; }
    .paper-clip { width: 60px; left: 10px; top: -20px; }
    .nav-btn { display: none; }
  }
</style>

