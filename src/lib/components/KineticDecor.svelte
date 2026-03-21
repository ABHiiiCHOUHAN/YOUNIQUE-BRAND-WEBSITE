<script>
  import { onMount } from 'svelte';
  import * as THREE from 'three';
  import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
  import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
  import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
  import { BokehShader } from 'three/addons/shaders/BokehShader.js';

  // Fix BokehShader destroying transparent backgrounds
  BokehShader.fragmentShader = BokehShader.fragmentShader.replace(
    'gl_FragColor.a = 1.0;',
    ''
  );

  let canvasElement;
  let wrapper;

  onMount(() => {
    const scene = new THREE.Scene();
    
    // Fallback sizing until ResizeObserver kicks in
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasElement, alpha: true, antialias: true });

    renderer.setPixelRatio(window.devicePixelRatio);
    camera.position.z = 15;
    
    // Post-processing for Depth of Field
    const renderPass = new RenderPass(scene, camera);
    renderPass.clearColor = new THREE.Color(0x000000);
    renderPass.clearAlpha = 0;

    const bokehPass = new BokehPass(scene, camera, {
      focus: 13.0,
      aperture: 0.025,
      maxblur: 0.02,
      width: window.innerWidth,
      height: window.innerHeight
    });

    const composer = new EffectComposer(renderer);
    composer.addPass(renderPass);
    composer.addPass(bokehPass);

    // Neutral lighting to preserve the exact material hex colors
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5); 
    scene.add(ambientLight);
    
    const mainLight = new THREE.DirectionalLight(0xffffff, 2.5);
    mainLight.position.set(10, 20, 10);
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 1.0);
    fillLight.position.set(-10, -10, -10);
    scene.add(fillLight);

    // Specific requested color palette
    const colors = [0xFF4081, 0x7C4DFF, 0x00E5FF, 0xFFD740, 0xFFAB40];
    
    // Premium solid vinyl/plastic materials
    const materials = colors.map(hex => new THREE.MeshPhysicalMaterial({ 
      color: hex,
      roughness: 0.2,
      metalness: 0.1,
      clearcoat: 0.4,
      clearcoatRoughness: 0.2,
      flatShading: false 
    }));

    const shapes = [];

    function addShape(object, material, pos, scale = 1) {
      let mesh;
      if (object.isBufferGeometry || object.isGeometry) {
        mesh = new THREE.Mesh(object, material);
      } else {
        mesh = object;
        // Apply material to all children
        mesh.traverse((child) => {
          if (child.isMesh) child.material = material;
        });
      }
      
      mesh.position.set(pos.x, pos.y, pos.z);
      mesh.scale.set(scale, scale, scale);
      
      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;
      
      mesh.userData = {
        rx: (Math.random() - 0.5) * 0.015,
        ry: (Math.random() - 0.5) * 0.015,
        rz: (Math.random() - 0.5) * 0.015,
        floatOffset: Math.random() * Math.PI * 2,
        floatSpeed: 0.5 + Math.random() * 0.5
      };
      
      scene.add(mesh);
      shapes.push(mesh);
    }

    // --- Complex Rounded Shapes (Matching Reference) ---

    // 1. Infinity Loop/Knot
    const infinityGeo = new THREE.TorusKnotGeometry(1.8, 0.5, 128, 32, 2, 3);
    addShape(infinityGeo, materials[0], { x: -16, y: 8, z: -2 }); // Pink - Pushed further top-left

    // 2. 3D Plus / Crossed Pills
    const plusGroup = new THREE.Group();
    const capGeo = new THREE.CapsuleGeometry(0.7, 2.8, 32, 32);
    const cap1 = new THREE.Mesh(capGeo);
    const cap2 = new THREE.Mesh(capGeo); cap2.rotation.x = Math.PI / 2;
    const cap3 = new THREE.Mesh(capGeo); cap3.rotation.z = Math.PI / 2;
    plusGroup.add(cap1, cap2, cap3);
    addShape(plusGroup, materials[1], { x: 18, y: -8, z: -4 }); // Purple - Pushed further bottom-right

    // 3. Fluid Blob / Dense Knot
    const blobGeo = new THREE.TorusKnotGeometry(1.5, 0.9, 128, 32, 3, 2);
    addShape(blobGeo, materials[2], { x: -20, y: -10, z: -6 }); // Cyan - Pushed further bottom-left

    // 4. Spinning Top (Lathe)
    const points = [
      new THREE.Vector2(0, -2),
      new THREE.Vector2(0.5, -1.8),
      new THREE.Vector2(2, 0),
      new THREE.Vector2(0.5, 1.8),
      new THREE.Vector2(0, 2)
    ];
    const topGeo = new THREE.LatheGeometry(points, 64);
    addShape(topGeo, materials[3], { x: 22, y: 10, z: 2 }); // Yellow - Pushed further top-right

    // 5. Coil / Spring
    const springGeo = new THREE.TorusKnotGeometry(1.5, 0.4, 200, 32, 1, 10);
    addShape(springGeo, materials[4], { x: -5, y: -16, z: -3 }); // Orange - Pushed further bottom

    // 6. Extruded Flower / Gear-like
    const flowerGroup = new THREE.Group();
    for(let i=0; i<6; i++) {
       const petal = new THREE.Mesh(new THREE.CapsuleGeometry(0.5, 2.5, 16, 16));
       petal.rotation.z = (Math.PI / 3) * i;
       flowerGroup.add(petal);
    }
    const center = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32));
    flowerGroup.add(center);
    addShape(flowerGroup, materials[2], { x: 12, y: 4, z: -8 }); // Cyan reused - Spread more center-right

    // Interactive mouse parallax variables
    let targetX = 0;
    let targetY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    const onPointerMove = (e) => {
      targetX = (e.clientX - windowHalfX) * 0.001; /* Reduced from 0.002 */
      targetY = (e.clientY - windowHalfY) * 0.001;
    };

    window.addEventListener('pointermove', onPointerMove);

    // Responsive Canvas
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        renderer.setSize(width, height);
        composer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
      }
    });
    
    if (wrapper) {
      resizeObserver.observe(wrapper);
      // Trigger initial size
      const rect = wrapper.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height);
      composer.setSize(rect.width, rect.height);
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
    }

    // Animation Loop
    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Smooth parallax on the entire scene based on cursor position
      scene.rotation.y += 0.015 * (targetX - scene.rotation.y); /* Slowed down from 0.03 */
      scene.rotation.x += 0.015 * (targetY - scene.rotation.x);

      // Scale scene incrementally as user scrolls down, reading directly from window to bypass Svelte reactivity overhead
      const currentScrollY = window.scrollY || 0;
      const isMobile = window.innerWidth < 768;
      const baseScale = isMobile ? 0.6 : 1.0;
      const targetScale = baseScale * (1 + (Math.max(0, currentScrollY) * 0.0010)); // scale up by 10% every 100px scrolled
      scene.scale.set(targetScale, targetScale, targetScale);

      // Spin and float individual shapes
      shapes.forEach((mesh) => {
        mesh.rotation.x += mesh.userData.rx;
        mesh.rotation.y += mesh.userData.ry;
        mesh.rotation.z += mesh.userData.rz;
        
        // Gentle bobbing effect
        mesh.position.y += Math.sin(time * mesh.userData.floatSpeed + mesh.userData.floatOffset) * 0.015;
      });

      composer.render();
    }
    animate();

    return () => {
      if (wrapper) resizeObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      renderer.dispose();
      composer.dispose();
    };
  });
</script>

<div class="doodads-wrapper" bind:this={wrapper}>
  <canvas bind:this={canvasElement}></canvas>
</div>

<style>
  .doodads-wrapper {
    position: absolute;
    inset: 0; /* Removed top gap */
    overflow: hidden;
    pointer-events: none; /* Clicks fall through, so the hero buttons still work! */
    z-index: 10; /* Render behind text, on top of hero background */
  }

  canvas {
    display: block;
    width: 100%;
    height: 100%;
    outline: none;
  }

  @media (max-width: 768px) {
    .doodads-wrapper {
      inset: 0;
    }
  }
</style>
