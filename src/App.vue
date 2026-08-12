<script setup lang="ts">
import CartDrawer from './components/CartDrawer.vue';
import AdminOrdersModal from './components/AdminOrdersModal.vue';
import ProductDetailModal from './components/ProductDetailModal.vue';
import OrderTrackingModal from './components/OrderTrackingModal.vue';
import FloatingContact from './components/FloatingContact.vue';
import NotificationModal from './components/NotificationModal.vue';
import { useNotification } from './composables/useNotification';
import { useModalsStore } from './stores/modals';

const { notification, closeNotification, handleConfirm } = useNotification();
const modals = useModalsStore();
</script>

<template>
  <div class="min-h-screen bg-white text-slate-800 font-sans selection:bg-red-600 selection:text-white">
    <RouterView />

    <!-- Global Modals (mounted once at app level) -->
    <CartDrawer :isOpen="modals.isCartOpen" @close="modals.isCartOpen = false" />
    <AdminOrdersModal
      :isOpen="modals.isAdminOpen"
      @close="modals.isAdminOpen = false"
      @product-updated="modals.triggerRefresh"
    />
    <ProductDetailModal
      :product="modals.selectedProduct"
      :isOpen="modals.isDetailOpen"
      @close="modals.isDetailOpen = false"
      @open-cart="modals.isCartOpen = true"
    />
    <OrderTrackingModal :isOpen="modals.isTrackingOpen" @close="modals.isTrackingOpen = false" />
    <FloatingContact
      @open-tracking="modals.isTrackingOpen = true"
      @open-cart="modals.isCartOpen = true"
    />
    <NotificationModal :notification="notification" @close="closeNotification" @confirm="handleConfirm" />
  </div>
</template>