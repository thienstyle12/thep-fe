<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';
import { useModalsStore } from '../stores/modals';
import { ShoppingCart, Phone, ClipboardList, Search, ChevronDown, Layers } from 'lucide-vue-next';

const props = defineProps<{
  categories?: any[];
}>();

const router = useRouter();
const cartStore = useCartStore();
const modals = useModalsStore();

const isDropdownOpen = ref(false);

const handleCategoryClick = (catId: number | null) => {
  isDropdownOpen.value = false;
  if (catId === null) {
    router.push({ name: 'products' });
  } else {
    router.push({ name: 'products', params: { categoryId: catId } });
  }
};
</script>

<template>
  <header class="sticky top-0 z-40 bg-white shadow-md border-b border-slate-200">
    <!-- Top Bar -->
    <div class="bg-[#006a64] text-white py-1.5 px-4 sm:px-6 text-xs">
      <div class="max-w-7xl mx-auto flex justify-between items-center">
        <div class="flex items-center space-x-4 sm:space-x-6">
          <a href="tel:0932283783" class="flex items-center gap-1.5 hover:text-yellow-300 transition">
            <Phone class="w-3.5 h-3.5 text-yellow-400" />
            Hotline Báo Giá: <strong class="text-yellow-300 font-black ml-1">093 228 37 83</strong>
          </a>
          <span class="hidden md:inline text-teal-100/80">| Email: thepviettin@gmail.com</span>
        </div>
        <div class="flex items-center space-x-3">
          <button
            @click="modals.isTrackingOpen = true"
            class="text-yellow-300 hover:text-white font-bold flex items-center gap-1 text-[11px] underline"
          >
            <Search class="w-3.5 h-3.5" /> Tra Cứu Đơn Hàng
          </button>
          <span class="hidden sm:inline font-black text-yellow-300 uppercase tracking-widest text-[11px]">
            | CHẤT LƯỢNG TẠO NIỀM TIN
          </span>
        </div>
      </div>
    </div>

    <!-- Main Header -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center gap-4">
      <!-- Logo -->
      <RouterLink to="/" class="flex items-center space-x-2.5 group shrink-0">
        <div class="w-10 h-10 bg-[#006a64] text-white font-black text-xl rounded-xl flex items-center justify-center border-2 border-teal-900 shadow-md group-hover:scale-105 transition duration-300">
          VT
        </div>
        <div class="whitespace-nowrap">
          <h2 class="text-xl font-black text-slate-900 tracking-tight leading-none">THÉP VIỆT TÍN</h2>
          <span class="text-[9px] text-[#006a64] font-extrabold uppercase tracking-widest block mt-0.5">
            Nhà Phân Phối Thép Công Trình
          </span>
        </div>
      </RouterLink>

      <!-- Nav Links -->
      <nav class="hidden lg:flex items-center space-x-4 xl:space-x-6 font-semibold text-slate-700 text-sm whitespace-nowrap">
        <RouterLink to="/" class="hover:text-[#006a64] transition">Trang Chủ</RouterLink>

        <!-- Dropdown SẢN PHẨM -->
        <div
          class="relative group shrink-0"
          @mouseenter="isDropdownOpen = true"
          @mouseleave="isDropdownOpen = false"
        >
          <button
            @click="isDropdownOpen = !isDropdownOpen"
            class="flex items-center gap-1 hover:text-[#006a64] transition py-2 font-extrabold whitespace-nowrap text-slate-900"
          >
            <Layers class="w-4 h-4 text-[#006a64]" />
            <span>SẢN PHẨM</span>
            <ChevronDown class="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180 text-slate-400" />
          </button>

          <!-- Dropdown List -->
          <Transition name="fade-drop">
            <div
              v-if="isDropdownOpen"
              class="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 px-2 z-50 text-slate-800"
            >
              <button
                @click="handleCategoryClick(null)"
                class="w-full text-left block px-3.5 py-2.5 rounded-xl text-xs font-black text-slate-900 hover:bg-teal-50 hover:text-[#006a64] transition"
              >
                ★ Tất Cả Sản Phẩm Thép
              </button>
              <div class="h-px bg-slate-100 my-1"></div>
              <button
                v-for="c in categories"
                :key="c.id"
                @click="handleCategoryClick(c.id)"
                class="w-full text-left block px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-teal-50 hover:text-[#006a64] transition"
              >
                ➔ {{ c.name }}
              </button>
            </div>
          </Transition>
        </div>

        <RouterLink to="/products" class="hover:text-[#006a64] transition">Bảng Giá</RouterLink>
        <a href="/#about" class="hover:text-[#006a64] transition">Về Chúng Tôi</a>
        <a href="/#contact" class="hover:text-[#006a64] transition">Liên Hệ</a>
      </nav>

      <!-- Action Buttons -->
      <div class="flex items-center space-x-2 shrink-0">
        <!-- Order Tracking -->
        <button
          @click="modals.isTrackingOpen = true"
          class="hidden sm:flex bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3 py-2 rounded-xl text-xs transition items-center gap-1 border border-slate-200 whitespace-nowrap"
        >
          <Search class="w-3.5 h-3.5 text-[#006a64]" /> Tra Cứu Đơn
        </button>

        <!-- Admin -->
        <button
          @click="modals.isAdminOpen = true"
          class="hidden sm:flex bg-slate-900 hover:bg-black text-white font-bold px-3 py-2 rounded-xl text-xs transition items-center gap-1 whitespace-nowrap"
        >
          <ClipboardList class="w-3.5 h-3.5 text-yellow-400" /> Quản Lý
        </button>

        <!-- Cart -->
        <button
          @click="modals.isCartOpen = true"
          class="relative bg-[#006a64] hover:bg-[#00544f] text-white font-bold px-3.5 py-2 rounded-xl shadow-md transition flex items-center gap-1.5 whitespace-nowrap"
        >
          <ShoppingCart class="w-4 h-4" />
          <span class="hidden sm:inline text-xs font-extrabold">Giỏ Báo Giá</span>
          <span
            v-if="cartStore.totalItemsCount > 0"
            class="absolute -top-1.5 -right-1.5 bg-yellow-400 text-slate-950 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow"
          >
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
  transition: all 0.18s ease-out;
}
.fade-drop-enter-from,
.fade-drop-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>