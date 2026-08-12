<script setup lang="ts">
import { ref } from 'vue';
import { useCartStore } from '../stores/cart';
import { ShoppingCart, Phone, ShieldCheck, ClipboardList, Search, ChevronDown, Layers } from 'lucide-vue-next';

const props = defineProps<{
  categories?: any[];
}>();

const emit = defineEmits(['open-cart', 'open-admin', 'open-tracking', 'select-category']);
const cartStore = useCartStore();

const isDropdownOpen = ref(false);

const handleCategoryClick = (catId: number | null) => {
  isDropdownOpen.value = false;
  emit('select-category', catId);
};
</script>

<template>
  <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-md border-b border-slate-100">
    <!-- Top Bar Header (Teal / Dark Steel Bar like theptranlong.vn) -->
    <div class="bg-teal-900 text-white py-2 px-6 text-xs sm:text-sm">
      <div class="max-w-7xl mx-auto flex justify-between items-center">
        <div class="flex items-center space-x-6">
          <a href="tel:0932283783" class="flex items-center gap-1.5 hover:text-yellow-300 transition">
            <Phone class="w-3.5 h-3.5 text-yellow-400" /> Hotline Báo Giá: <strong class="text-yellow-300 font-black">093 228 37 83</strong>
          </a>
          <span class="hidden md:inline text-teal-200/80">| Email: thepviettin@gmail.com</span>
        </div>
        <div class="flex items-center space-x-4">
          <button @click="$emit('open-tracking')" class="text-yellow-300 hover:text-white font-bold flex items-center gap-1 text-[11px] underline">
            <Search class="w-3.5 h-3.5 text-yellow-300" /> Tra Cứu Đơn Hàng
          </button>
          <span class="hidden sm:inline font-black text-yellow-400 uppercase tracking-widest text-[11px]">| CHẤT LƯỢNG TẠO NIỀM TIN</span>
        </div>
      </div>
    </div>

    <!-- Main Header -->
    <div class="max-w-7xl mx-auto px-6 py-3.5 flex justify-between items-center">
      <!-- Logo & Slogan -->
      <a href="#" class="flex items-center space-x-3 group">
        <div class="w-11 h-11 bg-teal-900 text-white font-black text-2xl rounded-xl flex items-center justify-center border-2 border-red-600 shadow-md group-hover:scale-105 transition duration-300">
          VT
        </div>
        <div>
          <h1 class="text-2xl font-black text-slate-900 tracking-tight leading-none">THÉP VIỆT TÍN</h1>
          <span class="text-[10px] text-red-600 font-extrabold uppercase tracking-widest block mt-0.5">Nhà Phân Phối Thép Công Trình</span>
        </div>
      </a>

      <!-- Nav Links with Dropdown Menu -->
      <nav class="hidden lg:flex items-center space-x-8 font-bold text-slate-700 text-sm">
        <a href="#products" @click="handleCategoryClick(null)" class="hover:text-red-600 transition">Trang Chủ</a>

        <!-- Dropdown for SẢN PHẨM -->
        <div 
          class="relative group"
          @mouseenter="isDropdownOpen = true"
          @mouseleave="isDropdownOpen = false"
        >
          <button 
            @click="isDropdownOpen = !isDropdownOpen"
            class="flex items-center gap-1 hover:text-red-600 transition py-2 font-extrabold"
          >
            <Layers class="w-4 h-4 text-red-600" />
            <span>SẢN PHẨM THÉP</span>
            <ChevronDown class="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
          </button>

          <!-- Dropdown List -->
          <Transition name="fade-drop">
            <div 
              v-if="isDropdownOpen"
              class="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 px-2 z-50 transform"
            >
              <a 
                href="#products"
                @click="handleCategoryClick(null)"
                class="block px-4 py-2.5 rounded-xl text-xs font-black text-slate-800 hover:bg-red-50 hover:text-red-600 transition"
              >
                ★ Tất Cả Sản Phẩm Thép
              </a>
              <div class="h-px bg-slate-100 my-1"></div>
              <a 
                v-for="c in categories" 
                :key="c.id"
                href="#products"
                @click="handleCategoryClick(c.id)"
                class="block px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-red-50 hover:text-red-600 transition"
              >
                ➔ {{ c.name }}
              </a>
            </div>
          </Transition>
        </div>

        <a href="#calculator" class="hover:text-red-600 transition flex items-center gap-1">
          🧮 Tính Trọng Lượng
        </a>
        <a href="#projects" class="hover:text-red-600 transition">Dự Án Tiêu Biểu</a>
        <a href="#about" class="hover:text-red-600 transition">Về Thép Việt Tín</a>
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

<style scoped>
.fade-drop-enter-active,
.fade-drop-leave-active {
  transition: all 0.2s ease-out;
}

.fade-drop-enter-from,
.fade-drop-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>