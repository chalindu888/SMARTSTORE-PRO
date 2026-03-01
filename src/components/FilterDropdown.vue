<script setup lang="ts">
const props = defineProps<{
  categories: string[]
}>()

const emit = defineEmits<{
  (e: 'filter', value: string): void
}>()
</script>

<template>
  <select
    @change="emit('filter', ($event.target as HTMLSelectElement).value)"
    class="p-2 border rounded 
           dark:bg-gray-700 dark:text-white"
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
</template>