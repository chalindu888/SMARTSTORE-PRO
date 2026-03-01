<script setup lang="ts">
import { useCartStore } from '@/stores/cartStore'

const cart = useCartStore()
</script>

<template>
  <div class="p-6 min-h-screen bg-gray-100 dark:bg-black">
    <h1 class="text-2xl font-bold mb-6 dark:text-white">
      Your Cart
    </h1>

    <div v-if="!cart.items.length" class="text-gray-500">
      Cart is empty.
    </div>

    <div v-else>
      <div
        v-for="item in cart.items"
        :key="item.id"
        class="bg-white dark:bg-gray-800 p-4 mb-4 rounded shadow"
      >
        <h2 class="font-semibold dark:text-white">
          {{ item.title }}
        </h2>
        <p class="dark:text-gray-300">
          Quantity: {{ item.quantity }}
        </p>
        <p class="text-indigo-600 font-bold">
          ${{ item.price * item.quantity }}
        </p>

        <button
          @click="cart.removeFromCart(item.id)"
          class="mt-2 bg-red-500 text-white px-3 py-1 rounded"
        >
          Remove
        </button>
      </div>

      <div class="text-xl font-bold mt-6 dark:text-white">
        Total: ${{ cart.totalPrice }}
      </div>
    </div>
  </div>
</template>