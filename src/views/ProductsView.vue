<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import api from '../api';
import Navbar from '../components/Navbar.vue';
import { useModalsStore } from '../stores/modals';
import { useCartStore } from '../stores/cart';
import type { Product } from '../types';
import { Search, Eye, ShoppingCart, Home, ChevronRight, Filter } from 'lucide-vue-next';

import { FALLBACK_CATEGORIES, FALLBACK_PRODUCTS } from '../data/fallbackData';

interface Category {
  id: number;
  name: string;
  code: string;
}

const route = useRoute();
const router = useRouter();
const modals = useModalsStore();
const cartStore = useCartStore();

const categories = ref<Category[]>(FALLBACK_CATEGORIES);
const products = ref<Product[]>(FALLBACK_PRODUCTS);
const searchKeyword = ref('');
const isLoadingProducts = ref(false);
const isSidebarOpen = ref(false); // mobile sidebar toggle

const selectedCategoryId = computed(() => {
  const id = route.params.categoryId;
  return id ? Number(id) : null;
});

const selectedCategory = computed(() =>
  categories.value.find(c => c.id === selectedCategoryId.value) ?? null
);

const fetchCategories = async () => {
  try {
    const res = await api.get('/categories');
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      categories.value = res.data;
    }
  } catch (err) {
    // Giữ nguyên FALLBACK_CATEGORIES
  }
};

const fetchProducts = async () => {
  isLoadingProducts.value = true;
  searchKeyword.value = '';
  try {
    const url = selectedCategoryId.value
      ? `/products?categoryId=${selectedCategoryId.value}`
      : '/products';
    const res = await api.get(url);
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      products.value = res.data;
    } else {
      filterFallbackProducts();
    }
  } catch (err) {
    filterFallbackProducts();
  } finally {
    isLoadingProducts.value = false;
  }
};

const filterFallbackProducts = () => {
  if (selectedCategoryId.value) {
    products.value = FALLBACK_PRODUCTS.filter(p => p.categoryId === selectedCategoryId.value);
  } else {
    products.value = FALLBACK_PRODUCTS;
  }
};

const filteredProducts = computed(() => {
  if (!searchKeyword.value) return products.value;
  const kw = searchKeyword.value.toLowerCase();
  return products.value.filter(p =>
    p.name.toLowerCase().includes(kw) ||
    (p.specifications && p.specifications.toLowerCase().includes(kw)) ||
    (p.description && p.description.toLowerCase().includes(kw))
  );
});

const formatPrice = (val: number) => {
  if (!val || val === 0) return 'Liên hệ báo giá';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
};

const selectCategory = (id: number | null) => {
  isSidebarOpen.value = false;
  if (id === null) {
    router.push({ name: 'products' });
  } else {
    router.push({ name: 'products', params: { categoryId: id } });
  }
};

watch(
  () => route.params.categoryId,
  () => fetchProducts(),
  { immediate: false }
);

// Refresh when admin updates products
watch(() => modals.productsRefreshKey, () => fetchProducts());

onMounted(async () => {
  await fetchCategories();
  await fetchProducts();
});
</script>

