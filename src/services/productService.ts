import type { ProductResponse, Product } from '@/types/product'

const BASE_URL = 'https://dummyjson.com'

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(`${BASE_URL}/products`)

  if (!response.ok) {
    throw new Error('Failed to fetch products')
  }

  const data: ProductResponse = await response.json()

  return data.products
}
export async function fetchProductById(id: number): Promise<Product> {
  const response = await fetch(`${BASE_URL}/products/${id}`)

  if (!response.ok) {
    throw new Error('Failed to fetch product')
  }

  const data: Product = await response.json()

  return data
}