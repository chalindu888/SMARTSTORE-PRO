<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const username = ref('')
const router = useRouter()
const auth = useAuthStore()

function handleLogin() {
  if (!username.value) return

  auth.login(username.value)
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black">
    <div class="bg-white dark:bg-gray-800 p-6 rounded shadow w-80">

      <h2 class="text-xl font-bold mb-4 dark:text-white">
        Login
      </h2>

      <input
        v-model="username"
        placeholder="Enter username"
        class="w-full p-2 border rounded mb-4 dark:bg-gray-700 dark:text-white"
      />

      <button
        @click="handleLogin"
        class="w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600"
      >
        Login
      </button>

    </div>
  </div>
</template>