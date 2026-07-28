<script setup lang="ts">
import type { Product } from '@/types/product'
import { useCartStore } from '@/stores/cartStore'

const cart = useCartStore()

defineProps<{
  product: Product
}>()
</script>

<template>
  <div
    class="group relative flex flex-col justify-between overflow-hidden rounded-2xl border-2 border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-100 dark:border-neutral-700 dark:bg-neutral-900/40 dark:hover:border-indigo-500 dark:hover:shadow-indigo-950/40"
  >
    <router-link :to="`/product/${product.id}`" class="block flex-grow cursor-pointer">
      <!-- Image wrapper -->
      <div class="relative aspect-square overflow-hidden bg-gray-50 dark:bg-neutral-800/50">
        <img
          :src="product.thumbnail"
          :alt="product.title"
          class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <!-- Category Badge -->
        <span class="absolute top-2 left-2 rounded-lg bg-black/60 px-2 py-0.5 text-[9px] font-bold tracking-wider text-white uppercase backdrop-blur-xs">
          {{ product.category }}
        </span>
      </div>

      <!-- Card Content -->
      <div class="p-3">
        <!-- Title -->
        <h3 class="text-xs font-bold text-gray-800 line-clamp-1 group-hover:text-indigo-600 dark:text-neutral-200 dark:group-hover:text-indigo-400 transition-colors">
          {{ product.title }}
        </h3>
        <!-- Description -->
        <p class="mt-1 text-[10px] leading-relaxed text-gray-400 dark:text-neutral-500 line-clamp-2 min-h-[2.5em]">
          {{ product.description }}
        </p>
      </div>
    </router-link>

    <!-- Bottom Section: Price + Add Button -->
    <div class="flex items-center justify-between border-t border-gray-50 p-3 pt-2.5 dark:border-neutral-800/80">
      <div class="flex flex-col">
        <span class="text-xs font-black text-indigo-600 dark:text-indigo-400">
          ${{ product.price }}
        </span>
        <div class="flex items-center gap-0.5 mt-0.5 text-[10px] text-amber-500">
          <span>★</span>
          <span class="font-semibold text-gray-500 dark:text-neutral-400">{{ product.rating }}</span>
        </div>
      </div>
      <!-- Add to cart -->
      <button
        @click="cart.addToCart(product)"
        class="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white dark:bg-neutral-800 dark:text-indigo-400 dark:hover:bg-indigo-500 dark:hover:text-white transition-all duration-200 active:scale-90 cursor-pointer shadow-xs"
        title="Add to Cart"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  </div>
</template>