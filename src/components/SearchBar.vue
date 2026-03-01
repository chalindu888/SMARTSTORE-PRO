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
  <input
    v-model="search"
    type="text"
    placeholder="Search products..."
    class="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
  />
</template>