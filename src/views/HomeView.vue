<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { fetchProducts } from '@/services/productService'
import type { Product } from '@/types/product'

import ProductCard from '@/components/ProductCard.vue'
import SearchBar from '@/components/SearchBar.vue'
import FilterDropdown from '@/components/FilterDropdown.vue'
import DarkToggle from '@/components/DarkToggle.vue'
import { useAuthStore } from '@/stores/authStore'
import banner from '@/assets/banner.png'


const auth = useAuthStore()
const products = ref<Product[]>([])
const searchTerm = ref('')
const selectedCategory = ref('')
const loading = ref(true)

onMounted(async () => {
  products.value = await fetchProducts()
  loading.value = false
})



const categories = computed(() => {
  const unique = new Set(products.value.map(p => p.category))
  return Array.from(unique)
})

const filteredProducts = computed(() => {
  return products.value.filter(product => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchTerm.value.toLowerCase())

    const matchesCategory =
      selectedCategory.value === '' ||
      product.category === selectedCategory.value

    return matchesSearch && matchesCategory
  })
})
</script>

<template>
  <div class="p-6 min-h-screen transition-colors duration-300 relative overflow-hidden">

    <!-- Home-only animated background (floating bubbles) -->
    <div class="home-bg-anim" aria-hidden="true">
      <span class="bubble b1"></span>
      <span class="bubble b2"></span>
      <span class="bubble b3"></span>
      <span class="bubble b4"></span>
      <span class="bubble b5"></span>
    </div>

    <!-- Premium hero section -->
    <section class="hero-shell mb-8 animate-entrance" style="animation-delay: 50ms">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 relative z-10">
        <div class="max-w-2xl">
          <div class="hero-badge">Curated essentials for modern living</div>
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight mt-4">
            Discover quality products with a refined shopping experience.
          </h1>
          <p class="mt-4 text-base sm:text-lg text-gray-700 dark:text-neutral-300 leading-7">
            From everyday favorites to standout pieces, SmartStore helps you browse, compare, and shop with confidence.
          </p>
          <div class="mt-6 flex flex-wrap gap-3">
            <a href="#products-section" class="rounded-full bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700">
              Explore products
            </a>
            <a href="#" class="rounded-full border border-white/70 dark:border-neutral-700 px-5 py-2.5 text-sm font-semibold text-gray-800 dark:text-neutral-200 transition hover:bg-white/70 dark:hover:bg-neutral-800/70">
              Learn more
            </a>
          </div>
        </div>

        <div class="w-full max-w-md">
          <div class="hero-media-card">
            <img :src="banner" alt="SmartStore collection banner" class="h-64 w-full object-cover" />
            <div class="hero-media-overlay">
              <p class="text-xs uppercase tracking-[0.3em] text-white/80">Fresh picks</p>
              <p class="mt-2 text-lg font-semibold text-white">Bright deals for every room</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 🔍 Search + Filter -->
    <div class="flex flex-col sm:flex-row gap-4 mb-8 bg-white/75 dark:bg-neutral-900/40 p-4 rounded-2xl border border-amber-100 dark:border-neutral-800/80 backdrop-blur-md shadow-sm animate-entrance" style="animation-delay: 150ms">
      <SearchBar @search="searchTerm = $event" />
      <FilterDropdown
        :categories="categories"
        @filter="selectedCategory = $event"
      />
    </div>

    <!-- Products Section -->
    <div id="products-section" class="relative animate-entrance" style="animation-delay: 250ms">

      <!-- Loading State Skeleton -->
      <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
        <div v-for="i in 12" :key="i" class="animate-pulse flex flex-col rounded-2xl bg-white dark:bg-neutral-900/40 border border-gray-100 dark:border-neutral-800/80 aspect-square p-3">
          <div class="bg-gray-200 dark:bg-neutral-800/60 rounded-xl w-full h-[60%] mb-3"></div>
          <div class="h-3 bg-gray-200 dark:bg-neutral-800/60 rounded w-3/4 mb-2"></div>
          <div class="h-2.5 bg-gray-200 dark:bg-neutral-800/60 rounded w-1/2"></div>
        </div>
      </div>

      <!-- No items found -->
      <div v-else-if="filteredProducts.length === 0" class="text-center py-16">
        <div class="text-4xl mb-3">🔍</div>
        <p class="text-gray-500 dark:text-neutral-400 font-semibold">No products found</p>
        <p class="text-xs text-gray-400 dark:text-neutral-500 mt-1">Try adjusting your search or filter.</p>
      </div>

      <!-- Animated Dense Product Grid -->
      <TransitionGroup
        v-else
        appear
        name="product-grid"
        tag="div"
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6"
      >
        <ProductCard
          v-for="(product, index) in filteredProducts"
          :key="product.id"
          :product="product"
          :style="{ '--delay': `${(index % 12) * 50}ms` }"
        />
      </TransitionGroup>

    </div>

  </div>
</template>

