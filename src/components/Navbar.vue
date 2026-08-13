<script setup lang="ts">
import { useCartStore } from '../stores/cart';
import { ShoppingCart, Phone, Search, Calculator, ClipboardList } from 'lucide-vue-next';
import { useRoute } from 'vue-router';
import VietTinLogo from './VietTinLogo.vue';

defineEmits(['open-cart', 'open-admin', 'open-tracking']);
const cartStore = useCartStore();
const route = useRoute();
</script>

<template>
  <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
    <!-- Top Bar -->
    <div class="bg-slate-900 text-white py-2 px-6 text-xs">
      <div class="max-w-7xl mx-auto flex justify-between items-center">
        <div class="flex items-center space-x-6">
          <a href="tel:0932283783" class="flex items-center gap-1.5 hover:text-amber-400 transition font-medium">
            <Phone class="w-3.5 h-3.5 text-amber-400" /> 
            Hotline: <strong class="text-amber-400 font-semibold">093 228 37 83</strong>
          </a>
          <span class="hidden md:inline text-slate-400">| Email: thepviettin@gmail.com</span>
        </div>
        <div class="flex items-center space-x-4">
          <button @click="$emit('open-tracking')" class="text-amber-400 hover:text-white font-medium flex items-center gap-1 text-[11px] underline cursor-pointer">
            <Search class="w-3.5 h-3.5 text-amber-400" /> Tra Cứu Đơn Hàng
          </button>
          <span class="hidden sm:inline font-semibold text-amber-400 uppercase tracking-wide text-[11px]">| CHẤT LƯỢNG TẠO NIỀM TIN</span>
        </div>
      </div>
    </div>

    <!-- Main Header -->
    <div class="max-w-7xl mx-auto px-6 py-2.5 flex justify-between items-center">
      <!-- Logo Official Image Vector -->
      <router-link to="/" class="flex items-center group">
        <VietTinLogo size="md" />
      </router-link>

      <!-- Nav Links (Separate Pages) -->
      <nav class="hidden lg:flex items-center space-x-7 font-medium text-slate-700 text-sm">
        <router-link 
          to="/" 
          :class="['relative py-1 transition-colors duration-200 hover:text-[#004d40]', route.path === '/' ? 'text-[#004d40] font-bold border-b-2 border-[#004d40]' : '']"
        >
          Trang Chủ
        </router-link>

        <router-link 
          to="/products" 
          :class="['relative py-1 transition-colors duration-200 hover:text-[#004d40]', route.path.startsWith('/products') ? 'text-[#004d40] font-bold border-b-2 border-[#004d40]' : '']"
        >
          Sản Phẩm Thép
        </router-link>

        <router-link 
          to="/calculator" 
          :class="['relative py-1 transition-colors duration-200 hover:text-[#004d40] flex items-center gap-1.5', route.path === '/calculator' ? 'text-[#004d40] font-bold border-b-2 border-[#004d40]' : '']"
        >
          <Calculator class="w-4 h-4 text-slate-500" /> Tính Trọng Lượng
        </router-link>

        <router-link 
          to="/about" 
          :class="['relative py-1 transition-colors duration-200 hover:text-[#004d40]', route.path === '/about' ? 'text-[#004d40] font-bold border-b-2 border-[#004d40]' : '']"
        >
          Về Chúng Tôi
        </router-link>

        <router-link 
          to="/contact" 
          :class="['relative py-1 transition-colors duration-200 hover:text-[#004d40]', route.path === '/contact' ? 'text-[#004d40] font-bold border-b-2 border-[#004d40]' : '']"
        >
          Liên Hệ Kho
        </router-link>
      </nav>

      <!-- Action Buttons -->
      <div class="flex items-center space-x-2.5">
        <!-- Order Tracking Button -->
        <button 
          @click="$emit('open-tracking')" 
          class="hidden sm:flex bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-medium px-3 py-2 rounded-xl text-xs transition-all duration-200 items-center gap-1.5 border border-slate-200/80 shadow-2xs cursor-pointer">
          <Search class="w-3.5 h-3.5 text-[#004d40]" /> Tra Cứu Đơn
        </button>

        <!-- Admin Orders Drawer Button -->
        <button 
          @click="$emit('open-admin')" 
          class="hidden sm:flex bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-medium px-3 py-2 rounded-xl text-xs transition-all duration-200 items-center gap-1.5 shadow-2xs cursor-pointer">
          <ClipboardList class="w-3.5 h-3.5 text-amber-400" /> Quản Lý
        </button>

        <!-- Cart Trigger -->
        <button 
          @click="$emit('open-cart')" 
          class="relative bg-[#004d40] hover:bg-teal-900 active:scale-95 text-white font-semibold px-3.5 py-2 rounded-xl shadow-xs transition-all duration-200 flex items-center gap-2 cursor-pointer">
          <ShoppingCart class="w-4 h-4" />
          <span class="hidden sm:inline text-xs">Giỏ Báo Giá</span>
          <span v-if="cartStore.totalItemsCount > 0" class="absolute -top-1.5 -right-1.5 bg-amber-400 text-slate-950 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border border-white shadow-xs animate-pulse">
            {{ cartStore.totalItemsCount }}
          </span>
        </button>
      </div>
    </div>
  </header>
</template>