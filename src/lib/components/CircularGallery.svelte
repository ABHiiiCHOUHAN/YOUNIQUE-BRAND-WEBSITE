<script>
  import { onMount, onDestroy } from 'svelte';
  import { Renderer, Camera, Transform, Plane, Mesh, Program, Texture } from 'ogl';

  let { items = [], bend = 3, textColor = '#ffffff', borderRadius = 0.05, font = 'bold 30px Unbounded', scrollSpeed = 2, scrollEase = 0.05 } = $props();

  let container;
  let gallery;

  // ── Helpers ──────────────────────────────────────────────────────────────────
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
  function lerp(p1, p2, t) { return p1 + (p2 - p1) * t; }

  // ── Title overlays ───────────────────────────────────────────────────────────
  function createTextTexture(gl, text, font, color) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = font;
    const w = Math.ceil(ctx.measureText(text).width) + 40;
    const h = Math.ceil(parseInt(font, 10) * 1.5) + 40;
    canvas.width = w; canvas.height = h;
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText(text, w / 2, h / 2);
    const tex = new Texture(gl, { generateMipmaps: false });
    tex.image = canvas;
    return { texture: tex, width: w, height: h };
  }

  class Title {
    constructor({ gl, plane, text, textColor, font }) {
      const { texture, width, height } = createTextTexture(gl, text, font, textColor);
      const geo = new Plane(gl);
      const prog = new Program(gl, {
        vertex: `attribute vec3 position;attribute vec2 uv;uniform mat4 modelViewMatrix;uniform mat4 projectionMatrix;varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
        fragment: `precision highp float;uniform sampler2D tMap;varying vec2 vUv;void main(){vec4 c=texture2D(tMap,vUv);if(c.a<0.1)discard;gl_FragColor=c;}`,
        uniforms: { tMap: { value: texture } },
        transparent: true
      });
      this.mesh = new Mesh(gl, { geometry: geo, program: prog });
      const aspect = width / height;
      const th = plane.scale.y * 0.12;
      this.mesh.scale.set(th * aspect, th, 1);
      this.mesh.position.y = -plane.scale.y * 0.5 - th * 0.5 - 0.15;
      this.mesh.setParent(plane);
    }
  }

  // ── Media item (one card) ────────────────────────────────────────────────────
  class Media {
    constructor({ geometry, gl, image, index, length, scene, screen, text, viewport, bend, textColor, borderRadius, font }) {
      this.extra = 0;
      this.geometry = geometry; this.gl = gl;
      this.image = image; this.index = index; this.length = length;
      this.scene = scene; this.screen = screen; this.text = text;
      this.viewport = viewport; this.bend = bend;
      this.textColor = textColor; this.borderRadius = borderRadius; this.font = font;
      // State
      this.selected = false;
      this.targetScale = 1;
      this.currentScale = 1;
      this.targetGray = 0;
      this.currentGray = 0;
      this.createShader();
      this.createMesh();
      new Title({ gl, plane: this.plane, text, textColor, font });
      this.onResize();
    }

    createShader() {
      const texture = new Texture(this.gl, { generateMipmaps: true });
      this.program = new Program(this.gl, {
        depthTest: false, depthWrite: false,
        vertex: `
          precision highp float;
          attribute vec3 position; attribute vec2 uv;
          uniform mat4 modelViewMatrix; uniform mat4 projectionMatrix;
          uniform float uTime; uniform float uSpeed;
          varying vec2 vUv;
          void main() {
            vUv = uv;
            vec3 p = position;
            p.z = (sin(p.x * 4.0 + uTime)*1.5 + cos(p.y * 2.0 + uTime)*1.5) * (0.1 + uSpeed * 0.5);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          }
        `,
        fragment: `
          precision highp float;
          uniform vec2 uImageSizes; uniform vec2 uPlaneSizes;
          uniform sampler2D tMap;
          uniform float uBorderRadius;
          uniform float uGrayscale;
          varying vec2 vUv;

          float roundedBoxSDF(vec2 p, vec2 b, float r) {
            vec2 d = abs(p) - b;
            return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
          }

          void main() {
            vec2 ratio = vec2(
              min((uPlaneSizes.x/uPlaneSizes.y)/(uImageSizes.x/uImageSizes.y), 1.0),
              min((uPlaneSizes.y/uPlaneSizes.x)/(uImageSizes.y/uImageSizes.x), 1.0)
            );
            vec2 uv = vec2(vUv.x*ratio.x+(1.0-ratio.x)*0.5, vUv.y*ratio.y+(1.0-ratio.y)*0.5);
            vec4 color = texture2D(tMap, uv);
            // Grayscale
            float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
            color.rgb = mix(color.rgb, vec3(gray), uGrayscale);
            // Rounded corners
            float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
            float alpha = 1.0 - smoothstep(-0.002, 0.002, d);
            gl_FragColor = vec4(color.rgb, alpha);
          }
        `,
        uniforms: {
          tMap: { value: texture },
          uPlaneSizes: { value: [0, 0] }, uImageSizes: { value: [0, 0] },
          uSpeed: { value: 0 }, uTime: { value: 100 * Math.random() },
          uBorderRadius: { value: this.borderRadius },
          uGrayscale: { value: 0 }
        },
        transparent: true
      });
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = this.image;
      img.onload = () => {
        texture.image = img;
        this.program.uniforms.uImageSizes.value = [img.naturalWidth, img.naturalHeight];
      };
    }

    createMesh() {
      this.plane = new Mesh(this.gl, { geometry: this.geometry, program: this.program });
      this.plane.setParent(this.scene);
    }

    update(scroll, direction, anySelected) {
      this.plane.position.x = this.x - scroll.current - this.extra;
      const x = this.plane.position.x;
      const H = this.viewport.width / 2;

      if (this.bend === 0) {
        this.plane.position.y = 0;
        this.plane.rotation.z = 0;
      } else {
        const B = Math.abs(this.bend);
        const R = (H * H + B * B) / (2 * B);
        const ex = Math.min(Math.abs(x), H);
        const arc = R - Math.sqrt(R * R - ex * ex);
        if (this.bend > 0) {
          this.plane.position.y = -arc;
          this.plane.rotation.z = -Math.sign(x) * Math.asin(ex / R);
        } else {
          this.plane.position.y = arc;
          this.plane.rotation.z = Math.sign(x) * Math.asin(ex / R);
        }
      }

      this.speed = scroll.current - scroll.last;
      this.program.uniforms.uTime.value += 0.04;
      this.program.uniforms.uSpeed.value = this.speed;

      // Animate grayscale for non-selected items
      this.targetGray = (anySelected && !this.selected) ? 1 : 0;
      this.currentGray = lerp(this.currentGray, this.targetGray, 0.08);
      this.program.uniforms.uGrayscale.value = this.currentGray;

      // Animate scale for selected item
      this.targetScale = this.selected ? 2 : 1;
      this.currentScale = lerp(this.currentScale, this.targetScale, 0.1);
      this.plane.scale.set(
        this.baseScaleX * this.currentScale,
        this.baseScaleY * this.currentScale,
        1
      );

      const planeOffset = this.plane.scale.x / 2;
      const viewportOffset = this.viewport.width / 2;
      this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
      this.isAfter = this.plane.position.x - planeOffset > viewportOffset;
      if (direction === 'right' && this.isBefore) { this.extra -= this.widthTotal; this.isBefore = this.isAfter = false; }
      if (direction === 'left' && this.isAfter) { this.extra += this.widthTotal; this.isBefore = this.isAfter = false; }
    }

    onResize({ screen, viewport } = {}) {
      if (screen) this.screen = screen;
      if (viewport) this.viewport = viewport;
      this.scale = this.screen.height / 1500;
      this.baseScaleY = (this.viewport.height * (900 * this.scale)) / this.screen.height;
      this.baseScaleX = (this.viewport.width * (700 * this.scale)) / this.screen.width;
      this.plane.scale.x = this.baseScaleX;
      this.plane.scale.y = this.baseScaleY;
      this.program.uniforms.uPlaneSizes.value = [this.baseScaleX, this.baseScaleY];
      this.padding = 2;
      this.width = this.baseScaleX + this.padding;
      this.widthTotal = this.width * this.length;
      this.x = this.width * this.index;
    }

    // Hit-test: is the normalized click inside this plane?
    hitTest(ndcX, ndcY, camera, viewport) {
      const px = this.plane.position.x;
      const py = this.plane.position.y;
      const hw = (this.baseScaleX * this.currentScale) / 2;
      const hh = (this.baseScaleY * this.currentScale) / 2;
      // Project plane to screen space via camera fov
      const fovY = (camera.fov * Math.PI) / 180;
      const tanHalfFov = Math.tan(fovY / 2);
      const ndcPlaneX = px / (tanHalfFov * camera.aspect * camera.position.z);
      const ndcPlaneY = py / (tanHalfFov * camera.position.z);
      const ndcHW = hw / (tanHalfFov * camera.aspect * camera.position.z);
      const ndcHH = hh / (tanHalfFov * camera.position.z);
      return Math.abs(ndcX - ndcPlaneX) < ndcHW && Math.abs(ndcY - ndcPlaneY) < ndcHH;
    }
  }

  // ── Main gallery controller ──────────────────────────────────────────────────
  class GalleryInstance {
    constructor(container, { items, bend, textColor, borderRadius, font, scrollSpeed, scrollEase }) {
      this.container = container;
      this.scrollSpeed = scrollSpeed;
      this.scroll = { ease: scrollEase, current: 0, target: 0, last: 0 };
      this.selectedIndex = -1;
      this.onCheckDebounce = debounce(this.onCheck.bind(this), 200);
      this.createRenderer();
      this.createCamera();
      this.createScene();
      this.onResize();
      this.createGeometry();
      this.createMedias(items, bend, textColor, borderRadius, font);
      this.update = this.update.bind(this);
      this.update();
      this.addEventListeners();
    }

    createRenderer() {
      this.renderer = new Renderer({ alpha: true, antialias: true, dpr: Math.min(window.devicePixelRatio || 1, 2) });
      this.gl = this.renderer.gl;
      this.gl.clearColor(0, 0, 0, 0);
      this.container.appendChild(this.gl.canvas);
    }
    createCamera() {
      this.camera = new Camera(this.gl);
      this.camera.fov = 45;
      this.camera.position.z = 20;
    }
    createScene() { this.scene = new Transform(); }
    createGeometry() { this.planeGeometry = new Plane(this.gl, { heightSegments: 50, widthSegments: 100 }); }

    createMedias(items, bend, textColor, borderRadius, font) {
      if (!items || items.length === 0) return;
      this.mediasImages = items.concat(items).concat(items);
      this.medias = this.mediasImages.map((data, index) => new Media({
        geometry: this.planeGeometry, gl: this.gl,
        image: data.url || data.image, index, length: this.mediasImages.length,
        scene: this.scene, screen: this.screen, text: data.title || data.text || '',
        viewport: this.viewport, bend, textColor, borderRadius, font
      }));
    }

    getClickNDC(e) {
      const rect = this.container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      return { x, y };
    }

    onTouchDown(e) {
      this.isDown = true;
      this.scroll.position = this.scroll.current;
      this.start = e.touches ? e.touches[0].clientX : e.clientX;
      this.startY = e.touches ? e.touches[0].clientY : e.clientY;
      this.isDragging = false;
    }
    onTouchMove(e) {
      if (!this.isDown) return;
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const y = e.touches ? e.touches[0].clientY : e.clientY;
      const dx = Math.abs(x - this.start);
      const dy = Math.abs(y - this.startY);
      if (dx > 5 || dy > 5) this.isDragging = true;
      if (this.isDragging) this.scroll.target = this.scroll.position + (this.start - x) * (this.scrollSpeed * 0.025);
    }
    onTouchUp(e) {
      if (!this.isDragging && e) {
        // It's a click — check hit test
        const { x, y } = this.getClickNDC(e);
        let hitIdx = -1;
        if (this.medias) {
          this.medias.forEach((m, i) => {
            if (m.hitTest(x, y, this.camera, this.viewport)) hitIdx = i;
          });
        }
        if (hitIdx >= 0) {
          // Toggle: clicking same = deselect
          const realIdx = hitIdx % (this.medias.length / 3);
          if (this.selectedRealIdx === realIdx) {
            this.selectedRealIdx = -1;
            this.medias.forEach(m => { m.selected = false; });
          } else {
            this.selectedRealIdx = realIdx;
            this.medias.forEach((m, i) => {
              const mRealIdx = i % (this.medias.length / 3);
              m.selected = (mRealIdx === realIdx);
            });
          }
        } else {
          // Clicked nothing — deselect
          this.selectedRealIdx = -1;
          this.medias.forEach(m => { m.selected = false; });
        }
      }
      this.isDown = false;
      this.isDragging = false;
      this.onCheck();
    }

    onWheel(e) {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      this.scroll.target += (e.deltaY > 0 ? this.scrollSpeed : -this.scrollSpeed) * 0.2;
      this.onCheckDebounce();
    }
    onCheck() {
      if (!this.medias || !this.medias[0]) return;
      const width = this.medias[0].width;
      const itemIndex = Math.round(Math.abs(this.scroll.target) / width);
      this.scroll.target = (this.scroll.target < 0 ? -1 : 1) * width * itemIndex;
    }
    onResize() {
      this.screen = { width: this.container.clientWidth, height: this.container.clientHeight };
      this.renderer.setSize(this.screen.width, this.screen.height);
      this.camera.perspective({ aspect: this.screen.width / this.screen.height });
      const fov = (this.camera.fov * Math.PI) / 180;
      const h = 2 * Math.tan(fov / 2) * this.camera.position.z;
      this.viewport = { width: h * this.camera.aspect, height: h };
      if (this.medias) this.medias.forEach(m => m.onResize({ screen: this.screen, viewport: this.viewport }));
    }

    update() {
      this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
      const direction = this.scroll.current > this.scroll.last ? 'right' : 'left';
      const anySelected = this.medias ? this.medias.some(m => m.selected) : false;
      if (this.medias) this.medias.forEach(m => m.update(this.scroll, direction, anySelected));
      this.renderer.render({ scene: this.scene, camera: this.camera });
      this.scroll.last = this.scroll.current;
      this.raf = window.requestAnimationFrame(this.update);
    }

    addEventListeners() {
      this._onResize = this.onResize.bind(this);
      this._onWheel = this.onWheel.bind(this);
      this._onTouchDown = this.onTouchDown.bind(this);
      this._onTouchMove = this.onTouchMove.bind(this);
      this._onTouchUp = this.onTouchUp.bind(this);
      window.addEventListener('resize', this._onResize);
      this.container.addEventListener('wheel', this._onWheel);
      this.container.addEventListener('mousedown', this._onTouchDown);
      window.addEventListener('mousemove', this._onTouchMove);
      window.addEventListener('mouseup', this._onTouchUp);
      this.container.addEventListener('touchstart', this._onTouchDown, { passive: true });
      window.addEventListener('touchmove', this._onTouchMove, { passive: true });
      window.addEventListener('touchend', this._onTouchUp);
    }

    destroy() {
      window.cancelAnimationFrame(this.raf);
      window.removeEventListener('resize', this._onResize);
      this.container.removeEventListener('wheel', this._onWheel);
      this.container.removeEventListener('mousedown', this._onTouchDown);
      window.removeEventListener('mousemove', this._onTouchMove);
      window.removeEventListener('mouseup', this._onTouchUp);
      this.container.removeEventListener('touchstart', this._onTouchDown);
      window.removeEventListener('touchmove', this._onTouchMove);
      window.removeEventListener('touchend', this._onTouchUp);
      if (this.gl.canvas.parentNode) this.container.removeChild(this.gl.canvas);
    }
  }

  onMount(() => {
    gallery = new GalleryInstance(container, {
      items, bend, textColor, borderRadius, font, scrollSpeed, scrollEase
    });
  });

  onDestroy(() => {
    if (gallery) gallery.destroy();
  });
</script>

<div bind:this={container} class="circular-gallery"></div>

<style>
  .circular-gallery {
    width: 100%;
    height: 80vh;
    overflow: hidden;
    cursor: grab;
    position: relative;
    user-select: none;
    background: transparent;
  }

  .circular-gallery :global(canvas) {
    width: 100% !important;
    height: 100% !important;
    display: block;
  }

  .circular-gallery:active {
    cursor: grabbing;
  }
</style>
