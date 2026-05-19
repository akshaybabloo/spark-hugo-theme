import { animate } from 'animejs'

const VERTEX_SRC = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`

const FRAGMENT_SRC = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 u_accent;

const int MAX_ITER = 150;

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution) / u_resolution.y;
    
    // Rotate 90 degrees and offset to stand the Buddha upright
    // Standard Mandelbrot head is at x = -2.0
    // By mapping -uv.y to x, and uv.x to y, the head points UP (+y)
    vec2 c = vec2(-uv.y * 3.0 - 0.5, uv.x * 3.0);
    
    // Add a very subtle slow drift to c for animation
    c += vec2(sin(u_time * 0.1), cos(u_time * 0.1)) * 0.02;

    vec2 z = vec2(0.0);
    float glow = 0.0;
    
    // First pass: Check if the point escapes
    bool escapes = false;
    for (int i = 0; i < MAX_ITER; i++) {
        z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
        if (dot(z, z) > 4.0) {
            escapes = true;
            break;
        }
    }

    // Ghostbrot / Nebulabrot approximation
    // If it escapes, it's outside the set. We accumulate glow based on its trajectory.
    // This perfectly creates the cloudy, glowing tendrils of a Buddhabrot.
    if (escapes) {
        z = vec2(0.0);
        for (int i = 0; i < MAX_ITER; i++) {
            z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
            if (dot(z, z) > 4.0) break;
            
            // Accumulate density based on how close the trajectory gets to the origin
            glow += exp(-dot(z, z));
        }
    }
    
    // Normalize and scale glow
    glow = pow(glow * 0.04, 1.2);
    
    // Breathing effect
    float breathe = 0.85 + 0.15 * sin(u_time * 0.8);
    glow *= breathe;

    gl_FragColor = vec4(u_accent, min(glow, 0.9));
}
`

export function initBuddhabrot(canvas: HTMLCanvasElement): void {
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
		console.error('Buddhabrot shader compile error:', gl.getShaderInfoLog(shader))
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
		console.error('Buddhabrot program link error:', gl.getProgramInfoLog(program))
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