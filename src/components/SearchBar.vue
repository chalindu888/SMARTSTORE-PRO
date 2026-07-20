<script setup lang="ts">
import { ref, watch } from 'vue'

const emit = defineEmits<{
  (e: 'search', value: string): void
}>()

const search = ref('')

watch(search, (newValue) => {
  emit('search', newValue)
})
</script>

<template>
  <div class="relative w-full">
    <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-neutral-500">
      <svg class="h-4.5 w-4.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
    <input
      v-model="search"
      type="text"
      placeholder="Search products..."
      class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 dark:bg-neutral-800/40 dark:border-neutral-800 dark:text-white rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 placeholder-gray-400 dark:placeholder-neutral-500 text-sm font-medium"
    />
  </div>
</template>