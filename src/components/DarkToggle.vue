<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isDark = ref(false)

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')

  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark')
    isDark.value = true
  }
})

function toggleTheme() {
  isDark.value = !isDark.value

  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}
</script>

<template>
  <button
    @click="toggleTheme"
    class="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200/80 dark:bg-neutral-800 dark:hover:bg-neutral-700/80 border border-gray-200/40 dark:border-neutral-700/30 text-gray-700 dark:text-neutral-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 hover:scale-105 active:scale-95 shadow-sm"
    aria-label="Toggle Dark Mode"
  >
    <div class="relative w-5 h-5 flex items-center justify-center">
      <!-- Sun Icon (visible in light mode) -->
      <svg
        class="absolute w-5 h-5 transform transition-all duration-500 ease-out"
        :class="{ 'rotate-0 scale-100 opacity-100': !isDark, 'rotate-[90deg] scale-50 opacity-0': isDark }"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="4" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </svg>

      <!-- Moon Icon (visible in dark mode) -->
      <svg
        class="absolute w-5 h-5 transform transition-all duration-500 ease-out"
        :class="{ 'rotate-[-90deg] scale-50 opacity-0': !isDark, 'rotate-0 scale-100 opacity-100': isDark }"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    </div>
  </button>
</template>