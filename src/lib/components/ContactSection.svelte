<script>
  import { PUBLIC_CONTACT_EMAIL } from '$env/static/public';

  let name = $state('');
  let email = $state('');
  let message = $state('');
  let status = $state('');

  function mailtoHref() {
    const subject = `Project inquiry — ${name || 'Younique'}`;
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    const to = PUBLIC_CONTACT_EMAIL || 'hello@younique.studio';
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
      <h1 class="page-title">Let’s create something unforgettable.</h1>
      <p class="page-sub">Let us know what you're working on and how we can collaborate.</p>
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

      <div class="social-contact">
        <span class="social-label">OR CONNECT VIA</span>
        <div class="social-tray">
          <a href="#twitter" class="social-pill" aria-label="X (Twitter)">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z"/></svg>
          </a>
          <a href="#linkedin" class="social-pill" aria-label="LinkedIn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.238 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
          </a>
          <a href="#instagram" class="social-pill" aria-label="Instagram">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
          <a href="#whatsapp" class="social-pill" aria-label="WhatsApp">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.81 9.81 0 017.001 2.895 9.81 9.81 0 012.887 7.001c-.001 5.451-4.436 9.884-9.886 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </a>
        </div>
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
    font-family: 'Rubik Mono One', sans-serif;
    margin-bottom: 1rem;
    color: var(--color-3);
    line-height: 1.1;
    letter-spacing: -0.05em;
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
    gap: 1.5rem;
    margin-top: 0.5rem;
  }

  .social-contact {
    grid-column: span 12;
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 2px dashed rgba(0,0,0,0.1);
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: 1.5rem;
  }

  :global(.dark) .social-contact {
    border-top-color: rgba(255,255,255,0.1);
  }

  .social-label {
    font-size: 0.75rem;
    font-weight: 900;
    letter-spacing: 0.1em;
    opacity: 0.6;
  }

  .social-tray {
    display: flex;
    gap: 1rem;
  }

  .social-pill {
    background: var(--color-5);
    color: #3d3d3d;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    text-decoration: none;
    border: 3px solid var(--color-3);
    box-shadow: 4px 4px 0 var(--color-3);
    transition: all 0.2s;
  }

  .social-pill:hover {
    transform: translate(-3px, -3px);
    box-shadow: 7px 7px 0 var(--color-3);
    background: var(--color-1);
    color: var(--color-3);
  }

  .social-pill:active {
    transform: translate(2px, 2px);
    box-shadow: 0px 0px 0 var(--color-3);
  }

  .social-pill svg {
    width: 22px;
    height: 22px;
  }

  :global(.dark) .social-pill {
    background: #3d3d3d;
    color: #fff;
    border-color: #fff;
    box-shadow: 4px 4px 0 #000;
  }

  :global(.dark) .social-pill:hover {
    box-shadow: 7px 7px 0 #000;
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
    box-shadow: 12px 14px 0px #000;
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
    color: #3d3d3d;
  }
</style>