<style scoped>
/* Page Entrance Keyframes */
@keyframes entrance {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-entrance {
  opacity: 0;
  animation: entrance 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Premium hero styling */
.hero-shell {
  position: relative;
  overflow: hidden;
  border-radius: 1.75rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #fff7eb 0%, #ffe8c7 30%, #f9d9f6 65%, #dcecff 100%);
  border: 1px solid rgba(217, 173, 120, 0.28);
  box-shadow: 0 18px 50px -24px rgba(92, 64, 34, 0.28);
}

.hero-shell::before,
.hero-shell::after {
  content: '';
  position: absolute;
  border-radius: 9999px;
  filter: blur(18px);
  opacity: 0.55;
  pointer-events: none;
}

.hero-shell::before {
  width: 220px;
  height: 220px;
  right: -30px;
  top: -40px;
  background: rgba(255, 166, 77, 0.28);
}

.hero-shell::after {
  width: 180px;
  height: 180px;
  left: -20px;
  bottom: -30px;
  background: rgba(110, 170, 255, 0.24);
}

.dark .hero-shell {
  background: linear-gradient(135deg, rgba(38, 19, 60, 0.96) 0%, rgba(29, 42, 80, 0.94) 40%, rgba(12, 61, 76, 0.95) 100%);
  border-color: rgba(255,255,255,0.08);
  box-shadow: 0 20px 50px -24px rgba(0,0,0,0.7);
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.8rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.7);
  color: #8a4b14;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.dark .hero-badge {
  background: rgba(255, 255, 255, 0.12);
  color: #f7c684;
}

.hero-media-card {
  position: relative;
  overflow: hidden;
  border-radius: 1.5rem;
  border: 1px solid rgba(255,255,255,0.7);
  box-shadow: 0 20px 45px -25px rgba(0,0,0,0.35);
  background: rgba(255,255,255,0.55);
  padding: 0.75rem;
}

.dark .hero-media-card {
  border-color: rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.06);
}

.hero-media-card img {
  display: block;
  border-radius: 1.15rem;
}

.hero-media-overlay {
  position: absolute;
  inset: auto 1.25rem 1.25rem 1.25rem;
  padding: 0.9rem 1rem;
  border-radius: 1rem;
  background: linear-gradient(90deg, rgba(16,20,40,0.86), rgba(16,20,40,0.62));
  backdrop-filter: blur(10px);
}

/* Home background floating bubbles */
.home-bg-anim {
  position: fixed;
  inset: 0;
  z-index: 5; /* above app gradient (0) and canvas (1), below main content (z-10) */
  pointer-events: none;
  overflow: hidden;
}
.home-bg-anim .bubble {
  position: absolute;
  border-radius: 50%;
  filter: blur(24px);
  opacity: 0.22; /* stronger in light mode so it's visible */
}
.home-bg-anim .b1 {
  width: 420px; height: 420px; left: -8%; top: -12%;
  background: radial-gradient(circle at 30% 30%, rgba(255,214,170,0.98), rgba(255,150,120,0.85));
  animation: float1 18s ease-in-out infinite;
}
.home-bg-anim .b2 {
  width: 360px; height: 360px; right: -6%; top: 6%;
  background: radial-gradient(circle at 40% 40%, rgba(155,246,255,0.95), rgba(189,178,255,0.85));
  animation: float2 22s ease-in-out infinite;
}
.home-bg-anim .b3 {
  width: 240px; height: 240px; left: 12%; bottom: -8%;
  background: radial-gradient(circle at 40% 40%, rgba(202,255,191,0.96), rgba(255,240,180,0.85));
  animation: float3 20s ease-in-out infinite;
}
.home-bg-anim .b4 {
  width: 160px; height: 160px; right: 18%; bottom: 6%;
  background: radial-gradient(circle at 40% 40%, rgba(255,255,255,0.95), rgba(220,220,255,0.85));
  opacity: 0.18;
  animation: float4 26s ease-in-out infinite;
}
.home-bg-anim .b5 {
  width: 100px; height: 100px; left: 50%; top: 20%; transform: translateX(-50%);
  background: radial-gradient(circle at 40% 40%, rgba(255,240,230,0.98), rgba(255,200,200,0.85));
  opacity: 0.18;
  animation: float5 16s ease-in-out infinite;
}

/* Dark mode: make bubbles subtler and use screen blend for glow */
.dark .home-bg-anim .bubble {
  mix-blend-mode: screen;
  filter: blur(28px) saturate(0.9) brightness(0.9);
  opacity: 0.12;
}

@keyframes float1 {
  0% { transform: translateY(0) translateX(0) scale(1); }
  50% { transform: translateY(28px) translateX(18px) scale(1.02); }
  100% { transform: translateY(0) translateX(0) scale(1); }
}
@keyframes float2 {
  0% { transform: translateY(0) translateX(0) scale(1); }
  50% { transform: translateY(-36px) translateX(-24px) scale(1.03); }
  100% { transform: translateY(0) translateX(0) scale(1); }
}
@keyframes float3 {
  0% { transform: translateY(0) translateX(0) scale(1); }
  50% { transform: translateY(22px) translateX(-30px) scale(1.01); }
  100% { transform: translateY(0) translateX(0) scale(1); }
}
@keyframes float4 {
  0% { transform: translateY(0) translateX(0) scale(1); }
  50% { transform: translateY(-18px) translateX(12px) scale(1.02); }
  100% { transform: translateY(0) translateX(0) scale(1); }
}
@keyframes float5 {
  0% { transform: translateY(0) translateX(0) scale(1); }
  50% { transform: translateY(12px) translateX(6px) scale(1.04); }
  100% { transform: translateY(0) translateX(0) scale(1); }
}

/* Product grid animation styles */
.product-grid-enter-active,
.product-grid-appear-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--delay, 0ms);
}
.product-grid-leave-active {
  transition: all 0.3s cubic-bezier(0.7, 0, 0.84, 0);
  position: absolute;
}
.product-grid-enter-from,
.product-grid-appear-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
.product-grid-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
.product-grid-move {
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
