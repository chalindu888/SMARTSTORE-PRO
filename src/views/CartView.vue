<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCartStore } from '@/stores/cartStore'
import { useToastStore } from '@/stores/toastStore'
import { fetchProducts } from '@/services/productService'
import type { Product } from '@/types/product'

const cart = useCartStore()
const toast = useToastStore()

// State
const currentStep = ref(1) // 1: Review, 2: Shipping, 3: Payment, 4: Success
const promoInput = ref('')
const loadingRecommendations = ref(true)
const recommendations = ref<Product[]>([])
const generatedOrderId = ref('')

// Shipping Form State
const shippingForm = ref({
  fullName: '',
  address: '',
  city: '',
  postalCode: '',
  country: 'United States'
})

// Payment Form State
const paymentForm = ref({
  cardName: '',
  cardNumber: '',
  cardExpiry: '',
  cardCvv: ''
})
const isCardFlipped = ref(false)

// Load recommendations
onMounted(async () => {
  try {
    const allProducts = await fetchProducts()
    // Select products that are not currently in the cart
    recommendations.value = allProducts
      .filter(p => !cart.items.some(item => item.id === p.id))
      .slice(0, 4)
  } catch (err) {
    console.error('Failed to load recommendations', err)
  } finally {
    loadingRecommendations.value = false
  }
})

// Computed Properties
const cartItems = computed(() => cart.items)
const savedItems = computed(() => cart.savedItems)

const detectedCardType = computed(() => {
  const num = paymentForm.value.cardNumber.replace(/\D/g, '')
  if (num.startsWith('4')) return 'Visa'
  if (num.startsWith('5')) return 'Mastercard'
  if (num.startsWith('3')) return 'Amex'
  return 'Credit Card'
})

// Methods
function handleQuantityChange(id: number, qty: number) {
  cart.updateQuantity(id, qty)
  toast.info('Cart quantity updated')
}

function handleRemove(id: number, title: string) {
  cart.removeFromCart(id)
  toast.warning(`Removed "${title}" from cart`)
}

function handleSaveForLater(id: number, title: string) {
  cart.saveForLater(id)
  toast.success(`Saved "${title}" for later`)
}

function handleMoveToCart(id: number, title: string) {
  cart.moveToCart(id)
  toast.success(`Moved "${title}" back to cart`)
}

function handleRemoveSaved(id: number, title: string) {
  cart.removeFromSaved(id)
  toast.warning(`Removed "${title}" from wishlist`)
}

function handleApplyPromo() {
  if (!promoInput.value) {
    toast.error('Please enter a coupon code')
    return
  }
  const success = cart.applyPromoCode(promoInput.value)
  if (success) {
    toast.success(`Coupon "${cart.appliedPromo}" applied!`)
    promoInput.value = ''
  } else {
    toast.error('Invalid or expired coupon code')
  }
}

function handleRemovePromo() {
  const code = cart.appliedPromo
  cart.removePromoCode()
  toast.info(`Coupon "${code}" removed`)
}

function autoFillPromo(code: string) {
  promoInput.value = code
  handleApplyPromo()
}

// Simulated Autofill for quick testing
function fillShippingInfo() {
  shippingForm.value = {
    fullName: 'John Doe',
    address: '123 SmartStore Way, Suite 404',
    city: 'San Francisco',
    postalCode: '94103',
    country: 'United States'
  }
  toast.info('Shipping details autofilled')
}

function fillPaymentInfo() {
  paymentForm.value = {
    cardName: 'JOHN DOE',
    cardNumber: '4111 2222 3333 4444',
    cardExpiry: '12/28',
    cardCvv: '123'
  }
  toast.info('Payment details autofilled')
}

// Shipping Validation
const isShippingValid = computed(() => {
  const f = shippingForm.value
  return !!(f.fullName.trim() && f.address.trim() && f.city.trim() && f.postalCode.trim())
})

