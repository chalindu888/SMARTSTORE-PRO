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
  <div class="p-6 min-h-screen bg-gray-100 dark:bg-black">

    <!-- ✅ BANNER IMAGE -->
    <Banner />

    <!-- 🔍 Search + Filter -->
    <div class="flex flex-col md:flex-row gap-4 mb-6">
      <SearchBar @search="searchTerm = $event" />
      <FilterDropdown
        :categories="categories"
        @filter="selectedCategory = $event"
      />
    </div>

    <!-- Products -->
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      <ProductCard
        v-for="product in filteredProducts"
        :key="product.id"
        :product="product"
      />
    </div>

  </div>
</template>

