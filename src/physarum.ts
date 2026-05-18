import { animate, createTimer } from 'animejs'

export function initPhysarum(canvas: HTMLCanvasElement): void {
	const ctx = canvas.getContext('2d')
	if (!ctx) return

	const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
	const accent = getComputedStyle(document.body).getPropertyValue('--color-accent').trim() || '#fb7185'

	let w = 0, h = 0
	// Use a lower resolution for the simulation to keep getImageData fast
	const SIM_SCALE = 2 
	
	const numParticles = 2000
	const sensorAngle = Math.PI / 4
	const sensorDist = 12
	const turnSpeed = 0.3
	const speed = 1.5

	interface Agent { x: number, y: number, angle: number }
	let agents: Agent[] = []

	const trailCanvas = document.createElement('canvas')
	const trailCtx = trailCanvas.getContext('2d', { willReadFrequently: true })!

	function resize() {
		w = canvas.clientWidth
		h = canvas.clientHeight
		if (w === 0 || h === 0) return
		
		const dpr = Math.min(window.devicePixelRatio || 1, 2)
		canvas.width = Math.round(w * dpr)
		canvas.height = Math.round(h * dpr)
		
		// Simulation resolution
		trailCanvas.width = Math.floor(canvas.width / SIM_SCALE)
		trailCanvas.height = Math.floor(canvas.height / SIM_SCALE)
		
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
		
		// Start transparent
		trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height)
		
		agents = Array.from({ length: numParticles }, () => ({
			x: Math.random() * trailCanvas.width,
			y: Math.random() * trailCanvas.height,
			angle: Math.random() * Math.PI * 2
		}))
	}
	resize()
	window.addEventListener('resize', resize)

	function sense(agent: Agent, angleOffset: number, imgData: Uint8ClampedArray) {
		const angle = agent.angle + angleOffset
		const sx = Math.floor(agent.x + Math.cos(angle) * sensorDist)
		const sy = Math.floor(agent.y + Math.sin(angle) * sensorDist)
		
		if (sx >= 0 && sx < trailCanvas.width && sy >= 0 && sy < trailCanvas.height) {
			const idx = (sy * trailCanvas.width + sx) * 4
			return imgData[idx + 3] // Read ALPHA channel
		}
		return 0
	}

	function render() {
		// 1. Decay the trail map (fade out alpha)
		trailCtx.globalCompositeOperation = 'destination-out'
		trailCtx.fillStyle = 'rgba(255, 255, 255, 0.1)'
		trailCtx.fillRect(0, 0, trailCanvas.width, trailCanvas.height)
		
		// 2. Agents move and leave trails
		trailCtx.globalCompositeOperation = 'source-over'
		const imgData = trailCtx.getImageData(0, 0, trailCanvas.width, trailCanvas.height)
		const data = imgData.data

		trailCtx.fillStyle = 'white'
		for (const a of agents) {
			const weightF = sense(a, 0, data)
			const weightL = sense(a, -sensorAngle, data)
			const weightR = sense(a, sensorAngle, data)

			if (weightF > weightL && weightF > weightR) {
				// Continue straight
			} else if (weightF < weightL && weightF < weightR) {
				a.angle += (Math.random() > 0.5 ? 1 : -1) * turnSpeed
			} else if (weightL > weightR) {
				a.angle -= turnSpeed
			} else if (weightR > weightL) {
				a.angle += turnSpeed
			}

			a.x += Math.cos(a.angle) * speed
			a.y += Math.sin(a.angle) * speed

			// Wrap around edges
			if (a.x < 0) a.x = trailCanvas.width - 1
			if (a.x >= trailCanvas.width) a.x = 0
			if (a.y < 0) a.y = trailCanvas.height - 1
			if (a.y >= trailCanvas.height) a.y = 0

			trailCtx.fillRect(Math.floor(a.x), Math.floor(a.y), 1, 1)
		}

		// 3. Draw to main canvas with coloring
		ctx.clearRect(0, 0, w, h)
		
		ctx.save()
		// Draw the trail map (white)
		ctx.drawImage(trailCanvas, 0, 0, w, h)
		
		// Color the trails
		ctx.globalCompositeOperation = 'source-in'
		ctx.fillStyle = accent
		ctx.globalAlpha = 0.6
		ctx.fillRect(0, 0, w, h)
		ctx.restore()
	}

	animate(canvas, { opacity: [0, 1], duration: 1400, ease: 'outQuad' })

	if (reduced) {
		for(let i=0; i<100; i++) render()
		return
	}

	createTimer({
		loop: true,
		duration: 1000,
		onUpdate: () => render()
	})
}