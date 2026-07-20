import { defineStore } from 'pinia'

export interface Toast {
  id: number
  message: string
  type: 'success' | 'info' | 'warning' | 'error'
  duration?: number
}

export const useToastStore = defineStore('toast', {
  state: () => ({
    toasts: [] as Toast[]
  }),

  actions: {
    add(message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success', duration = 3000) {
      const id = Date.now() + Math.random()
      const toast: Toast = { id, message, type, duration }
      this.toasts.push(toast)

      if (duration > 0) {
        setTimeout(() => {
          this.remove(id)
        }, duration)
      }
    },

    remove(id: number) {
      this.toasts = this.toasts.filter(t => t.id !== id)
    },

    success(message: string, duration = 3000) {
      this.add(message, 'success', duration)
    },

    info(message: string, duration = 3000) {
      this.add(message, 'info', duration)
    },

    warning(message: string, duration = 3000) {
      this.add(message, 'warning', duration)
    },

    error(message: string, duration = 3000) {
      this.add(message, 'error', duration)
    }
  }
})
