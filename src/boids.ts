import { animate, createTimer } from 'animejs'

const NUM_BOIDS = 150
const MAX_SPEED = 2
const MAX_FORCE = 0.05
const PERCEPTION_RADIUS = 50

class Boid {
	x: number
	y: number
	vx: number
	vy: number

	constructor(w: number, h: number) {
		this.x = Math.random() * w
		this.y = Math.random() * h
		const angle = Math.random() * Math.PI * 2
		this.vx = Math.cos(angle) * MAX_SPEED
		this.vy = Math.sin(angle) * MAX_SPEED
	}

	update(boids: Boid[], w: number, h: number) {
		let alignX = 0, alignY = 0
		let cohX = 0, cohY = 0
		let sepX = 0, sepY = 0
		let total = 0

		for (const other of boids) {
			if (other === this) continue
			const dx = this.x - other.x
			const dy = this.y - other.y
			const d = Math.sqrt(dx * dx + dy * dy)

			if (d < PERCEPTION_RADIUS) {
				alignX += other.vx
				alignY += other.vy
				cohX += other.x
				cohY += other.y
				
				if (d > 0) {
					sepX += dx / d
					sepY += dy / d
				}
				total++
			}
		}

		if (total > 0) {
			alignX /= total
			alignY /= total
			
			cohX = (cohX / total) - this.x
			cohY = (cohY / total) - this.y

			const normalize = (nx: number, ny: number) => {
				const mag = Math.sqrt(nx * nx + ny * ny)
				if (mag === 0) return {x: 0, y: 0}
				return {x: (nx / mag) * MAX_SPEED, y: (ny / mag) * MAX_SPEED}
			}

			const limit = (lx: number, ly: number, max: number) => {
				const mag = Math.sqrt(lx * lx + ly * ly)
				if (mag > max) return {x: (lx / mag) * max, y: (ly / mag) * max}
				return {x: lx, y: ly}
			}

			const a = normalize(alignX, alignY)
			const c = normalize(cohX, cohY)
			const s = normalize(sepX, sepY)

			const steerA = limit(a.x - this.vx, a.y - this.vy, MAX_FORCE)
			const steerC = limit(c.x - this.vx, c.y - this.vy, MAX_FORCE)
			const steerS = limit(s.x - this.vx, s.y - this.vy, MAX_FORCE * 1.5)

			this.vx += steerA.x + steerC.x + steerS.x
			this.vy += steerA.y + steerC.y + steerS.y
		}

		const mag = Math.sqrt(this.vx * this.vx + this.vy * this.vy)
		if (mag > MAX_SPEED) {
			this.vx = (this.vx / mag) * MAX_SPEED
			this.vy = (this.vy / mag) * MAX_SPEED
		}

		this.x += this.vx
		this.y += this.vy

		if (this.x < 0) this.x = w
		if (this.x > w) this.x = 0
		if (this.y < 0) this.y = h
		if (this.y > h) this.y = 0
	}
}

export function initBoids(canvas: HTMLCanvasElement): void {
	const ctx = canvas.getContext('2d')
	if (!ctx) return

	const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
	const accent = getComputedStyle(document.body).getPropertyValue('--color-accent').trim() || '#fb7185'

	let w = 0, h = 0
	let boids: Boid[] = []

	function resize() {
		w = canvas.clientWidth
		h = canvas.clientHeight
		if (w === 0 || h === 0) return
		const dpr = Math.min(window.devicePixelRatio || 1, 2)
		canvas.width = Math.round(w * dpr)
		canvas.height = Math.round(h * dpr)
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
		
		if (boids.length === 0) {
			for (let i = 0; i < NUM_BOIDS; i++) boids.push(new Boid(w, h))
		}
	}
	resize()
	window.addEventListener('resize', resize)

	function render() {
		ctx.clearRect(0, 0, w, h)
		ctx.fillStyle = accent
		
		for (const b of boids) {
			b.update(boids, w, h)
			
			const angle = Math.atan2(b.vy, b.vx)
			ctx.translate(b.x, b.y)
			ctx.rotate(angle)
			
			ctx.beginPath()
			ctx.moveTo(8, 0)
			ctx.lineTo(-4, 4)
			ctx.lineTo(-4, -4)
			ctx.closePath()
			
			ctx.globalAlpha = 0.5
			ctx.fill()
			
			ctx.rotate(-angle)
			ctx.translate(-b.x, -b.y)
		}
		ctx.globalAlpha = 1.0
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