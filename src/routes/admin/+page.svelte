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
	let projChallenge = $state('');
	let projCreativeDirection = $state('');
	let projResultMetric = $state('');
	let projGallery = $state([]);
	let projStats = $state([]);
	let projStatus = $state('');

	// Client Decks State
	let decks = $state([]);
	let editingDeckSlug = $state(null);
	let deckSlug = $state('');
	let deckClientName = $state('');
	let deckClientCompany = $state('');
	let deckTitle = $state('');
	let deckVersion = $state('v1.0 // Draft Review');
	let deckPasscode = $state('');
	let deckNotes = $state('');
	let deckDeliverables = $state([]);
	let deckStatus = $state('');
	let copiedDeckSlug = $state('');

	// Settings State
	let settings = $state({
		contactEmail: '',
		bookingLink: '',
		xLink: '',
		linkedinLink: '',
		instagramLink: '',
		whatsappLink: '',
		telegramLink: ''
	});
	let settingsStatus = $state('');

	// Messages State
	let messages = $state([]);

	$effect(() => {
		posts = data.posts || [];
		projects = data.projects || [];
		messages = data.messages || [];
		decks = data.decks || [];
		settings = data.settings || {
			contactEmail: 'theyouniquedesign@gmail.com',
			bookingLink: 'https://cal.com',
			xLink: '#twitter',
			linkedinLink: '#linkedin',
			instagramLink: '#instagram',
			whatsappLink: '#whatsapp',
			telegramLink: '#telegram'
		};
	});

	async function deleteMessage(id) {
		if (!confirm('Are you sure you want to delete this message?')) return;
		try {
			const res = await fetch(`/api/messages?id=${id}`, { method: 'DELETE' });
			if (res.ok) {
				messages = messages.filter((m) => m.id !== id);
			} else alert('Failed to delete message.');
		} catch (err) {
			alert('Network error.');
		}
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
					const index = posts.findIndex((p) => p.id === editingPostId);
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
				posts = posts.filter((p) => p.id !== id);
				if (editingPostId === id) cancelEditPost();
				postStatus = 'Post deleted.';
			} else alert('Failed to delete post.');
		} catch (err) {
			alert('Network error.');
		}
	}

	// Work Functions
	function editProject(proj) {
		editingProjId = proj.id;
		projTitle = proj.title;
		projTag = proj.tag || '';
		projYear = proj.year || '2024';
		projDesc = proj.desc || '';
		projFullDesc = proj.fullDesc || '';
		projChallenge = proj.challenge || '';
		projCreativeDirection = proj.creativeDirection || '';
		projResultMetric = proj.resultMetric || '';
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
		projChallenge = '';
		projCreativeDirection = '';
		projResultMetric = '';
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
					challenge: projChallenge,
					creativeDirection: projCreativeDirection,
					resultMetric: projResultMetric,
					gallery: projGallery,
					stats: projStats
				})
			});
			if (res.ok) {
				const savedProj = await res.json();
				if (editingProjId) {
					const index = projects.findIndex((p) => p.id === editingProjId);
					projects[index] = savedProj;
					projStatus = `Project updated!`;
				} else {
					projects = [...projects, savedProj];
					projStatus = `Project published!`;
				}
				cancelEditProject();
			} else projStatus = 'Error saving project.';
		} catch (err) {
			projStatus = 'Network error.';
		}
	}

	async function deleteProject(id) {
		if (!confirm('Are you sure you want to delete this project?')) return;
		try {
			const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
			if (res.ok) {
				projects = projects.filter((p) => p.id !== id);
				if (editingProjId === id) cancelEditProject();
				projStatus = 'Project deleted.';
			} else alert('Failed to delete project.');
		} catch (err) {
			alert('Network error.');
		}
	}
	// Client Deck Functions
	function editDeck(deck) {
		editingDeckSlug = deck.slug;
		deckSlug = deck.slug;
		deckClientName = deck.clientName;
		deckClientCompany = deck.clientCompany || '';
		deckTitle = deck.title;
		deckVersion = deck.version || 'v1.0 // Draft Review';
		deckPasscode = '';
		deckNotes = deck.notes || '';
		deckDeliverables = (deck.deliverables || []).map((d) => ({ ...d }));
		deckStatus = '';
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function cancelEditDeck() {
		editingDeckSlug = null;
		deckSlug = '';
		deckClientName = '';
		deckClientCompany = '';
		deckTitle = '';
		deckVersion = 'v1.0 // Draft Review';
		deckPasscode = '';
		deckNotes = '';
		deckDeliverables = [];
	}

	async function saveDeck(e) {
		e.preventDefault();
		if (!deckSlug || !deckClientName || !deckTitle || (!editingDeckSlug && !deckPasscode)) {
			deckStatus = 'Slug, client name, title, and passcode are required.';
			return;
		}
		deckStatus = 'Saving...';

		const method = editingDeckSlug ? 'PUT' : 'POST';
		const url = editingDeckSlug ? `/api/decks/${editingDeckSlug}` : '/api/decks';

		try {
			const res = await fetch(url, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					slug: deckSlug,
					clientName: deckClientName,
					clientCompany: deckClientCompany,
					title: deckTitle,
					version: deckVersion,
					passcode: deckPasscode,
					notes: deckNotes,
					deliverables: deckDeliverables
				})
			});
			if (res.ok) {
				const saved = await res.json();
				if (editingDeckSlug) {
					const idx = decks.findIndex((d) => d.slug === editingDeckSlug);
					if (idx !== -1) decks[idx] = saved;
					deckStatus = 'Client deck updated!';
				} else {
					decks = [saved, ...decks];
					deckStatus = 'Client deck created!';
				}
				cancelEditDeck();
			} else {
				const err = await res.json().catch(() => ({}));
				deckStatus = err.error || 'Error saving deck.';
			}
		} catch {
			deckStatus = 'Network error.';
		}
	}

	async function deleteDeck(slug) {
		if (!confirm(`Delete client deck /deck/${slug}?`)) return;
		try {
			const res = await fetch(`/api/decks/${slug}`, { method: 'DELETE' });
			if (res.ok) {
				decks = decks.filter((d) => d.slug !== slug);
				if (editingDeckSlug === slug) cancelEditDeck();
				deckStatus = 'Deck deleted.';
			} else alert('Failed to delete deck.');
		} catch {
			alert('Network error.');
		}
	}

	function copyDeckLink(slug) {
		const url = `${window.location.origin}/deck/${slug}`;
		navigator.clipboard?.writeText(url);
		copiedDeckSlug = slug;
		setTimeout(() => (copiedDeckSlug = ''), 2000);
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
				setTimeout(() => (settingsStatus = ''), 3000);
			} else settingsStatus = 'Error saving settings.';
		} catch (err) {
			settingsStatus = 'Network error.';
		}
	}
