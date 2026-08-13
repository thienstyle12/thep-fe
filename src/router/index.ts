import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductsView from '../views/ProductsView.vue'
import CalculatorView from '../views/CalculatorView.vue'
import AboutView from '../views/AboutView.vue'
import ContactView from '../views/ContactView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/products',
      name: 'products',
      component: ProductsView
    },
    {
      path: '/calculator',
      name: 'calculator',
      component: CalculatorView
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    },
    {
      path: '/contact',
      name: 'contact',
      component: ContactView
    }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
