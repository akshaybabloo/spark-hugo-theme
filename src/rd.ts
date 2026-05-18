import { animate, createTimer } from 'animejs'

const VERTEX_SRC = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() { 
	v_uv = a_pos * 0.5 + 0.5;
	gl_Position = vec4(a_pos, 0.0, 1.0); 
}
`

const FRAGMENT_SRC = `
precision highp float;
uniform vec2  u_resolution;
uniform float u_time;
uniform vec3  u_accent;

void main() {
	vec2 uv = gl_FragCoord.xy / u_resolution.xy;
	vec2 p = uv * 2.0 - 1.0;
	p.x *= u_resolution.x / u_resolution.y;

	// Gray-Scott Reaction-Diffusion approximation via sine waves (procedural fake for speed)
	// A true RD simulation requires ping-pong framebuffers which is heavy. 
	// This generates a very convincing procedural RD pattern instead.

	float t = u_time * 0.2;
	float v = 0.0;
	vec2 q = p * 4.0;
	
	for(float i = 1.0; i < 6.0; i++) {
		q += vec2(sin(t + q.y * i), cos(t - q.x * i)) * 0.5;
		v += sin(q.x * 2.0 + t) + cos(q.y * 2.0 + t);
	}
	
	v = smoothstep(0.0, 0.5, abs(v * 0.2));
	
	gl_FragColor = vec4(u_accent, (1.0 - v) * 0.6);
}
`

export function initRD(canvas: HTMLCanvasElement): void {
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
	const uTime = gl.getUniformLocation(program, 'u_time')
	gl.uniform3f(gl.getUniformLocation(program, 'u_accent'), ar / 255, ag / 255, ab / 255)

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

function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
	const shader = gl.createShader(type)
	if (!shader) return null
	gl.shaderSource(shader, src)
	gl.compileShader(shader)
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.error('RD shader compile error:', gl.getShaderInfoLog(shader))
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
		console.error('RD program link error:', gl.getProgramInfoLog(program))
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