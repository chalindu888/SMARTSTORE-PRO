<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import Navbar from '@/components/Navbar.vue'
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'
import Footer from '@/components/footer.vue'
import ShopInfoBar from '@/components/ShopInfoBar.vue'
import ToastContainer from '@/components/ToastContainer.vue'

const auth = useAuthStore()
const cart = useCartStore()
auth.loadUser()
cart.loadCart()

// ─── Canvas Particle Network ──────────────────────────────────────────────────
const canvasRef = ref<HTMLCanvasElement | null>(null)
let animId = 0
let cleanup: (() => void) | undefined

interface Particle {
  x: number; y: number
  vx: number; vy: number
  baseVx: number; baseVy: number
  r: number
  color: [number, number, number]
  alpha: number
  twinkleDir: number
}

const COLORS: [number, number, number][] = [
  [99,  102, 241], // indigo (keeps a cool accent)
  [245, 158, 11],  // warm amber (replaces violet)
  [34,  211, 238], // cyan
  [255, 183, 77],  // soft gold (replaces purple)
  [59,  130, 246], // blue
]

function initCanvas() {
  const canvasElement = canvasRef.value
  if (!canvasElement) return

  const canvas = canvasElement
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const safeCtx = ctx

  const mouse = { x: -9999, y: -9999 }
  const CONNECT = 140
  const REPEL   = 110
  let W = 0, H = 0
  let particles: Particle[] = []

  function resize() {
    W = canvas.width  = window.innerWidth
    H = canvas.height = window.innerHeight
    spawnParticles()
  }

  function spawnParticles() {
    const count = Math.min(Math.floor((W * H) / 16000), 80)
    particles = Array.from({ length: count }, () => {
      const vx = (Math.random() - 0.5) * 0.5
      const vy = (Math.random() - 0.5) * 0.5
      const color = COLORS[Math.floor(Math.random() * COLORS.length)] ?? [99, 102, 241]
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        vx, vy,
        baseVx: vx,
        baseVy: vy,
        r: Math.random() * 2 + 1,
        color,
        alpha: Math.random() * 0.6 + 0.4,
        twinkleDir: Math.random() > 0.5 ? 1 : -1,
      }
    }) as Particle[]
  }

  function onMouseMove(e: MouseEvent) {
    mouse.x = e.clientX
    mouse.y = e.clientY
  }
  function onMouseLeave() {
    mouse.x = -9999
    mouse.y = -9999
  }

  window.addEventListener('resize', resize)
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseleave', onMouseLeave)
  resize()

  function draw() {
    safeCtx.clearRect(0, 0, W, H)

    for (const p of particles) {
      // Twinkle
      p.alpha += p.twinkleDir * 0.008
      if (p.alpha > 1)   { p.alpha = 1;   p.twinkleDir = -1 }
      if (p.alpha < 0.2) { p.alpha = 0.2; p.twinkleDir =  1 }

      // Mouse repulsion
      const mdx  = p.x - mouse.x
      const mdy  = p.y - mouse.y
      const mdist = Math.sqrt(mdx * mdx + mdy * mdy)
      if (mdist < REPEL && mdist > 0) {
        const force = ((REPEL - mdist) / REPEL) * 0.6
        p.vx += (mdx / mdist) * force
        p.vy += (mdy / mdist) * force
      }

      // Drift back to base velocity
      p.vx += (p.baseVx - p.vx) * 0.02
      p.vy += (p.baseVy - p.vy) * 0.02

      // Damping
      p.vx *= 0.97
      p.vy *= 0.97

      // Move
      p.x += p.vx
      p.y += p.vy

      // Bounce
      if (p.x < 0)  { p.x = 0; p.vx  *= -1 }
      if (p.x > W)  { p.x = W; p.vx  *= -1 }
      if (p.y < 0)  { p.y = 0; p.vy  *= -1 }
      if (p.y > H)  { p.y = H; p.vy  *= -1 }

      // Draw glow dot
      const [r, g, b] = p.color
      const grd = safeCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3)
      grd.addColorStop(0,   `rgba(${r},${g},${b},${p.alpha})`)
      grd.addColorStop(0.5, `rgba(${r},${g},${b},${p.alpha * 0.4})`)
      grd.addColorStop(1,   `rgba(${r},${g},${b},0)`)
      safeCtx.beginPath()
      safeCtx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2)
      safeCtx.fillStyle = grd
      safeCtx.fill()
    }

    // Connections
    for (let i = 0; i < particles.length; i++) {
      const particleA = particles[i]
      if (!particleA) continue

      for (let j = i + 1; j < particles.length; j++) {
        const particleB = particles[j]
        if (!particleB) continue

        const dx   = particleA.x - particleB.x
        const dy   = particleA.y - particleB.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < CONNECT) {
          const a = (1 - dist / CONNECT) * 0.6
          const [r, g, b] = particleA.color
          safeCtx.beginPath()
          safeCtx.moveTo(particleA.x, particleA.y)
          safeCtx.lineTo(particleB.x, particleB.y)
          safeCtx.strokeStyle = `rgba(${r},${g},${b},${a})`
          safeCtx.lineWidth = 0.8
          safeCtx.stroke()
        }
      }
    }

    animId = requestAnimationFrame(draw)
  }

  draw()

  return () => {
    cancelAnimationFrame(animId)
    window.removeEventListener('resize', resize)
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseleave', onMouseLeave)
  }
}

