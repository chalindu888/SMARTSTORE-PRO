import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ProductDetailView from '@/views/ProductDetailView.vue'
import LoginView from '@/views/LoginView.vue'
import { useAuthStore } from '@/stores/authStore'
import CartView from '@/views/CartView.vue'
import SignupView from '@/views/SignupView.vue'
import AboutView from '@/views/AboutView.vue'
import ContactDetailView from '@/views/ContactDetailView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about-us',
      name: 'about-us',
      component: AboutView
    },
    {
      path: '/contact-detail',
      name: 'contact-detail',
      component: ContactDetailView
    },
    {
     path: '/signup',
     component: SignupView
    },
    {
      path: '/product/:id',
      name: 'productDetail',
      component: ProductDetailView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
   },
   {
  path: '/cart',
  name: 'cart',
  component: CartView,
  meta: { requiresAuth: true }
}
 
  ]
})
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router