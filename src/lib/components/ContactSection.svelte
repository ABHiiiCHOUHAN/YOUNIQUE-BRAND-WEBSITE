<script>
  let name = $state('');
  let email = $state('');
  let message = $state('');
  let status = $state('');

  function mailtoHref() {
    const subject = `Project inquiry — ${name || 'Younique'}`;
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    const to = 'hello@younique.studio';
    return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function onSubmit(e) {
    e.preventDefault();
    status = 'Opening your email app…';
    window.location.href = mailtoHref();
  }
</script>

<section class="wrap page-transition">
  <div class="panel">
    <header class="page-header">
      <h1 class="page-title">Let’s build something loud (and effective).</h1>
      <p class="page-sub">Send a quick note. This form opens your email app with everything pre-filled.</p>
    </header>

    <form class="form" onsubmit={onSubmit}>
      <label class="field">
        <span class="label">Name</span>
        <input bind:value={name} placeholder="Your name" autocomplete="name" />
      </label>

      <label class="field">
        <span class="label">Email</span>
        <input
          bind:value={email}
          placeholder="you@example.com"
          autocomplete="email"
          inputmode="email"
          type="email"
        />
      </label>

      <label class="field field--full">
        <span class="label">Message</span>
        <textarea bind:value={message} rows="6" placeholder="What are we making? Timeline, budget, vibe…"></textarea>
      </label>

      <div class="actions">
        <button class="btn" type="submit">Send</button>
        <a class="btn btn--ghost" href={mailtoHref()}>Email directly</a>
        {#if status}
          <div class="status" role="status">{status}</div>
        {/if}
      </div>
    </form>
  </div>
</section>

<style>
  .wrap {
    padding: 2.25rem clamp(1rem, 5vw, 4rem) 4rem;
    display: flex;
    justify-content: center;
  }

  /* Desktop Standard Styles */
  .panel {
    max-width: 900px;
    width: 100%;
    border-radius: 28px;
    border: 3px solid var(--color-3);
    background: var(--color-5);
    color: var(--color-3);
    box-shadow: 12px 14px 0px var(--color-3);
    padding: clamp(2rem, 5vw, 3rem);
    position: relative;
  }

  .page-title {
    font-size: clamp(2rem, 5vw, 3.8rem);
    font-family: var(--font-heading);
    margin-bottom: 1rem;
    color: var(--color-3);
    line-height: 1.1;
  }

  .page-sub {
    font-size: 1.15rem;
    opacity: 0.9;
    margin-bottom: 2rem;
    max-width: 60ch;
  }

  .form {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 1.5rem;
  }

  .field {
    grid-column: span 6;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .field--full {
    grid-column: span 12;
  }

  .label {
    font-weight: 800;
    font-size: 0.95rem;
  }

  input,
  textarea {
    width: 100%;
    border-radius: 12px;
    border: 2px solid var(--color-3);
    background: var(--color-5);
    color: var(--color-3);
    padding: 0.85rem 1rem;
    font: inherit;
    outline: none;
    box-shadow: 4px 4px 0px var(--color-3);
    transition: transform 0.1s;
  }

  textarea {
    min-height: 150px;
    resize: vertical;
  }

  .actions {
    grid-column: span 12;
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 0.5rem;
  }

  .btn {
    border-radius: 999px;
    padding: 0.8rem 1.8rem;
    font-weight: 800;
    font-family: inherit;
    border: 3px solid var(--color-3);
    background: var(--color-1); /* Vibrant primary by default */
    color: var(--color-3); /* Dark text */
    cursor: pointer;
    text-decoration: none;
    transition: all 0.2s cubic-bezier(0.25, 1, 0.5, 1);
    box-shadow: 4px 4px 0px var(--color-3);
  }

  .btn:hover, .btn:focus-visible {
    transform: translate(-4px, -4px);
    box-shadow: 8px 8px 0px var(--color-3);
    outline: none;
  }

  .btn:active {
    transform: translate(4px, 4px) !important;
    box-shadow: 0px 0px 0px var(--color-3) !important;
  }

  .btn--ghost {
    background: var(--color-5); /* Base background */
    color: var(--color-3);
  }

  /* Mobile Brutalist Styles */
  @media (max-width: 768px) {
    .wrap {
      padding: 3.5rem 1.25rem 3rem;
    }

    .panel {
      border-radius: 24px;
      border: 4px solid #1c1c1c;
      background: #FFFAF4;
      box-shadow: 8px 8px 0px #393839;
      padding: 2rem 1.25rem;
    }

    .page-title {
      font-size: 2rem;
      font-weight: 900;
      margin-bottom: 1rem;
    }

    .page-sub {
      font-size: 1rem;
      margin-bottom: 2rem;
    }

    .form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .field {
      grid-column: span 12;
    }

    input, textarea {
      border-radius: 18px;
      border: 3px solid #1c1c1c;
      background: #fff;
      box-shadow: 6px 6px 0px #1c1c1c;
      padding: 1rem;
    }

    .btn {
      width: 100%;
      padding: 1rem;
      border-width: 3px;
      border-color: #1c1c1c;
    }

    .btn--ghost {
      background: #fff;
    }
  }

  .status {
    width: 100%;
    font-weight: 700;
    font-size: 0.9rem;
    margin-top: 0.5rem;
  }

  :global(.dark) .panel {
    background: #2a2a2a;
    color: #fff;
    border-color: #fff;
    box-shadow: 12px 14px 0px #fff;
  }

  @media (max-width: 768px) {
    :global(.dark) .panel {
      box-shadow: 8px 8px 0px #fff;
    }
    :global(.dark) input,
    :global(.dark) textarea {
      background: #3d3d3d;
      border-color: #fff;
      box-shadow: 6px 6px 0px #fff;
    }
    :global(.dark) .btn {
      border-color: #fff;
    }
  }

  /* Neo-brutalist dark mode overrides */
  :global(.dark) .btn {
    border-color: var(--color-5);
    box-shadow: 4px 4px 0px var(--color-5);
  }
  :global(.dark) .btn:active {
    box-shadow: 0px 0px 0px var(--color-5) !important;
  }
  :global(.dark) .btn:hover,
  :global(.dark) .btn:focus-visible {
    box-shadow: 8px 8px 0px var(--color-5);
  }

  :global(.dark) .btn--ghost {
    background: var(--color-3);
    color: var(--color-5);
  }
  :global(.dark) .btn:not(.btn--ghost) {
    background: var(--color-1);
    color: var(--color-3);
  }
</style>

