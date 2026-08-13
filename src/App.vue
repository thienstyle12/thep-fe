<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import api from './api';
import Navbar from './components/Navbar.vue';
import CartDrawer from './components/CartDrawer.vue';
import AdminOrdersModal from './components/AdminOrdersModal.vue';
import ProductDetailModal from './components/ProductDetailModal.vue';
import OrderTrackingModal from './components/OrderTrackingModal.vue';
import FloatingContact from './components/FloatingContact.vue';
import NotificationModal from './components/NotificationModal.vue';
import VietTinLogo from './components/VietTinLogo.vue';
import LiveOrderTicker from './components/LiveOrderTicker.vue';
import BackToTop from './components/BackToTop.vue';
import { useNotification } from './composables/useNotification';
import { useCartStore } from './stores/cart';
import type { Product } from './types';
import { MapPin, Phone, CheckCircle2 } from 'lucide-vue-next';

const route = useRoute();
const { notification, closeNotification, handleConfirm } = useNotification();
const cartStore = useCartStore();

const isCartOpen = ref(false);
const isAdminOpen = ref(false);
const isTrackingOpen = ref(false);
const isDetailOpen = ref(false);
const selectedProduct = ref<Product | null>(null);
const scrollProgress = ref(0);
let globalObserver: IntersectionObserver | null = null;

const handleScroll = () => {
  const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (totalHeight > 0) {
    scrollProgress.value = (window.scrollY / totalHeight) * 100;
  }
};

const initGlobalObserver = () => {
  if (globalObserver) globalObserver.disconnect();
  globalObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    },
    { threshold: 0.05 }
  );

  document.querySelectorAll('.reveal-on-scroll, .banner-zoom-scroll, .banner-thut-tho, .banner-thut-tho-right').forEach((el) => {
    globalObserver?.observe(el);
  });
};

const refreshScrollObserver = () => {
  nextTick(() => {
    initGlobalObserver();
    // Kích hoạt hiển thị tức thì cho tất cả phần tử nằm trong tầm mắt khi chuyển tab
    document.querySelectorAll('.reveal-on-scroll, .banner-zoom-scroll, .banner-thut-tho, .banner-thut-tho-right').forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 200) {
        el.classList.add('is-visible');
      }
    });
  });
};

watch(() => route.path, () => {
  refreshScrollObserver();
});