</script>

<svelte:head>
	<title>Admin Dashboard - Younique</title>
</svelte:head>

<section class="wrap page-transition">
	<div class="tabs">
		<button
			class="tab-btn {activeTab === 'blog' ? 'active' : ''}"
			onclick={() => (activeTab = 'blog')}>Manage Blog</button
		>
		<button
			class="tab-btn {activeTab === 'work' ? 'active' : ''}"
			onclick={() => (activeTab = 'work')}>Manage Work</button
		>
		<button
			class="tab-btn {activeTab === 'messages' ? 'active' : ''}"
			onclick={() => (activeTab = 'messages')}
		>
			Messages
			{#if messages.length > 0}
				<span class="badge">{messages.length}</span>
			{/if}
		</button>
		<button
			class="tab-btn {activeTab === 'decks' ? 'active' : ''}"
			onclick={() => (activeTab = 'decks')}>Client Decks</button
		>
		<button
			class="tab-btn {activeTab === 'settings' ? 'active' : ''}"
			onclick={() => (activeTab = 'settings')}>Site Settings</button
		>
		<form method="POST" action="/admin/logout" style="display: contents;">
			<button type="submit" class="tab-btn btn-logout">Log Out</button>
		</form>
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
					<textarea bind:value={postContent} rows="8" placeholder="Start typing the chaos..."
					></textarea>
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
							<button class="btn-small btn-delete" onclick={() => deletePost(post.id)}
								>Delete</button
							>
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
					<textarea bind:value={projFullDesc} rows="6" placeholder="Detailed story of the work..."
					></textarea>
				</label>

				<div class="separator-dash"></div>
				<h3 class="field--full">Narrative Case Study (Outcome > Visuals)</h3>

				<label class="field field--full">
					<span class="label">01 // The Challenge</span>
					<textarea
						bind:value={projChallenge}
						rows="3"
						placeholder="What was the client's problem before hiring you?"
					></textarea>
				</label>
				<label class="field field--full">
					<span class="label">02 // Creative Direction</span>
					<textarea
						bind:value={projCreativeDirection}
						rows="3"
						placeholder="Typography choices, motion language, and visual hooks..."
					></textarea>
				</label>
				<label class="field field--full">
					<span class="label">03 // Result Metric (Outcome Headline)</span>
					<input
						bind:value={projResultMetric}
						placeholder="e.g. 42% increase in launch conversion"
					/>
				</label>

				<div class="gallery-manager field--full">
					<span class="label">Project Stats (Metric Cards)</span>
					<div class="gallery-inputs">
						{#each projStats as stat, index}
							<div class="gallery-row">
								<input bind:value={stat.val} placeholder="Value (e.g. 350+ hrs)" />
								<input bind:value={stat.label} placeholder="Label (e.g. project work)" />
								<button
									type="button"
									class="btn-small btn-delete"
									onclick={() => (projStats = projStats.filter((_, i) => i !== index))}>×</button
								>
							</div>
						{/each}
						<button
							type="button"
							class="btn btn--outline"
							onclick={() => (projStats = [...projStats, { val: '', label: '' }])}
							>+ Add Stat</button
						>
					</div>
				</div>

				<div class="gallery-manager field--full">
					<span class="label">Project Gallery (URLs & Titles)</span>
					<div class="gallery-inputs">
						{#each projGallery as item, index}
							<div class="gallery-row">
								<input bind:value={item.title} placeholder="Title" />
								<input bind:value={item.url} placeholder="Image/Video URL" />
								<button
									type="button"
									class="btn-small btn-delete"
									onclick={() => (projGallery = projGallery.filter((_, i) => i !== index))}
									>×</button
								>
							</div>
						{/each}
						<button
							type="button"
							class="btn btn--outline"
							onclick={() =>
								(projGallery = [...projGallery, { title: '', url: '', type: 'image' }])}
							>+ Add Item</button
						>
					</div>
				</div>

				<div class="actions">
					<button class="btn" type="submit"
						>{editingProjId ? 'Update Project' : 'Add Project'}</button
					>
					{#if editingProjId}
						<button class="btn btn--outline" type="button" onclick={cancelEditProject}
							>Cancel</button
						>
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
							<button class="btn-small btn-delete" onclick={() => deleteProject(proj.id)}
								>Delete</button
							>
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
					<div class="empty-state">
						No messages logged yet. Any new contact form submissions will appear here.
					</div>
				{/if}

				<div class="grid">
					{#each messages as msg}
						<div class="item-card message-card">
							<div class="message-meta">
								<span class="item-meta"
									>{new Date(msg.date).toLocaleDateString()} // {new Date(
										msg.date
									).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span
								>
								<span class="id-tag">ID: {msg.id.slice(-6)}</span>
							</div>
							<div class="message-body">
								<h3 class="item-heading">
									{msg.name} // <a href="mailto:{msg.email}">{msg.email}</a>
								</h3>
								{#if msg.mobile}<p class="mobile-text">PH: {msg.mobile}</p>{/if}
								{#if (msg.services && msg.services.length > 0) || msg.budget || msg.timeline}
									<div class="scope-badges">
										{#each msg.services || [] as svc}
											<span class="scope-chip">{svc}</span>
										{/each}
										{#if msg.budget}
											<span class="scope-chip scope-chip--accent">Budget: {msg.budget}</span>
										{/if}
										{#if msg.timeline}
											<span class="scope-chip">Timeline: {msg.timeline}</span>
										{/if}
									</div>
								{/if}
								<div class="msg-content">
									<p>{msg.message}</p>
								</div>
							</div>
							<div class="item-actions">
								<button class="btn-small btn-delete" onclick={() => deleteMessage(msg.id)}
									>Dismiss</button
								>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	{:else if activeTab === 'decks'}
		<div class="panel">
			<header class="page-header">
				<h1 class="page-title">
					{editingDeckSlug ? `Edit Deck: /deck/${editingDeckSlug}` : 'Create Private Client Deck.'}
				</h1>
			</header>
			<form class="form" onsubmit={saveDeck}>
				<label class="field">
					<span class="label">Client URL Slug</span>
					<input
						bind:value={deckSlug}
						placeholder="e.g. acme-rebrand"
						disabled={Boolean(editingDeckSlug)}
					/>
				</label>
				<label class="field">
					<span class="label">Client Name</span>
					<input bind:value={deckClientName} placeholder="e.g. Vatsal Patel" />
				</label>
				<label class="field">
					<span class="label">Client Company (Optional)</span>
					<input bind:value={deckClientCompany} placeholder="e.g. Acme Studio" />
				</label>
				<label class="field">
					<span class="label">Deck Title</span>
					<input bind:value={deckTitle} placeholder="e.g. Q4 Brand Identity & Reel Cuts" />
				</label>
				<label class="field">
					<span class="label">Version / Stage</span>
					<input bind:value={deckVersion} placeholder="v1.0 // Draft Review" />
				</label>
				<label class="field">
					<span class="label">Access Passcode {editingDeckSlug ? '(leave blank to keep)' : ''}</span>
					<input
						type="text"
						bind:value={deckPasscode}
						placeholder={editingDeckSlug ? 'Enter new passcode to change' : 'Secret client code'}
					/>
				</label>
				<label class="field field--full">
					<span class="label">Creative Director Notes</span>
					<textarea
						bind:value={deckNotes}
						rows="4"
						placeholder="Context or feedback instructions for the client..."
					></textarea>
				</label>

				<div class="gallery-manager field--full">
					<span class="label">Deck Deliverables (Images, Videos, Links)</span>
					<div class="gallery-inputs">
						{#each deckDeliverables as item, index}
							<div class="deck-deliverable-row">
								<select bind:value={item.type} class="deck-type-select">
									<option value="image">Image</option>
									<option value="video">Video</option>
									<option value="link">Link / PDF</option>
								</select>
								<input bind:value={item.title} placeholder="Deliverable title" />
								<input bind:value={item.url} placeholder="Asset URL (e.g. /videos/cut-1.mp4)" />
								<input bind:value={item.notes} placeholder="Notes (optional)" />
								<button
									type="button"
									class="btn-small btn-delete"
									onclick={() =>
										(deckDeliverables = deckDeliverables.filter((_, i) => i !== index))}>×</button
								>
							</div>
						{/each}
						<button
							type="button"
							class="btn btn--outline"
							onclick={() =>
								(deckDeliverables = [
									...deckDeliverables,
									{ type: 'image', title: '', url: '', notes: '' }
								])}>+ Add Deliverable</button
						>
					</div>
				</div>

				<div class="actions">
					<button class="btn" type="submit"
						>{editingDeckSlug ? 'Update Client Deck' : 'Create Client Deck'}</button
					>
					{#if editingDeckSlug}
						<button class="btn btn--outline" type="button" onclick={cancelEditDeck}>Cancel</button>
					{/if}
					{#if deckStatus}
						<div class="status">{deckStatus}</div>
					{/if}
				</div>
			</form>
		</div>

		<div class="posts-list">
			<h2 class="list-title">Private Client Decks</h2>
			{#if decks.length === 0}
				<p>No client decks yet. Create one above!</p>
			{/if}
			<div class="grid">
				{#each decks as deck}
					<article class="item-card">
						<div class="item-info">
							<span class="item-meta">
								{deck.clientName}{deck.clientCompany ? ` · ${deck.clientCompany}` : ''} // {deck.version}
							</span>
							<h3 class="item-heading">{deck.title}</h3>
							<a href="/deck/{deck.slug}" target="_blank" class="deck-url-preview"
								>/deck/{deck.slug} ↗</a
							>
						</div>
						<div class="item-actions">
							<button class="btn-small" onclick={() => copyDeckLink(deck.slug)}>
								{copiedDeckSlug === deck.slug ? 'Copied!' : 'Copy Link'}
							</button>
							<button class="btn-small" onclick={() => editDeck(deck)}>Edit</button>
							<button class="btn-small btn-delete" onclick={() => deleteDeck(deck.slug)}
								>Delete</button
							>
						</div>
					</article>
				{/each}
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
						<input
							type="email"
							bind:value={settings.contactEmail}
							placeholder="hello@younique.studio"
						/>
					</label>
					<p class="help-text">All contact form submissions will be directed to this address.</p>
				</div>

				<div class="field field--full">
					<label class="field">
						<span class="label">Discovery Call Booking URL (Cal.com / Calendly)</span>
						<input
							type="url"
							bind:value={settings.bookingLink}
							placeholder="https://cal.com/younique-studio/20min"
						/>
					</label>
					<p class="help-text">
						Paste your personal Cal.com or Calendly link to embed it directly inside the 20-Min Call popup.
					</p>
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
				<label class="field">
					<span class="label">Telegram URL</span>
					<input bind:value={settings.telegramLink} placeholder="#telegram" />
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
		padding: 2.25rem clamp(1rem, 3vw, 2.5rem) 4rem;
		max-width: 980px;
		margin: 0 auto;
		width: 100%;
		box-sizing: border-box;
	}

	.tabs {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-bottom: 2rem;
		align-items: center;
	}

	.tab-btn {
		font-family: inherit;
		padding: 0.65rem 1.25rem;
		font-size: 0.95rem;
		font-weight: 800;
		border-radius: 999px;
		border: 2px solid var(--color-3);
		background: transparent;
		color: var(--color-3);
		cursor: pointer;
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		white-space: nowrap;
		transition: all 0.2s;
	}

	.tab-btn.active {
		background: var(--color-3);
		color: var(--color-5);
	}

	.btn-logout {
		font-family: inherit;
		color: var(--color-3);
		border-color: var(--color-3);
		background: transparent;
	}

	.btn-logout:hover {
		background: #ff5252;
		color: #ffffff;
		border-color: var(--color-3);
		box-shadow: 2px 2px 0px var(--color-3);
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
		background: rgba(0, 0, 0, 0.03);
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

	.label {
		font-weight: 900;
	}

	input,
	textarea {
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

	input:focus,
	textarea:focus {
		border-color: var(--color-1);
		box-shadow: 0 0 0 4px var(--color-1);
	}

	textarea {
		resize: vertical;
	}

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

	.btn:hover,
	.btn:focus-visible {
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

	.posts-list {
		margin-top: 4rem;
	}
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

	.item-heading {
		margin: 0;
		font-family: var(--font-heading);
		font-size: 1.25rem;
	}

	.item-actions {
		display: flex;
		gap: 0.75rem;
	}

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

	@media (max-width: 680px) {
		.wrap {
			padding: 1.25rem 0.85rem 3rem;
		}

		.tabs {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 0.5rem;
			margin-bottom: 1.5rem;
		}

		.tab-btn {
			width: 100%;
			padding: 0.65rem 0.5rem;
			font-size: 0.85rem;
			justify-content: center;
			text-align: center;
			box-sizing: border-box;
		}

		.btn-logout {
			margin-left: 0;
			justify-content: center;
			text-align: center;
		}

		.panel {
			border-radius: 20px;
			border-width: 2.5px;
			box-shadow: 6px 6px 0px var(--color-3);
			padding: 1.25rem 1rem;
			margin-bottom: 1.5rem;
		}

		.page-title {
			font-size: 1.45rem;
			word-break: break-word;
		}

		.form {
			margin-top: 1.25rem;
			gap: 0.85rem;
		}

		.field {
			grid-column: span 12;
		}

		input,
		textarea {
			font-size: 16px;
			padding: 0.75rem 0.85rem;
			box-shadow: 3px 3px 0px var(--color-3);
		}

		.gallery-row {
			display: grid;
			grid-template-columns: 1fr auto;
			gap: 0.5rem;
			background: rgba(0, 0, 0, 0.03);
			padding: 0.65rem;
			border-radius: 10px;
			border: 1.5px dashed var(--color-3);
			box-sizing: border-box;
		}

		.gallery-row input {
			grid-column: 1 / 2;
			width: 100%;
			box-sizing: border-box;
		}

		.gallery-row .btn-delete {
			grid-column: 2 / 3;
			grid-row: 1 / span 2;
			align-self: stretch;
			padding: 0.6rem 0.85rem;
			font-size: 1.1rem;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.actions {
			display: flex;
			flex-direction: column;
			gap: 0.75rem;
		}

		.actions .btn,
		.actions .btn--outline {
			width: 100%;
			text-align: center;
			justify-content: center;
			box-sizing: border-box;
			padding: 0.85rem 1rem;
		}

		.status {
			width: 100%;
			text-align: center;
			box-sizing: border-box;
		}

		.posts-list {
			margin-top: 2.5rem;
		}

		.list-title {
			font-size: 1.45rem;
			margin-bottom: 1.25rem;
		}

		.item-card {
			flex-direction: column;
			align-items: stretch;
			gap: 1rem;
			padding: 1.15rem 1rem;
			border-width: 2px;
			border-radius: 14px;
			box-shadow: 4px 4px 0px var(--color-3);
		}

		.item-info {
			width: 100%;
		}

		.item-heading {
			font-size: 1.1rem;
			word-break: break-word;
		}

		.item-actions {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 0.5rem;
			width: 100%;
		}

		.btn-small {
			width: 100%;
			text-align: center;
			padding: 0.6rem 0.5rem;
			min-height: 40px;
			box-sizing: border-box;
		}

		.msg-content {
			padding: 1rem;
			font-size: 0.85rem;
			word-break: break-word;
			overflow-x: auto;
		}
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

	.scope-badges {
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem;
		margin: 0.6rem 0 0.25rem;
	}

	.scope-chip {
		font-size: 0.75rem;
		font-weight: 800;
		padding: 0.25rem 0.65rem;
		border-radius: 999px;
		border: 1.5px solid var(--color-3);
		background: transparent;
		color: var(--color-3);
	}

	.scope-chip--accent {
		background: var(--color-1);
		color: #1c1c1c;
	}

	.deck-deliverable-row {
		display: grid;
		grid-template-columns: 120px 1fr 1.2fr 1fr auto;
		gap: 0.5rem;
		align-items: center;
	}

	.deck-type-select {
		width: 100%;
		border-radius: 12px;
		border: 2px solid var(--color-3);
		background: var(--color-5);
		color: var(--color-3);
		padding: 0.85rem 0.6rem;
		font: inherit;
		font-weight: 700;
		box-shadow: 4px 4px 0px var(--color-3);
	}

	.deck-url-preview {
		font-size: 0.85rem;
		font-weight: 800;
		color: var(--color-3);
		opacity: 0.75;
		text-decoration: underline;
		margin-top: 0.25rem;
		display: inline-block;
	}

	@media (max-width: 780px) {
		.deck-deliverable-row {
			grid-template-columns: 1fr;
			background: rgba(0, 0, 0, 0.03);
			padding: 0.75rem;
			border-radius: 12px;
			border: 1.5px dashed var(--color-3);
		}
	}
</style>
