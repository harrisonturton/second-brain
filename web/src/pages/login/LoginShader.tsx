import { useEffect, useRef } from 'react'
import styled, { useTheme } from 'styled-components'

const Canvas = styled.canvas`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
`

// Fullscreen quad — two triangles in NDC.
const QUAD = new Float32Array([
  -1, -1,
  1, -1,
  -1, 1,
  -1, 1,
  1, -1,
  1, 1,
])

const VERTEX_SRC = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

// Ripple field. A few ambient wave sources drift slowly; one strong
// source follows the cursor. Distance attenuation keeps energy bounded.
// The result modulates a tint between the page bg and the accent.
const FRAGMENT_SRC = `
precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform vec3 u_baseColor;
uniform vec3 u_accentColor;

float wave(vec2 p, vec2 source, float freq, float phase) {
  float d = distance(p, source);
  return sin(d * freq - phase) * exp(-d * 1.1);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = uv;
  p.x *= aspect;

  vec2 m = u_mouse / u_resolution.xy;
  m.y = 1.0 - m.y;
  m.x *= aspect;

  float t = u_time;

  float r0 = wave(p, m, 28.0, t * 2.4);

  vec2 a1 = vec2(0.30 * aspect + sin(t * 0.13) * 0.10, 0.50 + cos(t * 0.17) * 0.18);
  vec2 a2 = vec2(0.72 * aspect + cos(t * 0.11) * 0.10, 0.40 + sin(t * 0.19) * 0.18);
  vec2 a3 = vec2(0.50 * aspect + sin(t * 0.07) * 0.22, 0.72 + cos(t * 0.23) * 0.12);

  float r1 = wave(p, a1, 22.0, t * 1.8);
  float r2 = wave(p, a2, 24.0, t * 2.0);
  float r3 = wave(p, a3, 18.0, t * 1.5);

  float field = r0 * 0.55 + (r1 + r2 + r3) * 0.22;

  // Map roughly [-1, 1] → [0, 1], then squash to a calm range.
  float intensity = smoothstep(-0.4, 1.0, field) * 0.22;

  vec3 col = mix(u_baseColor, u_accentColor, intensity);
  gl_FragColor = vec4(col, 1.0);
}
`

function compile(
  gl: WebGLRenderingContext,
  source: string,
  type: GLenum,
): WebGLShader | null {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('LoginShader compile failed:', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

function hexToRgb(hex: string): [number, number, number] {
  const s = hex.replace('#', '')
  const v = s.length === 3
    ? s.split('').map((c) => c + c).join('')
    : s
  return [
    parseInt(v.slice(0, 2), 16) / 255,
    parseInt(v.slice(2, 4), 16) / 255,
    parseInt(v.slice(4, 6), 16) / 255,
  ]
}

/**
 * LoginShader — fullscreen WebGL ripple field rendered behind the
 * login form. Ambient wave sources drift slowly; a stronger source
 * follows (lerped) the mouse cursor for a "thinking / brainwave"
 * vibe. Pointer-events disabled so it doesn't block the form.
 *
 * Falls back to nothing visible if the browser refuses WebGL.
 */
export function LoginShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const theme = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl', {
      antialias: false,
      premultipliedAlpha: false,
    })
    if (!gl) return

    const vs = compile(gl, VERTEX_SRC, gl.VERTEX_SHADER)
    const fs = compile(gl, FRAGMENT_SRC, gl.FRAGMENT_SHADER)
    if (!vs || !fs) return
    const program = gl.createProgram()
    if (!program) return
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('LoginShader link failed:', gl.getProgramInfoLog(program))
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      gl.deleteProgram(program)
      return
    }
    gl.useProgram(program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, QUAD, gl.STATIC_DRAW)
    const positionLoc = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(positionLoc)
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0)

    const uResolution = gl.getUniformLocation(program, 'u_resolution')
    const uMouse = gl.getUniformLocation(program, 'u_mouse')
    const uTime = gl.getUniformLocation(program, 'u_time')
    const uBase = gl.getUniformLocation(program, 'u_baseColor')
    const uAccent = gl.getUniformLocation(program, 'u_accentColor')

    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let cssWidth = 0
    let cssHeight = 0
    let target = { x: 0, y: 0 }
    let smoothed = { x: 0, y: 0 }

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      target = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    window.addEventListener('mousemove', onMove)

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      cssWidth = rect.width
      cssHeight = rect.height
      canvas.width = Math.max(1, Math.floor(cssWidth * dpr))
      canvas.height = Math.max(1, Math.floor(cssHeight * dpr))
      gl.viewport(0, 0, canvas.width, canvas.height)
      // Centre the cursor on first frame so the ripple isn't pinned at (0, 0).
      if (target.x === 0 && target.y === 0) {
        target = { x: cssWidth / 2, y: cssHeight / 2 }
        smoothed = { ...target }
      }
    }
    resize()
    window.addEventListener('resize', resize)

    const baseRgb = hexToRgb(theme.pageBg)
    const accentRgb = hexToRgb(theme.loginShaderAccent)

    let raf = 0
    const start = performance.now()
    const draw = () => {
      const t = (performance.now() - start) / 1000
      // Ease the cursor follower towards its target for a softer trail.
      smoothed.x += (target.x - smoothed.x) * 0.08
      smoothed.y += (target.y - smoothed.y) * 0.08

      gl.uniform2f(uResolution, canvas.width, canvas.height)
      gl.uniform2f(uMouse, smoothed.x * dpr, smoothed.y * dpr)
      gl.uniform1f(uTime, t)
      gl.uniform3f(uBase, baseRgb[0], baseRgb[1], baseRgb[2])
      gl.uniform3f(uAccent, accentRgb[0], accentRgb[1], accentRgb[2])
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
    }
  }, [theme.pageBg, theme.loginShaderAccent])

  return <Canvas ref={canvasRef} aria-hidden="true" />
}
