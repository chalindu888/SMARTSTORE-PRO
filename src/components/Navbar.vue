<script setup lang="ts">
import { useCartStore } from '@/stores/cartStore'
const cart = useCartStore()
</script>

<div class="flex justify-end mb-4">
  <div class="bg-indigo-500 text-white px-4 py-2 rounded">
    🛒 {{ cart.totalItems }}
  </div>
</div>