onMounted(() => { cleanup = initCanvas() })
onUnmounted(() => { cleanup?.() })
</script>

<template>
  <div class="app-root min-h-screen flex flex-col text-gray-900 dark:text-neutral-100 transition-colors duration-500 relative overflow-x-hidden">

    <!-- Animated gradient base -->
    <div class="app-gradient" aria-hidden="true" />

    <!-- Animated background image -->
    <img
      src="@/assets/animated-bg.svg"
      alt=""
      class="bg-graphic"
      aria-hidden="true"
    />

    <!-- Canvas particle network -->
    <canvas
      ref="canvasRef"
      class="app-canvas"
      aria-hidden="true"
    />

    <Navbar class="relative z-40" />

    <main class="flex-grow relative z-10">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <Footer class="relative z-10" />
    <ShopInfoBar class="relative z-10" />
    <ToastContainer />

  </div>
</template>

<style>
/* ── Base ───────────────────────────────────────────────────────── */
.app-root {
  background-color: #f5f0e8; /* warm light brown/cream */
}
.dark .app-root {
  background-color: #06060f;
}

/* ── Animated gradient behind canvas ────────────────────────────── */
.app-gradient {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  /* Light: warm brown / sandy beige shift */
  background: linear-gradient(
    130deg,
    #f5f0e8 0%,
    #faf6ee 25%,
    #f0e6d3 55%,
    #f7f2ea 80%,
    #f5f0e8 100%
  );
  background-size: 280% 280%;
  animation: bg-shift 22s ease infinite;
  opacity: 1;
}
.dark .app-gradient {
  background: linear-gradient(
    130deg,
    #0d0b1e 0%,
    #06060f 25%,
    #0c0824 55%,
    #070b1a 80%,
    #0d0b1e 100%
  );
  background-size: 280% 280%;
  opacity: 1;
}
@keyframes bg-shift {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* ── Canvas overlay ─────────────────────────────────────────────── */
.app-canvas {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  /* Light mode: very faint so content stays clear */
  opacity: 0.15;
}
.dark .app-canvas {
  /* Dark mode: particles are clearly visible */
  opacity: 0.65;
}

/* ── Animated image layer ─────────────────────────────────────── */
.bg-graphic {
  position: fixed;
  inset: 0;
  width: 120%;
  height: 120%;
  left: -10%;
  top: -10%;
  object-fit: cover;
  z-index: 0;
  pointer-events: none;
  opacity: 0.12;
  transform-origin: center;
  animation: bg-rotate 40s linear infinite, bg-pulse 10s ease-in-out infinite;
}
.dark .bg-graphic {
  opacity: 0.22;
  filter: saturate(1.05) brightness(0.85);
}

@keyframes bg-rotate {
  from { transform: rotate(0deg) scale(1); }
  to   { transform: rotate(360deg) scale(1); }
}
@keyframes bg-pulse {
  0%,100% { opacity: 0.12; }
  50%     { opacity: 0.18; }
}

/* ── Route transition ───────────────────────────────────────────── */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.22s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>