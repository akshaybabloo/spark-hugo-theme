/**
 * Conway's Game of Life background animation for the homepage hero.
 *
 * Runs on a toroidal grid and gently reseeds itself so the colony never
 * stalls. anime.js drives the heartbeat (`createTimer`) and the intro fade
 * (`animate`); the generation logic is plain typed-array work on a <canvas>.
 */
import { animate, createTimer } from 'animejs'

const CELL = 22 // px per cell
const DOT_SIZE = 8 // diameter of each live cell's circle, in px
const STEP_INTERVAL = 120 // ms between generations

export function initAutomata(canvas: HTMLCanvasElement): void {
	const ctx = canvas.getContext('2d')
	if (!ctx) return

	const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

	// Cell colour follows the active section theme (--color-accent on <body>).
	const accent = getComputedStyle(document.body).getPropertyValue('--color-accent').trim() || '#fb7185'

	let cols = 0
	let rows = 0
	let cur = new Uint8Array(0)
	let nxt = new Uint8Array(0)
	let fade = new Float32Array(0) // per-cell eased alpha
	let pop: number[] = [] // recent population counts, for stall detection

	const idx = (x: number, y: number) => y * cols + x

	/* ---- seeding -------------------------------------------------------- */

	function randomise(density: number) {
		for (let i = 0; i < cur.length; i++) cur[i] = Math.random() < density ? 1 : 0
	}

	/** Drop a few noisy 3x3 patches to keep the colony from dying out. */
	function sprinkle(patches: number) {
		for (let p = 0; p < patches; p++) {
			const ox = (Math.random() * cols) | 0
			const oy = (Math.random() * rows) | 0
			for (let dy = 0; dy < 3; dy++) {
				for (let dx = 0; dx < 3; dx++) {
					if (Math.random() < 0.6) cur[idx((ox + dx) % cols, (oy + dy) % rows)] = 1
				}
			}
		}
	}

	/* ---- generation step ------------------------------------------------ */

	function step() {
		for (let y = 0; y < rows; y++) {
			const yu = (y - 1 + rows) % rows
			const yd = (y + 1) % rows
			for (let x = 0; x < cols; x++) {
				const xl = (x - 1 + cols) % cols
				const xr = (x + 1) % cols
				const n =
					cur[idx(xl, yu)] + cur[idx(x, yu)] + cur[idx(xr, yu)] +
					cur[idx(xl, y)] + cur[idx(xr, y)] +
					cur[idx(xl, yd)] + cur[idx(x, yd)] + cur[idx(xr, yd)]
				const alive = cur[idx(x, y)]
				nxt[idx(x, y)] = n === 3 || (alive === 1 && n === 2) ? 1 : 0
			}
		}
		const swap = cur
		cur = nxt
		nxt = swap

		// Keep the colony alive: reseed when it collapses or settles.
		let count = 0
		for (let i = 0; i < cur.length; i++) count += cur[i]
		pop.push(count)
		if (pop.length > 16) pop.shift()
		const stalled = pop.length === 16 && pop.every((v) => v === pop[0])
		if (count < cur.length * 0.03 || stalled) sprinkle(6)
		else if (Math.random() < 0.04) sprinkle(1)
	}

	/* ---- rendering ------------------------------------------------------ */

	function draw() {
		ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
		ctx.fillStyle = accent
		const radius = DOT_SIZE / 2
		for (let i = 0; i < cur.length; i++) {
			// Ease each cell's alpha toward its alive/dead target.
			fade[i] += ((cur[i] ? 1 : 0) - fade[i]) * 0.2
			if (fade[i] < 0.02) continue
			ctx.globalAlpha = fade[i] * 0.32
			const cx = (i % cols) * CELL + CELL / 2
			const cy = ((i / cols) | 0) * CELL + CELL / 2
			ctx.beginPath()
			ctx.arc(cx, cy, radius, 0, Math.PI * 2)
			ctx.fill()
		}
		ctx.globalAlpha = 1
	}

	/* ---- sizing --------------------------------------------------------- */

	function resize() {
		const w = canvas.clientWidth
		const h = canvas.clientHeight
		if (w === 0 || h === 0) return
		const dpr = Math.min(window.devicePixelRatio || 1, 2)
		canvas.width = Math.round(w * dpr)
		canvas.height = Math.round(h * dpr)
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
		cols = Math.ceil(w / CELL) + 1
		rows = Math.ceil(h / CELL) + 1
		cur = new Uint8Array(cols * rows)
		nxt = new Uint8Array(cols * rows)
		fade = new Float32Array(cols * rows)
		pop = []
		randomise(0.22)
		draw()
	}

	/* ---- run ------------------------------------------------------------ */

	resize()

	let resizeRaf = 0
	window.addEventListener('resize', () => {
		cancelAnimationFrame(resizeRaf)
		resizeRaf = requestAnimationFrame(resize)
	})

	animate(canvas, { opacity: [0, 1], duration: 1400, ease: 'outQuad' })

	if (reduced) {
		// Respect reduced-motion: settle into a single static frame.
		for (let i = 0; i < 40; i++) step()
		for (let i = 0; i < fade.length; i++) fade[i] = cur[i]
		draw()
		return
	}

	let last = performance.now()
	let acc = 0
	createTimer({
		loop: true,
		duration: 1000,
		onUpdate: () => {
			const now = performance.now()
			acc += now - last
			last = now
			if (acc > 500) acc = 500 // cap catch-up after the tab was hidden
			while (acc >= STEP_INTERVAL) {
				step()
				acc -= STEP_INTERVAL
			}
			draw()
		},
	})
}
