<script>
  const skills = [
    { name: 'Soft Skills', desc: 'Emotional intelligence and effortless communication.', color: '#FDD803' },
    { name: 'Hard Skills', desc: 'Technical mastery over the tools of the trade.', color: '#6EB0CA' },
    { name: 'Thinking', desc: 'Strategic loops and structure-first methodology.', color: '#FF70A6' },
    { name: 'Problem Solving', desc: 'Turning "impossible" into a structured checklist.', color: '#84AD82' },
    { name: 'Customer Service', desc: 'Human-centric support for high-end results.', color: '#A855F7' }
  ];
</script>

<section id="skills" class="skills-wrap animate-section">
  <div class="header-overlay">
    <h2 class="title">CORE // SKILLS</h2>
  </div>

  <div class="skills-grid">
    {#each skills as skill}
      <div class="skill-card" style="--card-bg: {skill.color}">
        <div class="card-inner">
          <h3 class="skill-name">{skill.name}</h3>
          <p class="skill-desc">{skill.desc}</p>
        </div>
        <div class="card-shadow"></div>
      </div>
    {/each}
  </div>
</section>

<style>
  .skills-wrap {
    padding: 8rem clamp(1rem, 5vw, 4rem);
    position: relative;
    background: var(--color-5);
    overflow: hidden;
  }

  .header-overlay {
    margin-bottom: 4rem;
    position: relative;
    z-index: 2;
  }

  .title {
    font-family: 'moon-get', sans-serif;
    font-size: clamp(2.5rem, 6vw, 5rem);
    color: var(--color-3);
    line-height: 0.9;
    letter-spacing: -0.02em;
    margin: 0;
    text-transform: uppercase;
  }

  .skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2.5rem;
    position: relative;
    z-index: 1;
  }

  .skill-card {
    position: relative;
    height: 100%;
    min-height: 200px;
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .skill-card:hover {
    transform: translate(-8px, -8px) rotate(-1deg);
  }

  .card-inner {
    position: relative;
    z-index: 2;
    background: var(--card-bg);
    border: 4px solid var(--color-3);
    padding: 2rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  .card-shadow {
    position: absolute;
    top: 10px;
    left: 10px;
    right: -10px;
    bottom: -10px;
    background: var(--color-3);
    z-index: 1;
  }

  .skill-name {
    font-family: 'moon-get', sans-serif;
    font-weight: 900;
    font-size: 1.8rem;
    margin: 0 0 0.5rem 0;
    text-transform: uppercase;
    color: var(--color-3);
    line-height: 1;
  }

  .skill-desc {
    font-family: var(--font-secondary);
    font-size: 1.05rem;
    font-weight: 600;
    margin: 0;
    color: var(--color-3);
    opacity: 0.9;
    line-height: 1.3;
  }

  :global(.dark) .title {
    color: #f4f4f4;
  }

  @media (max-width: 768px) {
    .skills-wrap {
      padding: 5rem 1.5rem;
    }
    .skills-grid {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
    .skill-name {
      font-size: 1.6rem;
    }
    .skill-desc {
      font-size: 1rem;
    }
  }
</style>
