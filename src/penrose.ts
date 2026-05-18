import { animate, createTimer } from 'animejs'

export function initPenrose(canvas: HTMLCanvasElement): void {
	const ctx = canvas.getContext('2d')
	if (!ctx) return

	const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
	const accent = getComputedStyle(document.body).getPropertyValue('--color-accent').trim() || '#fb7185'

	let w = 0, h = 0
	let time = 0

	const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2

	type Point = { x: number, y: number }
	type Triangle = { color: number, A: Point, B: Point, C: Point }

	let triangles: Triangle[] = []

	function subdivide(triangles: Triangle[]): Triangle[] {
		const result: Triangle[] = []
		for (const t of triangles) {
			if (t.color === 0) {
				const P = {
					x: t.A.x + (t.B.x - t.A.x) / GOLDEN_RATIO,
					y: t.A.y + (t.B.y - t.A.y) / GOLDEN_RATIO
				}
				result.push({ color: 0, A: t.C, B: P, C: t.B })
				result.push({ color: 1, A: P, B: t.C, C: t.A })
			} else {
				const Q = {
					x: t.B.x + (t.A.x - t.B.x) / GOLDEN_RATIO,
					y: t.B.y + (t.A.y - t.B.y) / GOLDEN_RATIO
				}
				const R = {
					x: t.B.x + (t.C.x - t.B.x) / GOLDEN_RATIO,
					y: t.B.y + (t.C.y - t.B.y) / GOLDEN_RATIO
				}
				result.push({ color: 1, A: R, B: t.C, C: t.A })
				result.push({ color: 1, A: Q, B: R, C: t.B })
				result.push({ color: 0, A: R, B: Q, C: t.A })
			}
		}
		return result
	}

	function resize() {
		w = canvas.clientWidth
		h = canvas.clientHeight
		if (w === 0 || h === 0) return
		const dpr = Math.min(window.devicePixelRatio || 1, 2)
		canvas.width = Math.round(w * dpr)
		canvas.height = Math.round(h * dpr)
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
		
		triangles = []
		const cx = 0, cy = 0 // Center at origin for easier rotation
		const size = Math.max(w, h) * 1.5
		
		for (let i = 0; i < 10; i++) {
			const B = {
				x: cx + Math.cos((2 * i - 1) * Math.PI / 10) * size,
				y: cy + Math.sin((2 * i - 1) * Math.PI / 10) * size
			}
			const C = {
				x: cx + Math.cos((2 * i + 1) * Math.PI / 10) * size,
				y: cy + Math.sin((2 * i + 1) * Math.PI / 10) * size
			}
			if (i % 2 === 0) triangles.push({ color: 0, A: {x:cx, y:cy}, B: B, C: C })
			else triangles.push({ color: 0, A: {x:cx, y:cy}, B: C, C: B })
		}
		
		for (let i = 0; i < 7; i++) triangles = subdivide(triangles)
	}
	resize()
	window.addEventListener('resize', resize)

	function render() {
		ctx!.clearRect(0, 0, w, h)
		ctx!.save()
		
		// Center of screen
		ctx!.translate(w / 2, h / 2)
		
		// Slow rotation
		ctx!.rotate(time * 0.0001)
		
		// Breathing "Inflation" effect
		const breathe = 1.0 + Math.sin(time * 0.0005) * 0.05
		ctx!.scale(breathe, breathe)
		
		ctx!.strokeStyle = accent
		ctx!.lineWidth = 0.5
		
		for (const t of triangles) {
			ctx!.beginPath()
			ctx!.moveTo(t.A.x, t.A.y)
			ctx!.lineTo(t.B.x, t.B.y)
			ctx!.lineTo(t.C.x, t.C.y)
			ctx!.closePath()
			
			// Pulsing transparency based on distance from center
			const dist = Math.sqrt(t.A.x*t.A.x + t.A.y*t.A.y)
			const pulse = Math.sin(time * 0.001 - dist * 0.002) * 0.1 + 0.2
			
			ctx!.globalAlpha = t.color === 0 ? pulse : pulse * 0.5
			ctx!.fillStyle = accent
			ctx!.fill()
			
			ctx!.globalAlpha = 0.3
			ctx!.stroke()
		}
		ctx!.restore()
		time += 16
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