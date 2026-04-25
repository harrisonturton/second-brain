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

// Visual tuning. Cell size + gap define the grid; the rest control how
// strongly the cursor lights cells and how ripple wavefronts spread.
const CELL_SIZE = 14
const GAP = 1
const CURSOR_RADIUS = 56
const RIPPLE_SPEED = 320 // CSS px / second
const RIPPLE_PERIOD_MS = 110 // emit a new ripple every N ms
const RIPPLE_LIFETIME_S = 1.4
const RIPPLE_WIDTH = 28
const DECAY_PER_60HZ = 0.93 // per-frame decay at 60 Hz; framerate-corrected below

type Ripple = { x: number; y: number; t: number }

/**
 * LoginShader — a canvas-2D grid of cells behind the login form.
 * Cells start at the page background; the cursor lights nearby cells
 * (path) and emits expanding ripple wavefronts that flip cells they
 * cross. Each cell decays back to the background over ~1 s.
 *
 * Uses the canvas at device-pixel resolution but does math in CSS
 * pixels for cursor maths sanity. Pointer-events disabled so the
 * canvas never intercepts the form.
 */
export function LoginShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const theme = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let cssWidth = 0
    let cssHeight = 0
    let cols = 0
    let rows = 0
    let intensities = new Float32Array(0)
    const target = { x: -1e6, y: -1e6 }
    const ripples: Ripple[] = []
    let lastEmitMs = 0

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      target.x = e.clientX - rect.left
      target.y = e.clientY - rect.top
    }
    window.addEventListener('mousemove', onMove)

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      cssWidth = rect.width
      cssHeight = rect.height
      canvas.width = Math.max(1, Math.floor(cssWidth * dpr))
      canvas.height = Math.max(1, Math.floor(cssHeight * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      cols = Math.ceil(cssWidth / CELL_SIZE)
      rows = Math.ceil(cssHeight / CELL_SIZE)
      intensities = new Float32Array(cols * rows)

      // Centre the cursor on first frame so the ripples have somewhere
      // to come from before the user moves the mouse.
      if (target.x === -1e6) {
        target.x = cssWidth / 2
        target.y = cssHeight / 2
      }
    }
    resize()
    window.addEventListener('resize', resize)

    const start = performance.now()
    let lastFrameMs = start

    let raf = 0
    const draw = () => {
      const nowMs = performance.now()
      const t = (nowMs - start) / 1000
      const dt = Math.max(0.001, (nowMs - lastFrameMs) / 1000)
      lastFrameMs = nowMs

      // Emit a ripple at the cursor's current position on a fixed
      // cadence; the cursor's movement is reflected naturally by the
      // changing emit positions.
      if (nowMs - lastEmitMs > RIPPLE_PERIOD_MS) {
        ripples.push({ x: target.x, y: target.y, t })
        lastEmitMs = nowMs
      }
      while (ripples.length && t - ripples[0].t > RIPPLE_LIFETIME_S) {
        ripples.shift()
      }

      // Frame-rate-corrected decay so the visual is the same on 144 Hz
      // and 60 Hz displays.
      const decay = Math.pow(DECAY_PER_60HZ, dt * 60)

      // Update per-cell intensities.
      for (let r = 0; r < rows; r++) {
        const cy = r * CELL_SIZE + CELL_SIZE / 2
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c
          const cx = c * CELL_SIZE + CELL_SIZE / 2

          let intensity = intensities[idx] * decay

          // Path: cells inside the cursor radius get lit proportional
          // to their proximity.
          const pdx = cx - target.x
          const pdy = cy - target.y
          const pd = Math.sqrt(pdx * pdx + pdy * pdy)
          if (pd < CURSOR_RADIUS) {
            const v = 1 - pd / CURSOR_RADIUS
            if (v > intensity) intensity = v
          }

          // Ripples: each ripple is a thin ring expanding outward from
          // its emit position. Cells close to the ring get lit with a
          // strength that fades over the ripple's lifetime.
          for (let i = 0; i < ripples.length; i++) {
            const rp = ripples[i]
            const dx = cx - rp.x
            const dy = cy - rp.y
            const d = Math.sqrt(dx * dx + dy * dy)
            const age = t - rp.t
            const expected = age * RIPPLE_SPEED
            const offset = Math.abs(d - expected)
            if (offset < RIPPLE_WIDTH) {
              const ring = 1 - offset / RIPPLE_WIDTH
              const ageFalloff = 1 - age / RIPPLE_LIFETIME_S
              const v = ring * ageFalloff * 0.85
              if (v > intensity) intensity = v
            }
          }

          intensities[idx] = intensity
        }
      }

      // Render. Background fill, then a single colour pass for lit
      // cells (alpha = intensity gives the smooth transitions).
      ctx.fillStyle = theme.pageBg
      ctx.fillRect(0, 0, cssWidth, cssHeight)
      ctx.fillStyle = theme.textPrimary
      const inner = CELL_SIZE - GAP
      for (let r = 0; r < rows; r++) {
        const py = r * CELL_SIZE + GAP / 2
        for (let c = 0; c < cols; c++) {
          const intensity = intensities[r * cols + c]
          if (intensity > 0.02) {
            ctx.globalAlpha = intensity
            ctx.fillRect(c * CELL_SIZE + GAP / 2, py, inner, inner)
          }
        }
      }
      ctx.globalAlpha = 1

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', resize)
    }
  }, [theme.pageBg, theme.textPrimary])

  return <Canvas ref={canvasRef} aria-hidden="true" />
}
