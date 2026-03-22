<script>
  let { data } = $props();
</script>

<div class="maintenance-void">
  <div class="marquee-back marquee-1">
    <div class="track">
      <span>SYSTEM UPGRADE IN PROGRESS ●&nbsp;</span>
      <span>SYSTEM UPGRADE IN PROGRESS ●&nbsp;</span>
      <span>SYSTEM UPGRADE IN PROGRESS ●&nbsp;</span>
      <span>SYSTEM UPGRADE IN PROGRESS ●&nbsp;</span>
    </div>
  </div>
  
  <div class="marquee-back marquee-2">
    <div class="track">
      <span>SYSTEM UPGRADE IN PROGRESS ●&nbsp;</span>
      <span>SYSTEM UPGRADE IN PROGRESS ●&nbsp;</span>
      <span>SYSTEM UPGRADE IN PROGRESS ●&nbsp;</span>
      <span>SYSTEM UPGRADE IN PROGRESS ●&nbsp;</span>
    </div>
  </div>

  <div class="hero-center">
    <header class="standalone-header">
      <div class="brand-logo" role="img" aria-label="Younique Design Studio"></div>
    </header>

    <div class="message-box">
      <div class="tape-sticker">
        <div class="bg-digits">
          <span>5</span>
          <span class="hidden">0</span>
          <span>2</span>
        </div>
        <div class="fg-digits">
          <span class="drop-char drop-5">5</span>
          <span class="twitch-0">0</span>
          <span class="drop-char drop-2">2</span>
        </div>
      </div>
      <p class="desc">
        Our systems are currently undergoing a structural realignment to bring you 
        the next evolution of <span class="accent">digital chaos.</span> 
        We'll be back louder and sharper.
      </p>
      
      <div class="progress-bar">
        <div class="bar-inner"></div>
      </div>
      
      <div class="footer-meta">
        <span class="est">EST. RESYNC: T-MINUS SHORTLY</span>
        <div class="social-tray">
          <a href="#x" class="pill">X (TWITTER)</a>
          <a href="#ig" class="pill">INSTAGRAM</a>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .maintenance-void {
    min-height: 100vh;
    background: #3d3d3d;
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    position: relative;
    overflow: hidden;
    font-family: var(--font-secondary);
  }

  .marquee-back {
    position: absolute;
    top: 50%;
    left: -10vw;
    width: 120vw;
    background: var(--color-1);
    padding: 0.75rem 0;
    border-top: 4px solid #000;
    border-bottom: 4px solid #000;
    overflow: hidden;
    display: flex;
    white-space: nowrap;
    z-index: 1;
  }

  .marquee-1 {
    transform: translateY(-50%) rotate(-3deg);
  }

  .marquee-2 {
    transform: translateY(-50%) rotate(2deg);
  }

  .track {
    display: flex;
    animation: scroll 30s linear infinite;
    font-family: 'Rubik Mono One', sans-serif;
    font-size: 0.8rem;
    color: #000;
  }

  @keyframes scroll {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }

  .standalone-header {
    position: absolute;
    top: 5rem;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    z-index: 50;
  }

  .brand-logo {
    width: 350px;
    height: 70px;
    background: #fff;
    display: block;
    -webkit-mask-image: url('/assets/2_site_logo.svg');
    mask-image: url('/assets/2_site_logo.svg');
    -webkit-mask-size: contain;
    mask-size: contain;
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-position: center;
    mask-position: center;
  }

  .message-box {
    background: #4f4f4f;
    border: 4px solid #000;
    padding: 2.5rem;
    max-width: 500px;
    width: 100%;
    box-shadow: 15px 15px 0 #000;
    position: relative;
    z-index: 10;
    color: #fff;
    transform: rotate(-1deg);
    margin-top: 4rem; /* space for logo */
  }

  .desc {
    font-size: 1.25rem;
    font-weight: 700;
    line-height: 1.4;
    margin-bottom: 2rem;
  }

  .accent {
    color: #ff0044;
    text-decoration: underline;
    text-decoration-thickness: 3px;
    text-underline-offset: 4px;
  }

  .progress-bar {
    height: 30px;
    background: rgba(0,0,0,0.3);
    border: 3px solid #000;
    margin-bottom: 2rem;
    position: relative;
    overflow: hidden;
  }

  .bar-inner {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 65%;
    background: var(--color-2);
    animation: pulse-progress 4s ease-in-out infinite alternate;
  }

  @keyframes pulse-progress {
    from { width: 55%; }
    to { width: 75%; }
  }

  .footer-meta {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .est {
    font-family: 'Rubik Mono One', sans-serif;
    font-size: 0.75rem;
    opacity: 0.6;
    letter-spacing: 0.1em;
  }

  .social-tray {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .pill {
    padding: 0.6rem 1.2rem;
    background: #000;
    color: #f4f4f4;
    text-decoration: none;
    border-radius: 999px;
    font-weight: 800;
    font-size: 0.8rem;
    letter-spacing: 0.05em;
    transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
    border: 2px solid #000;
  }

  .pill:hover {
    background: #fff;
    color: #000;
    transform: translateY(-2px);
    box-shadow: 4px 4px 0 #000;
  }

  .tape-sticker {
    position: absolute;
    top: -45px;
    left: -15px;
    background: #ff0044;
    padding: 0.5rem 2rem;
    font-family: var(--kinetic-font-2), monospace; /* Kinetic-LLPixel */
    font-size: 2.5rem;
    font-weight: 900;
    transform: rotate(2deg);
    box-shadow: 4px 4px 0 #000;
    z-index: 50;
    border: 3px solid #000;
  }

  .bg-digits {
    color: #990025; /* Darker red footprint */
    display: flex;
    gap: 2px;
  }

  .bg-digits .hidden {
    visibility: hidden;
  }

  .fg-digits {
    position: absolute;
    top: 0.5rem;
    left: 2rem;
    bottom: 0.5rem;
    right: 2rem;
    color: #fff;
    display: flex;
    gap: 2px;
    pointer-events: none;
  }

  .drop-char {
    display: inline-block;
    animation: glitchDropOut 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  .drop-5 { animation-delay: 2.3s; }
  .drop-2 { animation-delay: 2s; }

  .twitch-0 {
    display: inline-block;
    animation: stopMotionTwitch 0.4s infinite;
    transform-origin: center;
  }

  @keyframes stopMotionTwitch {
    0%, 49.9% { transform: rotate(-5deg) translate(-1px, 1px); }
    50%, 100% { transform: rotate(5deg) translate(2px, -1px); }
  }

  @keyframes glitchDropOut {
    0% {
      transform: translate(0, 0) scale(1) rotate(0deg);
    }
    5% {
      transform: translate(-5px, -8px) scale(1.1) rotate(-8deg); /* POP */
      filter: drop-shadow(4px 4px 0px rgba(0,0,0,0.5));
    }
    8% {
      transform: translate(4px, -5px) scale(1.15) rotate(5deg); /* GLITCH */
      filter: drop-shadow(-4px 2px 0px rgba(0,0,0,0.5));
    }
    12% {
      transform: translate(-2px, -2px) scale(1.1) rotate(0deg); /* SETTLE SLIGHTLY */
    }
    15% {
      transform: translate(0, 0) scale(1.05) rotate(0deg); /* PAUSE BEFORE DROP */
    }
    100% {
      transform: translate(20px, 850px) rotate(45deg); /* MASSIVE FALL */
    }
  }

  @media (max-width: 768px) {
    .message-box { padding: 2rem; transform: none; }
    .standalone-header { top: 3.5rem; }
  }
</style>
