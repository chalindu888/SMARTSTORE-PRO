import { defineStore } from 'pinia'

interface User {
  username: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null
  }),

  getters: {
    isAuthenticated: (state) => !!state.user
  },

  actions: {
    login(username: string) {
      this.user = { username }
      localStorage.setItem('user', JSON.stringify(this.user))
    },

    logout() {
      this.user = null
      localStorage.removeItem('user')
    },

    loadUser() {
      const stored = localStorage.getItem('user')
      if (stored) {
        this.user = JSON.parse(stored)
      }
    }
  }
})