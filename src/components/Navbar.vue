<script setup lang="ts">
import { useCartStore } from '../stores/cart';
import { ShoppingCart, Phone, ShieldCheck, ClipboardList, Search } from 'lucide-vue-next';

defineEmits(['open-cart', 'open-admin', 'open-tracking']);
const cartStore = useCartStore();
</script>

<template>
  <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-md border-b border-slate-100">
    <!-- Top Bar -->
    <div class="bg-slate-950 text-white py-2 px-6 text-xs sm:text-sm">
      <div class="max-w-7xl mx-auto flex justify-between items-center">
        <div class="flex items-center space-x-6">
          <a href="tel:0932283783" class="flex items-center gap-1 hover:text-yellow-400 transition">
            <Phone class="w-3.5 h-3.5 text-red-500" /> Hotline Kinh Doanh: <strong class="text-yellow-400">093 228 37 83</strong>
          </a>
          <span class="hidden md:inline text-slate-400">| Email: thepviettin@gmail.com</span>
        </div>
        <div class="flex items-center space-x-4">
          <button @click="$emit('open-tracking')" class="text-yellow-400 hover:text-white font-bold flex items-center gap-1 text-[11px] underline">
            <Search class="w-3.5 h-3.5 text-yellow-400" /> Tra Cứu Đơn Hàng
          </button>
          <span class="hidden sm:inline font-bold text-red-500 uppercase tracking-widest text-[11px]">| CHẤT LƯỢNG TẠO NIỀM TIN</span>
        </div>
      </div>
    </div>

    <!-- Main Header -->
    <div class="max-w-7xl mx-auto px-6 py-3.5 flex justify-between items-center">
      <!-- Logo & Slogan -->
      <a href="#" class="flex items-center space-x-3 group">
        <div class="w-11 h-11 bg-slate-950 text-white font-black text-2xl rounded-xl flex items-center justify-center border-2 border-red-600 shadow-md group-hover:scale-105 transition duration-300">
          VT
        </div>
        <div>
          <h1 class="text-2xl font-black text-slate-900 tracking-tight leading-none">THÉP VIỆT TÍN</h1>
          <span class="text-[10px] text-red-600 font-extrabold uppercase tracking-widest block mt-0.5">Nhà Phân Phối Thép Công Trình</span>
        </div>
      </a>

      <!-- Nav Links -->
      <nav class="hidden lg:flex items-center space-x-8 font-bold text-slate-700 text-sm">
        <a href="#products" class="hover:text-red-600 transition">Sản Phẩm Thép</a>
        <a href="#calculator" class="hover:text-red-600 transition flex items-center gap-1 text-red-600">
          🧮 Tính Trọng Lượng
        </a>
        <a href="#about" class="hover:text-red-600 transition">Về Chúng Tôi</a>
        <a href="#contact" class="hover:text-red-600 transition">Liên Hệ Kho</a>
      </nav>

      <!-- Action Buttons -->
      <div class="flex items-center space-x-3">
        <!-- Order Tracking Button -->
        <button 
          @click="$emit('open-tracking')" 
          class="hidden sm:flex bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3.5 py-2.5 rounded-xl text-xs transition items-center gap-1.5 border border-slate-200">
          <Search class="w-4 h-4 text-red-600" /> Tra Cứu Đơn
        </button>

        <!-- Admin Orders Drawer Button -->
        <button 
          @click="$emit('open-admin')" 
          class="hidden sm:flex bg-slate-900 hover:bg-black text-white font-bold px-3.5 py-2.5 rounded-xl text-xs transition items-center gap-1.5">
          <ClipboardList class="w-4 h-4 text-yellow-400" /> Quản Lý
        </button>

        <!-- Cart Trigger -->
        <button 
          @click="$emit('open-cart')" 
          class="relative bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-lg transition flex items-center gap-2">
          <ShoppingCart class="w-5 h-5" />
          <span class="hidden sm:inline text-sm">Giỏ Báo Giá</span>
          <span v-if="cartStore.totalItemsCount > 0" class="absolute -top-2 -right-2 bg-yellow-400 text-slate-950 text-xs font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow">
            {{ cartStore.totalItemsCount }}
          </span>
        </button>
      </div>
    </div>
  </header>
</template>