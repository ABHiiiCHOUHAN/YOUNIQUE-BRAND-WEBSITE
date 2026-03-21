<script>
  import WorkSection from '$lib/components/WorkSection.svelte';
  let { data } = $props();
</script>

<WorkSection projects={data?.projects} />
