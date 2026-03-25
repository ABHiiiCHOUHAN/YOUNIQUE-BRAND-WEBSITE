<script>
  import { onMount, onDestroy } from 'svelte';

  let {
    items = [],
    direction = 'left',
    speed = 100,
    hoverSpeed = 0,
    gap = 32,
    logoHeight = 28,
    logoWidth = 'auto',
    vertical = false,
    reverse = false,
    pauseOnHover = false,
    className = '',
    itemDescription = true,
    fade = true,
    fadeColor = 'auto'
  } = $props();

  let trackRef;
  let animation;
  let isLoaded = $state(false);

  const toCssLength = (val) => typeof val === 'number' ? `${val}px` : val;

  // Image loading logic
  $effect(() => {
    const images = items.filter(item => item.src).map(item => item.src);
    if (images.length === 0) {
      isLoaded = true;
      return;
    }
    let loadedCount = 0;
    images.forEach(src => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === images.length) isLoaded = true;
      };
    });
  });

  const setupAnimation = () => {
    if (!isLoaded || !trackRef) return;

    const size = vertical ? trackRef.offsetHeight : trackRef.offsetWidth;
    const halfSize = size / 2;

    const distance = halfSize;
    const duration = (distance / speed) * 1000;

    const keyframes = vertical
      ? [
          { transform: `translateY(${reverse ? -distance : 0}px)` },
          { transform: `translateY(${reverse ? 0 : -distance}px)` }
        ]
      : [
          { transform: `translateX(${reverse ? -distance : 0}px)` },
          { transform: `translateX(${reverse ? 0 : -distance}px)` }
        ];

    if (animation) animation.cancel();

    animation = trackRef.animate(keyframes, {
      duration,
      easing: 'linear',
      iterations: Infinity
    });

    if (direction === 'right' || (vertical && direction === 'bottom')) {
      animation.playbackRate = -1;
    }
  };

  $effect(() => {
    if (isLoaded) setupAnimation();
  });

  const handleMouseEnter = () => {
    if (pauseOnHover) animation?.pause();
    if (hoverSpeed > 0) {
      const currentRate = animation?.playbackRate || 1;
      if (animation) animation.playbackRate = currentRate > 0 ? hoverSpeed / speed : -hoverSpeed / speed;
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) animation?.play();
    if (hoverSpeed > 0) {
      const currentRate = animation?.playbackRate || 1;
      if (animation) animation.playbackRate = currentRate > 0 ? 1 : -1;
    }
  };

  onDestroy(() => {
    if (animation) animation.cancel();
  });
</script>

<div
  class="logoloop {vertical ? 'logoloop--vertical' : ''} {fade ? 'logoloop--fade' : ''} {className}"
  style:--logoloop-gap={toCssLength(gap)}
  style:--logoloop-logoHeight={toCssLength(logoHeight)}
  style:--logoloop-logoWidth={toCssLength(logoWidth)}
  style:--logoloop-fadeColor={fadeColor === 'auto' ? 'var(--logoloop-fadeColorAuto)' : fadeColor}
  onmouseenter={handleMouseEnter}
  onmouseleave={handleMouseLeave}
  role="presentation"
>
  <div class="logoloop__track" bind:this={trackRef}>
    <div class="logoloop__list">
      {#each items as item}
        <div class="logoloop__item">
          {#if item.src}
            <img src={item.src} alt={item.alt || ''} class="logoloop__img" draggable="false" />
          {:else if item.node}
            <div class="logoloop__node">{@html item.node}</div>
          {/if}
          {#if itemDescription && item.title}
            <span class="logoloop__title">{item.title}</span>
          {/if}
        </div>
      {/each}
    </div>
    <div class="logoloop__list" aria-hidden="true">
      {#each items as item}
        <div class="logoloop__item">
          {#if item.src}
            <img src={item.src} alt={item.alt || ''} class="logoloop__img" draggable="false" />
          {:else if item.node}
            <div class="logoloop__node">{@html item.node}</div>
          {/if}
          {#if itemDescription && item.title}
            <span class="logoloop__title">{item.title}</span>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .logoloop {
    position: relative;
    overflow: hidden;
    width: 100%;
    --logoloop-gap: 32px;
    --logoloop-logoHeight: 28px;
    --logoloop-fadeColorAuto: #ffffff;
  }

  .logoloop--vertical {
    height: 100%;
    display: inline-block;
    width: auto;
  }

  :global(.dark) .logoloop {
    --logoloop-fadeColorAuto: #0b0b0b;
  }

  .logoloop__track {
    display: flex;
    width: max-content;
    will-change: transform;
    user-select: none;
    position: relative;
    z-index: 0;
  }

  .logoloop--vertical .logoloop__track {
    flex-direction: column;
    height: max-content;
    width: 100%;
  }

  .logoloop__list {
    display: flex;
    align-items: center;
    gap: var(--logoloop-gap);
    padding-right: var(--logoloop-gap);
  }

  .logoloop--vertical .logoloop__list {
    flex-direction: column;
    padding-right: 0;
    padding-bottom: var(--logoloop-gap);
  }

  .logoloop__item {
    display: flex;
    align-items: center;
    gap: 8px;
    height: var(--logoloop-logoHeight);
    flex-shrink: 0;
  }

  .logoloop__img {
    height: 100%;
    width: var(--logoloop-logoWidth);
    object-fit: contain;
    display: block;
  }

  .logoloop__node {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .logoloop__title {
    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;
  }

  /* Fading gradients */
  .logoloop--fade::before,
  .logoloop--fade::after {
    content: "";
    position: absolute;
    z-index: 1;
    pointer-events: none;
  }

  .logoloop:not(.logoloop--vertical).logoloop--fade::before,
  .logoloop:not(.logoloop--vertical).logoloop--fade::after {
    top: 0;
    bottom: 0;
    width: 10%;
    min-width: 40px;
  }

  .logoloop:not(.logoloop--vertical).logoloop--fade::before {
    left: 0;
    background: linear-gradient(to right, var(--logoloop-fadeColor), transparent);
  }

  .logoloop:not(.logoloop--vertical).logoloop--fade::after {
    right: 0;
    background: linear-gradient(to left, var(--logoloop-fadeColor), transparent);
  }

  .logoloop.logoloop--vertical.logoloop--fade::before,
  .logoloop.logoloop--vertical.logoloop--fade::after {
    left: 0;
    right: 0;
    height: 10%;
    min-height: 40px;
  }

  .logoloop.logoloop--vertical.logoloop--fade::before {
    top: 0;
    background: linear-gradient(to bottom, var(--logoloop-fadeColor), transparent);
  }

  .logoloop.logoloop--vertical.logoloop--fade::after {
    bottom: 0;
    background: linear-gradient(to top, var(--logoloop-fadeColor), transparent);
  }
</style>
