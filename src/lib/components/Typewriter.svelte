<script>
  let { text = "", speed = 70, delay = 0 } = $props();
  let displayedText = $state("");
  let index = $state(0);
  let started = $state(false);
  let element = $state();

  $effect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !started) {
        started = true;
        setTimeout(type, delay);
      }
    }, { 
      threshold: 0.1,
      rootMargin: '-5% 0px -5% 0px'
    });

    if (element) observer.observe(element);
    return () => observer.disconnect();
  });

  function type() {
    if (index < text.length) {
      displayedText += text.charAt(index);
      index++;
      setTimeout(type, speed);
    }
  }
</script>

<span bind:this={element} class="typewriter-container">
  <span class="text">{displayedText}</span><span class="cursor" class:hidden={index === text.length}>_</span>
</span>

<style>
  .typewriter-container {
    display: inline-flex;
    align-items: center;
  }
  .cursor {
    font-weight: 100;
    animation: blink 0.8s step-end infinite;
    margin-left: 2px;
  }
  .cursor.hidden {
    display: none;
  }
  @keyframes blink {
    from, to { opacity: 1; }
    50% { opacity: 0; }
  }
</style>
