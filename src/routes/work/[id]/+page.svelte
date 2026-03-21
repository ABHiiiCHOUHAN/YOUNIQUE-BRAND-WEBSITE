<script>
  import CircularGallery from '$lib/components/CircularGallery.svelte';
  import Masonry from '$lib/components/Masonry.svelte';
  let { data } = $props();
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
{:else}
  <article class="deck-page">
    {#if data.project.id !== 8 && data.project.id !== 7}
    <!-- Top Bar -->
    <nav class="deck-nav">
       <span class="left">{data.project.tag}</span>
       <span class="right">{data.project.year || '2024'}</span>
    </nav>
    {/if}

    <!-- Section 1: Minimal Intro -->
    <section class="slide slide--intro">
       <div class="grid">
          <div class="col-left">
             <h1 class="huge-title">{data.project.title.toUpperCase()}</h1>
             
             {#if data.project.id === 1}
               <div class="brand-options-nav">
                  <button class="option-row" onclick={() => document.getElementById('logofolio')?.scrollIntoView({ behavior: 'smooth' })}>
                     <div class="circle">1</div>
                     <div class="line"></div>
                     <div class="label">LOGOFOLIO</div>
                  </button>
                  <button class="option-row" onclick={() => document.getElementById('rebrands')?.scrollIntoView({ behavior: 'smooth' })}>
                     <div class="circle">2</div>
                     <div class="line"></div>
                     <div class="label">REBRANDING</div>
                  </button>
               </div>
             {/if}
          </div>
          <div class="col-right">
             <div class="summary">
                <span class="asterisk">*</span> {data.project.desc}
                <p class="p-rich">
                   {data.project.fullDesc}
                </p>
             </div>
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
         <div id="logofolio" class="gallery-label-header">
            <h2 class="sub-label">01 // LOGOFOLIO</h2>
         </div>
         <div class="gallery-bento layout-1">
            {#each currentSet as item, i}
              <div class="gallery-cell cell-{i}">
                 <img src={item.url} alt={item.title} class="gallery-img" />
                 <div class="cell-overlay">{item.title}</div>
              </div>
            {/each}
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
                         onclick={() => activeBrowserTab = i}
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
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                     </div>
                     <div class="url-input">younique.design/{['concept', 'design', 'launch'][activeBrowserTab]}</div>
                  </div>
               </div>
               
               <!-- Browser Screen / Content Area -->
               <div 
                  class="browser-screen-container"
                  bind:this={desktopContainer}
                  onscroll={handleDesktopScroll}
                  onmouseenter={() => activeScrollTarget = 'desktop'}
                  ontouchstart={() => activeScrollTarget = 'desktop'}
                  role="presentation"
               >
                  {#each [1, 2, 3] as _, i}
                     <img 
                        src="https://picsum.photos/1200/3000?random={i+10}" 
                        alt="Desktop layout mockup" 
                        class="browser-screen-img {activeBrowserTab === i ? 'is-visible' : ''}" 
                     />
                  {/each}
               </div>
            </div>

            <!-- Mobile Browser Mockup -->
            <div class="mobile-browser-element">
               <div class="mobile-browser-head">
                  <div class="mobile-address-bar">younique.design/{['concept', 'design', 'launch'][activeBrowserTab]}</div>
               </div>
               <div 
                  class="mobile-screen-container"
                  bind:this={mobileContainer}
                  onscroll={handleMobileScroll}
                  onmouseenter={() => activeScrollTarget = 'mobile'}
                  ontouchstart={() => activeScrollTarget = 'mobile'}
                  role="presentation"
               >
                  {#each [1, 2, 3] as _, i}
                     <img 
                        src="https://picsum.photos/600/2000?random={i+20}" 
                        alt="Mobile layout mockup" 
                        class="mobile-screen-img {activeBrowserTab === i ? 'is-visible' : ''}" 
                     />
                  {/each}
               </div>
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
         {#if data.project.id !== 8 && data.project.id !== 7}
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
     <section class="slide slide--stats">
        <div class="stats-grid">
           {#each data.project.stats || [] as stat}
             <div class="stat-card">
                <span class="small-icon">*</span>
                <div class="val">{stat.val}</div>
                <div class="label">{stat.label}</div>
             </div>
           {/each}
        </div>
        
        <footer class="deck-footer">
           <a href="/#work" class="back-btn">Back to Portfolio</a>
        </footer>
     </section>
 
   </article>
 {/if}
 
 <style>
   :root {
     --bg-light: #f4f4f4;
     --bg-dark: #3d3d3d;
     --text-dark: #3d3d3d;
     --text-light: #f4f4f4;
   }
 
   .deck-page {
     background: var(--bg-light);
     color: var(--text-dark);
     min-height: 100vh;
     font-family: 'Inter', sans-serif;
   }
 
   .deck-nav {
     display: flex;
     justify-content: space-between;
     padding: 1.5rem 2rem;
     font-size: 0.9rem;
     font-weight: 500;
     text-transform: lowercase;
     opacity: 0.6;
     position: sticky;
     top: 80px; /* Offset for the fixed header */
     z-index: 100;
     background: var(--bg-light);
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
   .asterisk { color: var(--bg-dark); font-weight: 900; }
   .p-rich { margin-top: 2rem; opacity: 0.8; font-size: 1.15rem; }
 
   /* Gallery Section */
   .slide--gallery {
     background: var(--bg-dark);
     color: var(--text-light);
     min-height: 100vh;
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
     background: #fff;
     color: #000;
     border: none;
     width: 50px;
     height: 50px;
     border-radius: 50%;
     font-size: 1.5rem;
     cursor: pointer;
     display: flex;
     align-items: center;
     justify-content: center;
     transition: transform 0.2s, background 0.2s;
   }
   .nav-btn:hover { transform: scale(1.1); background: #eee; }
 
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
     background: #e0e0e0; /* Static placeholder color */
     border: 2px solid #000;
     margin: -1px; /* Overlap borders for single-line look */
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
     background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);
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
   .layout-1 .cell-0 { grid-column: span 2; grid-row: span 2; }
   .layout-1 .cell-1, .layout-1 .cell-2, .layout-1 .cell-3, .layout-1 .cell-4 { grid-column: span 1; grid-row: span 1; }
 
 
   /* 7. Social Media (Portrait / Phone Focus) */
   .layout-7 { grid-template-columns: repeat(5, 1fr); grid-template-rows: repeat(1, 700px); }
   .layout-7 .cell-0, .layout-7 .cell-1, .layout-7 .cell-2, .layout-7 .cell-3, .layout-7 .cell-4 { 
     grid-column: span 1; 
     grid-row: span 1; 
   }
 
   /* 8. Video Editing (Cinematic Horizontal + Vertical Reels) */
   .layout-8 { grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(2, 400px); }
   .layout-8 .cell-0 { grid-column: span 2; grid-row: span 1; } /* Horizontal Feature */
   .layout-8 .cell-1 { grid-column: span 1; grid-row: span 2; } /* Vertical Reel Feature */
   .layout-8 .cell-2 { grid-column: span 1; grid-row: span 1; }
   .layout-8 .cell-3 { grid-column: span 1; grid-row: span 1; }
   .layout-8 .cell-4 { display: none; } /* Focus on the 4 key slots per set */
 
   /* 9. Graphics & Print (Asymmetric Magazine Layout) */
   .layout-9 { grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(2, 450px); }
   .layout-9 .cell-0 { grid-column: span 1; grid-row: span 2; } /* Vertical Feature */
   .layout-9 .cell-1 { grid-column: span 2; grid-row: span 1; } /* Wide Top */
   .layout-9 .cell-2, .layout-9 .cell-3 { grid-column: span 1; grid-row: span 1; }
   .layout-9 .cell-4 { grid-column: span 1; grid-row: span 1; visibility: hidden; }
 
   /* 10. 3D Models (Sculptural Layout) */
   .layout-10 { grid-template-columns: repeat(4, 1fr); grid-template-rows: repeat(2, 450px); }
   .layout-10 .cell-0 { grid-column: span 2; grid-row: span 2; } /* Removed arched feature for square look */
   .layout-10 .cell-1 { grid-column: span 2; grid-row: span 1; }
   .layout-10 .cell-2, .layout-10 .cell-3 { grid-column: span 1; grid-row: span 1; }
   .layout-10 .cell-4 { grid-column: span 2; grid-row: span 1; visibility: hidden; }

   /* 3. Neo-Brutalist Interactive Browser */
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
      background: var(--color-4); /* Green */
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
      background: var(--color-1); /* Yellow */
      z-index: 5;
      padding-bottom: 0.9rem; 
   }

   .browser-controls {
      display: flex;
      gap: 1rem;
      align-items: center;
      padding-bottom: 0.8rem;
   }

   .ctrl-min { width: 16px; height: 3px; background: var(--color-3); border-radius: 2px; }
   .ctrl-max { width: 14px; height: 14px; border: 3px solid var(--color-3); border-radius: 2px; }
   .ctrl-close { font-size: 2rem; line-height: 0.5; font-weight: 900; color: var(--color-3); margin-top: -2px; }

   .browser-toolbar {
      background: var(--color-1);
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
      background: var(--color-2); /* Blue */
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
      background: #FFF;
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
      background: var(--color-4); /* Green scrollbar */
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
      background: var(--color-1);
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
      background: #FFF;
      overflow-y: auto; /* Enable native scrolling */
      overflow-x: hidden;
   }

  .placeholder-bg {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #e0e0e0 0%, #d0d0d0 100%);
  }

  /* Stats Section */
  .slide--stats {
    background: var(--bg-light);
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
  }

  .stat-card {
    background: #fff;
    padding: 3rem;
    border-radius: 40px;
    min-height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    border: 1px solid rgba(0,0,0,0.05);
  }
  .stat-card:first-child { background: var(--bg-dark); color: #fff; }

  .small-icon { font-weight: 900; font-size: 1.5rem; }
  .val { font-size: 4rem; font-weight: 900; margin-top: 1rem; line-height: 0.9; letter-spacing: -0.05em; }
  .label { font-size: 1rem; opacity: 0.6; margin-top: 1rem; text-transform: uppercase; font-weight: 600; }

  .deck-footer {
    max-width: 1400px;
    margin: 6rem auto 0;
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .back-btn {
    padding: 1.25rem 4rem;
    background: var(--bg-dark);
    color: #fff;
    text-decoration: none;
    border-radius: 999px;
    font-weight: 800;
    text-transform: uppercase;
    transition: transform 0.3s ease;
  }
  .back-btn:hover { transform: scale(1.05); }

  /* --- BRAND SECTION NAVIGATION --- */
  .brand-options-nav {
    margin-top: 4rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .option-row {
    display: flex;
    align-items: center;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    text-align: left;
    transition: opacity 0.3s;
  }

  .option-row:hover {
    opacity: 0.7;
  }

  .circle {
    width: 42px;
    height: 42px;
    border: 2px solid #3d3d3d;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: 1.2rem;
    color: #3d3d3d;
    flex-shrink: 0;
  }

  .line {
    height: 1px;
    background: #3d3d3d;
    width: 80px;
    margin: 0 1rem;
    opacity: 0.4;
  }

  .label {
    font-family: var(--font-nauryz); /* Stylized font */
    font-size: 1.4rem;
    color: #3d3d3d;
    letter-spacing: 0.1em;
    font-weight: 500;
  }

  .gallery-label-header {
     max-width: 1400px;
     margin: 0 auto 3rem;
     width: 100%;
     border-bottom: 1px solid rgba(255,255,255,0.1);
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
    .line { width: 40px; }
    .label { font-size: 1.1rem; }
    .stat-card { padding: 2rem; min-height: 200px; }
    .val { font-size: 2.5rem; }
    
    /* Browser Mobile Scaling */
    .browser-mockup-wrapper { 
        padding: 4rem 1rem 8rem; 
        flex-direction: column;
        align-items: center;
        gap: 2rem;
    }
    .browser-head { padding: 0.5rem 0.5rem 0 0.5rem; }
    .browser-tab { padding: 0.4rem 1.2rem; font-size: 0.8rem; margin-bottom: -4px;}
    .browser-controls { display: none; }
    .browser-toolbar { padding: 0.5rem 1rem; gap: 0.8rem; }
    .nav-arrows { font-size: 1.2rem; gap: 0.6rem; }
    .url-input { font-size: 0.8rem; }
    .browser-screen-container { height: 400px; }
    .mobile-browser-element { width: 100%; max-width: 320px; height: 500px; }
    .mobile-screen-container { height: auto; }
  }
</style>
