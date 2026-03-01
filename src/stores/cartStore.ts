import { defineStore } from 'pinia'
import type { Product } from '@/types/product'

interface CartItem extends Product {
  quantity: number
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[]
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
      )
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

    removeFromCart(id: number) {
      this.items = this.items.filter(
        item => item.id !== id
      )
      this.saveCart()
    },

    saveCart() {
      localStorage.setItem('cart', JSON.stringify(this.items))
    },

    loadCart() {
      const stored = localStorage.getItem('cart')
      if (stored) {
        this.items = JSON.parse(stored)
      }
    }
  }
})