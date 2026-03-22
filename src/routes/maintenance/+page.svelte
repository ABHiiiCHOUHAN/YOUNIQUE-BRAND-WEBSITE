<script>
	let { data } = $props();
</script>

<div class="maintenance-void">
	<div class="marquee-top">
		<div class="track">
			<span>SYSTEM UPGRADE IN PROGRESS ●&nbsp;</span>
			<span>SYSTEM UPGRADE IN PROGRESS ●&nbsp;</span>
			<span>SYSTEM UPGRADE IN PROGRESS ●&nbsp;</span>
			<span>SYSTEM UPGRADE IN PROGRESS ●&nbsp;</span>
		</div>
	</div>

	<div class="hero-center">
		<div class="glitch-title">
			<h1 class="code">503</h1>
			<h1 class="main-txt">TEMPORARY <span class="highlight">DRIFTING.</span></h1>
		</div>
		
		<div class="message-card">
			<p class="desc">
				Our systems are currently undergoing a structural realignment to bring you 
				the next evolution of <span class="accent">digital chaos.</span> 
				We'll be back louder and sharper.
			</p>
			
			<div class="progress-bar">
				<div class="bar-inner"></div>
			</div>
			
			<div class="footer-meta">
				<span class="est">EST. RESYNC: T-MINUS SHORTLY</span>
				<div class="social-tray">
					<a href="#x" class="pill">X (TWITTER)</a>
					<a href="#ig" class="pill">INSTAGRAM</a>
				</div>
			</div>
		</div>
	</div>

	<!-- Small animated elements (Doodles/Scribbles) -->
	<div class="sketch sketch-1"></div>
	<div class="sketch sketch-2"></div>
</div>

<style>
	.maintenance-void {
		min-height: 100vh;
		background: #3d3d3d;
		color: #fff;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		position: relative;
		overflow: hidden;
		font-family: var(--font-secondary);
	}

	.marquee-top {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		background: var(--color-1);
		padding: 0.75rem 0;
		border-bottom: 4px solid #000;
		overflow: hidden;
		display: flex;
		white-space: nowrap;
		z-index: 100;
	}

	.track {
		display: flex;
		animation: scroll 30s linear infinite;
		font-family: 'Rubik Mono One', sans-serif;
		font-size: 0.8rem;
		color: #000;
	}

	@keyframes scroll {
		from { transform: translateX(0); }
		to { transform: translateX(-50%); }
	}

	.glitch-title {
		text-align: center;
		margin-bottom: 3rem;
	}

	.code {
		font-family: 'Rubik Mono One', sans-serif;
		font-size: 2rem;
		opacity: 0.3;
		margin-bottom: -1rem;
		color: var(--color-2);
	}

	.main-txt {
		font-family: 'Rubik Mono One', sans-serif;
		font-size: clamp(2.5rem, 8vw, 6rem);
		line-height: 0.95;
		letter-spacing: -0.05em;
		-webkit-text-stroke: 1.5px #000;
		text-shadow: 8px 8px 0 #000;
	}

	.highlight {
		color: var(--color-1);
	}

	.message-card {
		background: var(--color-5);
		color: #1c1c1c;
		border: 4px solid #000;
		padding: 3rem;
		max-width: 600px;
		width: 100%;
		box-shadow: 18px 18px 0 #000;
		position: relative;
		z-index: 10;
		transform: rotate(-1deg);
	}

	.desc {
		font-size: 1.25rem;
		font-weight: 700;
		line-height: 1.4;
		margin-bottom: 2rem;
	}

	.accent {
		color: #ff0044;
		text-decoration: underline;
		text-decoration-thickness: 3px;
		text-underline-offset: 4px;
	}

	.progress-bar {
		height: 30px;
		background: rgba(0,0,0,0.1);
		border: 3px solid #000;
		margin-bottom: 2rem;
		position: relative;
		overflow: hidden;
	}

	.bar-inner {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 65%;
		background: var(--color-2);
		animation: pulse-progress 4s ease-in-out infinite alternate;
	}

	@keyframes pulse-progress {
		from { width: 55%; }
		to { width: 75%; }
	}

	.footer-meta {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.est {
		font-family: 'Rubik Mono One', sans-serif;
		font-size: 0.75rem;
		opacity: 0.6;
		letter-spacing: 0.1em;
	}

	.social-tray {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.pill {
		padding: 0.6rem 1.2rem;
		background: #000;
		color: #f4f4f4;
		text-decoration: none;
		border-radius: 999px;
		font-weight: 800;
		font-size: 0.8rem;
		letter-spacing: 0.05em;
		transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
		border: 2px solid #000;
	}

	.pill:hover {
		background: #fff;
		color: #000;
		transform: translateY(-2px);
		box-shadow: 4px 4px 0 #000;
	}

	.sketch {
		position: absolute;
		pointer-events: none;
		opacity: 0.3;
		z-index: 1;
		width: 15vw;
		height: 15vw;
		background-size: contain;
		background-repeat: no-repeat;
		-webkit-mask-size: contain;
		mask-size: contain;
		background-color: var(--color-2);
	}

	.sketch-1 {
		top: 15%;
		left: 10%;
		-webkit-mask-image: url('/assets/hero-kinetic-elements/explosion.svg');
		mask-image: url('/assets/hero-kinetic-elements/explosion.svg');
		animation: rotate 30s linear infinite;
	}

	.sketch-2 {
		bottom: 10%;
		right: 15%;
		-webkit-mask-image: url('/assets/hero-kinetic-elements/sun-rectangle.svg');
		mask-image: url('/assets/hero-kinetic-elements/sun-rectangle.svg');
		animation: rotate-reverse 20s linear infinite;
	}

	@keyframes rotate {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}

	@keyframes rotate-reverse {
		from { transform: rotate(0deg); }
		to { transform: rotate(-360deg); }
	}

	@media (max-width: 768px) {
		.message-card { padding: 2rem; transform: none; }
		.main-txt { font-size: 3rem; }
	}
</style>