<template>
  <div class="bg-slate-50 min-h-screen text-slate-800">
    <Navbar :categories="categories" />

    <!-- Breadcrumb Bar -->
    <div class="bg-white border-b border-slate-200 py-2.5 px-4 shadow-sm">
      <div class="max-w-7xl mx-auto flex items-center gap-2 text-xs text-slate-500 font-medium">
        <RouterLink to="/" class="hover:text-[#006a64] transition flex items-center gap-1">
          <Home class="w-3.5 h-3.5" /> Trang chủ
        </RouterLink>
        <ChevronRight class="w-3.5 h-3.5 text-slate-300" />
        <span class="text-slate-400">Sản phẩm</span>
        <template v-if="selectedCategory">
          <ChevronRight class="w-3.5 h-3.5 text-slate-300" />
          <span class="text-[#006a64] font-bold">{{ selectedCategory.name }}</span>
        </template>
      </div>
    </div>

    <!-- Page Content -->
    <div class="max-w-7xl mx-auto px-4 py-8 flex gap-6">

      <!-- ===== LEFT SIDEBAR ===== -->
      <!-- Mobile toggle button -->
      <button
        class="lg:hidden fixed bottom-20 left-4 z-40 bg-[#006a64] text-white px-4 py-2 rounded-full shadow-lg text-xs font-bold flex items-center gap-2"
        @click="isSidebarOpen = !isSidebarOpen"
      >
        <Filter class="w-4 h-4" /> Danh mục
      </button>

      <!-- Sidebar -->
      <aside
        :class="[
          'flex-shrink-0 w-60 xl:w-64 transition-all duration-300',
          'lg:block',
          isSidebarOpen ? 'fixed inset-y-0 left-0 z-50 bg-white shadow-2xl overflow-y-auto pt-4 lg:relative lg:shadow-none' : 'hidden lg:block'
        ]"
      >
        <!-- Sidebar header -->
        <div class="bg-[#006a64] text-white px-4 py-3 rounded-t-xl font-extrabold text-sm uppercase tracking-wide flex items-center gap-2">
          <span class="w-1 h-5 bg-yellow-400 rounded"></span>
          Danh Mục Sản Phẩm
        </div>

        <!-- Category list -->
        <div class="border border-slate-200 rounded-b-xl overflow-hidden bg-white shadow-sm">
          <button
            @click="selectCategory(null)"
            :class="[
              'w-full text-left px-4 py-3 text-sm font-bold transition flex items-center justify-between border-b border-slate-100 last:border-0',
              selectedCategoryId === null
                ? 'bg-teal-50 text-[#006a64] border-l-4 border-l-[#006a64]'
                : 'text-slate-700 hover:bg-slate-50 hover:text-[#006a64]'
            ]"
          >
            <span>Tất cả sản phẩm</span>
            <ChevronRight class="w-3.5 h-3.5 flex-shrink-0 opacity-60" />
          </button>
          <button
            v-for="cat in categories"
            :key="cat.id"
            @click="selectCategory(cat.id)"
            :class="[
              'w-full text-left px-4 py-3 text-sm font-bold transition flex items-center justify-between border-b border-slate-100 last:border-0',
              selectedCategoryId === cat.id
                ? 'bg-teal-50 text-[#006a64] border-l-4 border-l-[#006a64]'
                : 'text-slate-700 hover:bg-slate-50 hover:text-[#006a64]'
            ]"
          >
            <span>{{ cat.name }}</span>
            <ChevronRight class="w-3.5 h-3.5 flex-shrink-0 opacity-60" />
          </button>
        </div>

        <!-- Hotline CTA -->
        <div class="mt-4 bg-[#006a64] rounded-xl p-4 text-white">
          <p class="text-xs font-bold mb-1">📞 Cần tư vấn báo giá?</p>
          <a href="tel:0932283783" class="block text-lg font-black hover:underline">093 228 37 83</a>
          <p class="text-teal-100 text-xs mt-1">Hotline 24/7 – Giao hàng tận nơi</p>
        </div>
      </aside>

      <!-- Overlay for mobile sidebar -->
      <div
        v-if="isSidebarOpen"
        class="lg:hidden fixed inset-0 bg-black/40 z-40"
        @click="isSidebarOpen = false"
      ></div>

      <!-- ===== MAIN CONTENT ===== -->
      <main class="flex-1 min-w-0">
        <!-- Page Header -->
        <div class="mb-6 pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl font-black text-slate-800 uppercase tracking-tight">
              {{ selectedCategory ? selectedCategory.name : 'Tất Cả Sản Phẩm Thép' }}
            </h1>
            <p class="text-slate-500 text-sm mt-0.5">
              {{ filteredProducts.length }} sản phẩm
              <span v-if="selectedCategory">trong danh mục <span class="text-red-600 font-semibold">{{ selectedCategory.name }}</span></span>
            </p>
          </div>

          <!-- Search Bar -->
          <div class="relative w-full sm:w-80 flex-shrink-0">
            <input
              v-model="searchKeyword"
              type="text"
              placeholder="Tìm tên thép, quy cách, mác thép..."
              class="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition bg-white"
            />
            <Search class="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>
        </div>

        <!-- Category Tabs (quick filter) -->
        <div class="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          <button
            @click="selectCategory(null)"
            :class="[
              'px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition border',
              selectedCategoryId === null
                ? 'bg-[#006a64] text-white border-[#006a64] shadow-md'
                : 'bg-white text-slate-600 border-slate-300 hover:border-[#006a64] hover:text-[#006a64]'
            ]"
          >
            Tất cả
          </button>
          <button
            v-for="cat in categories"
            :key="cat.id"
            @click="selectCategory(cat.id)"
            :class="[
              'px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition border',
              selectedCategoryId === cat.id
                ? 'bg-[#006a64] text-white border-[#006a64] shadow-md'
                : 'bg-white text-slate-600 border-slate-300 hover:border-[#006a64] hover:text-[#006a64]'
            ]"
          >
            {{ cat.name }}
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="isLoadingProducts" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          <div v-for="i in 6" :key="i" class="rounded-xl bg-slate-100 animate-pulse h-72"></div>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredProducts.length === 0" class="text-center py-20 border border-slate-200 rounded-xl bg-slate-50">
          <div class="text-5xl mb-4">🔍</div>
          <p class="text-slate-600 font-bold text-base mb-1">Không tìm thấy sản phẩm phù hợp</p>
          <p class="text-slate-400 text-sm mb-4">Thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác.</p>
          <button
            @click="searchKeyword = ''; selectCategory(null)"
            class="text-[#006a64] font-extrabold text-sm underline hover:no-underline"
          >
            Xem tất cả sản phẩm
          </button>
        </div>

        <!-- Product Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          <div
            v-for="(product, idx) in filteredProducts"
            :key="product.id"
            class="bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-[#006a64] hover:shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-0.5 flex flex-col group"
            :style="{ animationDelay: `${(idx % 9) * 60}ms` }"
          >
            <!-- Product Image -->
            <div class="relative overflow-hidden bg-slate-100 h-48">
              <img
                :src="product.imageUrl"
                :alt="product.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                @error="($event.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400&q=80'"
              />
              <!-- Badge -->
              <span class="absolute top-3 left-3 bg-[#006a64] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase shadow">
                {{ product.badge || 'Sẵn Kho' }}
              </span>
              <!-- SKU -->
              <span class="absolute top-3 right-3 bg-white/90 text-slate-600 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-slate-200">
                {{ product.sku || 'VT-' + product.id }}
              </span>
            </div>

            <!-- Product Info -->
            <div class="p-4 flex-1 flex flex-col">
              <!-- Category tag -->
              <span class="text-[10px] font-extrabold text-[#006a64] uppercase tracking-widest mb-1">
                {{ product.category || 'Thép Công Trình' }}
              </span>

              <!-- Name -->
              <h3 class="font-extrabold text-slate-800 text-base leading-snug mb-2 group-hover:text-[#006a64] transition-colors line-clamp-2">
                {{ product.name }}
              </h3>

              <!-- Specs -->
              <div class="bg-slate-50 border border-slate-200 rounded-lg p-2.5 mb-2">
                <span class="text-[9px] font-bold text-slate-400 uppercase block mb-0.5">Quy cách kỹ thuật:</span>
                <p class="text-xs font-bold text-slate-700 line-clamp-2">{{ product.specifications }}</p>
              </div>

              <!-- Price & Stock -->
              <div class="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span class="text-[9px] font-bold text-slate-400 block uppercase">Đơn giá tham khảo:</span>
                  <span class="text-base font-black text-[#006a64]">
                    {{ formatPrice(product.pricePerUnit) }}
                  </span>
                  <span v-if="product.unit" class="text-[10px] text-slate-400 font-normal ml-0.5">/{{ product.unit }}</span>
                </div>

                <!-- Action buttons -->
                <div class="flex items-center gap-1.5">
                  <button
                    @click="modals.openProductDetail(product)"
                    title="Xem chi tiết"
                    class="p-2 rounded-xl bg-slate-100 hover:bg-[#006a64] hover:text-white text-slate-600 transition"
                  >
                    <Eye class="w-4 h-4" />
                  </button>
                  <button
                    @click="cartStore.addToCart(product, 1)"
                    title="Thêm vào giỏ"
                    class="p-2 rounded-xl bg-[#006a64] hover:bg-[#00544f] text-white transition flex items-center gap-1 text-xs font-bold px-3"
                  >
                    <ShoppingCart class="w-4 h-4" />
                    <span>+ Thêm</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Simple Footer -->
    <footer class="bg-slate-900 text-white py-8 px-4 mt-12 border-t border-slate-800">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 bg-[#006a64] border-2 border-white rounded-xl flex items-center justify-center font-black text-sm">VT</div>
          <div>
            <span class="font-black text-white text-sm">THÉP VIỆT TÍN</span>
            <span class="text-slate-400 text-xs block">Chất Lượng Tạo Niềm Tin</span>
          </div>
        </div>
        <div class="flex items-center gap-4 text-xs text-slate-400">
          <RouterLink to="/" class="hover:text-white transition">Trang chủ</RouterLink>
          <a href="tel:0932283783" class="hover:text-white transition flex items-center gap-1">
            📞 093 228 37 83
          </a>
          <span>thepviettin@gmail.com</span>
        </div>
        <p class="text-slate-500 text-xs">© 2026 THÉP VIỆT TÍN</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