// Payment Validation
const isPaymentValid = computed(() => {
  const p = paymentForm.value
  const num = p.cardNumber.replace(/\D/g, '')
  const expiry = p.cardExpiry.replace(/\D/g, '')
  const cvv = p.cardCvv.replace(/\D/g, '')
  return !!(p.cardName.trim() && num.length >= 15 && expiry.length === 4 && cvv.length >= 3)
})

function nextStep() {
  if (currentStep.value === 1) {
    if (cart.items.length === 0) {
      toast.error('Your cart is empty!')
      return
    }
    currentStep.value = 2
  } else if (currentStep.value === 2) {
    if (!isShippingValid.value) {
      toast.error('Please fill in all shipping details')
      return
    }
    currentStep.value = 3
  } else if (currentStep.value === 3) {
    if (!isPaymentValid.value) {
      toast.error('Please fill in valid payment information')
      return
    }
    // Generate Random Order ID
    generatedOrderId.value = 'ORD-' + Math.floor(100000 + Math.random() * 900000)
    cart.clearCart()
    currentStep.value = 4
    toast.success('Order placed successfully!')
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

function formatCardNumber(e: Event) {
  const input = e.target as HTMLInputElement
  const value = input.value.replace(/\D/g, '')
  let formatted = ''
  for (let i = 0; i < value.length && i < 16; i++) {
    if (i > 0 && i % 4 === 0) formatted += ' '
    formatted += value[i]
  }
  paymentForm.value.cardNumber = formatted
}

function formatCardExpiry(e: Event) {
  const input = e.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '')
  if (value.length > 4) value = value.slice(0, 4)
  let formatted = ''
  if (value.length > 2) {
    formatted = value.slice(0, 2) + '/' + value.slice(2)
  } else {
    formatted = value
  }
  paymentForm.value.cardExpiry = formatted
}

function formatCardCvv(e: Event) {
  const input = e.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '')
  if (value.length > 4) value = value.slice(0, 4)
  paymentForm.value.cardCvv = value
}

function addRecommendedToCart(product: Product) {
  cart.addToCart(product)
  toast.success(`Added "${product.title}" to cart`)
  recommendations.value = recommendations.value.filter(p => p.id !== product.id)
}
</script>

