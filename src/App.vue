<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'

const auth = useAuthStore()
auth.loadUser()
</script>

<template>
  <router-view />
</template>