import { defineStore } from 'pinia'

interface User {
  username: string
  email: string
  password: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    users: [] as User[],
    isAuthenticated: false
  }),

  actions: {
    loadUser() {
      const savedUser = localStorage.getItem('user')
      const savedUsers = localStorage.getItem('users')

      if (savedUser) {
        this.user = JSON.parse(savedUser)
        this.isAuthenticated = true
      }

      if (savedUsers) {
        this.users = JSON.parse(savedUsers)
      }
    },

    signup(user: User) {
      // Check if email already exists
      const exists = this.users.find(u => u.email === user.email)

      if (exists) {
        throw new Error('User already exists')
      }

      this.users.push(user)
      localStorage.setItem('users', JSON.stringify(this.users))

      // Auto login after signup
      this.user = user
      this.isAuthenticated = true
      localStorage.setItem('user', JSON.stringify(user))
    },

    login(email: string, password: string) {
      const user = this.users.find(
        u => u.email === email && u.password === password
      )

      if (!user) {
        throw new Error('Invalid credentials')
      }

      this.user = user
      this.isAuthenticated = true
      localStorage.setItem('user', JSON.stringify(user))
    },

    logout() {
      this.user = null
      this.isAuthenticated = false
      localStorage.removeItem('user')
    }
  }
})