<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'
import Footer from '@/components/Footer.vue'
import ShopInfoBar from '@/components/ShopInfoBar.vue'
const auth = useAuthStore()
const cart = useCartStore()

auth.loadUser()
cart.loadCart()
</script>

<template>
  <div class="min-h-screen flex flex-col">

    <Navbar />

    <main class="flex-grow">
      <router-view />
    </main>

    <Footer />
    <ShopInfoBar />

  </div>
</template>