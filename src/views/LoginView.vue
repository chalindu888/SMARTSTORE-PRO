<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()
const auth = useAuthStore()

function handleLogin() {
  if (!email.value || !password.value) {
    error.value = 'Please enter both email and password.'
    return
  }

  try {
    auth.login(email.value, password.value)
    router.push('/')
  } catch (err: any) {
    error.value = err.message
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black">
    <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow w-96">

      <h2 class="text-2xl font-bold mb-6 text-center dark:text-white">
        Login
      </h2>

      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="w-full mb-4 p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
      />

      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="w-full mb-4 p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
      />

      <p v-if="error" class="text-red-500 mb-4">{{ error }}</p>

      <button
        @click="handleLogin"
        class="w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600 transition duration-300"
      >
        Login
      </button>

      <p class="mt-4 text-center dark:text-white">
        Don't have an account?
        <router-link to="/signup" class="text-blue-500 hover:underline">
          Sign Up
        </router-link>
      </p>

    </div>
  </div>
</template>