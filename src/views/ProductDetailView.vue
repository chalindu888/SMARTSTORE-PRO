import { fetchProductById } from '@/services/productService'
import { useRoute } from 'vue-router'

const route = useRoute()
const product = ref<Product | null>(null)

onMounted(async () => {
  const id = Number(route.params.id)
  product.value = await fetchProductById(id)
})