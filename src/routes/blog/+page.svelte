<script>
  import BlogSection from '$lib/components/BlogSection.svelte';
  let { data } = $props();
</script>

<svelte:head>
  <title>Blog - Younique</title>
</svelte:head>

<BlogSection postsPromise={data.postsPromise} />
