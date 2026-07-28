<script setup lang="ts">
defineProps<{
  categories: string[]
}>()

const emit = defineEmits<{
  (e: 'filter', value: string): void
}>()
</script>

<template>
  <div class="relative w-full">
    <!-- Category/Filter Icon -->
    <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-neutral-500">
      <svg class="h-4.5 w-4.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
      </svg>
    </div>
    <select
      @change="emit('filter', ($event.target as HTMLSelectElement).value)"
      class="w-full pl-10 pr-8 py-2.5 bg-white/70 border border-amber-100 dark:bg-neutral-800/40 dark:border-neutral-800 dark:text-white rounded-xl shadow-sm focus:outline-hidden focus:ring-2 focus:ring-amber-300/30 focus:border-amber-400 transition-all duration-200 text-sm font-medium appearance-none cursor-pointer"
    >
      <option value="">All Categories</option>
      <option
        v-for="category in categories"
        :key="category"
        :value="category"
      >
        {{ category }}
      </option>
    </select>
    <!-- Custom Arrow Chevron -->
    <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400 dark:text-neutral-500">
      <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
</template>
