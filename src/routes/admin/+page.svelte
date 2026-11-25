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
	let deckVersion = $state('v1.0 | Draft Review');
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

	// Ratings & Reviews State
	let reviews = $state([]);
	let reviewPlaceholderImg = $state('/assets/reviews/default-placeholder.svg');
	let reviewFilter = $state('all');
	let editingReviewId = $state(null);
	let revAuthor = $state('');
	let revRole = $state('');
	let revText = $state('');
	let revStars = $state(5);
	let revImg = $state('');
	let revLive = $state(true);
	let revStatus = $state('');
	let uploadingRowId = $state('');

	// 200x200 Image Cropper Modal State
	const CROP_VIEW_SIZE = 240;
	let cropModalOpen = $state(false);
	let cropTargetRevId = $state(''); // '' = form photo, non-empty = existing review row ID
	let cropSrc = $state('');
	let cropObjectUrl = $state('');
	let cropImgEl = $state(null);
	let cropNatW = $state(0);
	let cropNatH = $state(0);
	let cropZoom = $state(1);
	let cropX = $state(0);
	let cropY = $state(0);
	let cropDragging = $state(false);
	let cropDragStartX = 0;
	let cropDragStartY = 0;
	let cropOriginX = 0;
	let cropOriginY = 0;
	let cropSaving = $state(false);
	let cropError = $state('');

	const cropBaseScale = $derived(
		cropNatW > 0 && cropNatH > 0
			? Math.max(CROP_VIEW_SIZE / cropNatW, CROP_VIEW_SIZE / cropNatH)
			: 1
	);
	const cropScale = $derived(cropBaseScale * cropZoom);
	const cropDispW = $derived(cropNatW * cropScale);
	const cropDispH = $derived(cropNatH * cropScale);
	const cropMaxPanX = $derived(Math.max(0, (cropDispW - CROP_VIEW_SIZE) / 2));
	const cropMaxPanY = $derived(Math.max(0, (cropDispH - CROP_VIEW_SIZE) / 2));

	const pendingReviewCount = $derived(reviews.filter((r) => !r.live).length);
	const filteredReviews = $derived(
		reviewFilter === 'pending'
			? reviews.filter((r) => !r.live)
			: reviewFilter === 'live'
				? reviews.filter((r) => Boolean(r.live))
				: reviews
	);

	$effect(() => {
		posts = data.posts || [];
		projects = data.projects || [];
		messages = data.messages || [];
		decks = data.decks || [];
		reviews = data.reviewsData?.reviews || [];
		reviewPlaceholderImg =
			data.reviewsData?.placeholderImg || '/assets/reviews/default-placeholder.svg';
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
		deckVersion = deck.version || 'v1.0 | Draft Review';
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
		deckVersion = 'v1.0 | Draft Review';
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

	// Ratings & 200x200 Interactive Image Cropper Helpers
	function openCropperFromFile(file, targetRevId = '') {
		if (!file) return;
		if (cropObjectUrl) URL.revokeObjectURL(cropObjectUrl);
		const url = URL.createObjectURL(file);
		cropObjectUrl = url;
		cropSrc = url;
		cropTargetRevId = targetRevId;
		cropNatW = 0;
		cropNatH = 0;
		cropZoom = 1;
		cropX = 0;
		cropY = 0;
		cropError = '';
		cropModalOpen = true;
	}

	function openCropperFromUrl(existingUrl, targetRevId = '') {
		if (!existingUrl) return;
		if (cropObjectUrl) {
			URL.revokeObjectURL(cropObjectUrl);
			cropObjectUrl = '';
		}
		cropSrc = existingUrl;
		cropTargetRevId = targetRevId;
		cropNatW = 0;
		cropNatH = 0;
		cropZoom = 1;
		cropX = 0;
		cropY = 0;
		cropError = '';
		cropModalOpen = true;
	}

	function closeCropper() {
		cropModalOpen = false;
		cropDragging = false;
		cropSaving = false;
		cropError = '';
		if (cropObjectUrl) {
			URL.revokeObjectURL(cropObjectUrl);
			cropObjectUrl = '';
		}
		cropSrc = '';
	}

	function onCropImgLoad(e) {
		const el = e.currentTarget;
		cropNatW = el.naturalWidth || 200;
		cropNatH = el.naturalHeight || 200;
		cropZoom = 1;
		cropX = 0;
		cropY = 0;
	}

	function clampCropPan(x, y) {
		return {
			x: Math.max(-cropMaxPanX, Math.min(cropMaxPanX, x)),
			y: Math.max(-cropMaxPanY, Math.min(cropMaxPanY, y))
		};
	}

	function onCropPointerDown(e) {
		e.preventDefault();
		cropDragging = true;
		cropDragStartX = e.clientX;
		cropDragStartY = e.clientY;
		cropOriginX = cropX;
		cropOriginY = cropY;
		e.currentTarget.setPointerCapture?.(e.pointerId);
	}

	function onCropPointerMove(e) {
		if (!cropDragging) return;
		const dx = e.clientX - cropDragStartX;
		const dy = e.clientY - cropDragStartY;
		const clamped = clampCropPan(cropOriginX + dx, cropOriginY + dy);
		cropX = clamped.x;
		cropY = clamped.y;
	}

	function onCropPointerUp() {
		cropDragging = false;
	}

	function onCropZoomChange(e) {
		cropZoom = Number(e.currentTarget.value);
		const clamped = clampCropPan(cropX, cropY);
		cropX = clamped.x;
		cropY = clamped.y;
	}

	async function applyCropAndUpload() {
		if (!cropImgEl || !cropNatW || !cropNatH) return;
		cropSaving = true;
		cropError = '';

		try {
			const canvas = document.createElement('canvas');
			canvas.width = 200;
			canvas.height = 200;
			const ctx = canvas.getContext('2d');

			const viewLeft = (cropDispW - CROP_VIEW_SIZE) / 2 - cropX;
			const viewTop = (cropDispH - CROP_VIEW_SIZE) / 2 - cropY;
			const sx = Math.max(0, viewLeft / cropScale);
			const sy = Math.max(0, viewTop / cropScale);
			const sSize = Math.min(cropNatW - sx, cropNatH - sy, CROP_VIEW_SIZE / cropScale);

			ctx.drawImage(cropImgEl, sx, sy, sSize, sSize, 0, 0, 200, 200);
			const dataUrl = canvas.toDataURL('image/png');

			const res = await fetch('/api/reviews/upload', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ dataUrl })
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.error || 'Upload failed.');
			}
			const { url } = await res.json();

			if (cropTargetRevId) {
				uploadingRowId = cropTargetRevId;
				const putRes = await fetch(`/api/reviews/${cropTargetRevId}`, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ img: url })
				});
				if (!putRes.ok) throw new Error('Failed to save cropped image.');
				const updated = await putRes.json();
				reviews = reviews.map((r) => (r.id === cropTargetRevId ? updated : r));
				uploadingRowId = '';
			} else {
				revImg = url;
				revStatus = '200×200 cropped photo ready.';
			}

			closeCropper();
		} catch (err) {
			cropError = err.message || 'Could not crop and upload image.';
			uploadingRowId = '';
		} finally {
			cropSaving = false;
		}
	}

	function handleReviewFileSelect(e, targetRevId = '') {
		const file = e.target.files?.[0];
		e.target.value = '';
		if (file) openCropperFromFile(file, targetRevId);
	}

	function editReview(rev) {
		editingReviewId = rev.id;
		revAuthor = rev.author || '';
		revRole = rev.role || '';
		revText = rev.text || '';
		revStars = rev.stars || 5;
		revImg = rev.img || '';
		revLive = Boolean(rev.live);
		revStatus = '';
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function cancelEditReview() {
		editingReviewId = null;
		revAuthor = '';
		revRole = '';
		revText = '';
		revStars = 5;
		revImg = '';
		revLive = true;
	}

	async function saveReview(e) {
		e.preventDefault();
		if (!revAuthor.trim() || !revText.trim()) {
			revStatus = 'Author name and review text are required.';
			return;
		}
		revStatus = 'Saving...';
		const method = editingReviewId ? 'PUT' : 'POST';
		const url = editingReviewId ? `/api/reviews/${editingReviewId}` : '/api/reviews';

		try {
			const res = await fetch(url, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					author: revAuthor,
					role: revRole,
					text: revText,
					stars: Number(revStars),
					img: revImg,
					live: revLive
				})
			});
			if (res.ok) {
				const saved = await res.json();
				if (editingReviewId) {
					reviews = reviews.map((r) => (r.id === editingReviewId ? saved : r));
					revStatus = 'Review updated!';
				} else {
					reviews = [saved, ...reviews];
					revStatus = 'Review added!';
				}
				cancelEditReview();
			} else {
				const err = await res.json().catch(() => ({}));
				revStatus = err.error || 'Error saving review.';
			}
		} catch {
			revStatus = 'Network error.';
		}
	}

	async function toggleReviewLive(rev) {
		if (!rev.live && !rev.text?.trim()) {
			revStatus = 'Add a quote in Edit before publishing a star-only rating to the homepage.';
			editReview(rev);
			return;
		}
		try {
			const res = await fetch(`/api/reviews/${rev.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ live: !rev.live })
			});
			if (res.ok) {
				const updated = await res.json();
				reviews = reviews.map((r) => (r.id === rev.id ? updated : r));
			} else {
				alert('Failed to toggle live status.');
			}
		} catch {
			alert('Network error.');
		}
	}

	async function deleteReview(id) {
		if (!confirm('Delete this rating / review?')) return;
		try {
			const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
			if (res.ok) {
				reviews = reviews.filter((r) => r.id !== id);
				if (editingReviewId === id) cancelEditReview();
			} else {
				alert('Failed to delete review.');
			}
		} catch {
			alert('Network error.');
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
			class="tab-btn {activeTab === 'ratings' ? 'active' : ''}"
			onclick={() => (activeTab = 'ratings')}
		>
			Ratings
			{#if pendingReviewCount > 0}
				<span class="badge">{pendingReviewCount}</span>
			{/if}
		</button>
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
				<h1 class="page-title">{editingPostId ? 'Edit Post' : 'New Blog Post'}</h1>
			</header>
			<form class="form" onsubmit={savePost}>
				<label class="field">
					<span class="label">Date</span>
					<input type="date" bind:value={postDate} />
				</label>
				<label class="field field--full">
					<span class="label">Title</span>
					<input bind:value={postTitle} placeholder="Enter post title" />
				</label>
				<label class="field field--full">
					<span class="label">Content</span>
					<textarea bind:value={postContent} rows="8" placeholder="Write article content..."
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
			<h2 class="list-title">Published Posts</h2>
			{#if posts.length === 0}
				<p class="empty-msg">No posts found.</p>
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
				<h1 class="page-title">{editingProjId ? 'Edit Project' : 'New Project'}</h1>
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
					<span class="label">Summary Headline</span>
					<input bind:value={projDesc} placeholder="Short positioning statement" />
				</label>
				<label class="field field--full">
					<span class="label">Project Description</span>
					<textarea bind:value={projFullDesc} rows="6" placeholder="Detailed project overview..."
					></textarea>
				</label>

				<div class="separator-dash"></div>
				<h3 class="section-subhead field--full">Case Study Narrative</h3>

				<label class="field field--full">
					<span class="label">Challenge</span>
					<textarea
						bind:value={projChallenge}
						rows="3"
						placeholder="What problem did the client need solved?"
					></textarea>
				</label>
				<label class="field field--full">
					<span class="label">Creative Direction</span>
					<textarea
						bind:value={projCreativeDirection}
						rows="3"
						placeholder="Typography, motion, and visual strategy..."
					></textarea>
				</label>
				<label class="field field--full">
					<span class="label">Result Metric</span>
					<input
						bind:value={projResultMetric}
						placeholder="e.g. 42% increase in launch conversion"
					/>
				</label>

				<div class="gallery-manager field--full">
					<span class="label">Project Stats</span>
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
					<span class="label">Project Gallery</span>
					<div class="gallery-inputs">
						{#each projGallery as item, index}
							<div class="gallery-row">
								<input bind:value={item.title} placeholder="Title" />
								<input bind:value={item.url} placeholder="Image or video URL" />
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
			<h2 class="list-title">Existing Projects</h2>
			{#if projects.length === 0}
				<p class="empty-msg">No projects found.</p>
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
						No messages logged yet. New contact form submissions will appear here.
					</div>
				{/if}

				<div class="grid">
					{#each messages as msg}
						<div class="item-card message-card">
							<div class="message-meta">
								<span class="item-meta"
									>{new Date(msg.date).toLocaleDateString()} | {new Date(
										msg.date
									).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span
								>
								<span class="id-tag">ID: {msg.id.slice(-6)}</span>
							</div>
							<div class="message-body">
								<h3 class="item-heading">
									{msg.name} &mdash; <a href="mailto:{msg.email}" class="msg-email">{msg.email}</a>
								</h3>
								{#if msg.mobile}<p class="mobile-text">Phone: {msg.mobile}</p>{/if}
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
					{editingDeckSlug ? `Edit Deck: /deck/${editingDeckSlug}` : 'New Client Deck'}
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
					<input bind:value={deckVersion} placeholder="v1.0 — Draft Review" />
				</label>
				<label class="field">
					<span class="label">Access Passcode {editingDeckSlug ? '(leave blank to keep)' : ''}</span>
					<input
						type="text"
						bind:value={deckPasscode}
						placeholder={editingDeckSlug ? 'Enter new passcode to change' : 'Client access code'}
					/>
				</label>
				<label class="field field--full">
					<span class="label">Creator Notes</span>
					<textarea
						bind:value={deckNotes}
						rows="4"
						placeholder="Notes or context for the client..."
					></textarea>
				</label>

				<div class="gallery-manager field--full">
					<span class="label">Deck Deliverables</span>
					<div class="gallery-inputs">
						{#each deckDeliverables as item, index}
							<div class="deck-deliverable-row">
								<select bind:value={item.type} class="deck-type-select">
									<option value="image">Image</option>
									<option value="video">Video</option>
									<option value="link">Link / PDF</option>
								</select>
								<input bind:value={item.title} placeholder="Deliverable title" />
								<input bind:value={item.url} placeholder="Asset URL" />
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
			<h2 class="list-title">Client Decks</h2>
			{#if decks.length === 0}
				<p class="empty-msg">No client decks yet.</p>
			{/if}
			<div class="grid">
				{#each decks as deck}
					<article class="item-card">
						<div class="item-info">
							<span class="item-meta">
								{deck.clientName}{deck.clientCompany ? ` | ${deck.clientCompany}` : ''} | {deck.version}
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
				<h1 class="page-title">Site Settings</h1>
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
	{:else if activeTab === 'ratings'}
		<!-- Add / Edit Review Form -->
		<div class="panel">
			<header class="page-header">
				<h1 class="page-title">{editingReviewId ? 'Edit Client Review' : 'Add Client Review'}</h1>
			</header>
			<form class="form" onsubmit={saveReview}>
				<label class="field">
					<span class="label">Client Name</span>
					<input bind:value={revAuthor} placeholder="e.g. Jordan Lee" />
				</label>
				<label class="field">
					<span class="label">Role &amp; Company / Location</span>
					<input bind:value={revRole} placeholder="e.g. Head of Brand | Mumbai, India" />
				</label>
				<label class="field field--full">
					<span class="label">Star Rating</span>
					<select class="deck-type-select" bind:value={revStars}>
						<option value={5}>5 / 5 Stars</option>
						<option value={4}>4 / 5 Stars</option>
						<option value={3}>3 / 5 Stars</option>
						<option value={2}>2 / 5 Stars</option>
						<option value={1}>1 / 5 Star</option>
					</select>
				</label>
				<div class="field field--full">
					<span class="label">Review Quote</span>
					<textarea
						bind:value={revText}
						rows="4"
						placeholder="Client review text displayed on the homepage Voices section..."
					></textarea>
				</div>

				<div class="field field--full">
					<span class="label">Client Photo (200×200)</span>
					<div class="review-upload-row">
						<div class="avatar-box-200">
							<img src={revImg || reviewPlaceholderImg} alt="Client avatar" />
						</div>
						<div class="review-upload-actions">
							<label class="btn btn--outline" style="cursor: pointer;">
								Upload Photo
								<input
									type="file"
									accept="image/png,image/jpeg,image/webp"
									onchange={(e) => handleReviewFileSelect(e, '')}
									style="display: none;"
								/>
							</label>
							{#if revImg}
								<button
									type="button"
									class="btn-small"
									onclick={() => openCropperFromUrl(revImg, '')}
								>
									Crop 200×200
								</button>
								<button type="button" class="btn-small" onclick={() => (revImg = '')}>
									Remove
								</button>
							{/if}
						</div>
					</div>
				</div>

				<div class="field field--full">
					<label class="live-check">
						<input type="checkbox" bind:checked={revLive} />
						<span>Put Live on Website</span>
					</label>
				</div>

				<div class="actions">
					<button class="btn" type="submit">
						{editingReviewId ? 'Update Review' : 'Save Review'}
					</button>
					{#if editingReviewId}
						<button class="btn btn--outline" type="button" onclick={cancelEditReview}>Cancel</button>
					{/if}
					{#if revStatus}
						<div class="status">{revStatus}</div>
					{/if}
				</div>
			</form>
		</div>

		<!-- Ratings & Reviews Moderation Queue -->
		<div class="posts-list">
			<div class="reviews-list-header">
				<h2 class="list-title" style="margin: 0;">Client Ratings &amp; Reviews ({reviews.length})</h2>
				<div class="filter-pills">
					<button
						type="button"
						class="btn-small {reviewFilter === 'all' ? 'is-filter-active' : ''}"
						onclick={() => (reviewFilter = 'all')}
					>
						All ({reviews.length})
					</button>
					<button
						type="button"
						class="btn-small {reviewFilter === 'pending' ? 'is-filter-active' : ''}"
						onclick={() => (reviewFilter = 'pending')}
					>
						Pending ({pendingReviewCount})
					</button>
					<button
						type="button"
						class="btn-small {reviewFilter === 'live' ? 'is-filter-active' : ''}"
						onclick={() => (reviewFilter = 'live')}
					>
						Live ({reviews.length - pendingReviewCount})
					</button>
				</div>
			</div>

			{#if filteredReviews.length === 0}
				<p class="empty-msg">No reviews match this filter.</p>
			{/if}

			<div class="grid">
				{#each filteredReviews as rev}
					<article class="item-card review-mod-card">
						<div class="review-mod-left">
							<img
								src={rev.img || reviewPlaceholderImg}
								alt={rev.author}
								class="review-thumb-64"
							/>
							<div class="item-info">
								<div class="scope-badges" style="margin-top: 0;">
									<span class="scope-chip {rev.live ? 'scope-chip--accent' : ''}">
										{rev.live ? 'LIVE' : 'PENDING'}
									</span>
									<span class="scope-chip">★ {rev.stars || 5}/5</span>
									{#if rev.deckTitle}
										<span class="scope-chip">Deck: {rev.deckTitle}</span>
									{/if}
								</div>
								<h3 class="item-heading">{rev.author}</h3>
								<span class="item-meta">{rev.role || 'Client Partner'}</span>
								{#if rev.text}
									<p class="review-quote-preview">"{rev.text}"</p>
								{:else}
									<p class="review-quote-empty">Star rating submitted without written quote.</p>
								{/if}
							</div>
						</div>

						<div class="item-actions review-mod-actions">
							<button
								type="button"
								class="btn-small {rev.live ? '' : 'btn-go-live'}"
								onclick={() => toggleReviewLive(rev)}
							>
								{rev.live ? 'Unpublish' : 'Put Live'}
							</button>
							<label class="btn-small" style="cursor: pointer;">
								{uploadingRowId === rev.id ? '...' : 'Upload Photo'}
								<input
									type="file"
									accept="image/png,image/jpeg,image/webp"
									onchange={(e) => handleReviewFileSelect(e, rev.id)}
									disabled={uploadingRowId === rev.id}
									style="display: none;"
								/>
							</label>
							{#if rev.img}
								<button
									type="button"
									class="btn-small"
									onclick={() => openCropperFromUrl(rev.img, rev.id)}
								>
									Crop
								</button>
							{/if}
							<button type="button" class="btn-small" onclick={() => editReview(rev)}>Edit</button>
							<button type="button" class="btn-small btn-delete" onclick={() => deleteReview(rev.id)}>
								Delete
							</button>
						</div>
					</article>
				{/each}
			</div>
		</div>
	{/if}
</section>

<!-- 200x200 Photo Cropper Modal (outside .page-transition so position:fixed anchors cleanly to viewport) -->
{#if cropModalOpen}
	<div
		class="crop-backdrop"
		role="presentation"
		onclick={(e) => {
			if (e.target === e.currentTarget && !cropSaving) closeCropper();
		}}
	>
		<div class="crop-modal panel" role="dialog" aria-modal="true" aria-labelledby="crop-modal-title">
			<header class="crop-header">
				<h2 id="crop-modal-title" class="page-title">Crop Photo (200×200)</h2>
				<button
					type="button"
					class="btn-small"
					onclick={closeCropper}
					disabled={cropSaving}
					aria-label="Close cropper"
				>
					×
				</button>
			</header>

			<div
				class="crop-stage"
				role="application"
				aria-label="Drag to reposition crop area"
				style="width: {CROP_VIEW_SIZE}px; height: {CROP_VIEW_SIZE}px;"
				onpointerdown={onCropPointerDown}
				onpointermove={onCropPointerMove}
				onpointerup={onCropPointerUp}
				onpointercancel={onCropPointerUp}
			>
				{#if cropSrc}
					<img
						bind:this={cropImgEl}
						src={cropSrc}
						alt="Crop preview"
						onload={onCropImgLoad}
						draggable="false"
						style="width: {cropDispW}px; height: {cropDispH}px; transform: translate(calc(-50% + {cropX}px), calc(-50% + {cropY}px));"
					/>
				{/if}
				<div class="crop-grid" aria-hidden="true"></div>
			</div>

			<div class="crop-controls">
				<label class="crop-zoom-field">
					<span class="label">Zoom ({cropZoom.toFixed(1)}×)</span>
					<input
						type="range"
						min="1"
						max="3"
						step="0.05"
						value={cropZoom}
						oninput={onCropZoomChange}
					/>
				</label>
				{#if cropError}
					<p class="crop-error">{cropError}</p>
				{/if}
				<div class="actions" style="margin-top: 0.25rem;">
					<button
						type="button"
						class="btn"
						onclick={applyCropAndUpload}
						disabled={cropSaving || !cropNatW}
					>
						{cropSaving ? 'Saving...' : 'Crop & Save (200×200)'}
					</button>
					<button
						type="button"
						class="btn btn--outline"
						onclick={closeCropper}
						disabled={cropSaving}
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.wrap,
	.crop-backdrop {
		--adm-surface: var(--color-5, #fffaf4);
		--adm-input-bg: #ffffff;
		--adm-subtle-bg: #f1eadf;
		--adm-border: #1c1c1c;
		--adm-divider: rgba(28, 28, 28, 0.22);
		--adm-shadow-ink: #1c1c1c;
		--adm-text: #1c1c1c;
		--adm-muted: #57534e;
		--adm-accent: var(--color-1, #fdd803);
		--adm-accent-ink: #111111;

		font-family: var(--font-heading, system-ui, -apple-system, sans-serif);
		color: var(--adm-text);
	}

	.wrap {
		padding: 2rem clamp(1rem, 3vw, 2.5rem) 4rem;
		max-width: 980px;
		margin: 0 auto;
		width: 100%;
		box-sizing: border-box;
	}

	:global(.dark) .wrap,
	:global(.dark) .crop-backdrop {
		--adm-surface: #242424;
		--adm-input-bg: #181818;
		--adm-subtle-bg: #323232;
		--adm-border: #c9c4bc;
		--adm-divider: rgba(255, 250, 244, 0.18);
		--adm-shadow-ink: #111111;
		--adm-text: #fffaf4;
		--adm-muted: #b8b3ac;
		--adm-accent: #fdd803;
		--adm-accent-ink: #111111;
	}

	.tabs {
		display: flex;
		flex-wrap: wrap;
		gap: 0.65rem;
		margin-bottom: 1.75rem;
		align-items: center;
	}

	.tab-btn {
		font-family: inherit;
		padding: 0.6rem 1.2rem;
		font-size: 0.9rem;
		font-weight: 800;
		border-radius: 999px;
		border: 2px solid var(--adm-border);
		background: var(--adm-surface);
		color: var(--adm-text);
		box-shadow: 3px 3px 0px var(--adm-shadow-ink);
		cursor: pointer;
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		white-space: nowrap;
		outline: none;
		transition:
			background-color 0.12s ease,
			color 0.12s ease,
			transform 0.1s ease,
			box-shadow 0.1s ease;
	}

	.tab-btn:hover {
		background: var(--adm-subtle-bg);
	}

	.tab-btn:active {
		transform: translate(2px, 2px);
		box-shadow: 1px 1px 0px var(--adm-shadow-ink);
	}

	.tab-btn:focus-visible {
		outline: 2px solid var(--adm-accent);
		outline-offset: 2px;
	}

	.tab-btn.active {
		background: var(--adm-accent);
		color: var(--adm-accent-ink);
		border: 2px solid #111111;
		box-shadow: 3px 3px 0px var(--adm-shadow-ink);
	}

	.tab-btn.active:hover {
		background: #ffe234;
	}

	.btn-logout {
		border-color: #dc2626;
		color: #dc2626;
		background: var(--adm-surface);
	}

	:global(.dark) .btn-logout {
		color: #fca5a5;
		border-color: #f87171;
	}

	.btn-logout:hover {
		background: #dc2626;
		color: #ffffff;
		border-color: #111111;
	}

	.panel {
		border-radius: 16px;
		border: 2px solid var(--adm-border);
		background: var(--adm-surface);
		color: var(--adm-text);
		box-shadow: 4px 4px 0px var(--adm-shadow-ink);
		padding: clamp(1.25rem, 3vw, 2rem);
		margin-bottom: 2rem;
	}

	.page-header {
		margin-bottom: 1.25rem;
		padding-bottom: 0.9rem;
		border-bottom: 1.5px solid var(--adm-divider);
	}

	.page-title {
		font-family: inherit;
		font-size: 1.45rem;
		font-weight: 800;
		margin: 0;
		letter-spacing: -0.02em;
		color: var(--adm-text);
	}

	.section-subhead {
		font-family: inherit;
		font-size: 1.05rem;
		font-weight: 800;
		margin: 0 0 0.25rem;
		color: var(--adm-text);
	}

	.badge {
		background: var(--adm-accent);
		color: var(--adm-accent-ink);
		border: 1.5px solid #1c1c1c;
		font-size: 0.72rem;
		font-weight: 800;
		padding: 0.08rem 0.45rem;
		border-radius: 999px;
		margin-left: 0.45rem;
		line-height: 1.2;
	}

	.message-card {
		flex-direction: column !important;
		align-items: stretch !important;
		gap: 1rem;
	}

	.message-meta {
		display: flex;
		justify-content: space-between;
		color: var(--adm-muted);
		font-size: 0.82rem;
		font-weight: 700;
	}

	.msg-email {
		color: inherit;
		text-decoration: underline;
		font-weight: 600;
	}

	.msg-content {
		background: var(--adm-subtle-bg);
		padding: 1rem 1.15rem;
		border-radius: 10px;
		border: 1.5px solid var(--adm-divider);
		margin-top: 0.75rem;
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
		font-size: 0.9rem;
		color: var(--adm-text);
		white-space: pre-wrap;
	}

	.msg-content p {
		margin: 0;
	}

	.mobile-text {
		font-weight: 600;
		font-size: 0.88rem;
		margin: 0.35rem 0 0;
		color: var(--adm-muted);
	}

	.empty-state,
	.empty-msg {
		padding: 2rem 0;
		text-align: center;
		color: var(--adm-muted);
		font-weight: 600;
	}

	.form {
		display: grid;
		grid-template-columns: repeat(12, 1fr);
		gap: 1rem;
	}

	.field {
		grid-column: span 6;
		display: grid;
		gap: 0.4rem;
	}

	.field--full {
		grid-column: span 12;
	}

	.label {
		font-weight: 700;
		font-size: 0.86rem;
		color: var(--adm-text);
	}

	input,
	textarea {
		width: 100%;
		border-radius: 10px;
		border: 1.5px solid var(--adm-border);
		background: var(--adm-input-bg);
		color: var(--adm-text);
		padding: 0.72rem 0.9rem;
		font: inherit;
		font-size: 0.95rem;
		font-weight: 500;
		outline: none;
		box-shadow: 2px 2px 0px var(--adm-shadow-ink);
		transition:
			border-color 0.15s ease,
			box-shadow 0.15s ease;
		appearance: none;
		box-sizing: border-box;
	}

	input::placeholder,
	textarea::placeholder {
		color: var(--adm-muted);
		opacity: 0.75;
	}

	input:focus,
	textarea:focus {
		border-color: var(--adm-accent);
		box-shadow: 3px 3px 0px var(--adm-accent);
	}

	input:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	textarea {
		resize: vertical;
	}

	.actions {
		grid-column: span 12;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.8rem;
		margin-top: 0.75rem;
	}

	.btn {
		font-family: inherit;
		border-radius: 999px;
		padding: 0.7rem 1.45rem;
		font-weight: 800;
		font-size: 0.9rem;
		border: 2px solid #111111;
		background: var(--adm-accent);
		color: var(--adm-accent-ink);
		cursor: pointer;
		text-decoration: none;
		outline: none;
		box-shadow: 3px 3px 0px var(--adm-shadow-ink);
		transition:
			background-color 120ms ease,
			transform 100ms ease,
			box-shadow 100ms ease;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	.btn:hover {
		background: #ffe234;
	}

	.btn:active {
		transform: translate(2px, 2px);
		box-shadow: 1px 1px 0px var(--adm-shadow-ink);
	}

	.btn:focus-visible {
		outline: 2px solid var(--adm-accent);
		outline-offset: 2px;
	}

	.btn--outline {
		background: var(--adm-surface);
		color: var(--adm-text);
		border: 2px solid var(--adm-border);
		box-shadow: 3px 3px 0px var(--adm-shadow-ink);
		align-self: flex-start;
	}

	.btn--outline:hover {
		background: var(--adm-subtle-bg);
	}

	.status {
		font-weight: 700;
		font-size: 0.88rem;
		padding: 0.5rem 0.95rem;
		background: var(--adm-subtle-bg);
		color: var(--adm-text);
		border-radius: 999px;
		border: 1.5px solid var(--adm-border);
		box-shadow: 2px 2px 0px var(--adm-shadow-ink);
	}

	.posts-list {
		margin-top: 2.5rem;
	}

	.list-title {
		font-family: inherit;
		font-size: 1.3rem;
		font-weight: 800;
		margin-bottom: 1.25rem;
		color: var(--adm-text);
		letter-spacing: -0.015em;
	}

	.grid {
		display: flex;
		flex-direction: column;
		gap: 0.95rem;
	}

	.item-card {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: var(--adm-surface);
		border: 2px solid var(--adm-border);
		border-radius: 14px;
		padding: 1.15rem 1.35rem;
		box-shadow: 3px 3px 0px var(--adm-shadow-ink);
	}

	.item-info {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.item-meta {
		font-size: 0.78rem;
		font-weight: 700;
		color: var(--adm-muted);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.item-heading {
		margin: 0;
		font-family: inherit;
		font-size: 1.06rem;
		font-weight: 700;
		color: var(--adm-text);
	}

	.item-actions {
		display: flex;
		gap: 0.55rem;
		flex-shrink: 0;
	}

	.btn-small {
		padding: 0.45rem 0.95rem;
		font-weight: 700;
		font-family: inherit;
		font-size: 0.85rem;
		cursor: pointer;
		border-radius: 999px;
		border: 2px solid var(--adm-border);
		background: var(--adm-surface);
		color: var(--adm-text);
		outline: none;
		box-shadow: 2px 2px 0px var(--adm-shadow-ink);
		transition:
			background-color 0.12s ease,
			transform 0.1s ease,
			box-shadow 0.1s ease;
	}

	.btn-small:hover {
		background: var(--adm-subtle-bg);
	}

	.btn-small:active {
		transform: translate(1px, 1px);
		box-shadow: 1px 1px 0px var(--adm-shadow-ink);
	}

	.btn-delete {
		background: var(--adm-surface);
		color: #dc2626;
		border-color: #dc2626;
	}

	:global(.dark) .btn-delete {
		color: #fca5a5;
		border-color: #f87171;
	}

	.btn-delete:hover {
		background: #dc2626;
		color: #ffffff;
		border-color: #dc2626;
	}

	/* Gallery & Deck Deliverable Managers */
	.gallery-manager {
		margin-top: 1rem;
		padding-top: 1.25rem;
		border-top: 1.5px solid var(--adm-divider);
	}

	.gallery-inputs {
		display: flex;
		flex-direction: column;
		gap: 0.65rem;
		margin-top: 0.75rem;
	}

	.gallery-row {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.gallery-row input {
		flex: 1;
	}

	.help-text {
		font-size: 0.84rem;
		color: var(--adm-muted);
		margin: 0.25rem 0 0;
	}

	.separator-dash {
		grid-column: span 12;
		height: 1.5px;
		background: var(--adm-divider);
		margin: 0.85rem 0;
	}

	.scope-badges {
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem;
		margin: 0.55rem 0 0.25rem;
	}

	.scope-chip {
		font-size: 0.76rem;
		font-weight: 700;
		padding: 0.22rem 0.65rem;
		border-radius: 999px;
		border: 1.5px solid var(--adm-border);
		background: var(--adm-subtle-bg);
		color: var(--adm-text);
	}

	.scope-chip--accent {
		background: var(--adm-accent);
		color: var(--adm-accent-ink);
		border-color: #1c1c1c;
	}

	.deck-deliverable-row {
		display: grid;
		grid-template-columns: 120px 1fr 1.2fr 1fr auto;
		gap: 0.5rem;
		align-items: center;
	}

	.deck-type-select {
		width: 100%;
		border-radius: 10px;
		border: 1.5px solid var(--adm-border);
		background: var(--adm-input-bg);
		color: var(--adm-text);
		padding: 0.72rem 0.6rem;
		font: inherit;
		font-size: 0.9rem;
		font-weight: 600;
		box-shadow: 2px 2px 0px var(--adm-shadow-ink);
		outline: none;
	}

	.deck-url-preview {
		font-size: 0.84rem;
		font-weight: 700;
		color: var(--adm-muted);
		text-decoration: underline;
		margin-top: 0.25rem;
		display: inline-block;
	}

	.deck-url-preview:hover {
		color: var(--adm-text);
	}

	@media (max-width: 780px) {
		.deck-deliverable-row {
			grid-template-columns: 1fr;
			background: var(--adm-subtle-bg);
			padding: 0.75rem;
			border-radius: 12px;
			border: 1.5px solid var(--adm-border);
		}
	}

	@media (max-width: 680px) {
		.wrap {
			padding: 1.25rem 0.85rem 3rem;
		}

		.tabs {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 0.5rem;
			margin-bottom: 1.25rem;
		}

		.tab-btn {
			width: 100%;
			padding: 0.6rem 0.5rem;
			font-size: 0.85rem;
			box-sizing: border-box;
		}

		.panel {
			padding: 1.2rem 1rem;
			margin-bottom: 1.5rem;
			box-shadow: 3px 3px 0px var(--adm-shadow-ink);
		}

		.page-title {
			font-size: 1.3rem;
			word-break: break-word;
		}

		.field {
			grid-column: span 12;
		}

		input,
		textarea {
			font-size: 16px;
			padding: 0.72rem 0.85rem;
		}

		.gallery-row {
			display: grid;
			grid-template-columns: 1fr auto;
			gap: 0.5rem;
			background: var(--adm-subtle-bg);
			padding: 0.65rem;
			border-radius: 10px;
			border: 1.5px solid var(--adm-border);
			box-sizing: border-box;
		}

		.gallery-row input {
			grid-column: 1 / 2;
		}

		.gallery-row .btn-delete {
			grid-column: 2 / 3;
			grid-row: 1 / span 2;
			align-self: stretch;
			padding: 0.6rem 0.85rem;
			font-size: 1.05rem;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.actions {
			display: flex;
			flex-direction: column;
			gap: 0.65rem;
		}

		.actions .btn,
		.actions .btn--outline,
		.btn--outline {
			width: 100%;
			box-sizing: border-box;
			padding: 0.78rem 1rem;
		}

		.status {
			width: 100%;
			text-align: center;
			box-sizing: border-box;
		}

		.item-card {
			flex-direction: column;
			align-items: stretch;
			gap: 0.9rem;
			padding: 1rem;
		}

		.item-heading {
			font-size: 1rem;
			word-break: break-word;
		}

		.item-actions {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
			gap: 0.5rem;
			width: 100%;
		}

		.btn-small {
			width: 100%;
			text-align: center;
			padding: 0.55rem 0.5rem;
			min-height: 38px;
			box-sizing: border-box;
		}

		.msg-content {
			padding: 0.9rem;
			font-size: 0.85rem;
			word-break: break-word;
			overflow-x: auto;
		}
	}

	/* Ratings & 200x200 Photo / Cropper Controls */
	.avatar-box-200 {
		position: relative;
		width: 112px;
		height: 112px;
		border-radius: 14px;
		border: 2px solid var(--adm-border);
		box-shadow: 3px 3px 0px var(--adm-shadow-ink);
		overflow: hidden;
		background: var(--adm-subtle-bg);
		flex-shrink: 0;
	}

	.avatar-box-200 img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.review-upload-row {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
		margin-top: 0.25rem;
	}

	.review-upload-actions {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		flex-wrap: wrap;
	}

	/* Cropper Modal */
	.crop-backdrop {
		position: fixed;
		inset: 0;
		z-index: 300;
		background: rgba(18, 18, 18, 0.6);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
	}

	.crop-modal {
		width: 100%;
		max-width: 400px;
		max-height: calc(100dvh - 2rem);
		overflow-y: auto;
		margin-bottom: 0;
		background: var(--adm-surface);
		color: var(--adm-text);
		border: 2px solid var(--adm-border);
		box-shadow: 5px 5px 0px var(--adm-shadow-ink);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.15rem;
	}

	.crop-header {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 0.75rem;
		border-bottom: 1.5px solid var(--adm-divider);
	}

	.crop-stage {
		position: relative;
		overflow: hidden;
		border-radius: 14px;
		border: 2px solid var(--adm-border);
		box-shadow: 3px 3px 0px var(--adm-shadow-ink);
		background: #141414;
		cursor: grab;
		touch-action: none;
		user-select: none;
	}

	.crop-stage:active {
		cursor: grabbing;
	}

	.crop-stage img {
		position: absolute;
		left: 50%;
		top: 50%;
		max-width: none;
		pointer-events: none;
		user-select: none;
	}

	.crop-grid {
		position: absolute;
		inset: 0;
		pointer-events: none;
		border: 1px dashed rgba(253, 216, 3, 0.75);
		box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.25);
	}

	.crop-controls {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.crop-zoom-field {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.crop-zoom-field input[type='range'] {
		width: 100%;
		padding: 0;
		border: none;
		box-shadow: none;
		background: transparent;
		appearance: auto;
		-webkit-appearance: slider-horizontal;
		accent-color: var(--adm-accent);
		cursor: pointer;
	}

	.crop-error {
		margin: 0;
		font-size: 0.85rem;
		font-weight: 700;
		color: #dc2626;
	}

	.live-check {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		font-weight: 700;
		font-size: 0.92rem;
		cursor: pointer;
		color: var(--adm-text);
	}

	.live-check input[type='checkbox'] {
		width: 18px;
		height: 18px;
		padding: 0;
		margin: 0;
		appearance: auto;
		box-shadow: none;
		accent-color: var(--adm-accent);
		cursor: pointer;
	}

	.reviews-list-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
		margin-bottom: 1.25rem;
	}

	.filter-pills {
		display: flex;
		gap: 0.45rem;
		flex-wrap: wrap;
	}

	.is-filter-active {
		background: var(--adm-accent) !important;
		color: var(--adm-accent-ink) !important;
		border-color: #1c1c1c !important;
	}

	.review-mod-card {
		align-items: flex-start;
		gap: 1rem;
	}

	.review-mod-left {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		flex: 1;
		min-width: 0;
	}

	.review-thumb-64 {
		width: 64px;
		height: 64px;
		border-radius: 12px;
		object-fit: cover;
		border: 1.5px solid var(--adm-border);
		background: var(--adm-subtle-bg);
		flex-shrink: 0;
	}

	.review-quote-preview {
		margin: 0.45rem 0 0;
		font-size: 0.92rem;
		line-height: 1.45;
		color: var(--adm-text);
		opacity: 0.9;
	}

	.review-quote-empty {
		margin: 0.4rem 0 0;
		font-size: 0.85rem;
		font-style: italic;
		color: var(--adm-muted);
	}

	.review-mod-actions {
		flex-wrap: wrap;
		justify-content: flex-end;
	}

	.btn-go-live {
		background: var(--adm-accent);
		color: var(--adm-accent-ink);
		border-color: #111111;
	}

	.btn-go-live:hover {
		background: #ffe234;
	}
</style>
