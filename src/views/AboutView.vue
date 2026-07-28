<script setup lang="ts">
const highlights = [
  'Curated products chosen for everyday value and quality.',
  'Fast, secure checkout designed for a smooth shopping experience.',
  'Friendly support that helps customers before and after purchase.',
]
</script>

<template>
  <section class="min-h-screen px-6 py-16 md:py-24">
    <div class="max-w-4xl mx-auto">
      <div class="rounded-3xl bg-white/80 dark:bg-neutral-900/70 backdrop-blur-md border border-amber-100 dark:border-neutral-800 shadow-xl shadow-black/5 p-8 md:p-12">
        <p class="text-xs font-bold uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-400 mb-4">About Us</p>
        <h1 class="text-3xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white mb-5">
          Built to make online shopping feel simple, fast, and reliable.
        </h1>
        <p class="text-base md:text-lg text-gray-600 dark:text-neutral-300 leading-relaxed max-w-2xl">
          CKS SmartStore is a modern shopping destination focused on quality products, a clean buying flow, and practical support for every customer.
        </p>

        <div class="mt-8 grid gap-4 md:grid-cols-3">
          <div v-for="item in highlights" :key="item" class="rounded-2xl bg-amber-50/70 dark:bg-neutral-800/60 border border-amber-100 dark:border-neutral-700 p-5 text-sm text-gray-700 dark:text-neutral-300">
            {{ item }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>