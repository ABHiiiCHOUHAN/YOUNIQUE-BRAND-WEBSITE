<script>
  import { onMount } from 'svelte';
  
  const reviews = [
    { text: "Spent six weeks debating a single bezier curve and I've never been happier. The Fintech Identity they built for us didn't just 'look cool'—it tripled our sign-up rate in a month.", author: "Neha Sharma", role: "Founder // BLR", img: "https://i.pravatar.cc/150?u=neha", shape: "hexagon", color: "#FFD4E9" },
    { text: "Most studios take the safe route. These guys basically forced us to be bolder. The Video Campaign they cut for our launch had people literally stopping their scroll. Zero fluff.", author: "Rahul Kapoor", role: "Creative Lead // HYD", img: "https://i.pravatar.cc/150?u=rahul", shape: "circle", color: "#D1E8FF" },
    { text: "The website they architected actually handles our massive traffic spikes without flinching. It's fast, it's weird, and it's perfect. Easily the best investment we made this year.", author: "Arjun Mehta", role: "Tech Founder // IND", img: "https://i.pravatar.cc/150?u=arjun", shape: "star", color: "#FFE499" },
    { text: "I thought our branding was fine. Then I saw what they did with our Logofolio and realized we were just invisible. They gave us an edge that genuinely scares our competitors.", author: "Priya Das", role: "CEO, Indigo // DEL", img: "https://i.pravatar.cc/150?u=priya", shape: "hexagon", color: "#E2FFD1" },
    { text: "Strategic ROI is rarely this visible. We stopped being 'just another app' and started being a destination. No marketing bullshit, just pure visual results.", author: "Ananya Iyer", role: "Marketing Director // CHN", img: "https://i.pravatar.cc/150?u=ananya", shape: "circle", color: "#FFFAFF" },
    { text: "Technical mastery combined with fearless creativity. They didn't just give us a logo; they gave us a pulse. A rare breed in a template-driven world.", author: "Thomas Müller", role: "Sys Architect // GER", img: "https://i.pravatar.cc/150?u=thomas", shape: "star", color: "#D6FFFA" },
    { text: "Dynamic, fast, and visually stunning. Our conversion rates are up by 40% after the re-brand. They understand the psychology of the scroll better than anyone.", author: "Amina K.", role: "Growth Lead // UAE", img: "https://i.pravatar.cc/150?u=amina", shape: "hexagon", color: "#D1FFF8" },
    { text: "The London scene was wowed. They brought exactly the edge we needed for our Fashion Launch. It's rare to find a team this obsessed with the details.", author: "Claire Bennett", role: "Editor, Luxe // UK", img: "https://i.pravatar.cc/150?u=claire", shape: "circle", color: "#E8D1FF" },
    { text: "They turned 'impossible' into a structured checklist that looked incredible. The result is an interface that feels alive.", author: "Hitoshi Sato", role: "Digital Artist // JPN", img: "https://i.pravatar.cc/150?u=hitoshi", shape: "star", color: "#D1D5FF" },
    { text: "Simple, direct, and incredibly effective. They truly care about the outcome and push us to think bigger and bolder every single day.", author: "Amara Okafor", role: "Brand Strategist // NGA", img: "https://i.pravatar.cc/150?u=amara", shape: "hexagon", color: "#FFD1D1" }
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

  const onMouseLeave = () => {
    if (isDragging) onMouseUp();
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
      onmouseup={onMouseUp}
      onmousemove={onMouseMove}
      onmouseleave={onMouseLeave}
    >
      {#each reviews as review, i}
        <div class="review-slide stagger-item" style:animation-delay="{i * 0.1}s" class:active={i === activeIndex}>
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
  @font-face {
    font-family: 'ShadowsIntoLight';
    src: url('/fonts/ShadowsIntoLight-Regular.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  .reviews-wrap {
    padding: 10rem 0; /* No side padding to allow full-width scroll */
    background: #3d3d3d;
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
    font-family: 'Rubik Mono One', sans-serif;
    font-size: clamp(2.5rem, 6vw, 5rem);
    color: var(--color-5);
    line-height: 1;
    letter-spacing: -0.05em;
    margin: 0;
    text-transform: uppercase;
  }

  :global(.dark) .title {
    color: var(--color-1);
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
    padding: 4rem calc(50% - 275px); /* Center based on 550px width */
    -ms-overflow-style: none; /* Hide scrollbar IE/Edge */
    scrollbar-width: none; /* Hide scrollbar Firefox */
    cursor: grab;
    user-select: none;
  }

  .slides-inner:active {
    cursor: grabbing;
  }

  /* Force instant scrolling during drag for smoothness */
  .slides-inner.dragging {
    scroll-behavior: auto !important;
    scroll-snap-type: none !important;
  }

  .slides-inner::-webkit-scrollbar {
    display: none; /* Hide scrollbar Chrome/Safari */
  }

  .review-slide {
    flex: 0 0 550px; /* Reduced from 700px */
    scroll-snap-align: center;
    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s;
    opacity: 0.4;
    transform: scale(0.9);
  }

  .review-slide.active {
    opacity: 1;
    transform: scale(1) rotate(1deg);
  }

  .paper-note {
    padding: 3rem 2.5rem 2.5rem; /* Reduced padding */
    border: 4px solid #1c1c1c;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
    filter: brightness(0.96) contrast(1.02); /* Seamless tint */
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
    z-index: 15;
    overflow: hidden;
    filter: grayscale(1) contrast(1.1) opacity(0.9); /* Premium minimal tint */
  }

  .client-photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none; /* Let drag events pass to container */
    user-select: none;
    -webkit-user-drag: none;
  }

  /* Photo Shapes */
  .client-photo.circle { border-radius: 50%; }
  .client-photo.hexagon { 
    clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%); 
    border-radius: 20%; 
  }
  .client-photo.star { 
    clip-path: polygon(50% 2%, 68% 35%, 98% 38%, 78% 62%, 88% 98%, 50% 82%, 12% 98%, 22% 62%, 2% 38%, 32% 35%);
    border-radius: 35%;
  }

  .review-text {
    font-family: 'ShadowsIntoLight', cursive;
    font-size: clamp(1.4rem, 2.8vw, 2.2rem); /* Significantly smaller as requested */
    font-weight: 400;
    line-height: 1.2;
    color: #1c1c1c;
    margin: 0 0 1.5rem 0;
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
      flex: 0 0 280px;
    }
    .paper-note { 
      padding: 3rem 2rem; 
      aspect-ratio: 1 / 1.1;
      justify-content: center;
    }
    .client-photo { width: 80px; height: 80px; top: -30px; right: 10px; }
    .paper-clip { width: 60px; left: 10px; top: -20px; }
    .review-text { font-size: 1.1rem; line-height: 1.4; margin-bottom: 1rem; }
    .nav-btn { display: none; }
  }
</style>