const handleOpenProductDetail = (e: Event) => {
  const customEvent = e as CustomEvent<Product>;
  if (customEvent.detail) {
    selectedProduct.value = customEvent.detail;
    isDetailOpen.value = true;
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('open-product-detail', handleOpenProductDetail);
  refreshScrollObserver();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('open-product-detail', handleOpenProductDetail);
  if (globalObserver) globalObserver.disconnect();
});
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-[#004d40] selection:text-white flex flex-col justify-between relative">
    <div>
      <!-- Top Navigation Header -->
      <Navbar 
        @open-cart="isCartOpen = true" 
        @open-admin="isAdminOpen = true" 
        @open-tracking="isTrackingOpen = true" 
      />

      <!-- Main Dynamic View (Separate Pages via Vue Router) -->
      <main>
        <router-view />
      </main>
    </div>

    <!-- Add To Cart Global Floating Toast Notification -->
    <Transition name="toast">
      <div v-if="cartStore.showToast && cartStore.lastAddedProduct" 
           class="fixed bottom-6 right-6 z-50 bg-[#004d40] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-teal-400/40 flex items-center gap-3 font-semibold text-xs animate-bounce pointer-events-none">
        <CheckCircle2 class="w-5 h-5 text-amber-400 flex-shrink-0" />
        <div>
          <span class="text-amber-300 font-bold block">✓ Đã Thêm Vào Giỏ Báo Giá!</span>
          <span class="text-white text-[11px] font-medium leading-tight block">{{ cartStore.lastAddedProduct.name }}</span>
        </div>
      </div>
    </Transition>

    <!-- Global Company Footer -->
    <footer id="about" class="bg-slate-900 text-white py-12 px-6 mt-12 border-t border-slate-800">
      <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <div class="inline-flex items-center bg-white px-3.5 py-1.5 rounded-2xl shadow-md border border-slate-200 mb-3">
            <VietTinLogo size="md" />
          </div>
          <p class="text-slate-400 text-xs leading-relaxed mb-3 font-normal">
            Chuyên phân phối Thép Xây Dựng, Dây buộc 1 ly, Thép rút đen, Lưới thép trát tường. Đầy đủ chứng chỉ CO/CQ.
          </p>
        </div>

        <div>
          <h5 class="font-bold text-xs uppercase text-amber-400 mb-3 tracking-wider">Danh Mục Sản Phẩm</h5>
          <ul class="space-y-1.5 text-xs text-slate-300 font-medium">
            <li><router-link to="/products?categoryId=1" class="hover:text-amber-400 transition">Thép Cây VIS CB300V / CB400V</router-link></li>
            <li><router-link to="/products?categoryId=2" class="hover:text-amber-400 transition">Dây Buộc 1 Ly (Thép Ủ Mềm)</router-link></li>
            <li><router-link to="/products?categoryId=2" class="hover:text-amber-400 transition">Thép Rút Đen D1 - D10</router-link></li>
            <li><router-link to="/products?categoryId=3" class="hover:text-amber-400 transition">Lưới Trát Tường Chống Nứt</router-link></li>
          </ul>
        </div>

        <div id="contact">
          <h5 class="font-bold text-xs uppercase text-amber-400 mb-3 tracking-wider">Hệ Thống Kho Hàng</h5>
          <ul class="space-y-2 text-xs text-slate-300 font-medium">
            <li class="flex items-start gap-2">
              <MapPin class="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span><strong>Kho Miền Nam:</strong> Quốc Lộ 1A, Bình Tân, TP. Hồ Chí Minh</span>
            </li>
            <li class="flex items-start gap-2">
              <MapPin class="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span><strong>Kho Miền Bắc:</strong> Cụm CN Yên Mỹ, Hưng Yên</span>
            </li>
          </ul>
        </div>

        <div>
          <h5 class="font-bold text-xs uppercase text-amber-400 mb-3 tracking-wider">Hotline Báo Giá 24/7</h5>
          <a href="tel:0932283783" class="inline-flex items-center gap-2 bg-[#004d40] hover:bg-teal-800 text-white font-bold px-3.5 py-2.5 rounded-xl text-xs mb-2 transition">
            <Phone class="w-3.5 h-3.5 text-amber-400" /> 093 228 37 83
          </a>
          <p class="text-slate-400 text-xs font-normal">Liên hệ trực tiếp Zalo / Điện thoại để chốt đơn dự án.</p>
        </div>
      </div>

      <div class="max-w-7xl mx-auto border-t border-slate-800 mt-10 pt-4 text-center text-xs text-slate-500">
        © 2026 THÉP VIỆT TÍN. Bản quyền thuộc về Thép Việt Tín - Chất Lượng Tạo Niềm Tin.
      </div>
    </footer>

    <!-- Global Drawers & Modals -->
    <CartDrawer :isOpen="isCartOpen" @close="isCartOpen = false" />
    <AdminOrdersModal :isOpen="isAdminOpen" @close="isAdminOpen = false" />
    <ProductDetailModal :product="selectedProduct" :isOpen="isDetailOpen" @close="isDetailOpen = false" @open-cart="isCartOpen = true" />
    <OrderTrackingModal :isOpen="isTrackingOpen" @close="isTrackingOpen = false" />
    <FloatingContact @open-tracking="isTrackingOpen = true" @open-cart="isCartOpen = true" />
    <NotificationModal :notification="notification" @close="closeNotification" @confirm="handleConfirm" />
    <LiveOrderTicker />
    <BackToTop />
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>