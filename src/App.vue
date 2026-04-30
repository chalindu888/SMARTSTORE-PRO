<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'

const auth = useAuthStore()
const cart = useCartStore()

auth.loadUser()
cart.loadCart()
</script>

<template>
  <div class="min-h-screen bg-gray-100 dark:bg-black">
    <Navbar />
    <router-view />
  </div>
</template>