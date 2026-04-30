<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'
import { useRouter } from 'vue-router'
import DarkToggle from '@/components/DarkToggle.vue'

const auth = useAuthStore()
const cart = useCartStore()
const router = useRouter()

function logout() {
  auth.logout()
  router.push('/')
}
</script>

<template>
  <nav class="bg-white dark:bg-gray-900 shadow-md">
    <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

      <!-- Left Side Logo -->
      <div
        class="text-xl font-bold cursor-pointer dark:text-white"
        @click="$router.push('/')"
      >
        🛍 CKS SmartStore
      </div>

      <!-- Right Side Controls -->
      <div class="flex items-center gap-6">

        <!-- Cart Icon -->
        <div
          class="relative cursor-pointer dark:text-white"
          @click="$router.push('/cart')"
        >
          🛒
          <span
            v-if="cart.totalItems"
            class="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full"
          >
            {{ cart.totalItems }}
          </span>
        </div>

        <!-- Dark Mode Button -->
        <DarkToggle />

        <!-- Auth Section -->
        <div v-if="auth.isAuthenticated" class="flex items-center gap-3">
          <span class="dark:text-white">
            👤 {{ auth.user?.username }}
          </span>

          <button
            @click="logout"
            class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <router-link
          v-else
          to="/login"
          class="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
        >
          Login
        </router-link>
        <router-link
    to="/signup"
    class="bg-green-500 text-white px-4 py-2 rounded"
  >
    Sign Up
  </router-link>

      </div>
      

    </div>
  </nav>
</template>