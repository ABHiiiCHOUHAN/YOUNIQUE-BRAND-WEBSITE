<script>
  let { data } = $props();

  let activeTab = $state('blog');
  
  // Blog State
  let posts = $state([]);
  let editingPostId = $state(null);
  let postTitle = $state('');
  let postContent = $state('');
  let postDate = $state(new Date().toISOString().split('T')[0]);
  let postStatus = $state('');

  // Work State
  let projects = $state([]);
  let editingProjId = $state(null);
  let projTitle = $state('');
  let projTag = $state('');
  let projYear = $state('2024');
  let projDesc = $state('');
  let projFullDesc = $state('');
  let projGallery = $state([]);
  let projStats = $state([]);
  let projStatus = $state('');

  // Settings State
  let settings = $state({ 
    contactEmail: '', 
    xLink: '', 
    linkedinLink: '', 
    instagramLink: '', 
    whatsappLink: '' 
  });
  let settingsStatus = $state('');

  // Messages State
  let messages = $state([]);

  $effect(() => {
    posts = data.posts || [];
    projects = data.projects || [];
    messages = data.messages || [];
    settings = data.settings || { 
      contactEmail: 'theyouniquedesign@gmail.com',
      xLink: '#twitter',
      linkedinLink: '#linkedin',
      instagramLink: '#instagram',
      whatsappLink: '#whatsapp'
    };
  });

  async function deleteMessage(id) {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      const res = await fetch(`/api/messages?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        messages = messages.filter(m => m.id !== id);
      } else alert('Failed to delete message.');
    } catch (err) { alert('Network error.'); }
  }
  
  // Blog Functions
  function editPost(post) {
    editingPostId = post.id;
    postTitle = post.title;
    postContent = post.content || post.excerpt || '';
    postDate = post.date;
    postStatus = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelEditPost() {
    editingPostId = null;
    postTitle = '';
    postContent = '';
    postDate = new Date().toISOString().split('T')[0];
  }

  async function savePost(e) {
    e.preventDefault();
    if (!postTitle || !postContent) {
      postStatus = 'Please fill all fields.';
      return;
    }
    postStatus = 'Saving...';
    
    const method = editingPostId ? 'PUT' : 'POST';
    const url = editingPostId ? `/api/posts/${editingPostId}` : '/api/posts';
    
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: postTitle, content: postContent, date: postDate })
      });
      if (res.ok) {
        const savedPost = await res.json();
        if (editingPostId) {
          const index = posts.findIndex(p => p.id === editingPostId);
          posts[index] = savedPost;
          postStatus = `Blog updated!`;
        } else {
          posts = [savedPost, ...posts];
          postStatus = `Blog published!`;
        }
        cancelEditPost();
      } else {
        postStatus = 'Error saving post.';
      }
    } catch (err) {
      postStatus = 'Network error.';
    }
  }

  async function deletePost(id) {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        posts = posts.filter(p => p.id !== id);
        if (editingPostId === id) cancelEditPost();
        postStatus = 'Post deleted.';
      } else alert('Failed to delete post.');
    } catch (err) { alert('Network error.'); }
  }

  // Work Functions
  function editProject(proj) {
    editingProjId = proj.id;
    projTitle = proj.title;
    projTag = proj.tag || '';
    projYear = proj.year || '2024';
    projDesc = proj.desc || '';
    projFullDesc = proj.fullDesc || '';
    projGallery = proj.gallery || [];
    projStats = proj.stats || [];
    projStatus = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelEditProject() {
    editingProjId = null;
    projTitle = '';
    projTag = '';
    projYear = '2024';
    projDesc = '';
    projFullDesc = '';
    projGallery = [];
    projStats = [];
  }

  async function saveProject(e) {
    e.preventDefault();
    if (!projTitle || !projDesc || !projTag) {
      projStatus = 'Please fill all fields.';
      return;
    }
    projStatus = 'Saving...';
    
    const method = editingProjId ? 'PUT' : 'POST';
    const url = editingProjId ? `/api/projects/${editingProjId}` : '/api/projects';
    
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: projTitle, 
          tag: projTag, 
          year: projYear,
          desc: projDesc, 
          fullDesc: projFullDesc,
          gallery: projGallery,
          stats: projStats
        })
      });
      if (res.ok) {
        const savedProj = await res.json();
        if (editingProjId) {
          const index = projects.findIndex(p => p.id === editingProjId);
          projects[index] = savedProj;
          projStatus = `Project updated!`;
        } else {
          projects = [...projects, savedProj];
          projStatus = `Project published!`;
        }
        cancelEditProject();
      } else projStatus = 'Error saving project.';
    } catch (err) { projStatus = 'Network error.'; }
  }

  async function deleteProject(id) {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        projects = projects.filter(p => p.id !== id);
        if (editingProjId === id) cancelEditProject();
        projStatus = 'Project deleted.';
      } else alert('Failed to delete project.');
    } catch (err) { alert('Network error.'); }
  }
  async function saveSettings(e) {
    if (e) e.preventDefault();
    settingsStatus = 'Saving...';
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        settingsStatus = 'Settings saved!';
        setTimeout(() => settingsStatus = '', 3000);
      } else settingsStatus = 'Error saving settings.';
    } catch (err) { settingsStatus = 'Network error.'; }
  }
</script>

<svelte:head>
  <title>Admin Dashboard - Younique</title>
</svelte:head>

<section class="wrap page-transition">
  <div class="tabs">
    <button class="tab-btn {activeTab === 'blog' ? 'active' : ''}" onclick={() => activeTab = 'blog'}>Manage Blog</button>
    <button class="tab-btn {activeTab === 'work' ? 'active' : ''}" onclick={() => activeTab = 'work'}>Manage Work</button>
    <button class="tab-btn {activeTab === 'messages' ? 'active' : ''}" onclick={() => activeTab = 'messages'}>
      Messages 
      {#if messages.length > 0}
        <span class="badge">{messages.length}</span>
      {/if}
    </button>
    <button class="tab-btn {activeTab === 'settings' ? 'active' : ''}" onclick={() => activeTab = 'settings'}>Site Settings</button>
  </div>

  {#if activeTab === 'blog'}
    <div class="panel">
      <header class="page-header">
        <h1 class="page-title">{editingPostId ? 'Edit Post' : 'Publish a new post.'}</h1>
      </header>
      <form class="form" onsubmit={savePost}>
        <label class="field">
          <span class="label">Date</span>
          <input type="date" bind:value={postDate} />
        </label>
        <label class="field field--full">
          <span class="label">Title</span>
          <input bind:value={postTitle} placeholder="A catchy, loud title..." />
        </label>
        <label class="field field--full">
          <span class="label">Content</span>
          <textarea bind:value={postContent} rows="8" placeholder="Start typing the chaos..."></textarea>
        </label>
        <div class="actions">
          <button class="btn" type="submit">{editingPostId ? 'Update Post' : 'Publish'}</button>
          {#if editingPostId}
            <button class="btn btn--outline" type="button" onclick={cancelEditPost}>Cancel</button>
          {/if}
          {#if postStatus}
            <div class="status">{postStatus}</div>
          {/if}
        </div>
      </form>
    </div>

    <div class="posts-list">
      <h2 class="list-title">Manage Content</h2>
      {#if posts.length === 0}
        <p>No posts found. Start writing!</p>
      {/if}
      <div class="grid">
        {#each posts as post}
          <article class="item-card">
            <div class="item-info">
              <time class="item-meta">{post.date}</time>
              <h3 class="item-heading">{post.title}</h3>
            </div>
            <div class="item-actions">
              <button class="btn-small" onclick={() => editPost(post)}>Edit</button>
              <button class="btn-small btn-delete" onclick={() => deletePost(post.id)}>Delete</button>
            </div>
          </article>
        {/each}
      </div>
    </div>

  {:else if activeTab === 'work'}
    <div class="panel">
      <header class="page-header">
        <h1 class="page-title">{editingProjId ? 'Edit Project' : 'Add a new project.'}</h1>
      </header>
      <form class="form" onsubmit={saveProject}>
        <label class="field">
          <span class="label">Title</span>
          <input bind:value={projTitle} placeholder="Project name" />
        </label>
        <label class="field">
          <span class="label">Tag</span>
          <input bind:value={projTag} placeholder="e.g. Identity, Visual" />
        </label>
        <label class="field">
          <span class="label">Project Year</span>
          <input bind:value={projYear} placeholder="2024" />
        </label>
        <label class="field field--full">
          <span class="label">Hero Title (Uppercase)</span>
          <input bind:value={projDesc} placeholder="INNOVATIVE SOLUTIONS..." />
        </label>
        <label class="field field--full">
          <span class="label">Full Project Content</span>
          <textarea bind:value={projFullDesc} rows="6" placeholder="Detailed story of the work..."></textarea>
        </label>

        <div class="gallery-manager field--full">
           <span class="label">Project Stats (Metric Cards)</span>
           <div class="gallery-inputs">
             {#each projStats as stat, index}
               <div class="gallery-row">
                 <input bind:value={stat.val} placeholder="Value (e.g. 7500 hours)" />
                 <input bind:value={stat.label} placeholder="Label (e.g. project work)" />
                 <button type="button" class="btn-small btn-delete" onclick={() => projStats = projStats.filter((_, i) => i !== index)}>×</button>
               </div>
             {/each}
             <button type="button" class="btn btn--outline" onclick={() => projStats = [...projStats, { val: '', label: '' }]}>+ Add Stat</button>
           </div>
        </div>

        <div class="gallery-manager field--full">
           <span class="label">Project Gallery (URLs & Titles)</span>
           <div class="gallery-inputs">
             {#each projGallery as item, index}
               <div class="gallery-row">
                 <input bind:value={item.title} placeholder="Title" />
                 <input bind:value={item.url} placeholder="Image/Video URL" />
                 <button type="button" class="btn-small btn-delete" onclick={() => projGallery = projGallery.filter((_, i) => i !== index)}>×</button>
               </div>
             {/each}
             <button type="button" class="btn btn--outline" onclick={() => projGallery = [...projGallery, { title: '', url: '', type: 'image' }]}>+ Add Item</button>
           </div>
        </div>

        <div class="actions">
          <button class="btn" type="submit">{editingProjId ? 'Update Project' : 'Add Project'}</button>
          {#if editingProjId}
            <button class="btn btn--outline" type="button" onclick={cancelEditProject}>Cancel</button>
          {/if}
          {#if projStatus}
            <div class="status">{projStatus}</div>
          {/if}
        </div>
      </form>
    </div>

    <div class="posts-list">
      <h2 class="list-title">Manage Work Projects</h2>
      {#if projects.length === 0}
        <p>No projects found. Add one!</p>
      {/if}
      <div class="grid">
        {#each projects as proj}
          <article class="item-card">
            <div class="item-info">
              <span class="item-meta">{proj.tag}</span>
              <h3 class="item-heading">{proj.title}</h3>
            </div>
            <div class="item-actions">
              <button class="btn-small" onclick={() => editProject(proj)}>Edit</button>
              <button class="btn-small btn-delete" onclick={() => deleteProject(proj.id)}>Delete</button>
            </div>
          </article>
        {/each}
      </div>
    </div>
  {:else if activeTab === 'messages'}
    <div class="panel panel--messages">
      <header class="page-header">
        <h1 class="page-title">Client Inquiries</h1>
      </header>
      
      <div class="messages-list">
        {#if messages.length === 0}
          <div class="empty-state">No messages logged yet. Any new contact form submissions will appear here.</div>
        {/if}
        
        <div class="grid">
          {#each messages as msg}
            <div class="item-card message-card">
              <div class="message-meta">
                <span class="item-meta">{new Date(msg.date).toLocaleDateString()} // {new Date(msg.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                <span class="id-tag">ID: {msg.id.slice(-6)}</span>
              </div>
              <div class="message-body">
                <h3 class="item-heading">{msg.name} // <a href="mailto:{msg.email}">{msg.email}</a></h3>
                {#if msg.mobile}<p class="mobile-text">PH: {msg.mobile}</p>{/if}
                <div class="msg-content">
                  <p>{msg.message}</p>
                </div>
              </div>
              <div class="item-actions">
                <button class="btn-small btn-delete" onclick={() => deleteMessage(msg.id)}>Dismiss</button>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  {:else if activeTab === 'settings'}
    <div class="panel">
      <header class="page-header">
        <h1 class="page-title">Global Site Settings</h1>
      </header>
      <form class="form" onsubmit={saveSettings}>
        <div class="field field--full">
          <label class="field">
            <span class="label">Primary Contact Email</span>
            <input type="email" bind:value={settings.contactEmail} placeholder="hello@younique.studio" />
          </label>
          <p class="help-text">All contact form submissions will be directed to this address.</p>
        </div>

        <div class="separator-dash"></div>
        <h3 class="field--full">Social Media Links</h3>

        <label class="field">
          <span class="label">X (Twitter) URL</span>
          <input bind:value={settings.xLink} placeholder="#twitter" />
        </label>
        <label class="field">
          <span class="label">LinkedIn URL</span>
          <input bind:value={settings.linkedinLink} placeholder="#linkedin" />
        </label>
        <label class="field">
          <span class="label">Instagram URL</span>
          <input bind:value={settings.instagramLink} placeholder="#instagram" />
        </label>
        <label class="field">
          <span class="label">WhatsApp URL</span>
          <input bind:value={settings.whatsappLink} placeholder="#whatsapp" />
        </label>

        <div class="actions">
          <button class="btn" type="submit">Save Settings</button>
          {#if settingsStatus}
            <div class="status">{settingsStatus}</div>
          {/if}
        </div>
      </form>
    </div>
  {/if}
</section>

<style>
  .wrap {
    padding: 2.25rem clamp(1rem, 4vw, 4rem) 4rem;
    max-width: 800px;
    margin: 0 auto;
  }

  .tabs {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .tab-btn {
    padding: 0.75rem 1.5rem;
    font-size: 1.1rem;
    font-weight: 800;
    border-radius: 999px;
    border: 2px solid var(--color-3);
    background: transparent;
    color: var(--color-3);
    cursor: pointer;
    transition: all 0.2s;
  }

  .tab-btn.active {
    background: var(--color-3);
    color: var(--color-5);
  }

  .panel {
    border-radius: 28px;
    border: 3px solid var(--color-3);
    background: var(--color-5);
    color: var(--color-3);
    box-shadow: 12px 14px 0px var(--color-3);
    padding: clamp(1.25rem, 3vw, 2rem);
    margin-bottom: 2rem;
  }

  .badge {
    background: var(--color-1);
    color: var(--color-3);
    font-size: 0.7rem;
    padding: 0.1rem 0.4rem;
    border-radius: 6px;
    margin-left: 0.5rem;
    vertical-align: middle;
  }

  .message-card {
    flex-direction: column !important;
    align-items: stretch !important;
    gap: 1.5rem;
  }

  .message-meta {
    display: flex;
    justify-content: space-between;
    opacity: 0.6;
    font-weight: 800;
  }

  .msg-content {
    background: rgba(0,0,0,0.03);
    padding: 1.5rem;
    border-radius: 12px;
    border: 1px dashed var(--color-3);
    margin-top: 1rem;
    font-family: 'Space Mono', monospace;
    font-size: 0.95rem;
    color: var(--color-3);
    white-space: pre-wrap;
  }

  .mobile-text {
    font-weight: 700;
    font-size: 0.9rem;
    margin-top: 0.25rem;
    opacity: 0.8;
  }

  .empty-state {
    padding: 3rem 0;
    text-align: center;
    opacity: 0.6;
    font-weight: 700;
  }

  .form {
    margin-top: 2rem;
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 1rem;
  }

  .field {
    grid-column: span 6;
    display: grid;
    gap: 0.45rem;
  }

  .field--full {
    grid-column: span 12;
  }

  .label { font-weight: 900; }

  input, textarea {
    width: 100%;
    border-radius: 12px;
    border: 2px solid var(--color-3);
    background: var(--color-5);
    color: var(--color-3);
    padding: 0.85rem 0.95rem;
    font: inherit;
    outline: none;
    box-shadow: 4px 4px 0px var(--color-3);
    transition: transform 0.1s;
    appearance: none;
  }

  input:focus, textarea:focus {
    border-color: var(--color-1);
    box-shadow: 0 0 0 4px var(--color-1);
  }

  textarea { resize: vertical; }

  .actions {
    grid-column: span 12;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 1rem;
  }

  .btn {
    border-radius: 999px;
    padding: 0.8rem 1.5rem;
    font-weight: 900;
    border: 2px solid var(--color-3);
    background: var(--color-1);
    color: var(--color-3);
    cursor: pointer;
    text-decoration: none;
    box-shadow: 4px 4px 0px var(--color-3);
    transition: transform 120ms ease;
  }

  .btn:hover, .btn:focus-visible {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0px var(--color-3);
  }

  .btn--outline {
    background: transparent;
    box-shadow: none;
  }

  .status {
    font-weight: 700;
    padding: 0.5rem 1rem;
    background: var(--color-4);
    color: var(--color-5);
    border-radius: 8px;
    border: 2px solid var(--color-3);
  }

  .posts-list { margin-top: 4rem; }
  .list-title {
    font-family: var(--font-heading);
    font-size: 2rem;
    margin-bottom: 2rem;
    color: var(--color-3);
  }

  .grid {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .item-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--color-5);
    border: 3px solid var(--color-3);
    border-radius: 16px;
    padding: 1.5rem;
    box-shadow: 6px 6px 0px var(--color-3);
  }

  .item-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .item-meta {
    font-size: 0.85rem;
    font-weight: 700;
    opacity: 0.7;
    text-transform: uppercase;
  }

  .item-heading { margin: 0; font-family: var(--font-heading); font-size: 1.25rem; }

  .item-actions { display: flex; gap: 0.75rem; }

  .btn-small {
    padding: 0.5rem 1rem;
    font-weight: 800;
    font-family: inherit;
    font-size: 0.9rem;
    cursor: pointer;
    border-radius: 8px;
    border: 2px solid var(--color-3);
    background: var(--color-5);
    color: var(--color-3);
    transition: transform 0.1s;
  }

  .btn-small:hover {
    transform: translate(-2px, -2px);
    box-shadow: 2px 2px 0px var(--color-3);
  }

  .btn-delete {
    background: #ffcccc;
    color: #cc0000;
  }

  @media (max-width: 600px) {
    .field { grid-column: span 12; }
    .item-card { flex-direction: column; align-items: flex-start; gap: 1rem; }
  }
  /* Gallery Manager */
  .gallery-manager {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 2px dashed var(--color-3);
  }

  .gallery-inputs {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 1rem;
  }

  .gallery-row {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .gallery-row input {
    flex: 1;
  }


  .btn-delete {
    background: #ff4d4d;
    color: white;
    padding: 0.25rem 0.6rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
  }

  .help-text {
    font-size: 0.9rem;
    opacity: 0.7;
    margin-top: 0.25rem;
  }
  .separator-dash {
    grid-column: span 12;
    height: 1px;
    border-top: 2px dashed var(--color-3);
    margin: 1.5rem 0;
    opacity: 0.3;
  }
</style>
