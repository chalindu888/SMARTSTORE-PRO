<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const username = ref('')
const email = ref('')
const password = ref('')
const error = ref('')

function handleSignup() {
  try {
    auth.signup({
      username: username.value,
      email: email.value,
      password: password.value
    })

    router.push('/') // go to home
  } catch (err: any) {
    error.value = err.message
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-black">
    <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow w-96">

      <h2 class="text-2xl font-bold mb-6 text-center dark:text-white">
        Sign Up
      </h2>

      <input
        v-model="username"
        type="text"
        placeholder="Username"
        class="w-full mb-4 p-2 border rounded"
      />

      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="w-full mb-4 p-2 border rounded"
      />

      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="w-full mb-4 p-2 border rounded"
      />

      <p v-if="error" class="text-red-500 mb-4">{{ error }}</p>

      <button
        @click="handleSignup"
        class="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
      >
        Sign Up
      </button>

      <p class="mt-4 text-center dark:text-white">
        Already have an account?
        <router-link to="/login" class="text-blue-500">
          Login
        </router-link>
      </p>

    </div>
  </div>
</template>