<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'
import Footer from '@/components/footer.vue'
import ShopInfoBar from '@/components/ShopInfoBar.vue'
import ToastContainer from '@/components/ToastContainer.vue'

const auth = useAuthStore()
const cart = useCartStore()

auth.loadUser()
cart.loadCart()
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-50 dark:bg-neutral-950 text-gray-900 dark:text-neutral-100 transition-colors duration-300">

    <Navbar />

    <main class="flex-grow">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <Footer />
    <ShopInfoBar />
    <ToastContainer />

  </div>
</template>

<style>
/* Global route transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>