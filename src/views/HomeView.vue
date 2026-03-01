<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { fetchProducts } from '@/services/productService'
import type { Product } from '@/types/Product'

import ProductCard from '@/components/ProductCard.vue'
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
<div class="flex justify-end gap-4 mb-4">

  <div v-if="auth.isAuthenticated" class="flex items-center gap-3">
    <span class="dark:text-white">
      Welcome, {{ auth.user?.username }}
    </span>

    <button
      @click="auth.logout()"
      class="bg-red-500 text-white px-3 py-1 rounded"
    >
      Logout
    </button>
  </div>

  <router-link
    v-else
    to="/login"
    class="bg-indigo-500 text-white px-4 py-2 rounded"
  >
    Login
  </router-link>

   </div>

   <div class="flex justify-between items-center mb-6">
  <h1 class="text-2xl font-bold dark:text-white">Products</h1>
  <DarkToggle />
  </div>
   <div class="min-h-screen bg-gray-100 dark:bg-gray-900">

    <!-- Search and Filter -->
    <div class="flex flex-col md:flex-row gap-4 mb-6">
      <SearchBar @search="searchTerm = $event" />
      <FilterDropdown
        :categories="categories"
        @filter="selectedCategory = $event"
      />
    </div>

    <!-- Loading -->
    <div v-if="loading">
      Loading...
    </div>

    <!-- No Results -->
    <div v-else-if="!filteredProducts.length" class="text-center text-gray-500">
      No products found.
    </div>

    <!-- Product Grid -->
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      <ProductCard
        v-for="product in filteredProducts"
        :key="product.id"
        :product="product"
      />
    </div>
    <div v-if="!filteredProducts.length && !loading" class="text-center text-gray-500">
  No products found.
</div>

  </div>
</template>
