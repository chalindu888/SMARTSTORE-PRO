<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToastStore } from '@/stores/toastStore'

const toast = useToastStore()
const router = useRouter()
const email = ref('')

function handleSubscribe() {
  if (!email.value || !email.value.includes('@')) {
    toast.error('Please enter a valid email address.')
    return
  }
  toast.success('Thank you for subscribing to our newsletter!')
  email.value = ''
}

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
  <footer class="bg-neutral-900 text-neutral-400 border-t border-neutral-800 transition-colors duration-300 font-sans">
    
    <!-- Top Footer: Brand, Subscription & Quick Links -->
    <div class="max-w-7xl mx-auto px-6 py-12 md:py-16">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
        
        <!-- Column 1: Brand & Newsletter (Span 5) -->
        <div class="md:col-span-5 flex flex-col justify-between">
          <div>
            <!-- Logo matching Navbar -->
            <div
              class="text-xl font-bold cursor-pointer text-white tracking-tight flex items-center gap-2.5 hover:opacity-90 transition duration-200 select-none mb-4"
              @click="router.push('/')"
            >
              <div class="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-md shadow-indigo-500/20">
                <svg class="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  <circle cx="12" cy="14" r="1.5" fill="currentColor" />
                </svg>
              </div>
              <span class="font-extrabold tracking-tight">
                CKS<span class="text-indigo-400 font-medium">SmartStore</span>
              </span>
            </div>
            
            <p class="text-sm text-neutral-400 max-w-sm mb-6 leading-relaxed">
              Your trusted online shopping destination for premium quality products, amazing deals, and secure checkout. Elevating your lifestyle, one item at a time.
            </p>
          </div>

          <!-- Newsletter Signup -->
          <div>
            <h4 class="text-xs font-bold uppercase tracking-wider text-neutral-200 mb-2.5">
              Subscribe to Newsletter
            </h4>
            <p class="text-xs text-neutral-500 mb-3">
              Get the latest updates on new arrivals, flash sales, and exclusive offers.
            </p>
            <form @submit.prevent="handleSubscribe" class="flex max-w-sm">
              <input
                v-model="email"
                type="email"
                placeholder="Enter your email address"
                class="w-full px-4 py-2.5 rounded-l-xl bg-neutral-800 border border-neutral-700/50 focus:outline-none focus:border-indigo-500/70 text-xs text-neutral-200 placeholder-neutral-500 transition"
                required
              />
              <button
                type="submit"
                class="bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-semibold text-xs px-4 py-2.5 rounded-r-xl transition-all duration-200 shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <!-- Column 2: Quick Navigation (Span 2) -->
        <div class="md:col-span-2">
          <h4 class="text-xs font-bold uppercase tracking-wider text-neutral-200 mb-4">
            Quick Links
          </h4>
          <ul class="space-y-2.5">
            <li>
              <router-link to="/" class="text-sm hover:text-white hover:translate-x-1 transition duration-200 inline-block">
                Home
              </router-link>
            </li>
            <li>
              <a href="#products" @click.prevent="scrollToProducts" class="text-sm hover:text-white hover:translate-x-1 transition duration-200 inline-block">
                Shop products
              </a>
            </li>
            <li>
              <router-link to="/cart" class="text-sm hover:text-white hover:translate-x-1 transition duration-200 inline-block">
                My Shopping Cart
              </router-link>
            </li>
            <li>
              <router-link to="/login" class="text-sm hover:text-white hover:translate-x-1 transition duration-200 inline-block">
                Customer Login
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Column 3: Customer Support (Span 2) -->
        <div class="md:col-span-2">
          <h4 class="text-xs font-bold uppercase tracking-wider text-neutral-200 mb-4">
            Customer Support
          </h4>
          <ul class="space-y-2.5">
            <li>
              <a href="#" class="text-sm hover:text-white hover:translate-x-1 transition duration-200 inline-block">Help Center</a>
            </li>
            <li>
              <a href="#" class="text-sm hover:text-white hover:translate-x-1 transition duration-200 inline-block">Easy Returns</a>
            </li>
            <li>
              <a href="#" class="text-sm hover:text-white hover:translate-x-1 transition duration-200 inline-block">Secure Payment</a>
            </li>
            <li>
              <a href="#" class="text-sm hover:text-white hover:translate-x-1 transition duration-200 inline-block">Privacy Policy</a>
            </li>
          </ul>
        </div>

        <!-- Column 4: Contact & Hours (Span 3) -->
        <div class="md:col-span-3">
          <h4 class="text-xs font-bold uppercase tracking-wider text-neutral-200 mb-4">
            Contact & Location
          </h4>
          
          <div class="space-y-3.5">
            <!-- Location -->
            <div class="flex items-start gap-3">
              <svg class="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p class="text-xs leading-relaxed text-neutral-400">
                Colombo, Sri Lanka
              </p>
            </div>

            <!-- Phone -->
            <div class="flex items-start gap-3">
              <svg class="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <p class="text-xs text-neutral-400">+94 77 123 4567</p>
            </div>

            <!-- Email -->
            <div class="flex items-start gap-3">
              <svg class="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p class="text-xs text-neutral-400">chalindu888@gmail.com</p>
            </div>

            <!-- Clock -->
            <div class="flex items-start gap-3 pt-1.5 border-t border-neutral-800/80">
              <svg class="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2" />
              </svg>
              <div>
                <h5 class="text-[10px] font-bold uppercase tracking-wider text-neutral-300">Opening Hours</h5>
                <p class="text-xs text-neutral-400 mt-0.5">Mon - Fri : 8.00 AM - 8.00 PM</p>
                <p class="text-xs text-neutral-400">Saturday : 9.00 AM - 6.00 PM</p>
                <p class="text-xs text-neutral-500">Sunday : Closed</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Bottom Footer: Copyright, Socials & Payment Partners -->
    <div class="bg-neutral-950/60 py-6 border-t border-neutral-800">
      <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        
        <!-- Copyright -->
        <p class="text-xs text-neutral-500 order-3 md:order-1">
          &copy; 2026 CKS SmartStore. All rights reserved. Created with absolute quality.
        </p>

        <!-- Social Media Icons -->
        <div class="flex items-center gap-4 order-1 md:order-2">
          <!-- X (Twitter) -->
          <a href="#" class="text-neutral-500 hover:text-white transition duration-200" aria-label="X (formerly Twitter)">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <!-- Instagram -->
          <a href="#" class="text-neutral-500 hover:text-white transition duration-200" aria-label="Instagram">
            <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
          <!-- LinkedIn -->
          <a href="#" class="text-neutral-500 hover:text-white transition duration-200" aria-label="LinkedIn">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </a>
          <!-- GitHub -->
          <a href="#" class="text-neutral-500 hover:text-white transition duration-200" aria-label="GitHub">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
          </a>
        </div>

        <!-- Payment Partners -->
        <div class="flex items-center gap-2.5 order-2 md:order-3">
          <!-- Visa -->
          <svg class="h-6 w-9 text-neutral-500 fill-current hover:text-white transition" viewBox="0 0 36 24" aria-label="Visa">
            <rect width="36" height="24" rx="4" fill="currentColor" fill-opacity="0.1" />
            <path d="M12.7 16l2-7.3h1.8L14.5 16h-1.8zm6.5-7.3c-.4-.2-.9-.3-1.5-.3-1.6 0-2.8.9-2.8 2.1 0 .9.8 1.4 1.4 1.7.6.3.8.5.8.8 0 .4-.5.6-1 .6-.6 0-1.1-.1-1.6-.4l-.2-.1-.3 1.7c.5.2 1.4.4 2.2.4 1.7 0 2.8-.8 2.8-2.1 0-.7-.4-1.2-1.3-1.7-.5-.3-.9-.5-.9-.8 0-.3.3-.5.8-.5.5 0 .9.1 1.3.3l.2.1.4-1.7zm4.2 4.4c.2-.6 1.1-3 1.1-3s.2-.5.3-.8l.2.8s.5 2.4.6 3h-2.2zm2.9 2.9h1.7L26 8.7h-1.5c-.3 0-.6.2-.7.5l-3 7.1h1.9l.4-1.1h2.3l.2 1.1zM8.5 8.7L6.8 13.9c-.2-.5-.9-2.7-.9-2.7-.3-1-.9-1.9-1.9-2.4l1.8 7.2H7.7l2.8-7.3H8.5z" />
          </svg>
          <!-- Mastercard -->
          <svg class="h-6 w-9 text-neutral-500 fill-current hover:text-white transition" viewBox="0 0 36 24" aria-label="Mastercard">
            <rect width="36" height="24" rx="4" fill="currentColor" fill-opacity="0.1" />
            <circle cx="15.5" cy="12" r="5" />
            <circle cx="20.5" cy="12" r="5" />
          </svg>
          <!-- PayPal -->
          <svg class="h-6 w-9 text-neutral-500 fill-current hover:text-white transition" viewBox="0 0 36 24" aria-label="PayPal">
            <rect width="36" height="24" rx="4" fill="currentColor" fill-opacity="0.1" />
            <path d="M12.5 16.5l1.8-7.5H17.2c1.4 0 2.3.7 2.1 2-.2 1.2-1.2 1.9-2.6 1.9h-1.6l-.9 3.6H12.5zm4.3-5.2c.4 0 .7-.2.8-.6.1-.4-.1-.7-.5-.7h-1.2l-.3 1.3h1.2z" />
            <path d="M14.5 17.5l1.8-7.5H19.2c1.4 0 2.3.7 2.1 2-.2 1.2-1.2 1.9-2.6 1.9h-1.6l-.9 3.6H14.5z" opacity="0.6" />
          </svg>
          <!-- Apple Pay -->
          <svg class="h-6 w-9 text-neutral-500 fill-current hover:text-white transition" viewBox="0 0 36 24" aria-label="Apple Pay">
            <rect width="36" height="24" rx="4" fill="currentColor" fill-opacity="0.1" />
            <path d="M14.5 14.5c.2-.5.5-.8.8-1.2.3-.3.7-.5 1-.6v-1.1h-1v1.1h-1v1h1.2zm2.5-4.5c0-.6.3-1 .8-1.4.5-.4 1.1-.6 1.8-.6.5 0 1 .1 1.4.3.4.2.7.5.9.9l-.8.6c-.2-.3-.4-.4-.6-.5-.2-.1-.5-.2-.8-.2-.4 0-.7.1-1 .4-.3.3-.4.6-.4 1s.1.7.4 1c.3.3.6.4 1 .4.3 0 .6-.1.8-.2.2-.1.4-.2.6-.5l.8.6c-.2.4-.5.7-.9.9-.4.2-.9.3-1.4.3-.7 0-1.3-.2-1.8-.6-.5-.4-.8-.8-.8-1.4z" />
          </svg>
        </div>

      </div>
    </div>

  </footer>
</template>