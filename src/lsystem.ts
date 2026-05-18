import { animate, createTimer } from 'animejs'

export function initLSystem(canvas: HTMLCanvasElement): void {
	const ctx = canvas.getContext('2d')
	if (!ctx) return

	const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
	const accent = getComputedStyle(document.body).getPropertyValue('--color-accent').trim() || '#fb7185'

	let time = 0
	let progress = 0.001

	// L-System Generator
	function generate(axiom: string, rules: Record<string, string>, iter: number) {
		let s = axiom
		for (let i = 0; i < iter; i++) {
			let n = ""
			for (let j = 0; j < s.length; j++) n += rules[s[j]] || s[j]
			s = n
		}
		return s
	}

	// 1. Classic Plant
	const plant = generate("X", { "X": "F+[[X]-X]-F[-FX]+X", "F": "FF" }, 5)
	// 2. Barnsley-style Fern
	const fern = generate("X", { "X": "F[+X][-X]FX", "F": "FF" }, 6)
	// 3. Geometric 'Flower' (Koch-like)
	const flower = generate("F-F-F-F", { "F": "FF-F-F-F-F-F+F" }, 3)

	function drawSystem(w: number, h: number, ox: number, oy: number, baseScale: number, tilt: number, system: string, angleDeg: number) {
		ctx!.save()
		ctx!.translate(ox, oy)
		ctx!.rotate(tilt)
		
		const len = Math.min(w, h) * 0.005 * baseScale
		const baseAngle = (angleDeg * Math.PI) / 180
		const windAngle = baseAngle + Math.sin(time * 0.002 + ox) * 0.01

		ctx!.beginPath()
		const limit = Math.floor(system.length * progress)
		let stackDepth = 0

		for (let i = 0; i < limit; i++) {
			const char = system[i]
			if (char === "F") {
				ctx!.translate(0, -len)
				ctx!.lineTo(0, 0)
			} else if (char === "+") {
				ctx!.rotate(windAngle)
			} else if (char === "-") {
				ctx!.rotate(-windAngle)
			} else if (char === "[") {
				ctx!.save()
				stackDepth++
			} else if (char === "]") {
				if (stackDepth > 0) {
					ctx!.restore()
					ctx!.moveTo(0, 0)
					stackDepth--
				}
			}
		}
		for (let i = 0; i < stackDepth; i++) ctx!.restore()
		ctx!.stroke()
		ctx!.restore()
	}

	function render() {
		const w = canvas.clientWidth
		const h = canvas.clientHeight
		if (w === 0 || h === 0) return

		const dpr = Math.min(window.devicePixelRatio || 1, 2)
		const canvasW = Math.round(w * dpr)
		const canvasH = Math.round(h * dpr)
		
		if (canvas.width !== canvasW || canvas.height !== canvasH) {
			canvas.width = canvasW
			canvas.height = canvasH
			ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
		}

		ctx!.clearRect(0, 0, w, h)
		ctx!.strokeStyle = accent
		ctx!.lineWidth = 1.4
		ctx!.globalAlpha = 0.35

		const isMobile = w < 768
		if (isMobile) {
			// Single organic plant for mobile
			drawSystem(w, h, w * 0.5, h - 20, 1.6, 0.0, plant, 25)
		} else {
			// Diversity for desktop
			drawSystem(w, h, w * 0.2, h, 1.1, -0.1, fern, 20)      // Fern on left
			drawSystem(w, h, w * 0.8, h, 0.9, 0.2, flower, 90)    // Geometric on right
			drawSystem(w, h, w * 0.5, h + 40, 1.4, 0.0, plant, 25) // Classic plant center
		}
		
		time += 16
		if (progress < 1) progress += 0.004
	}

	animate(canvas, { opacity: [0, 1], duration: 1400, ease: 'outQuad' })

	if (reduced) {
		progress = 1
		render()
		return
	}

	const loop = () => {
		render()
		requestAnimationFrame(loop)
	}
	loop()
}