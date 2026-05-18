/**
 * Julia-set background animation for the homepage hero.
 *
 * Similar to the Mandelbrot set, but the constant 'c' is determined by the
 * mouse position, allowing the user to "shape" the fractal dynamically.
 * Includes the same Orbit Trap logic for organic texture and section-themed colors.
 */
import { animate } from 'animejs'

const VERTEX_SRC = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`

const FRAGMENT_SRC = `
precision highp float;
uniform vec2  u_resolution;
uniform vec2  u_mouse;
uniform float u_time;
uniform vec3  u_accent;

const int MAX_ITER = 300;

void main() {
	vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution) / u_resolution.y;

	// Fixed scale and limit (no breathing zoom)
	float scale = 1.5;
	int   limit = MAX_ITER;

	// Classic Julia set constant near the 'rabbit' or 'dragon' regions
	vec2 baseC = vec2(-0.75, 0.1);
	vec2 mouseOffset = (u_mouse - 0.5) * 0.05;
	vec2 c = baseC + mouseOffset;

	vec2 z = uv * scale;
	float iter = 0.0;
	float trap = 1e10;
	bool escaped = false;

	for (int i = 0; i < MAX_ITER; i++) {
		if (i >= limit) break;
		z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;

		// Orbit Trap: creates the "veined" organic texture
		trap = min(trap, abs(z.x));
		trap = min(trap, abs(z.y));

		// Larger escape radius = smoother coloring
		if (dot(z, z) > 256.0) { escaped = true; iter = float(i); break; }
	}

	// Inside the set: faint version of the trap for subtle texture
	if (!escaped) {
		float insideTrap = pow(clamp(1.0 - trap, 0.0, 1.0), 10.0);
		gl_FragColor = vec4(u_accent, insideTrap * 0.12);
		return;
	}

	// Smooth (fractional) iteration count for continuous colour bands
	float mu = iter + 1.0 - log(log(dot(z, z)) * 0.5) / log(2.0);

	// Cyclic alpha ramp scrolling over time - speed up for visibility without zoom
	float band = sin(mu * 0.5 - u_time * 1.5) * 0.5 + 0.5;

	// Mix smooth escape-time with the orbit trap (same as Mandelbrot)
	float trapEffect = pow(clamp(1.0 - trap, 0.0, 1.0), 6.0);
	float alpha = clamp(band * 0.35 + trapEffect * 0.35, 0.0, 0.75);

	gl_FragColor = vec4(u_accent, alpha);
}
`

export function initJulia(canvas: HTMLCanvasElement): void {
	const gl = canvas.getContext('webgl', { premultipliedAlpha: false, alpha: true, antialias: true })
	if (!gl) return

	const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

	const accent = getComputedStyle(document.body).getPropertyValue('--color-accent').trim() || '#fb7185'
	const [ar, ag, ab] = hexToRgb(accent)

	const program = buildProgram(gl, VERTEX_SRC, FRAGMENT_SRC)
	if (!program) return
	gl.useProgram(program)

	const buffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
	const posLoc = gl.getAttribLocation(program, 'a_pos')
	gl.enableVertexAttribArray(posLoc)
	gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

	const uResolution = gl.getUniformLocation(program, 'u_resolution')
	const uMouse = gl.getUniformLocation(program, 'u_mouse')
	const uTime = gl.getUniformLocation(program, 'u_time')
	gl.uniform3f(gl.getUniformLocation(program, 'u_accent'), ar / 255, ag / 255, ab / 255)

	let mx = 0.5
	let my = 0.5
	window.addEventListener('mousemove', (e) => {
		mx = e.clientX / window.innerWidth
		my = 1 - e.clientY / window.innerHeight
	})

	function resize() {
		const w = canvas.clientWidth
		const h = canvas.clientHeight
		if (w === 0 || h === 0) return
		const dpr = Math.min(window.devicePixelRatio || 1, 2)
		canvas.width = Math.round(w * dpr)
		canvas.height = Math.round(h * dpr)
		gl.viewport(0, 0, canvas.width, canvas.height)
		gl.uniform2f(uResolution, canvas.width, canvas.height)
	}
	resize()
	window.addEventListener('resize', resize)

	function render(seconds: number) {
		gl.uniform1f(uTime, seconds)
		gl.uniform2f(uMouse, mx, my)
		gl.drawArrays(gl.TRIANGLES, 0, 3)
	}

	animate(canvas, { opacity: [0, 1], duration: 1400, ease: 'outQuad' })

	if (reduced) {
		render(10)
		return
	}

	const start = performance.now()
	function frame() {
		render((performance.now() - start) / 1000)
		requestAnimationFrame(frame)
	}
	requestAnimationFrame(frame)
}

/* ---- WebGL helpers (duplicated for independence) ------------------------ */

function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
	const shader = gl.createShader(type)
	if (!shader) return null
	gl.shaderSource(shader, src)
	gl.compileShader(shader)
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.error('Julia shader compile error:', gl.getShaderInfoLog(shader))
		gl.deleteShader(shader)
		return null
	}
	return shader
}

function buildProgram(gl: WebGLRenderingContext, vert: string, frag: string): WebGLProgram | null {
	const vs = compileShader(gl, gl.VERTEX_SHADER, vert)
	const fs = compileShader(gl, gl.FRAGMENT_SHADER, frag)
	if (!vs || !fs) return null
	const program = gl.createProgram()
	if (!program) return null
	gl.attachShader(program, vs)
	gl.attachShader(program, fs)
	gl.linkProgram(program)
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error('Julia program link error:', gl.getProgramInfoLog(program))
		return null
	}
	return program
}

function hexToRgb(hex: string): [number, number, number] {
	let h = hex.replace('#', '').trim()
	if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]
	const n = parseInt(h, 16)
	return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
