<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { fetchProducts } from '@/services/productService'
import type { Product } from '@/types/product'

import ProductCard from '@/components/ProductCard.vue'
import Banner from '@/components/Banner.vue'
import SearchBar from '@/components/SearchBar.vue'
import FilterDropdown from '@/components/FilterDropdown.vue'
import DarkToggle from '@/components/DarkToggle.vue'
import { useAuthStore } from '@/stores/authStore'


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
  <div class="p-6 min-h-screen bg-slate-50 dark:bg-neutral-950 transition-colors duration-300">

    <!-- ✅ BANNER IMAGE -->
    <Banner class="animate-entrance" style="animation-delay: 50ms" />

    <!-- 🔍 Search + Filter -->
    <div class="flex flex-col sm:flex-row gap-4 mb-8 bg-white dark:bg-neutral-900/40 p-4 rounded-2xl border border-gray-100 dark:border-neutral-800/80 backdrop-blur-md animate-entrance" style="animation-delay: 150ms">
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
        <p class="text-gray-500 dark:text-neutral-400 font-medium">No products match your search or filter criteria.</p>
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


