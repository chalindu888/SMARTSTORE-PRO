<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'
import { useRouter } from 'vue-router'
import DarkToggle from '@/components/DarkToggle.vue'

const auth = useAuthStore()
const cart = useCartStore()
const router = useRouter()

const animateCart = ref(false)
const showDropdown = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

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

function toggleDropdown(e: Event) {
  e.stopPropagation()
  showDropdown.value = !showDropdown.value
}

function closeDropdown() {
  showDropdown.value = false
}

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    showDropdown.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
})

function scrollToProducts() {
  if (router.currentRoute.value.path !== '/') {
    router.push('/').then(() => {
      setTimeout(() => {
        const el = document.getElementById('products-section')
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 300)
    })
  } else {
    const el = document.getElementById('products-section')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<template>
  <nav class="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-neutral-900/80 border-b border-gray-200/50 dark:border-neutral-800/50 transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-6 py-3.5 flex justify-between items-center">

      <!-- Left Side Logo -->
      <div
        class="text-xl font-bold cursor-pointer text-gray-900 dark:text-white tracking-tight flex items-center gap-2.5 hover:opacity-90 transition duration-200 select-none"
        @click="router.push('/')"
      >
        <div class="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-md shadow-indigo-500/20">
          <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            <circle cx="12" cy="14" r="1.5" fill="currentColor" />
          </svg>
        </div>
        <span class="font-extrabold tracking-tight">
          CKS<span class="text-indigo-600 dark:text-indigo-400 font-medium">SmartStore</span>
        </span>
      </div>

      <!-- Center Links (Desktop only) -->
      <div class="hidden md:flex items-center gap-8">
        <router-link
          to="/"
          class="text-sm font-semibold text-gray-600 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-indigo-600 dark:after:bg-indigo-400 after:transition-all after:duration-300 hover:after:w-full"
          active-class="text-indigo-600 dark:text-indigo-400 after:w-full"
        >
          Home
        </router-link>
        <a
          href="#products"
          @click.prevent="scrollToProducts"
          class="text-sm font-semibold text-gray-600 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-indigo-600 dark:after:bg-indigo-400 after:transition-all after:duration-300 hover:after:w-full"
        >
          Shop
        </a>
        <router-link
          to="/cart"
          class="text-sm font-semibold text-gray-600 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-indigo-600 dark:after:bg-indigo-400 after:transition-all after:duration-300 hover:after:w-full"
          active-class="text-indigo-600 dark:text-indigo-400 after:w-full"
        >
          Cart
        </router-link>
      </div>

      <!-- Right Side Controls -->
      <div class="flex items-center gap-4 sm:gap-6">

        <!-- Cart Icon -->
        <div
          class="relative cursor-pointer text-gray-600 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-indigo-400 p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-800/80 transition-all duration-200 active:scale-95"
          @click="router.push('/cart')"
          :class="{ 'animate-wiggle': animateCart }"
        >
          <svg class="w-5.5 h-5.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span
            v-if="cart.totalItems"
            class="absolute top-1 right-1 bg-indigo-600 text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white dark:border-neutral-900 transition-transform duration-300"
            :class="{ 'scale-125 bg-rose-500': animateCart }"
          >
            {{ cart.totalItems }}
          </span>
        </div>

        <!-- Dark Mode Button -->
        <DarkToggle />

        <!-- Auth Section -->
        <div v-if="auth.isAuthenticated" ref="dropdownRef" class="relative">
          <button
            @click="toggleDropdown"
            class="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-800/80 transition duration-200 focus:outline-none"
          >
            <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 text-white text-sm font-bold flex items-center justify-center uppercase shadow-sm">
              {{ auth.user?.username?.charAt(0) || 'U' }}
            </div>
            <span class="hidden sm:inline text-sm font-semibold text-gray-700 dark:text-neutral-300">
              {{ auth.user?.username }}
            </span>
            <svg class="w-4 h-4 text-gray-400 dark:text-neutral-500 transition-transform duration-200" :class="{ 'rotate-180': showDropdown }" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Dropdown Panel -->
          <transition name="dropdown">
            <div
              v-if="showDropdown"
              class="absolute right-0 mt-2 w-56 rounded-2xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border border-gray-200/50 dark:border-neutral-800/50 shadow-xl py-2 z-50 transform origin-top-right transition-all"
            >
              <div class="px-4 py-2.5 border-b border-gray-100 dark:border-neutral-800/60">
                <p class="text-xs text-gray-400 dark:text-neutral-500">Signed in as</p>
                <p class="text-sm font-bold text-gray-800 dark:text-neutral-200 truncate">{{ auth.user?.username }}</p>
              </div>
              
              <div class="p-1">
                <router-link
                  to="/cart"
                  @click="closeDropdown"
                  class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-gray-600 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800/60 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                >
                  🛒 View Cart
                </router-link>
              </div>

              <div class="p-1 border-t border-gray-100 dark:border-neutral-800/60">
                <button
                  @click="() => { logout(); closeDropdown(); }"
                  class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition text-left"
                >
                  ↩ Sign Out
                </button>
              </div>
            </div>
          </transition>
        </div>

        <div v-else class="flex items-center gap-3">
          <router-link
            to="/login"
            class="text-sm font-semibold text-gray-600 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition duration-200 px-3 py-2 rounded-xl"
          >
            Login
          </router-link>
          <router-link
            to="/signup"
            class="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition duration-200 active:scale-95 shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20"
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

/* Dropdown Transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-8px);
}
</style>