<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { fetchProductById } from '@/services/productService'
import type { Product } from '@/types/Product'

const route = useRoute()
const product = ref<Product | null>(null)
const loading = ref(true)

onMounted(async () => {
  const id = Number(route.params.id)
  product.value = await fetchProductById(id)
  loading.value = false
})
</script>

<template>
  <div class="p-6 min-h-screen bg-gray-100 dark:bg-black">

    <div v-if="loading">
      Loading...
    </div>

    <div v-else-if="product" class="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow">

      <img
        :src="product.thumbnail"
        :alt="product.title"
        class="w-full h-64 object-cover rounded-md"
      />

      <h1 class="text-2xl font-bold mt-4 dark:text-white">
        {{ product.title }}
      </h1>

      <p class="text-gray-600 dark:text-gray-300 mt-2">
        {{ product.description }}
      </p>

      <p class="text-indigo-600 font-bold mt-4 text-xl">
        ${{ product.price }}
      </p>

      <p class="text-yellow-500 mt-2">
        ⭐ {{ product.rating }}
      </p>

      <router-link
        to="/"
        class="inline-block mt-6 bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
      >
        Back to Products
      </router-link>

    </div>

  </div>
</template>