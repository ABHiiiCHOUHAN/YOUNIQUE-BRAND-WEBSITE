<script>
  const skills = [
    { name: 'Soft Skills', desc: 'Emotional intelligence and effortless communication.', color: '#FDD803' },
    { name: 'Hard Skills', desc: 'Technical mastery over the tools of the trade.', color: '#6EB0CA' },
    { name: 'Thinking', desc: 'Strategic loops and structure-first methodology.', color: '#FF70A6' },
    { name: 'Problem Solving', desc: 'Turning "impossible" into a structured checklist.', color: '#84AD82' },
    { name: 'Customer Service', desc: 'Human-centric support for high-end results.', color: '#A855F7' }
  ];
</script>

<section id="skills" class="skills-wrap">
  <div class="arsenal-damage-grid">
    <!-- THE ARSENAL -->
    <div class="arsenal-box stagger-item" style="animation-delay: 0.1s;">
      <div class="box-label">THE ARSENAL</div>
      <h2 class="box-title">CORE // SKILLS</h2>
      <ul class="skills-list">
        <li>Visual Identity</li>
        <li>Digital Spaces</li>
        <li>Creative Direction</li>
        <li>Structured Chaos</li>
      </ul>
    </div>

    <!-- THE DAMAGE -->
    <div class="damage-box stagger-item" style="animation-delay: 0.25s;">
      <div class="box-label">THE DAMAGE</div>
      <h2 class="box-title">BY THE NUMBERS</h2>
      <ul class="stats-list">
        <li><span>45+</span> Brands Disrupted</li>
        <li><span>100%</span> Cookie-Cutter Free</li>
        <li><span>3+</span> Years Defying Defaults</li>
      </ul>
    </div>
  </div>
</section>

<style>
  .skills-wrap {
    padding: 8rem clamp(1rem, 5vw, 4rem);
    background: var(--color-5);
  }

  .arsenal-damage-grid {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: 3rem;
    max-width: 1400px;
    margin: 0 auto;
  }

  .arsenal-box, .damage-box {
    background: var(--color-5);
    border: 4px solid var(--color-3);
    padding: clamp(2rem, 5vw, 4rem);
    position: relative;
    box-shadow: 12px 12px 0px var(--color-3);
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .arsenal-box {
    background: var(--color-2); /* A nice accent color for the arsenal */
  }

  .damage-box {
    background: transparent;
    border: none;
    box-shadow: none;
    padding: 2rem 0;
    transform: translateX(-1.5rem); /* The requested slight left bias */
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    align-items: flex-start;
  }

  :global(.dark) .arsenal-box {
    background: #3d3d3d;
    border-color: #fff;
    box-shadow: 12px 12px 0px #000;
    color: #fff;
  }

  :global(.dark) .damage-box {
    background: #2a2a2a;
    border-color: #fff;
    box-shadow: 12px 12px 0 #000;
    color: #fff;
  }

  .box-label {
    font-family: 'Rubik Mono One', sans-serif;
    font-size: 0.85rem;
    opacity: 0.6;
    letter-spacing: 0.1em;
  }

  .box-title {
    font-family: 'Rubik Mono One', sans-serif;
    font-size: clamp(2rem, 4vw, 3.5rem);
    line-height: 1;
    margin: 0;
    letter-spacing: -0.05em;
  }

  .skills-list, .stats-list {
    list-style: none;
    padding: 0;
    margin: 2rem 0 0;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .skills-list li {
    font-family: var(--font-heading);
    font-size: clamp(1.8rem, 3vw, 2.8rem);
    font-weight: 900;
    text-transform: uppercase;
    line-height: 0.9;
    letter-spacing: -0.02em;
  }

  .stats-list li {
    font-family: var(--font-secondary);
    font-size: 1.4rem;
    font-weight: 700;
  }

  .stats-list span {
    display: block;
    font-family: 'Rubik Mono One', sans-serif;
    font-size: 3rem;
    color: var(--color-1);
    -webkit-text-stroke: 1.5px #000;
    text-shadow: 4px 4px 0 #000;
    line-height: 1;
    margin-bottom: 0.25rem;
  }

  @media (max-width: 1024px) {
    .arsenal-damage-grid {
      grid-template-columns: 1fr;
      gap: 5rem;
    }
    .damage-box {
      transform: none;
    }
  }

  @media (max-width: 768px) {
    .skills-wrap {
      padding: 5rem 1.5rem;
    }
    .box-title {
      font-size: 2rem;
    }
    .skills-list li {
      font-size: 1.8rem;
    }
    .stats-list span {
      font-size: 2.5rem;
    }
  }
</style>
