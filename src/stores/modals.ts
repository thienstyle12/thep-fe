import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Product } from '../types'

export const useModalsStore = defineStore('modals', () => {
  const isCartOpen = ref(false)
  const isAdminOpen = ref(false)
  const isTrackingOpen = ref(false)
  const isDetailOpen = ref(false)
  const selectedProduct = ref<Product | null>(null)
  const productsRefreshKey = ref(0)

  const openDetail = (product: Product) => {
    selectedProduct.value = product
    isDetailOpen.value = true
  }

  const triggerRefresh = () => {
    productsRefreshKey.value++
  }

  return {
    isCartOpen, isAdminOpen, isTrackingOpen,
    isDetailOpen, selectedProduct,
    productsRefreshKey,
    openDetail, triggerRefresh
  }
})
