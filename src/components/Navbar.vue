<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'
import { useRouter } from 'vue-router'
import DarkToggle from '@/components/DarkToggle.vue'

const auth = useAuthStore()
const cart = useCartStore()
const router = useRouter()

const animateCart = ref(false)

watch(() => cart.totalItems, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    animateCart.value = true
    setTimeout(() => {
      animateCart.value = false
    }, 500)
  }
})

function logout() {
  auth.logout()
  router.push('/')
}
</script>

<template>
  <nav class="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-gray-100 dark:border-neutral-800 sticky top-0 z-40 transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

      <!-- Left Side Logo -->
      <div
        class="text-xl font-black cursor-pointer dark:text-white tracking-tight flex items-center gap-2 hover:opacity-90 transition active:scale-95 select-none"
        @click="$router.push('/')"
      >
        <span class="bg-indigo-600 text-white px-2.5 py-1.5 rounded-xl text-lg shadow-md font-mono">CKS</span>
        SmartStore
      </div>

      <!-- Right Side Controls -->
      <div class="flex items-center gap-6">

        <!-- Cart Icon -->
        <div
          class="relative cursor-pointer text-gray-700 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-indigo-400 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-800 transition-all duration-200 active:scale-90"
          @click="$router.push('/cart')"
          :class="{ 'animate-wiggle': animateCart }"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span
            v-if="cart.totalItems"
            class="absolute top-1.5 right-1.5 bg-indigo-600 text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white dark:border-neutral-900 transition-transform duration-300"
            :class="{ 'scale-125 bg-pink-500': animateCart }"
          >
            {{ cart.totalItems }}
          </span>
        </div>

        <!-- Dark Mode Button -->
        <DarkToggle />

        <!-- Auth Section -->
        <div v-if="auth.isAuthenticated" class="flex items-center gap-4">
          <span class="text-sm font-bold text-gray-600 dark:text-neutral-300 flex items-center gap-1.5 bg-gray-50 dark:bg-neutral-800 px-3 py-1.5 rounded-xl">
            👤 {{ auth.user?.username }}
          </span>

          <button
            @click="logout"
            class="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition duration-200 active:scale-95 shadow-sm"
          >
            Logout
          </button>
        </div>

        <div v-else class="flex items-center gap-3">
          <router-link
            to="/login"
            class="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition duration-200 active:scale-95 shadow-sm"
          >
            Login
          </router-link>
          <router-link
            to="/signup"
            class="border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 text-gray-700 dark:text-neutral-300 text-xs font-bold px-4 py-2 rounded-xl transition duration-200 active:scale-95"
          >
            Sign Up
          </router-link>
        </div>

      </div>
    </div>
  </nav>
</template>

<style scoped>
@keyframes wiggle {
  0%, 100% { transform: scale(1); }
  25% { transform: scale(1.15) rotate(-5deg); }
  50% { transform: scale(1.15) rotate(5deg); }
  75% { transform: scale(1.15) rotate(-3deg); }
}
.animate-wiggle {
  animation: wiggle 0.5s ease-in-out;
}
</style>