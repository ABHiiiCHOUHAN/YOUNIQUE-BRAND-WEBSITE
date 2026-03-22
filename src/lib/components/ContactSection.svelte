<script>
  import { onMount } from 'svelte';
  import { PUBLIC_CONTACT_EMAIL } from '$env/static/public';

  let name = $state('');
  let email = $state('');
  let countryCode = $state('91');
  let mobile = $state('');
  let message = $state('');
  let status = $state('');
  let showValidation = $state(false);
  let validationErrors = $state({ name: '', email: '', mobile: '', message: '' });
  let contactEmail = $state(PUBLIC_CONTACT_EMAIL || 'hello@younique.studio');
  let socialLinks = $state({
    xLink: '#twitter',
    linkedinLink: '#linkedin',
    instagramLink: '#instagram',
    whatsappLink: '#whatsapp'
  });

  // 3-4-3 Formatter for mobile digits
  function formatMobile(val) {
    const raw = val.replace(/\D/g, '').slice(0, 10);
    if (raw.length <= 3) return raw;
    if (raw.length <= 7) return `${raw.slice(0, 3)} ${raw.slice(3)}`;
    return `${raw.slice(0, 3)} ${raw.slice(3, 7)} ${raw.slice(7)}`;
  }

  onMount(async () => {
    try {
      const res = await fetch('/api/settings');
      const settings = await res.json();
      if (settings.contactEmail) {
        contactEmail = settings.contactEmail;
      }
      if (settings.xLink) socialLinks.xLink = settings.xLink;
      if (settings.linkedinLink) socialLinks.linkedinLink = settings.linkedinLink;
      if (settings.instagramLink) socialLinks.instagramLink = settings.instagramLink;
      if (settings.whatsappLink) socialLinks.whatsappLink = settings.whatsappLink;
    } catch (err) {}
  });

  async function onSubmit(e) {
    e.preventDefault();
    
    // Reset errors
    validationErrors = { name: '', email: '', mobile: '', message: '' };
    let hasError = false;

    if (!name.trim()) { 
      validationErrors.name = 'REQUIRED'; 
      hasError = true; 
    }

    if (!email) { 
      validationErrors.email = 'REQUIRED'; 
      hasError = true; 
    } else if (!email.includes('@')) { 
      validationErrors.email = 'INVALID EMAIL'; 
      hasError = true; 
    } else if (!email.toLowerCase().split('?')[0].split('#')[0].endsWith('.com') && 
               !email.toLowerCase().split('?')[0].split('#')[0].endsWith('.in') && 
               !email.toLowerCase().split('?')[0].split('#')[0].endsWith('.edu')) {
      validationErrors.email = 'INVALID EMAIL';
      hasError = true;
    }
    
    const digitsOnly = mobile.replace(/\D/g, '');
    if (!mobile || !countryCode) { validationErrors.mobile = 'REQUIRED'; hasError = true; }
    else if (digitsOnly.length !== 10) { validationErrors.mobile = 'INVALID NO.'; hasError = true; }
    
    if (!message) { validationErrors.message = 'REQUIRED'; hasError = true; }

    if (hasError) {
      showValidation = true;
      return;
    }

    showValidation = false;
    status = 'waiting';
    
    const fullMobile = `+${countryCode} ${mobile}`;
    
    // Construct the mailto link
    const subject = `Project Inquiry: ${name}`;
    const body = `New inquiry received:\n\nName: ${name}\nEmail: ${email}\nMobile: ${fullMobile}\n\nMessage:\n${message}`;
    const to = contactEmail;
    const mailLink = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // 1. Log the message to our internal API (Admin manage section)
    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, mobile: fullMobile, message })
      });
    } catch (err) {
      console.error('Failed to log message internally:', err);
    }

    // 2. Open the user's mail client
    window.location.href = mailLink;

    // 3. Transition to success UI
    setTimeout(() => {
      status = 'success';
      // Reset form
      setTimeout(() => {
        status = '';
        name = '';
        email = '';
        mobile = '';
        message = '';
      }, 3000);
    }, 1200);
  }
</script>

