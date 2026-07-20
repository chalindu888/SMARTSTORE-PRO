<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { fetchProductById } from '@/services/productService'
import type { Product } from '@/types/product'
import { useCartStore } from '@/stores/cartStore'
import { useToastStore } from '@/stores/toastStore'

const route = useRoute()
const cart = useCartStore()
const toast = useToastStore()

const product = ref<Product | null>(null)
const loading = ref(true)
const activeImage = ref('')
const quantity = ref(1)
const activeTab = ref<'desc' | 'specs' | 'reviews'>('desc')

onMounted(async () => {
  try {
    const id = Number(route.params.id)
    product.value = await fetchProductById(id)
    if (product.value) {
      activeImage.value = product.value.thumbnail || product.value.images[0] || ''
    }
  } catch (err) {
    console.error(err)
    toast.error('Failed to load product details')
  } finally {
    loading.value = false
  }
})

// Simulated reviews based on rating
const simulatedReviews = computed(() => {
  if (!product.value) return []
  const score = Math.round(product.value.rating)
  return [
    {
      id: 1,
      author: 'David L.',
      rating: score,
      date: 'July 18, 2026',
      content: `Extremely happy with this purchase. The quality is outstanding and it matches the description perfectly. Fast shipping too!`
    },
    {
      id: 2,
      author: 'Sophia K.',
      rating: Math.max(1, score - 1),
      date: 'July 12, 2026',
      content: `Good value for the price. Works exactly as expected. The brand really represents quality.`
    }
  ]
})

