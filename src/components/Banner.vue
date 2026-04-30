<script setup lang="ts">
import banner from '@/assets/banner.png'
</script>

<template>
  <div class="relative w-full mb-6">

    <img
      :src="banner"
      alt="Shop Banner"
      class="w-full h-[200px] md:h-[240px] object-cover rounded-xl"
    />

    <!-- Overlay -->
    <div class="absolute inset-0 bg-black/20 rounded-xl"></div>

  </div>
</template>