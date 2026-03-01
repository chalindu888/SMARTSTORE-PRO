<script setup lang="ts">
import type { Product } from '@/types/Product'
import { useCartStore } from '@/stores/cartStore'

const cart = useCartStore()
/*
  Define props with strict typing
  This ensures:
  - No "any"
  - Full TypeScript support
*/
const props = defineProps<{
  product: Product
}>()
</script>

<template>
  <div
    class="bg-white dark:bg-gray-800 
           rounded-xl shadow-md 
           hover:shadow-xl 
           transition duration-300 
           overflow-hidden"
  >

    <!-- Product Image -->
    <img
      :src="product.thumbnail"
      :alt="product.title"
      class="w-full h-48 object-cover"
    />

    <!-- Card Content -->
    <div class="p-4">

      <!-- Title -->
      <h2 class="text-lg font-semibold dark:text-white">
        {{ product.title }}
      </h2>

      <!-- Description -->
      <p class="text-sm text-gray-500 dark:text-gray-300 mt-1 line-clamp-2">
        {{ product.description }}
      </p>

      <!-- Price -->
      <p class="text-indigo-600 font-bold mt-2">
        ${{ product.price }}
      </p>

      <!-- Rating -->
      <p class="text-yellow-500 text-sm mt-1">
        ⭐ {{ product.rating }}
      </p>

      <!-- View Button -->
      <router-link
        :to="`/product/${product.id}`"
        class="mt-3 inline-block 
               bg-indigo-500 
               text-white 
               px-4 py-2 
               rounded-md 
               hover:bg-indigo-600 
               transition"
      >
        View Details
      </router-link>

    </div>
      <button
  @click="cart.addToCart(product)"
  class="mt-2 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
>
  Add to Cart
</button>
  </div>

</template>