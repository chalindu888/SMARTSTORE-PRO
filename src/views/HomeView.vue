<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchProducts } from '@/services/productService'
import type { Product } from '@/types/Product'
import ProductCard from '@/components/ProductCard.vue'

const products = ref<Product[]>([])
const loading = ref<boolean>(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    products.value = await fetchProducts()
  } catch (err) {
    error.value = 'Failed to load products'
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="p-6">

    <h1 class="text-2xl font-bold mb-6">Products</h1>

    <!-- Loading State -->
    <div v-if="loading">Loading products...</div>

    <!-- Error State -->
    <div v-else-if="error" class="text-red-500">
      {{ error }}
    </div>

    <!-- Product Grid -->
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
      />
    </div>

  </div>
</template>