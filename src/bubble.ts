import { animate } from 'animejs'

const VERTEX_SRC = `
attribute vec2 a_index; // (i, j)
uniform float u_n;      // n (250)
uniform float u_time;
uniform vec2  u_res;
varying float v_alpha;

void main() {
    float i = a_index.x;
    float j = a_index.y;
    float n = u_n;
    float t = u_time * 0.05;

    // The complex math from the Python code:
    // ang = complex(i, t + (2*pi/n)*i)
    vec2 ang = vec2(i, t + (6.283185 / n) * i);
    vec2 z = vec2(0.0);
    
    // To get the j-th point, we must iterate j times.
    // WebGL 1.0 requires constant loop limits, so we use a max and break.
    for (int step = 0; step < 250; step++) {
        if (float(step) >= j) break;
        vec2 theta = ang + z;
        // exp(1j*theta.real) + exp(1j*theta.imag)
        z = vec2(
            cos(theta.x) + cos(theta.y),
            sin(theta.x) + sin(theta.y)
        );
    }

    // Scale and Project
    // Python code uses N/4 as radius. 
    // Here we normalize to clip space [-1, 1]
    vec2 pos = z * 0.45;
    
    // Aspect ratio correction
    if (u_res.x > u_res.y) {
        pos.x *= u_res.y / u_res.x;
    } else {
        pos.y *= u_res.x / u_res.y;
    }

    gl_Position = vec4(pos, 0.0, 1.0);
    gl_PointSize = 1.5;
    
    // Vary alpha based on iteration depth for depth effect
    v_alpha = 0.1 + (j / n) * 0.6;
}
`

const FRAGMENT_SRC = `
precision highp float;
uniform vec3 u_accent;
varying float v_alpha;

void main() {
    gl_FragColor = vec4(u_accent, v_alpha * 0.8);
}
`

export function initBubble(canvas: HTMLCanvasElement): void {
	const gl = canvas.getContext('webgl', { antialias: true, alpha: true })
	if (!gl) return

	const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
	const accent = getComputedStyle(document.body).getPropertyValue('--color-accent').trim() || '#fb7185'
	const [ar, ag, ab] = hexToRgb(accent)

	const program = buildProgram(gl, VERTEX_SRC, FRAGMENT_SRC)
	if (!program) return
	gl.useProgram(program)

	// Create a grid of indices (i, j)
	// n=250 means 250 spirals of 250 points each = 62,500 points
	const n = 250
	const indices = new Float32Array(n * n * 2)
	for (let i = 0; i < n; i++) {
		for (let j = 0; j < n; j++) {
			const idx = (i * n + j) * 2
			indices[idx] = i
			indices[idx + 1] = j
		}
	}

	const buffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
	gl.bufferData(gl.ARRAY_BUFFER, indices, gl.STATIC_DRAW)
	
	const posLoc = gl.getAttribLocation(program, 'a_index')
	gl.enableVertexAttribArray(posLoc)
	gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

	const uN = gl.getUniformLocation(program, 'u_n')
	const uTime = gl.getUniformLocation(program, 'u_time')
	const uRes = gl.getUniformLocation(program, 'u_res')
	const uAccent = gl.getUniformLocation(program, 'u_accent')

	gl.uniform1f(uN, n)
	gl.uniform3f(uAccent, ar / 255, ag / 255, ab / 255)

	function resize() {
		const w = canvas.clientWidth
		const h = canvas.clientHeight
		if (w === 0 || h === 0) return
		const dpr = Math.min(window.devicePixelRatio || 1, 2)
		canvas.width = Math.round(w * dpr)
		canvas.height = Math.round(h * dpr)
		gl.viewport(0, 0, canvas.width, canvas.height)
		gl.uniform2f(uRes, canvas.width, canvas.height)
	}
	resize()
	window.addEventListener('resize', resize)

	function render(seconds: number) {
		gl.clear(gl.COLOR_BUFFER_BIT)
		gl.uniform1f(uTime, seconds)
		gl.drawArrays(gl.POINTS, 0, n * n)
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

/* ---- WebGL helpers ----------------------------------------------------- */

function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
	const shader = gl.createShader(type)
	if (!shader) return null
	gl.shaderSource(shader, src)
	gl.compileShader(shader)
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.error('Shader error:', gl.getShaderInfoLog(shader))
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
		console.error('Program error:', gl.getProgramInfoLog(program))
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
