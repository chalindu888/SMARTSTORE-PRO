import { defineStore } from 'pinia'
import type { Product } from '@/types/product'

export interface CartItem extends Product {
  quantity: number
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
    savedItems: [] as CartItem[],
    appliedPromo: null as string | null,
    shippingMethod: 'standard' as 'standard' | 'express' | 'overnight'
  }),

  getters: {
    totalPrice: (state) =>
      state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),

    totalItems: (state) =>
      state.items.reduce(
        (total, item) => total + item.quantity,
        0
      ),

    promoDiscount(): number {
      if (!this.appliedPromo) return 0
      const subtotal = this.totalPrice
      if (this.appliedPromo === 'WELCOME10') {
        return Number((subtotal * 0.1).toFixed(2))
      }
      if (this.appliedPromo === 'SMART20') {
        return Number((subtotal * 0.2).toFixed(2))
      }
      return 0 // FREESHIP discount is 0 on product price, applied to shipping cost
    },

    shippingCost(): number {
      const subtotal = this.totalPrice
      if (subtotal === 0) return 0
      
      const isFreeStandard = subtotal > 100 || this.appliedPromo === 'FREESHIP'
      
      if (this.shippingMethod === 'standard') {
        return isFreeStandard ? 0 : 5.00
      } else if (this.shippingMethod === 'express') {
        return 15.00
      } else if (this.shippingMethod === 'overnight') {
        return 25.00
      }
      return 0
    },

    estimatedTax(): number {
      const subtotalAfterDiscount = Math.max(0, this.totalPrice - this.promoDiscount)
      return Number((subtotalAfterDiscount * 0.08).toFixed(2))
    },

    orderTotal(): number {
      const subtotal = this.totalPrice
      if (subtotal === 0) return 0
      const final = subtotal - this.promoDiscount + this.shippingCost + this.estimatedTax
      return Number(final.toFixed(2))
    }
  },

  actions: {
    addToCart(product: Product) {
      const existing = this.items.find(
        item => item.id === product.id
      )

      if (existing) {
        existing.quantity++
      } else {
        this.items.push({ ...product, quantity: 1 })
      }

      this.saveCart()
    },

    updateQuantity(id: number, quantity: number) {
      const item = this.items.find(item => item.id === id)
      if (item) {
        item.quantity = Math.max(1, quantity)
        this.saveCart()
      }
    },

    removeFromCart(id: number) {
      this.items = this.items.filter(
        item => item.id !== id
      )
      this.saveCart()
    },

    saveForLater(id: number) {
      const index = this.items.findIndex(item => item.id === id)
      if (index !== -1) {
        const item = this.items.splice(index, 1)[0]
        if (item) {
          // Add to savedItems if not already there, otherwise update quantity
          const existingSaved = this.savedItems.find(s => s.id === id)
          if (existingSaved) {
            existingSaved.quantity += item.quantity
          } else {
            this.savedItems.push(item)
          }
          this.saveCart()
        }
      }
    },

    moveToCart(id: number) {
      const index = this.savedItems.findIndex(item => item.id === id)
      if (index !== -1) {
        const item = this.savedItems.splice(index, 1)[0]
        if (item) {
          const existingCart = this.items.find(c => c.id === id)
          if (existingCart) {
            existingCart.quantity += item.quantity
          } else {
            this.items.push(item)
          }
          this.saveCart()
        }
      }
    },

    removeFromSaved(id: number) {
      this.savedItems = this.savedItems.filter(item => item.id !== id)
      this.saveCart()
    },

    applyPromoCode(code: string): boolean {
      const cleanCode = code.trim().toUpperCase()
      if (['WELCOME10', 'SMART20', 'FREESHIP'].includes(cleanCode)) {
        this.appliedPromo = cleanCode
        return true
      }
      return false
    },

    removePromoCode() {
      this.appliedPromo = null
    },

    setShippingMethod(method: 'standard' | 'express' | 'overnight') {
      this.shippingMethod = method
    },

    clearCart() {
      this.items = []
      this.appliedPromo = null
      this.shippingMethod = 'standard'
      this.saveCart()
    },

    saveCart() {
      localStorage.setItem('cart', JSON.stringify(this.items))
      localStorage.setItem('saved_cart', JSON.stringify(this.savedItems))
    },

    loadCart() {
      const stored = localStorage.getItem('cart')
      if (stored) {
        this.items = JSON.parse(stored)
      }
      const savedStored = localStorage.getItem('saved_cart')
      if (savedStored) {
        this.savedItems = JSON.parse(savedStored)
      }
    }
  }
})