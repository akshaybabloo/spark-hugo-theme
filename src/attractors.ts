import { animate, createTimer } from 'animejs'

export function initAttractors(canvas: HTMLCanvasElement): void {
	const ctx = canvas.getContext('2d')
	if (!ctx) return

	const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
	const accent = getComputedStyle(document.body).getPropertyValue('--color-accent').trim() || '#fb7185'

	let w = 0, h = 0

	// Lorenz Attractor parameters
	const sigma = 10
	const rho = 28
	const beta = 8 / 3

	// Particles
	const numParticles = 200
	const particles = Array.from({ length: numParticles }, () => ({
		x: (Math.random() - 0.5) * 2,
		y: (Math.random() - 0.5) * 2,
		z: 20 + (Math.random() - 0.5) * 2,
	}))

	const dt = 0.005

	function resize() {
		w = canvas.clientWidth
		h = canvas.clientHeight
		if (w === 0 || h === 0) return
		const dpr = Math.min(window.devicePixelRatio || 1, 2)
		canvas.width = Math.round(w * dpr)
		canvas.height = Math.round(h * dpr)
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
		ctx.clearRect(0, 0, w, h)
	}
	resize()
	window.addEventListener('resize', resize)

	function render() {
		// Fade effect for trails
		ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--color-bg').trim() || '#000'
		ctx.globalAlpha = 0.04
		ctx.fillRect(0, 0, w, h)

		ctx.globalAlpha = 0.6
		ctx.fillStyle = accent

		const scale = Math.min(w / 34, h / 34) // Increased scale by ~30% for broader presence
		const cx = w * 0.5 // Perfect horizontal center
		const cy = h * 0.5 // Perfect vertical center

		for (const p of particles) {
			const dx = (sigma * (p.y - p.x)) * dt
			const dy = (p.x * (rho - p.z) - p.y) * dt
			const dz = (p.x * p.y - beta * p.z) * dt

			p.x += dx
			p.y += dy
			p.z += dz

			// 2D projection (X, Z)
			// X ranges roughly [-20, 20], Z ranges roughly [0, 50]
			// Center of lobes is near Z=27
			const px = cx + p.x * scale
			const pz = cy - (p.z - 27) * scale

			ctx.beginPath()
			ctx.arc(px, pz, 1.2, 0, Math.PI * 2)
			ctx.fill()
		}
	}

	animate(canvas, { opacity: [0, 1], duration: 1400, ease: 'outQuad' })

	if (reduced) {
		for (let i = 0; i < 200; i++) render()
		return
	}

	createTimer({
		loop: true,
		duration: 1000,
		onUpdate: () => render()
	})
}