<section class="wrap page-transition">
  <div class="panel">
    <header class="page-header">
      <h1 class="page-title">Let’s create something unforgettable.</h1>
      <p class="page-sub">Let us know what you're working on and how we can collaborate.</p>
    </header>

    <form class="form" onsubmit={onSubmit} novalidate>
      <label class="field">
        <div class="field-info">
          <span class="label">Name</span>
          {#if showValidation && validationErrors.name}<span class="error-hint">{validationErrors.name}</span>{/if}
        </div>
        <input bind:value={name} name="name" placeholder="Your name" autocomplete="name" />
      </label>

      <label class="field">
        <div class="field-info">
          <span class="label">Email</span>
          {#if showValidation && validationErrors.email}<span class="error-hint">{validationErrors.email}</span>{/if}
        </div>
        <input type="email" bind:value={email} placeholder="you@example.com" />
      </label>

      <div class="field">
        <div class="field-info">
          <span class="label">Mobile</span>
          {#if showValidation && validationErrors.mobile}<span class="error-hint">{validationErrors.mobile}</span>{/if}
        </div>
        <div class="mobile-group">
          <div class="country-input-wrap">
            <span class="plus-token">+</span>
            <input type="tel" bind:value={countryCode} class="country-input" maxlength="2" />
          </div>
          <input 
            type="tel" 
            value={mobile} 
            oninput={(e) => mobile = formatMobile(e.target.value)}
            placeholder="123 4567 890" 
            maxlength="12" 
          />
        </div>
      </div>

      <label class="field field--full">
        <div class="field-info">
          <span class="label">Message</span>
          {#if showValidation && validationErrors.message}<span class="error-hint">{validationErrors.message}</span>{/if}
        </div>
        <textarea bind:value={message} placeholder="Talk to us about your vision..." rows="4"></textarea>
      </label>

      <div class="actions">
        <button class="btn" type="submit" class:btn--waiting={status === 'waiting'} class:btn--success={status === 'success'} disabled={status !== ''}>
          {#if status === 'waiting'}
            <div class="btn-content">
              <span>wait a sec..</span>
            </div>
          {:else if status === 'success'}
            <div class="btn-content success-pop">
              <svg class="checkmark" width="22" height="22" viewBox="0 0 24 24">
                <path d="M4 12l6 6L20 6" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span>Sent successfully</span>
            </div>
          {:else}
            Send inquiry
          {/if}
        </button>
        
        <div class="social-contact">
          <span class="social-label">OR CONTACT VIA</span>
          <div class="social-tray">
            <a href={socialLinks.xLink} class="social-pill social-pill--x" aria-label="X (Twitter)">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z"/></svg>
            </a>
            <a href={socialLinks.linkedinLink} class="social-pill social-pill--linkedin" aria-label="LinkedIn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.238 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
            <a href={socialLinks.instagramLink} class="social-pill social-pill--instagram" aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href={socialLinks.whatsappLink} class="social-pill social-pill--whatsapp" aria-label="WhatsApp">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.81 9.81 0 017.001 2.895 9.81 9.81 0 012.887 7.001c-.001 5.451-4.436 9.884-9.886 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </form>
  </div>
</section>

<style>
  .wrap {
    padding: 0 clamp(1rem, 5vw, 4rem) 0;
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
    justify-content: space-between; /* Space out items */
    gap: 3rem;
    margin-top: 1.5rem;
    flex-wrap: wrap; /* On mobile they will Stack */
  }

  @media (max-width: 1024px) {
    .actions {
      justify-content: center;
      text-align: center;
      flex-direction: column;
      gap: 2rem;
    }
  }

  .social-contact {
    display: flex;
    flex-direction: row;
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

  .social-pill--x:hover { background: #fff; color: #000; border-color: #000; }
  .social-pill--linkedin:hover { background: #0077b5; color: #fff; border-color: #0077b5; }
  .social-pill--instagram:hover { background: #e4405f; color: #fff; border-color: #e4405f; }
  .social-pill--whatsapp:hover { background: #128c7e; color: #fff; border-color: #128c7e; }

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
    padding: 1.1rem 3rem;
    font-weight: 800;
    font-size: 1.1rem;
    letter-spacing: -0.01em;
    border: 3px solid var(--color-3);
    background: var(--color-1);
 /* Vibrant primary by default */
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

  }

  .btn--waiting, .btn--success {
    cursor: wait;
    min-width: 160px;
    transition: all 0.3s ease;
  }

  .btn--success {
    cursor: default;
    background: var(--color-4) !important; /* Keep success green as requested in earlier steps or switch to yellow? */
    /* The user said "keep button consistancy in all three like send inquiry button" */
    /* This likely means they want the yellow theme for all. */
    background: var(--color-1) !important; 
    color: var(--color-3) !important;
  }
  
  .btn--waiting {
    background: var(--color-1) !important;
    color: var(--color-3) !important;
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

  :global(.dark) .btn:not(.btn--ghost) {
    background: var(--color-1);
    color: #3d3d3d;
  }

  .mobile-group {
    display: flex;
    gap: 0.5rem;
  }

  .country-input-wrap {
    display: flex;
    align-items: center;
    background: var(--color-5);
    border: 2px solid var(--color-3);
    border-radius: 12px;
    padding: 0.85rem 0.25rem; /* Ultra tight padding */
    box-shadow: 4px 4px 0 var(--color-3);
    width: 55px; /* Fixed small width */
    overflow: hidden;
    transition: transform 0.1s;
  }

  .plus-token {
    font-weight: 800;
    font-size: 1.1rem;
    color: var(--color-3);
    margin-right: -4px;
    user-select: none;
  }

  .country-input {
    width: 100% !important;
    border: none !important;
    box-shadow: none !important;
    background: transparent !important;
    text-align: left !important;
    padding: 0 0.25rem !important;
    font-weight: 800 !important;
  }

  :global(.dark) .country-input-wrap {
    background: #3d3d3d;
    border-color: #fff;
    box-shadow: 6px 6px 0 #fff; /* Match dark mode shadow of main inputs */
  }

  .field-info {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 0.25rem;
  }

  .error-hint {
    font-size: 0.65rem;
    font-weight: 900;
    color: #ff4d4d;
    letter-spacing: 0.05em;
    animation: pulseError 1s infinite;
  }

  @keyframes pulseError {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }

  .btn-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
  }

  .success-pop {
    animation: successScale 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
  }

  .checkmark path {
    stroke-dasharray: 40;
    stroke-dashoffset: 40;
    animation: drawCheck 0.4s ease-out 0.2s forwards;
  }

  @keyframes drawCheck {
    to { stroke-dashoffset: 0; }
  }

  @keyframes successScale {
    0% { transform: scale(0.8); opacity: 0; filter: brightness(1.5); }
    50% { transform: scale(1.1); filter: brightness(1.2); }
    100% { transform: scale(1); opacity: 1; filter: brightness(1); }
  }

  .btn--success {
    box-shadow: 0 0 20px rgba(var(--color-4-rgb, 74, 222, 128), 0.4);
    position: relative;
    overflow: hidden;
  }

  .btn--success::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent);
    transform: rotate(45deg);
    animation: lightBeam 0.8s ease-out forwards;
  }

  @keyframes lightBeam {
    from { transform: rotate(45deg) translate(-100%, -100%); }
    to { transform: rotate(45deg) translate(100%, 100%); }
  }
</style>