<template>
  <div class="min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
    <div class="max-w-7xl mx-auto">
      
      <!-- Stepper / Wizard Tracker -->
      <div class="mb-10 max-w-3xl mx-auto" v-if="currentStep < 4">
        <div class="flex items-center justify-between relative">
          <!-- Connector Line -->
          <div class="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-200 dark:bg-neutral-800 -translate-y-1/2 z-0"></div>
          <div 
            class="absolute left-0 top-1/2 h-0.5 bg-indigo-500 -translate-y-1/2 z-0 transition-all duration-500"
            :style="{ width: ((currentStep - 1) / 2) * 100 + '%' }"
          ></div>

          <!-- Step 1 -->
          <div class="z-10 flex flex-col items-center">
            <div 
              class="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 shadow-md"
              :class="currentStep >= 1 ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 dark:ring-indigo-950/50' : 'bg-white dark:bg-neutral-800 text-gray-500 border border-gray-300 dark:border-neutral-700'"
            >
              <span v-if="currentStep > 1">✓</span>
              <span v-else>1</span>
            </div>
            <span class="text-xs font-semibold mt-2 text-gray-600 dark:text-neutral-400">Review</span>
          </div>

          <!-- Step 2 -->
          <div class="z-10 flex flex-col items-center">
            <div 
              class="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 shadow-md"
              :class="currentStep >= 2 ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 dark:ring-indigo-950/50' : 'bg-white dark:bg-neutral-800 text-gray-500 border border-gray-300 dark:border-neutral-700'"
            >
              <span v-if="currentStep > 2">✓</span>
              <span v-else>2</span>
            </div>
            <span class="text-xs font-semibold mt-2 text-gray-600 dark:text-neutral-400">Shipping</span>
          </div>

          <!-- Step 3 -->
          <div class="z-10 flex flex-col items-center">
            <div 
              class="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 shadow-md"
              :class="currentStep >= 3 ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 dark:ring-indigo-950/50' : 'bg-white dark:bg-neutral-800 text-gray-500 border border-gray-300 dark:border-neutral-700'"
            >
              3
            </div>
            <span class="text-xs font-semibold mt-2 text-gray-600 dark:text-neutral-400">Payment</span>
          </div>
        </div>
      </div>

      <!-- Main Layout Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Left Side Content Column (Col 8) -->
        <div class="lg:col-span-8 space-y-8">

          <!-- STEP 1: REVIEW ITEMS -->
          <div v-if="currentStep === 1" class="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 p-6 shadow-sm">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                 Your Cart 
                <span class="text-sm font-normal px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  {{ cart.totalItems }} {{ cart.totalItems === 1 ? 'item' : 'items' }}
                </span>
              </h2>
              <button 
                v-if="cartItems.length" 
                @click="cart.clearCart(); toast.info('Cart cleared')"
                class="text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 font-medium flex items-center gap-1 transition"
              >
                Clear Cart
              </button>
            </div>

            <!-- Empty Cart State -->
            <div v-if="!cartItems.length" class="text-center py-16 px-4">
              <div class="text-6xl mb-4">🛒</div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h3>
              <p class="text-gray-500 dark:text-neutral-400 mb-6 max-w-sm mx-auto">
                Looks like you haven't added anything to your cart yet. Explore our awesome collection and find something you love!
              </p>
              <router-link 
                to="/"
                class="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all shadow-md"
              >
                Start Shopping
              </router-link>
            </div>

            <!-- Cart Items List with Transitions -->
            <div v-else class="divide-y divide-gray-100 dark:divide-neutral-800">
              <TransitionGroup name="list" tag="div" class="space-y-4">
                <div 
                  v-for="item in cartItems" 
                  :key="item.id"
                  class="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-4 first:pt-0 last:pb-0 group transition-all"
                >
                  <!-- Thumbnail -->
                  <div class="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 dark:bg-neutral-800 flex-shrink-0 border border-gray-100 dark:border-neutral-800">
                    <img :src="item.thumbnail" :alt="item.title" class="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                  </div>

                  <!-- Product details -->
                  <div class="flex-grow min-w-0">
                    <div class="flex justify-between items-start gap-2">
                      <h3 class="text-base font-bold text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                        {{ item.title }}
                      </h3>
                    </div>
                    <p class="text-xs text-gray-400 dark:text-neutral-500 mt-0.5 truncate">
                      {{ item.brand }} · {{ item.category }}
                    </p>
                    <div class="flex items-center gap-4 mt-2">
                      <button 
                        @click="handleSaveForLater(item.id, item.title)"
                        class="text-xs text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition"
                      >
                        Save for later
                      </button>
                      <button 
                        @click="handleRemove(item.id, item.title)"
                        class="text-xs text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 font-medium transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <!-- Quantity selector & Price -->
                  <div class="flex items-center sm:justify-end gap-6 w-full sm:w-auto">
                    <!-- Quantity controller -->
                    <div class="flex items-center border border-gray-200 dark:border-neutral-700 rounded-lg overflow-hidden bg-white dark:bg-neutral-800">
                      <button 
                        @click="handleQuantityChange(item.id, item.quantity - 1)" 
                        :disabled="item.quantity <= 1"
                        class="px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-neutral-700 text-gray-500 disabled:opacity-30 disabled:hover:bg-transparent transition font-bold"
                      >
                        -
                      </button>
                      <span class="px-3 py-1 text-sm font-semibold text-gray-800 dark:text-neutral-200 w-8 text-center bg-gray-50/50 dark:bg-neutral-800/50 border-x border-gray-100 dark:border-neutral-700">
                        {{ item.quantity }}
                      </span>
                      <button 
                        @click="handleQuantityChange(item.id, item.quantity + 1)" 
                        class="px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-neutral-700 text-gray-500 transition font-bold"
                      >
                        +
                      </button>
                    </div>

                    <!-- Item Subtotal -->
                    <div class="text-right ml-auto sm:ml-0 min-w-[70px]">
                      <span class="block text-sm font-bold text-gray-900 dark:text-white">
                        ${{ (item.price * item.quantity).toFixed(2) }}
                      </span>
                      <span class="block text-[11px] text-gray-400 dark:text-neutral-500" v-if="item.quantity > 1">
                        ${{ item.price }} each
                      </span>
                    </div>
                  </div>
                </div>
              </TransitionGroup>
            </div>
          </div>


          <!-- STEP 2: SHIPPING DETAILS -->
          <div v-if="currentStep === 2" class="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 p-6 shadow-sm animate-fade-in">
            <div class="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-neutral-800 pb-4">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                 Shipping Details
              </h2>
              <button 
                @click="fillShippingInfo"
                class="text-xs bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-lg font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900 transition"
              >
                Autofill Details
              </button>
            </div>

            <!-- Shipping address inputs -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="md:col-span-2">
                <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-neutral-400 mb-2">Full Name</label>
                <input 
                  v-model="shippingForm.fullName"
                  type="text" 
                  placeholder="e.g. John Doe"
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-neutral-700 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>

              <div class="md:col-span-2">
                <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-neutral-400 mb-2">Street Address</label>
                <input 
                  v-model="shippingForm.address"
                  type="text" 
                  placeholder="e.g. 123 Main St, Apt 4"
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-neutral-700 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-neutral-400 mb-2">City</label>
                <input 
                  v-model="shippingForm.city"
                  type="text" 
                  placeholder="e.g. San Francisco"
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-neutral-700 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-neutral-400 mb-2">Postal / Zip Code</label>
                <input 
                  v-model="shippingForm.postalCode"
                  type="text" 
                  placeholder="e.g. 94103"
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-neutral-700 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>

              <div class="md:col-span-2">
                <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-neutral-400 mb-2">Country</label>
                <select 
                  v-model="shippingForm.country"
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                >
                  <option>United States</option>
                  <option>Canada</option>
                  <option>United Kingdom</option>
                  <option>Sri Lanka</option>
                  <option>Australia</option>
                  <option>Germany</option>
                </select>
              </div>
            </div>

            <!-- Shipping Speed Selector -->
            <div class="mt-8 border-t border-gray-100 dark:border-neutral-800 pt-6">
              <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-neutral-400 mb-4">Choose Shipping Method</label>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- Standard -->
                <label 
                  class="flex items-center justify-between p-4 rounded-xl border cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800 transition"
                  :class="cart.shippingMethod === 'standard' ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300' : 'border-gray-200 dark:border-neutral-700 bg-transparent'"
                >
                  <div class="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="shipping_speed" 
                      value="standard" 
                      :checked="cart.shippingMethod === 'standard'"
                      @change="cart.setShippingMethod('standard')"
                      class="text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                    />
                    <div>
                      <span class="block text-sm font-bold">Standard</span>
                      <span class="block text-xs text-gray-400 dark:text-neutral-500">3 - 6 business days</span>
                    </div>
                  </div>
                  <span class="text-sm font-bold">
                    {{ (cart.totalPrice > 100 || cart.appliedPromo === 'FREESHIP') ? 'Free' : '$5.00' }}
                  </span>
                </label>

                <!-- Express -->
                <label 
                  class="flex items-center justify-between p-4 rounded-xl border cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800 transition"
                  :class="cart.shippingMethod === 'express' ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300' : 'border-gray-200 dark:border-neutral-700 bg-transparent'"
                >
                  <div class="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="shipping_speed" 
                      value="express" 
                      :checked="cart.shippingMethod === 'express'"
                      @change="cart.setShippingMethod('express')"
                      class="text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                    />
                    <div>
                      <span class="block text-sm font-bold">Express</span>
                      <span class="block text-xs text-gray-400 dark:text-neutral-500">2 - 3 business days</span>
                    </div>
                  </div>
                  <span class="text-sm font-bold">$15.00</span>
                </label>

                <!-- Overnight -->
                <label 
                  class="flex items-center justify-between p-4 rounded-xl border cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800 transition"
                  :class="cart.shippingMethod === 'overnight' ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300' : 'border-gray-200 dark:border-neutral-700 bg-transparent'"
                >
                  <div class="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="shipping_speed" 
                      value="overnight" 
                      :checked="cart.shippingMethod === 'overnight'"
                      @change="cart.setShippingMethod('overnight')"
                      class="text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                    />
                    <div>
                      <span class="block text-sm font-bold">Overnight</span>
                      <span class="block text-xs text-gray-400 dark:text-neutral-500">Next business day</span>
                    </div>
                  </div>
                  <span class="text-sm font-bold">$25.00</span>
                </label>
              </div>
            </div>
          </div>


          <!-- STEP 3: PAYMENT & CREDIT CARD PREVIEW -->
          <div v-if="currentStep === 3" class="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 p-6 shadow-sm animate-fade-in">
            <div class="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-neutral-800 pb-4">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                💳 Secure Payment
              </h2>
              <button 
                @click="fillPaymentInfo"
                class="text-xs bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-lg font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900 transition"
              >
                Autofill Payment
              </button>
            </div>

            <!-- Virtual Credit Card Design -->
            <div class="flex justify-center mb-8 perspective-1000">
              <div 
                class="w-full max-w-sm h-48 rounded-2xl p-6 text-white bg-gradient-to-br from-indigo-700 via-purple-600 to-indigo-900 relative transition-transform duration-700 transform-style-3d shadow-xl"
                :class="{ 'rotate-y-180': isCardFlipped }"
              >
                <!-- FRONT OF CARD -->
                <div class="absolute inset-0 p-6 flex flex-col justify-between backface-hidden">
                  <div class="flex justify-between items-start">
                    <div>
                      <span class="text-[9px] uppercase tracking-widest text-indigo-200">CKS SmartStore Pro</span>
                      <span class="block text-lg font-extrabold tracking-wide mt-0.5">PayPortal</span>
                    </div>
                    <!-- Chip -->
                    <div class="w-10 h-8 rounded bg-yellow-400/80 backdrop-blur-sm border border-yellow-300/40 relative overflow-hidden">
                      <div class="absolute top-1/2 left-0 right-0 h-[1px] bg-yellow-600/50"></div>
                      <div class="absolute top-0 bottom-0 left-1/2 w-[1px] bg-yellow-600/50"></div>
                    </div>
                  </div>

                  <div>
                    <!-- Card Number -->
                    <div class="text-xl font-bold tracking-widest mb-4 font-mono">
                      {{ paymentForm.cardNumber || '•••• •••• •••• ••••' }}
                    </div>
                    <div class="flex justify-between items-end">
                      <div>
                        <span class="block text-[8px] uppercase tracking-wider text-indigo-200">Card Holder</span>
                        <span class="block text-xs font-bold tracking-wide uppercase truncate max-w-[150px]">
                          {{ paymentForm.cardName || 'Your Name Here' }}
                        </span>
                      </div>
                      <div class="text-right">
                        <span class="block text-[8px] uppercase tracking-wider text-indigo-200">Expires</span>
                        <span class="block text-xs font-bold tracking-wide font-mono">
                          {{ paymentForm.cardExpiry || 'MM/YY' }}
                        </span>
                      </div>
                      <div class="text-right font-extrabold italic text-sm text-indigo-200">
                        {{ detectedCardType }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- BACK OF CARD -->
                <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-950 to-neutral-900 text-white flex flex-col justify-between py-6 backface-hidden rotate-y-180">
                  <div class="w-full h-10 bg-neutral-900 mt-2"></div>
                  
                  <div class="px-6 flex justify-between items-center">
                    <div class="w-3/4 h-8 bg-gray-200/20 backdrop-blur-sm rounded flex items-center justify-end px-3">
                      <span class="text-[8px] text-gray-400 uppercase tracking-widest font-bold">Secure CVV</span>
                    </div>
                    <!-- CVV Display -->
                    <div class="bg-yellow-400 text-neutral-900 font-mono font-bold px-3 py-1.5 rounded text-sm tracking-widest">
                      {{ paymentForm.cardCvv || '•••' }}
                    </div>
                  </div>

                  <div class="px-6 flex justify-between items-center text-[8px] text-indigo-300">
                    <span>SmartStore Pro Encrypted Gateways</span>
                    <span>PCI-DSS</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Card Inputs -->
            <div class="space-y-4">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-neutral-400 mb-2">Cardholder Name</label>
                <input 
                  v-model="paymentForm.cardName"
                  type="text" 
                  placeholder="e.g. JOHN DOE"
                  @focus="isCardFlipped = false"
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-neutral-700 bg-transparent text-gray-900 dark:text-white uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-neutral-400 mb-2">Card Number</label>
                <input 
                  v-model="paymentForm.cardNumber"
                  type="text" 
                  placeholder="e.g. 4111 2222 3333 4444"
                  @input="formatCardNumber"
                  @focus="isCardFlipped = false"
                  maxlength="19"
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-neutral-700 bg-transparent text-gray-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-neutral-400 mb-2">Expiry Date</label>
                  <input 
                    v-model="paymentForm.cardExpiry"
                    type="text" 
                    placeholder="MM/YY"
                    @input="formatCardExpiry"
                    @focus="isCardFlipped = false"
                    maxlength="5"
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-neutral-700 bg-transparent text-gray-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-neutral-400 mb-2">CVV Code</label>
                  <input 
                    v-model="paymentForm.cardCvv"
                    type="password" 
                    placeholder="•••"
                    @input="formatCardCvv"
                    @focus="isCardFlipped = true"
                    @blur="isCardFlipped = false"
                    maxlength="4"
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-neutral-700 bg-transparent text-gray-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  />
                </div>
              </div>
            </div>
          </div>


          <!-- STEP 4: ORDER SUCCESS SCREEN -->
          <div v-if="currentStep === 4" class="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 p-8 shadow-sm text-center max-w-2xl mx-auto animate-bounce-in">
            <div class="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-emerald-100 dark:border-emerald-900/50">
              <svg class="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Order Confirmed!</h2>
            <p class="text-sm text-gray-500 dark:text-neutral-400 mb-6">
              Thank you for shopping with us! We have received your order and are preparing it for shipment.
            </p>

            <!-- Order Specs Card -->
            <div class="bg-gray-50 dark:bg-neutral-800/50 border border-gray-100 dark:border-neutral-800 rounded-xl p-5 mb-8 text-left space-y-3 font-medium">
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-500 dark:text-neutral-400">Order ID:</span>
                <span class="font-bold text-gray-800 dark:text-neutral-200">{{ generatedOrderId }}</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-500 dark:text-neutral-400">Estimated Delivery:</span>
                <span class="font-bold text-gray-800 dark:text-neutral-200">3 - 5 business days</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-500 dark:text-neutral-400">Shipping Address:</span>
                <span class="font-bold text-gray-800 dark:text-neutral-200 truncate max-w-[200px]" :title="shippingForm.address">
                  {{ shippingForm.address }}, {{ shippingForm.city }}
                </span>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
              <router-link 
                to="/"
                class="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md transition hover:scale-105 active:scale-95 duration-200"
              >
                Continue Shopping
              </router-link>
              <button 
                @click="currentStep = 1; generatedOrderId = ''"
                class="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl border border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-neutral-300 font-medium hover:bg-gray-50 dark:hover:bg-neutral-800 transition"
              >
                Reset Cart demo
              </button>
            </div>
          </div>


          <!-- WISHLIST / SAVE FOR LATER -->
          <div v-if="savedItems.length && currentStep < 4" class="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 p-6 shadow-sm mt-8">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              ⭐ Saved for Later
              <span class="text-xs font-normal px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400">
                {{ savedItems.length }}
              </span>
            </h3>

            <div class="divide-y divide-gray-100 dark:divide-neutral-800">
              <TransitionGroup name="list" tag="div" class="space-y-4">
                <div 
                  v-for="item in savedItems" 
                  :key="item.id"
                  class="flex items-center gap-4 py-4 first:pt-0 last:pb-0 group"
                >
                  <img :src="item.thumbnail" :alt="item.title" class="w-16 h-16 rounded-lg object-cover border border-gray-100 dark:border-neutral-800" />
                  
                  <div class="flex-grow min-w-0">
                    <h4 class="text-sm font-bold text-gray-900 dark:text-white truncate">
                      {{ item.title }}
                    </h4>
                    <p class="text-xs text-indigo-600 font-bold mt-1">
                      ${{ item.price }}
                    </p>
                    <div class="flex items-center gap-3 mt-1.5">
                      <button 
                        @click="handleMoveToCart(item.id, item.title)"
                        class="text-[11px] text-green-500 hover:text-green-600 font-bold transition"
                      >
                        Move to Cart
                      </button>
                      <button 
                        @click="handleRemoveSaved(item.id, item.title)"
                        class="text-[11px] text-red-500 hover:text-red-600 font-bold transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </TransitionGroup>
            </div>
          </div>


          <!-- PRODUCT RECOMMENDATIONS -->
          <div v-if="currentStep < 4" class="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 p-6 shadow-sm mt-8">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
               You Might Also Like
            </h3>

            <div v-if="loadingRecommendations" class="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
              <div v-for="i in 4" :key="i" class="space-y-3">
                <div class="bg-gray-200 dark:bg-neutral-800 h-28 rounded-xl"></div>
                <div class="bg-gray-200 dark:bg-neutral-800 h-4 rounded w-3/4"></div>
                <div class="bg-gray-200 dark:bg-neutral-800 h-4 rounded w-1/2"></div>
              </div>
            </div>

            <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div 
                v-for="product in recommendations" 
                :key="product.id"
                class="bg-gray-50 dark:bg-neutral-800/30 border border-gray-100 dark:border-neutral-800/80 rounded-xl p-3 flex flex-col justify-between hover:shadow-md transition group"
              >
                <div>
                  <div class="h-24 w-full rounded-lg overflow-hidden bg-white dark:bg-neutral-800 mb-2.5">
                    <img :src="product.thumbnail" :alt="product.title" class="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                  </div>
                  <h4 class="text-xs font-bold text-gray-900 dark:text-white truncate" :title="product.title">
                    {{ product.title }}
                  </h4>
                  <span class="text-xs text-indigo-600 font-extrabold mt-1 block">
                    ${{ product.price }}
                  </span>
                </div>
                <button 
                  @click="addRecommendedToCart(product)"
                  class="mt-3 w-full bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold py-1.5 rounded-lg transition-transform active:scale-95"
                >
                  + Add to Cart
                </button>
              </div>
            </div>
          </div>

        </div> <!-- End Col 8 -->

        <!-- Right Side: Order Summary & Checkout Stepper Controls (Col 4) -->
        <div class="lg:col-span-4" v-if="currentStep < 4">
          <div class="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 p-6 shadow-sm space-y-6 sticky top-6">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-neutral-800 pb-3">Order Summary</h3>

            <!-- Price Computations -->
            <div class="space-y-3.5 text-sm font-medium">
              <div class="flex justify-between items-center text-gray-500 dark:text-neutral-400">
                <span>Subtotal</span>
                <span class="text-gray-900 dark:text-white">${{ cart.totalPrice.toFixed(2) }}</span>
              </div>

              <!-- Promo Code savings -->
              <div v-if="cart.promoDiscount > 0" class="flex justify-between items-center text-emerald-600 dark:text-emerald-400">
                <span class="flex items-center gap-1.5">
                  🏷️ Promo discount ({{ cart.appliedPromo }})
                  <button @click="handleRemovePromo" class="text-[10px] hover:text-red-500 transition">✕</button>
                </span>
                <span>-${{ cart.promoDiscount.toFixed(2) }}</span>
              </div>

              <!-- Shipping -->
              <div class="flex justify-between items-center text-gray-500 dark:text-neutral-400">
                <span class="flex items-center gap-1">
                  Shipping
                  <span class="text-[10px] text-indigo-500 capitalize" v-if="currentStep >= 2">({{ cart.shippingMethod }})</span>
                </span>
                <span class="text-gray-900 dark:text-white">
                  {{ cart.shippingCost === 0 ? 'Free' : `$${cart.shippingCost.toFixed(2)}` }}
                </span>
              </div>

              <!-- Tax -->
              <div class="flex justify-between items-center text-gray-500 dark:text-neutral-400">
                <span>Estimated Tax (8%)</span>
                <span class="text-gray-900 dark:text-white">${{ cart.estimatedTax.toFixed(2) }}</span>
              </div>

              <div class="h-[1px] bg-gray-100 dark:bg-neutral-800 my-2"></div>

              <!-- Total -->
              <div class="flex justify-between items-center text-base font-extrabold">
                <span class="text-gray-900 dark:text-white">Grand Total</span>
                <span class="text-indigo-600 dark:text-indigo-400 text-lg">${{ cart.orderTotal.toFixed(2) }}</span>
              </div>
            </div>

            <!-- PROMO CODES SECTION -->
            <div v-if="currentStep === 1" class="border-t border-gray-100 dark:border-neutral-800 pt-5 space-y-4">
              <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-neutral-400">Apply Promo Code</label>
              
              <div class="flex gap-2">
                <input 
                  v-model="promoInput"
                  type="text" 
                  placeholder="e.g. SMART20"
                  class="flex-grow px-3 py-2 border border-gray-200 dark:border-neutral-700 bg-transparent text-sm rounded-lg text-gray-900 dark:text-white uppercase focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button 
                  @click="handleApplyPromo"
                  class="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 rounded-lg text-sm font-bold transition"
                >
                  Apply
                </button>
              </div>

              <!-- Sample Promo Badges -->
              <div class="space-y-1.5">
                <span class="block text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Tap to apply:</span>
                <div class="flex flex-wrap gap-2">
                  <button 
                    @click="autoFillPromo('WELCOME10')"
                    class="text-[10px] bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900 px-2 py-1 rounded-md hover:bg-emerald-100 transition"
                  >
                    WELCOME10 (-10%)
                  </button>
                  <button 
                    @click="autoFillPromo('SMART20')"
                    class="text-[10px] bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900 px-2 py-1 rounded-md hover:bg-emerald-100 transition"
                  >
                    SMART20 (-20%)
                  </button>
                  <button 
                    @click="autoFillPromo('FREESHIP')"
                    class="text-[10px] bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900 px-2 py-1 rounded-md hover:bg-emerald-100 transition"
                  >
                    FREESHIP (Free Std)
                  </button>
                </div>
              </div>
            </div>

            <!-- NEXT STEP / CHEKOUT BUTTONS -->
            <div class="space-y-3 pt-2">
              <button 
                @click="nextStep"
                :disabled="currentStep === 1 && !cartItems.length"
                class="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:scale-100 text-white rounded-xl font-bold transition hover:scale-105 active:scale-95 shadow-md flex items-center justify-center gap-2"
              >
                <span v-if="currentStep === 1">Proceed to Checkout</span>
                <span v-else-if="currentStep === 2">Proceed to Payment</span>
                <span v-else-if="currentStep === 3">Pay ${{ cart.orderTotal.toFixed(2) }}</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>

              <button 
                v-if="currentStep > 1"
                @click="prevStep"
                class="w-full py-3.5 border border-gray-200 dark:border-neutral-800 text-gray-700 dark:text-neutral-300 rounded-xl font-bold transition hover:bg-gray-50 dark:hover:bg-neutral-800 text-sm"
              >
                Go Back
              </button>
            </div>

          </div>
        </div> <!-- End Col 4 -->

      </div> <!-- End Grid -->
    </div>
  </div>
</template>

<style scoped>
/* List transitions (enter/leave) */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.list-move {
  transition: transform 0.4s ease;
}

/* Animations */
.animate-fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-bounce-in {
  animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounceIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Credit Card Flip styles */
.perspective-1000 {
  perspective: 1000px;
}
.transform-style-3d {
  transform-style: preserve-3d;
}
.backface-hidden {
  backface-visibility: hidden;
}
.rotate-y-180 {
  transform: rotateY(180deg);
}
</style>