function addToCart() {
  if (!product.value) return
  
  for (let i = 0; i < quantity.value; i++) {
    cart.addToCart(product.value)
  }
  
  toast.success(`Added ${quantity.value}x "${product.value.title}" to cart!`)
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:from-neutral-950 dark:to-neutral-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
      
      <!-- Back button -->
      <router-link 
        to="/" 
        class="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-8 transition group"
      >
        <span class="transform group-hover:-translate-x-1 transition duration-200">←</span> Back to Catalog
      </router-link>

      <!-- Loading skeleton -->
      <div v-if="loading" class="bg-white dark:bg-neutral-900 rounded-3xl p-8 border border-gray-100 dark:border-neutral-800 shadow-sm animate-pulse grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-gray-200 dark:bg-neutral-800 rounded-2xl h-80"></div>
        <div class="space-y-4">
          <div class="h-8 bg-gray-200 dark:bg-neutral-800 rounded w-3/4"></div>
          <div class="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-1/4"></div>
          <div class="h-20 bg-gray-200 dark:bg-neutral-800 rounded"></div>
          <div class="h-10 bg-gray-200 dark:bg-neutral-800 rounded w-1/2 mt-6"></div>
        </div>
      </div>

      <!-- Main Product Card -->
      <div v-else-if="product" class="bg-white dark:bg-neutral-900 rounded-3xl border border-gray-100 dark:border-neutral-800 p-6 md:p-8 shadow-sm animate-slide-up">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          <!-- Image Gallery side -->
          <div class="space-y-4">
            <!-- Active Image -->
            <div class="aspect-video w-full rounded-2xl overflow-hidden bg-gray-50 dark:bg-neutral-800 border border-gray-100 dark:border-neutral-800 flex items-center justify-center">
              <img :src="activeImage" :alt="product.title" class="w-full h-full object-cover object-center max-h-[380px]" />
            </div>

            <!-- Thumbnail Carousel -->
            <div v-if="product.images && product.images.length > 1" class="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
              <button
                v-for="(img, idx) in product.images"
                :key="idx"
                @click="activeImage = img"
                class="w-20 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition hover:scale-105 active:scale-95 duration-200"
                :class="activeImage === img ? 'border-indigo-600 ring-2 ring-indigo-100 dark:ring-indigo-950/50' : 'border-gray-200 dark:border-neutral-800 opacity-70 hover:opacity-100'"
              >
                <img :src="img" :alt="`${product.title} view ${idx + 1}`" class="w-full h-full object-cover" />
              </button>
            </div>
          </div>

          <!-- Product Details side -->
          <div class="flex flex-col justify-between space-y-6">
            <div>
              <!-- Badges -->
              <div class="flex flex-wrap items-center gap-2 mb-4">
                <span class="px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wider uppercase bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                  {{ product.category }}
                </span>
                <span 
                  class="px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wider uppercase"
                  :class="product.stock > 10 ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400'"
                >
                  {{ product.stock > 10 ? 'In Stock' : `Only ${product.stock} left!` }}
                </span>
              </div>

              <!-- Title & Brand -->
              <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">
                {{ product.title }}
              </h1>
              <p class="text-sm font-semibold text-gray-500 dark:text-neutral-400 mt-1">
                Brand: <span class="text-gray-900 dark:text-neutral-200">{{ product.brand }}</span>
              </p>

              <!-- Star Rating -->
              <div class="flex items-center gap-1 mt-3">
                <div class="flex text-amber-500">
                  <span v-for="star in 5" :key="star" class="text-lg">
                    {{ star <= Math.round(product.rating) ? '★' : '☆' }}
                  </span>
                </div>
                <span class="text-xs font-semibold text-gray-500 dark:text-neutral-400 bg-gray-50 dark:bg-neutral-800 px-2 py-0.5 rounded ml-2">
                  {{ product.rating }}
                </span>
              </div>

              <!-- Pricing Section -->
              <div class="mt-6 flex items-baseline gap-3">
                <span class="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                  ${{ product.price }}
                </span>
                <span 
                  v-if="product.discountPercentage" 
                  class="text-sm text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-lg"
                >
                  {{ product.discountPercentage }}% OFF
                </span>
              </div>
            </div>

            <!-- Actions block -->
            <div class="border-t border-b border-gray-100 dark:border-neutral-800 py-6 my-4 space-y-4">
              <label class="block text-xs font-extrabold uppercase tracking-wider text-gray-500 dark:text-neutral-400">Select Quantity</label>
              
              <div class="flex items-center gap-4">
                <div class="flex items-center border border-gray-200 dark:border-neutral-700 rounded-xl overflow-hidden bg-white dark:bg-neutral-800">
                  <button 
                    @click="quantity = Math.max(1, quantity - 1)"
                    :disabled="quantity <= 1"
                    class="px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-neutral-700 text-gray-500 disabled:opacity-30 transition font-bold"
                  >
                    -
                  </button>
                  <span class="px-4 py-2 text-base font-bold text-gray-800 dark:text-neutral-200 w-12 text-center bg-gray-50/30 dark:bg-neutral-800/30 border-x border-gray-100 dark:border-neutral-700">
                    {{ quantity }}
                  </span>
                  <button 
                    @click="quantity++"
                    class="px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-neutral-700 text-gray-500 transition font-bold"
                  >
                    +
                  </button>
                </div>

                <button 
                  @click="addToCart"
                  class="flex-grow py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition hover:scale-105 active:scale-95 duration-200 shadow-md text-sm flex items-center justify-center gap-2"
                >
                  🛒 Add to Cart · ${{ (product.price * quantity).toFixed(2) }}
                </button>
              </div>
            </div>

            <!-- Services Quick info -->
            <div class="grid grid-cols-2 gap-4 text-xs font-semibold text-gray-500 dark:text-neutral-400">
              <div class="flex items-center gap-2">
                <span>🛡️</span> 1 Year Warranty
              </div>
              <div class="flex items-center gap-2">
                <span>🔄</span> 30 Days Free Return
              </div>
              <div class="flex items-center gap-2">
                <span>⚡</span> Express Shipping Available
              </div>
              <div class="flex items-center gap-2">
                <span>💳</span> Secure Payments Only
              </div>
            </div>

          </div>
        </div>

        <!-- Information Tabs (Description / Specifications / Customer Reviews) -->
        <div class="mt-12 border-t border-gray-100 dark:border-neutral-800 pt-8">
          <!-- Tab Headers -->
          <div class="flex border-b border-gray-100 dark:border-neutral-800 gap-6">
            <button 
              @click="activeTab = 'desc'"
              class="pb-4 text-sm font-bold border-b-2 transition duration-200"
              :class="activeTab === 'desc' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-400 hover:text-gray-600'"
            >
              Description
            </button>
            <button 
              @click="activeTab = 'specs'"
              class="pb-4 text-sm font-bold border-b-2 transition duration-200"
              :class="activeTab === 'specs' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-400 hover:text-gray-600'"
            >
              Specifications
            </button>
            <button 
              @click="activeTab = 'reviews'"
              class="pb-4 text-sm font-bold border-b-2 transition duration-200"
              :class="activeTab === 'reviews' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-400 hover:text-gray-600'"
            >
              Reviews ({{ simulatedReviews.length }})
            </button>
          </div>

          <!-- Tab Content -->
          <div class="py-6 min-h-[150px]">
            
            <!-- Description -->
            <div v-if="activeTab === 'desc'" class="text-sm leading-relaxed text-gray-600 dark:text-neutral-300">
              <p>{{ product.description }}</p>
              <p class="mt-4 text-gray-400">Manufactured with premium raw materials and rigorous durability testing to ensure the best possible experience. Perfect for both professional use and everyday needs.</p>
            </div>

            <!-- Specifications -->
            <div v-else-if="activeTab === 'specs'" class="max-w-md">
              <div class="divide-y divide-gray-100 dark:divide-neutral-800 text-sm font-semibold">
                <div class="flex justify-between py-2.5">
                  <span class="text-gray-400">Brand</span>
                  <span class="text-gray-900 dark:text-neutral-200">{{ product.brand }}</span>
                </div>
                <div class="flex justify-between py-2.5">
                  <span class="text-gray-400">Category</span>
                  <span class="text-gray-900 dark:text-neutral-200">{{ product.category }}</span>
                </div>
                <div class="flex justify-between py-2.5">
                  <span class="text-gray-400">Stock Availability</span>
                  <span class="text-gray-900 dark:text-neutral-200">{{ product.stock }} units</span>
                </div>
                <div class="flex justify-between py-2.5">
                  <span class="text-gray-400">Initial Discount</span>
                  <span class="text-gray-900 dark:text-neutral-200">{{ product.discountPercentage }}%</span>
                </div>
                <div class="flex justify-between py-2.5">
                  <span class="text-gray-400">Customer Rating</span>
                  <span class="text-gray-900 dark:text-neutral-200">{{ product.rating }} / 5.0</span>
                </div>
              </div>
            </div>

            <!-- Customer Reviews -->
            <div v-else-if="activeTab === 'reviews'" class="space-y-6">
              <div 
                v-for="review in simulatedReviews" 
                :key="review.id"
                class="bg-gray-50 dark:bg-neutral-800/20 border border-gray-100 dark:border-neutral-800/80 rounded-2xl p-5"
              >
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <h5 class="text-sm font-bold text-gray-800 dark:text-neutral-200">{{ review.author }}</h5>
                    <div class="flex text-amber-400 text-xs mt-0.5">
                      <span v-for="star in 5" :key="star">{{ star <= review.rating ? '★' : '☆' }}</span>
                    </div>
                  </div>
                  <span class="text-xs text-gray-400">{{ review.date }}</span>
                </div>
                <p class="text-sm text-gray-600 dark:text-neutral-300">{{ review.content }}</p>
              </div>
            </div>

          </div>
        </div>

      </div>

      <!-- Not Found State -->
      <div v-else class="text-center py-16">
        <h3 class="text-xl font-bold dark:text-white">Product not found.</h3>
        <router-link to="/" class="mt-4 inline-block bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold">
          Return Home
        </router-link>
      </div>

    </div>
  </div>
</template>

<style scoped>
.animate-slide-up {
  animation: slideUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scrollbar support for thumbnails */
.scrollbar-thin::-webkit-scrollbar {
  height: 4px;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgb(224, 224, 224);
  border-radius: 20px;
}
.dark .scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgb(64, 64, 64);
}
</style>