<script>
  import { onMount, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';
  import * as THREE from 'three';
  import { gsap } from 'gsap';

  let { items = [] } = $props();

  let container;
  let scene, camera, renderer, group;
  let isMoving = false;
  let mousePosition = new THREE.Vector2();
  let raycaster = new THREE.Raycaster();
  
  // Interactive State
  let holdTimer;
  let focusedObject = $state(null);
  let focusedData = $state(null);
  let isDragging = false;
  let dragVelocity = $state(0);
  let time = 0; // for wobble
  
  const radius = 10;
  const itemCount = items.length || 20;

  onMount(() => {
    init();
    animate();
    window.addEventListener('resize', handleResize);
  });

  onDestroy(() => {
    if (renderer) {
      renderer.dispose();
      renderer.forceContextLoss();
    }
    window.removeEventListener('resize', handleResize);
    clearTimeout(holdTimer);
  });

  function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 25;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    group = new THREE.Group();
    scene.add(group);

    const phi = Math.PI * (3 - Math.sqrt(5));

    items.forEach((item, i) => {
      const y = 1 - (i / (itemCount - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;

      const loader = new THREE.TextureLoader();
      const texturePath = item.image || item.url || item;
      const texture = loader.load(texturePath);

      const material = new THREE.SpriteMaterial({ 
        map: texture,
        transparent: true,
        opacity: 0.8
      });

      const sprite = new THREE.Sprite(material);
      sprite.position.set(x * radius, y * radius, z * radius);
      sprite.scale.set(3, 3, 1);
      
      sprite.userData = { 
        id: i, 
        originalPos: sprite.position.clone(),
        data: item,
        inSphere: true
      };
      
      group.add(sprite);
    });
  }

  function handleResize() {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }

  function handleMouseDown(e) {
    if (focusedObject) return; // Ignore hold if already focused

    isMoving = true;
    isDragging = false;
    
    const rect = container.getBoundingClientRect();
    mousePosition.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mousePosition.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mousePosition, camera);
    const intersects = raycaster.intersectObjects(group.children);

    if (intersects.length > 0) {
      const target = intersects[0].object;
      
      holdTimer = setTimeout(() => {
        if (!isDragging) {
           focusOnItem(target);
        }
      }, 300); // 0.3 seconds hold
    }
  }

  function focusOnItem(sprite) {
    focusedObject = sprite;
    focusedData = sprite.userData.data;
    
    // Detach from group to stop following rotation
    const worldPos = new THREE.Vector3();
    sprite.getWorldPosition(worldPos);
    group.remove(sprite);
    scene.add(sprite);
    sprite.position.copy(worldPos);
    sprite.userData.inSphere = false;

    // Dim and slow others
    group.children.forEach(child => {
      gsap.to(child.material, { opacity: 0.05, duration: 1 });
    });

    // Move focused image to middle of screen
    gsap.to(sprite.position, {
      x: -2, // Move slightly to left to accommodate right text
      y: 0, 
      z: 15,
      duration: 1.2,
      ease: "power3.inOut"
    });
    
    gsap.to(sprite.scale, {
      x: 4.5, y: 4.5, // 1.5x original
      duration: 1.2,
      ease: "power3.inOut"
    });
    
    gsap.to(sprite.material, { opacity: 1, duration: 0.5 });
  }

  function resetFocus() {
    if (!focusedObject) return;
    
    const sprite = focusedObject;
    focusedObject = null;
    focusedData = null;

    // Attach back to group (maintains absolute world position)
    // Then animate back locally to originalPos
    group.attach(sprite);
    sprite.userData.inSphere = true;

    gsap.to(sprite.position, {
      x: sprite.userData.originalPos.x,
      y: sprite.userData.originalPos.y,
      z: sprite.userData.originalPos.z,
      duration: 1.2,
      ease: "power3.inOut"
    });
    
    gsap.to(sprite.scale, {
      x: 3, y: 3,
      duration: 1.2,
      ease: "power3.inOut"
    });
  }

  let targetX = 0, targetY = 0;
  let smoothX = 0, smoothY = 0;
  
  function handleMouseMove(e) {
    if (!isMoving) return;
    isDragging = true;
    clearTimeout(holdTimer);

    // Track targets based on movement
    targetX += e.movementX || 0;
    targetY += e.movementY || 0;
    
    // Total drag velocity for stretch effect
    dragVelocity = Math.sqrt(targetX * targetX + targetY * targetY) * 0.05;
  }

  function handleMouseUp() {
    isMoving = false;
    clearTimeout(holdTimer);
    if (focusedObject) {
       resetFocus();
    }
    // Also reset targets to stop "pulling" after release
    targetX = 0;
    targetY = 0;
  }

  function animate() {
    requestAnimationFrame(animate);
    time += 0.01;

    // Smoothing (lerping) logic for rotation
    // This creates the .1s delay/lag feel and high smoothness
    smoothX += (targetX - smoothX) * 0.1;
    smoothY += (targetY - smoothY) * 0.1;

    // Apply smooth rotation if there is movement
    if (Math.abs(smoothX) > 0.01 || Math.abs(smoothY) > 0.01) {
      const axis = new THREE.Vector3(smoothY, smoothX, 0).normalize();
      const angle = Math.sqrt(smoothX * smoothX + smoothY * smoothY) * 0.005;
      group.rotateOnWorldAxis(axis, angle);
      
      // Decay target values over time so rotation isn't infinite
      targetX *= 0.8;
      targetY *= 0.8;
    }

    dragVelocity *= 0.95;

    // Base auto-movement
    const baseRotation = (focusedObject || isMoving) ? 0.0005 : 0.002;
    if (!isMoving) {
      group.rotation.y += baseRotation;
    }

    // Wobble for focused object
    if (focusedObject) {
       focusedObject.position.x += Math.sin(time * 2) * 0.002;
       focusedObject.position.y += Math.cos(time * 1.5) * 0.002;
    }

    // Stretch effect during drag
    const stretchScale = 1 + dragVelocity * 0.1;
    group.scale.set(stretchScale, stretchScale, stretchScale);

    group.children.forEach((child) => {
      if (child.userData.inSphere && !focusedObject) {
        const worldPos = new THREE.Vector3();
        child.getWorldPosition(worldPos);
        const dist = worldPos.distanceTo(camera.position);
        const opacity = THREE.MathUtils.mapLinear(dist, camera.position.z - radius, camera.position.z + radius, 1, 0.1);
        child.material.opacity = Math.max(0.1, opacity);
      }
    });

    renderer.render(scene, camera);
  }
</script>

<div 
  bind:this={container} 
  class="infinite-menu-container"
  role="presentation"
  onmousedown={handleMouseDown}
  onmousemove={handleMouseMove}
  onmouseup={handleMouseUp}
  onmouseleave={handleMouseUp}
  onclick={() => { if (focusedObject) resetFocus(); }}
>
  {#if focusedData}
    <div class="focus-overlay" transition:fade={{ duration: 600 }}>
       <div class="focus-details">
          <div class="text-group">
             <div class="industry">{focusedData.industry}</div>
             <div class="name">{focusedData.name}</div>
             <div class="type">TYPE // {focusedData.type}</div>
          </div>
       </div>
    </div>
  {/if}
</div>

<style>
  @font-face {
    font-family: 'SpaceGrotesk';
    src: url('/fonts/static/SpaceGrotesk-Medium.ttf') format('truetype');
  }
  @font-face {
    font-family: 'SpaceMonoItalic';
    src: url('/fonts/Space_Mono/SpaceMono-Italic.ttf') format('truetype');
  }

  .infinite-menu-container {
    width: 100%;
    height: 100vh;
    cursor: grab;
    position: relative;
    user-select: none;
    background: transparent;
    overflow: hidden;
  }

  .infinite-menu-container:active {
    cursor: grabbing;
  }

  .focus-overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 20;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .focus-details {
    position: absolute;
    left: 55%; /* Position to the right of the center-aligned image */
    text-align: left;
    color: #fff;
    filter: blur(0px);
    animation: fadeBlurIn 1s cubic-bezier(0.2, 1, 0.3, 1) forwards;
  }

  .text-group {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .industry {
    font-family: 'SpaceMonoItalic', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.25em;
    opacity: 0.5;
    text-transform: uppercase;
  }

  .name {
    font-family: 'SpaceGrotesk', sans-serif;
    font-size: 2rem;
    font-weight: 500;
    letter-spacing: -0.02em;
    line-height: 0.9;
    margin: 0.1rem 0;
  }

  .type {
    font-family: 'SpaceGrotesk', sans-serif;
    font-size: 0.6rem;
    letter-spacing: 0.15em;
    opacity: 0.35;
  }

  @keyframes fadeBlurIn {
    from {
      opacity: 0;
      filter: blur(15px);
      transform: translateX(40px);
    }
    to {
      opacity: 1;
      filter: blur(0px);
      transform: translateX(0);
    }
  }
</style>
