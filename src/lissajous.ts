import { animate, createTimer } from 'animejs'

export function initLissajous(canvas: HTMLCanvasElement): void {
	const ctx = canvas.getContext('2d')
	if (!ctx) return

	const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
	const accent = getComputedStyle(document.body).getPropertyValue('--color-accent').trim() || '#fb7185'

	let w = 0, h = 0
	let time = 0

	function resize() {
		w = canvas.clientWidth
		h = canvas.clientHeight
		if (w === 0 || h === 0) return
		const dpr = Math.min(window.devicePixelRatio || 1, 2)
		canvas.width = Math.round(w * dpr)
		canvas.height = Math.round(h * dpr)
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
	}
	resize()
	window.addEventListener('resize', resize)

	function render() {
		ctx.clearRect(0, 0, w, h)
		
		const cx = w / 2
		const cy = h / 2
		const a = w * 0.4
		const b = h * 0.4
		
		// Frequencies that slowly drift
		const freqX = 3 + Math.sin(time * 0.001) * 0.5
		const freqY = 2 + Math.cos(time * 0.0013) * 0.5
		const delta = time * 0.005

		ctx.beginPath()
		ctx.strokeStyle = accent
		ctx.lineWidth = 2
		ctx.globalAlpha = 0.4

		for (let t = 0; t <= Math.PI * 2; t += 0.01) {
			const x = cx + a * Math.sin(freqX * t + delta)
			const y = cy + b * Math.sin(freqY * t)
			if (t === 0) ctx.moveTo(x, y)
			else ctx.lineTo(x, y)
		}
		
		ctx.stroke()
		time += 1
	}

	animate(canvas, { opacity: [0, 1], duration: 1400, ease: 'outQuad' })

	if (reduced) {
		render()
		return
	}

	createTimer({
		loop: true,
		duration: 1000,
		onUpdate: () => render()
	})
}