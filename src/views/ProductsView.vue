<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../api';
import { useCartStore } from '../stores/cart';
import type { Product } from '../types';
import { Search, Phone, ChevronRight, Eye, ShoppingCart, CheckCircle2, Sparkles, Filter } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();

interface Category {
  id: number;
  name: string;
  code: string;
}

const products = ref<Product[]>([]);
const categories = ref<Category[]>([]);
const searchKeyword = ref('');
const selectedCategoryId = ref<number | null>(null);
const isLoadingProducts = ref(false);
const addedIdMap = ref<Record<number, boolean>>({});

const defaultCategories: Category[] = [
  { id: 1, name: 'Thép Xây Dựng', code: 'THAP_XAY_DUNG' },
  { id: 2, name: 'Dây Thép & Thép Rút', code: 'DAY_THAP_RUT' },
  { id: 3, name: 'Lưới Thép Công Trình', code: 'LUOI_THAP' },
  { id: 4, name: 'Thép Hộp & Xà Gồ', code: 'THAP_HOP' },
  { id: 5, name: 'Thép Hình & Thép Tấm', code: 'THAP_HINH' }
];

const defaultProducts: Product[] = [
  { id: 1, categoryId: 1, name: 'Thép Cây VIS D12 CB300V', sku: 'VIS-D12', specifications: 'Đường kính 12mm • Dài 11.7m • W=10.4kg', unit: 'Cây', pricePerUnit: 185000, stockQuantity: 500, description: 'Thép cây Việt-Ý (VIS) mác CB300V chính hãng, khả năng dẻo uốn chịu lực vượt trội cho công trình dân dụng & dự án.', badge: 'Bán Chạy', category: 'Thép Xây Dựng', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTikKCqGn7UP2NBYbtXg5Gnx_5dttOIL-gN4u9Prsz7lA&s=10' },
  { id: 2, categoryId: 1, name: 'Thép Cây VIS D16 CB400V', sku: 'VIS-D16', specifications: 'Đường kính 16mm • Dài 11.7m • W=18.47kg', unit: 'Cây', pricePerUnit: 315000, stockQuantity: 350, description: 'Thép gân mác CB400V cường độ cao, gân xoắn dập chìm mác thép VIS chuẩn CO/CQ nhà máy.', badge: 'Phổ Biến', category: 'Thép Xây Dựng', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQO2OrauljcRycAsqIRxWQX5KTyBEs69WPjh_fmOZEQA&s=10' },
  { id: 3, categoryId: 1, name: 'Thép Cuộn Ø6 Hòa Phát', sku: 'HP-D06', specifications: 'Đường kính Ø6mm • Cuộn ~1000kg', unit: 'Kg', pricePerUnit: 16500, stockQuantity: 8000, description: 'Thép cuộn mạ kẽm / đen Hòa Phát bề mặt bóng đẹp, đúng chuẩn TCVN 1651-1:2018.', badge: 'Sẵn Kho', category: 'Thép Xây Dựng', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPJXISuOfo232j5ps35knn5LtDutiJVNj7mKJ49dN65A&s=10' },
  { id: 4, categoryId: 2, name: 'Dây Buộc 1 Ly (Thép Ủ Mềm)', sku: 'DB-01LY', specifications: 'Đường kính Ø 0.95mm - 1.0mm', unit: 'Kg', pricePerUnit: 18500, stockQuantity: 2000, description: 'Mềm dẻo, dễ uốn buộc dầm sàn, không bị gãy giòn khi xoắn mạnh, bó 50kg chuẩn.', badge: 'Giá Kho', category: 'Dây Thép & Thép Rút', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWa7DOnEd3YD38K6UcDx6ctcobXr9P-XCSGOYPJNWZjQ&s=10' },
  { id: 5, categoryId: 2, name: 'Thép Rút Đen D6', sku: 'TR-D06', specifications: 'Đường kính Ø 6.0mm cuộn 50kg', unit: 'Kg', pricePerUnit: 17200, stockQuantity: 5000, description: 'Dây thép rút đen chuyên sản xuất đai cọc bê tông, đai cột công trình, bẻ đai vuông sắc nét.', badge: 'Mới', category: 'Dây Thép & Thép Rút', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-AFlnvK7h_Y2ljQcseLux24FLfKiDrF1NpqkR-5yNQw&s=10' },
  { id: 6, categoryId: 2, name: 'Dây Thép Mạ Kẽm 3 Ly', sku: 'MK-03LY', specifications: 'Đường kính Ø 3.0mm cuộn', unit: 'Kg', pricePerUnit: 21000, stockQuantity: 1500, description: 'Dây kẽm mạ bóng chống gỉ sét ngoài trời, dùng buộc giàn giáo, căng dây chịu lực.', badge: 'Sẵn Kho', category: 'Dây Thép & Thép Rút', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTk28_IHv7MCMdVXs-2W0J3ILwFfkZLrUPGlrFLEmSpg&s=10' },
  { id: 7, categoryId: 3, name: 'Lưới Trát Tường Chống Nứt 1cm', sku: 'LT-1CM', specifications: 'Ô hàn 1cm x 1cm • Dài 24m • 7kg/cuộn', unit: 'Cuộn', pricePerUnit: 135000, stockQuantity: 400, description: 'Lưới thép dập giãn ô trám chống nứt chân chim tường xây, tiếp giáp cột bê tông.', badge: 'Hot', category: 'Lưới Thép Công Trình', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJekwPyIqzrLIUWuskGO9H9Qx52zEaDiw0h3ImzoNxcw&s=10' },
  { id: 8, categoryId: 3, name: 'Lưới Thép Hàn D4 Ô 100x100', sku: 'LTH-D04', specifications: 'Dây 4mm • Ô 100x100mm • Tấm 2x6m', unit: 'Tấm', pricePerUnit: 280000, stockQuantity: 300, description: 'Lưới thép hàn đổ bê tông nhà xưởng, đường nội bộ, thi công nhanh gấp 3 lần buộc tay.', badge: 'Dự Án', category: 'Lưới Thép Công Trình', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJekwPyIqzrLIUWuskGO9H9Qx52zEaDiw0h3ImzoNxcw&s=10' },
  { id: 9, categoryId: 4, name: 'Thép Hộp Mạ Kẽm 50x100', sku: 'TH-50100', specifications: 'Dày 1.8mm • Dài 6m', unit: 'Cây', pricePerUnit: 340000, stockQuantity: 250, description: 'Thép hộp mạ kẽm chống ăn mòn xà gồ mái, khung kết cấu khung thép tiền chế.', badge: 'Dự Án', category: 'Thép Hộp & Xà Gồ', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGs-obnokh5lnBGO-23UGS1lXuFKt_EnVgzDQf5QI0UA&s=10' },
  { id: 10, categoryId: 4, name: 'Thép Hộp Vuông 40x40 Kẽm', sku: 'TH-4040', specifications: 'Dày 1.4mm • Dài 6m', unit: 'Cây', pricePerUnit: 165000, stockQuantity: 600, description: 'Thép hộp mạ kẽm vuông Hòa Phát / Hoa Sen, dán nhãn đàng hoàng, chuẩn ly.', badge: 'Phổ Biến', category: 'Thép Hộp & Xà Gồ', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrOj514AJbAquo7ikCPusFHze6OWRWZD6NTcPS6WHwdw&s=10' },
  { id: 11, categoryId: 5, name: 'Thép V Góc V50x50x5', sku: 'TV-5050', specifications: 'Cánh 50mm • Dày 5mm • Dài 6m • W=22.3kg', unit: 'Cây', pricePerUnit: 375000, stockQuantity: 180, description: 'Thép góc V mạ kẽm nhúng nóng / đen dùng gia công tháp truyền tải, kệ kho, khung đỡ.', badge: 'Sẵn Kho', category: 'Thép Hình & Thép Tấm', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi7AsCl1hKtI-3OMHGSWZl1rcxrKUiuBD0NF0gS_ZxBQ&s=10' },
  { id: 12, categoryId: 5, name: 'Thép I Định Hình I150x75', sku: 'TI-150', specifications: 'Cao 150mm • Cánh 75mm • Dài 6m • W=84kg', unit: 'Cây', pricePerUnit: 1420000, stockQuantity: 90, description: 'Thép I150 nhập khẩu / An Khánh tiêu chuẩn SS400 chịu uốn chịu tải công trình nhà xưởng.', badge: 'Chính Hãng', category: 'Thép Hình & Thép Tấm', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfk0bMjqTuL8r98SRKGyLgD1Z-tiOmp9rXOZjb68GRgw&s=10' }
];

const makeProductsVisible = () => {
  nextTick(() => {
    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
      el.classList.add('is-visible');
    });
  });
};

const fetchCategories = async () => {
  try {
    const res = await api.get('/categories');
    if (res.data && res.data.length > 0) {
      categories.value = res.data;
    } else {
      categories.value = defaultCategories;
    }
  } catch (err) {
    categories.value = defaultCategories;
  }
};

const fetchProducts = async () => {
  isLoadingProducts.value = true;
  try {
    const url = selectedCategoryId.value
      ? `/products?categoryId=${selectedCategoryId.value}`
      : '/products';
    const res = await api.get(url);
    if (res.data && res.data.length > 0) {
      products.value = res.data;
    } else {
      products.value = defaultProducts;
    }
  } catch (err) {
    products.value = defaultProducts;
  } finally {
    isLoadingProducts.value = false;
    makeProductsVisible();
  }
};

const selectCategory = (id: number | null) => {
  selectedCategoryId.value = id;
  if (id !== null) {
    router.replace({ query: { ...route.query, categoryId: id } });
  } else {
    router.replace({ query: {} });
  }
  fetchProducts();
  makeProductsVisible();
};

const handleAddToCartWithEffect = (product: Product) => {
  cartStore.addToCart(product);
  addedIdMap.value[product.id] = true;
  setTimeout(() => {
    addedIdMap.value[product.id] = false;
  }, 1500);
};

const filteredProducts = computed(() => {
  let list = products.value;
  if (selectedCategoryId.value !== null) {
    const targetId = Number(selectedCategoryId.value);
    const selectedCat = categories.value.find(c => c.id === targetId) || defaultCategories.find(c => c.id === targetId);
    list = list.filter(p => {
      const pCatId = (p as any).categoryId ?? (p as any).category_id;
      if (pCatId !== undefined && pCatId !== null && Number(pCatId) === targetId) return true;
      if (selectedCat && p.category && p.category.toLowerCase().includes(selectedCat.name.toLowerCase())) return true;
      if (targetId === 1 && p.category && p.category.includes('Xây Dựng')) return true;
      if (targetId === 2 && p.category && (p.category.includes('Dây') || p.category.includes('Rút'))) return true;
      if (targetId === 3 && p.category && p.category.includes('Lưới')) return true;
      if (targetId === 4 && p.category && (p.category.includes('Hộp') || p.category.includes('Xà Gồ'))) return true;
      if (targetId === 5 && p.category && (p.category.includes('Hình') || p.category.includes('Tấm'))) return true;
      return false;
    });
  }
  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase().trim();
    list = list.filter(p =>
      p.name.toLowerCase().includes(kw) ||
      (p.specifications && p.specifications.toLowerCase().includes(kw)) ||
      (p.description && p.description.toLowerCase().includes(kw)) ||
      (p.sku && p.sku.toLowerCase().includes(kw))
    );
  }
  makeProductsVisible();
  return list;
});

const formatPrice = (val: number) => {
  if (!val || val === 0) return 'Liên hệ báo giá';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
};

const openProductDetail = (product: Product) => {
  const event = new CustomEvent('open-product-detail', { detail: product });
  window.dispatchEvent(event);
};

watch(() => route.query.categoryId, (newCatId) => {
  if (newCatId) {
    selectedCategoryId.value = Number(newCatId);
  } else {
    selectedCategoryId.value = null;
  }
  fetchProducts();
  makeProductsVisible();
}, { immediate: true });

onMounted(async () => {
  await fetchCategories();
  if (route.query.categoryId) {
    selectedCategoryId.value = Number(route.query.categoryId);
  }
  fetchProducts();
  makeProductsVisible();
});
</script>

<template>
  <div class="bg-slate-50 min-h-screen py-8 px-6">
    <div class="max-w-7xl mx-auto">

      <!-- Breadcrumb Navigation Bar -->
      <div class="flex items-center text-xs text-slate-500 gap-1.5 mb-6 bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-2xs reveal-on-scroll">
        <router-link to="/" class="hover:text-[#004d40] transition">Trang chủ</router-link>
        <ChevronRight class="w-3.5 h-3.5 text-slate-400" />
        <router-link to="/products" class="hover:text-[#004d40] transition">Sản phẩm</router-link>
        <ChevronRight class="w-3.5 h-3.5 text-slate-400" />
        <span class="font-bold text-[#004d40]">
          {{ selectedCategoryId ? (categories.find(c => c.id === selectedCategoryId)?.name || 'Danh mục sản phẩm') : 'Tất cả sản phẩm' }}
        </span>
      </div>

      <!-- 2-Column Category Classification Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <!-- LEFT SIDEBAR (DANH MỤC SẢN PHẨM & TƯ VẤN BÁO GIÁ) -->
        <div class="lg:col-span-3 space-y-6">
          
          <!-- DANH MỤC SẢN PHẨM Box -->
          <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs reveal-on-scroll reveal-delay-1">
            <!-- Box Header -->
            <div class="bg-[#004d40] text-white px-4 py-3.5 font-bold text-sm flex items-center gap-2 tracking-wide uppercase">
              <span class="w-1.5 h-4 bg-amber-400 rounded-full inline-block"></span>
              <span>DANH MỤC SẢN PHẨM</span>
            </div>
            
            <!-- Category Menu List -->
            <div class="divide-y divide-slate-100 text-xs font-semibold">
              <button 
                @click="selectCategory(null)"
                :class="[
                  'w-full flex items-center justify-between px-4 py-3.5 transition-all text-left cursor-pointer group',
                  selectedCategoryId === null 
                    ? 'bg-teal-50/90 text-[#004d40] border-l-4 border-[#004d40] font-bold' 
                    : 'text-slate-700 hover:bg-slate-50 hover:text-[#004d40]'
                ]"
              >
                <span>Tất cả sản phẩm</span>
                <ChevronRight :class="['w-4 h-4 transition-transform group-hover:translate-x-0.5', selectedCategoryId === null ? 'text-[#004d40]' : 'text-slate-400']" />
              </button>

              <button 
                v-for="cat in categories" 
                :key="cat.id"
                @click="selectCategory(cat.id)"
                :class="[
                  'w-full flex items-center justify-between px-4 py-3.5 transition-all text-left cursor-pointer group',
                  selectedCategoryId === cat.id 
                    ? 'bg-teal-50/90 text-[#004d40] border-l-4 border-[#004d40] font-bold' 
                    : 'text-slate-700 hover:bg-slate-50 hover:text-[#004d40]'
                ]"
              >
                <span>{{ cat.name }}</span>
                <ChevronRight :class="['w-4 h-4 transition-transform group-hover:translate-x-0.5', selectedCategoryId === cat.id ? 'text-[#004d40]' : 'text-slate-400']" />
              </button>
            </div>
          </div>

          <!-- Left Sidebar Contact Consultation Card -->
          <div class="bg-[#004d40] text-white p-5 rounded-2xl shadow-md space-y-2 relative overflow-hidden reveal-on-scroll reveal-delay-2">
            <div class="flex items-center gap-2 text-amber-400 font-bold text-xs">
              <Phone class="w-4 h-4 text-amber-400 flex-shrink-0 animate-bounce" />
              <span>Cần tư vấn báo giá?</span>
            </div>
            <a href="tel:0932283783" class="text-2xl font-black text-white block tracking-wide hover:text-amber-300 transition">
              093 228 37 83
            </a>
            <p class="text-[11px] text-teal-100 font-normal">
              Hotline 24/7 – Giao hàng tận nơi
            </p>
          </div>

        </div>

        <!-- RIGHT MAIN CONTENT (CLASSIFICATION PAGE PRODUCTS GRID) -->
        <div class="lg:col-span-9">
          
          <!-- Category Title & Product Count & Search Bar -->
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs reveal-on-scroll">
            <div>
              <h2 class="text-2xl font-black text-slate-900 uppercase tracking-tight">
                {{ selectedCategoryId ? (categories.find(c => c.id === selectedCategoryId)?.name || 'DANH MỤC SẢN PHẨM') : 'TẤT CẢ SẢN PHẨM' }}
              </h2>
              <p class="text-xs text-slate-500 font-medium mt-1">
                <strong class="text-slate-800 font-bold">{{ filteredProducts.length }}</strong> sản phẩm trong danh mục 
                <span class="font-bold text-[#004d40]">
                  {{ selectedCategoryId ? (categories.find(c => c.id === selectedCategoryId)?.name) : 'Tất cả sản phẩm' }}
                </span>
              </p>
            </div>

            <!-- Search Bar Input -->
            <div class="relative w-full sm:w-80">
              <input 
                v-model="searchKeyword" 
                type="text" 
                placeholder="Tìm tên thép, quy cách, mác thép..." 
                class="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-full text-xs outline-none focus:border-[#004d40] focus:ring-1 focus:ring-[#004d40] shadow-2xs font-medium"
              />
              <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <!-- Horizontal Filter Tag Pills -->
          <div class="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none text-xs font-semibold reveal-on-scroll reveal-delay-1">
            <button 
              @click="selectCategory(null)"
              :class="[
                'px-4 py-2 rounded-full transition-all whitespace-nowrap shadow-2xs cursor-pointer',
                selectedCategoryId === null 
                  ? 'bg-[#004d40] text-white font-bold' 
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              ]"
            >
              Tất cả
            </button>

            <button 
              v-for="cat in categories" 
              :key="cat.id"
              @click="selectCategory(cat.id)"
              :class="[
                'px-4 py-2 rounded-full transition-all whitespace-nowrap shadow-2xs cursor-pointer',
                selectedCategoryId === cat.id 
                  ? 'bg-[#004d40] text-white font-bold' 
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              ]"
            >
              {{ cat.name }}
            </button>
          </div>

          <!-- Loading State -->
          <div v-if="isLoadingProducts" class="text-center py-16 text-slate-400 font-semibold text-xs">
            Đang tải dữ liệu sản phẩm thép...
          </div>

          <!-- Empty State -->
          <div v-else-if="filteredProducts.length === 0" class="text-center py-16 bg-white rounded-2xl border border-slate-200 p-6 text-xs">
            <p class="text-slate-500 font-semibold mb-2">Không tìm thấy sản phẩm thép nào phù hợp.</p>
            <button @click="searchKeyword = ''; selectCategory(null)" class="text-[#004d40] font-semibold underline cursor-pointer">Xóa bộ lọc để xem lại tất cả</button>
          </div>

          <!-- Product Grid Cards (3 Columns) -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div 
              v-for="(product, idx) in filteredProducts" 
              :key="product.id" 
              :class="['bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-[#004d40] hover:shadow-xl transition-all duration-500 flex flex-col justify-between group reveal-on-scroll', `reveal-delay-${(idx % 3) + 1}`]"
            >
              <div>
                <!-- Image Container -->
                <div class="relative overflow-hidden bg-slate-100 h-52">
                  <img 
                    :src="product.imageUrl" 
                    :alt="product.name" 
                    class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  
                  <!-- Top Left Badge -->
                  <span class="absolute top-3 left-3 bg-[#004d40] text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase shadow-xs">
                    {{ product.badge || 'SẴN KHO' }}
                  </span>

                  <!-- Top Right SKU Badge -->
                  <span class="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-xs text-slate-100 text-[10px] font-mono font-semibold px-2 py-1 rounded-md">
                    {{ product.sku || 'VT-' + product.id }}
                  </span>
                </div>

                <!-- Product Content -->
                <div class="p-4">
                  <span class="text-[10px] font-bold text-teal-700 uppercase tracking-wider block mb-1">
                    {{ product.category || 'THÉP XÂY DỰNG' }}
                  </span>

                  <h4 class="text-sm font-bold text-slate-900 mb-2 leading-snug group-hover:text-[#004d40] transition">
                    {{ product.name }}
                  </h4>

                  <!-- Technical specifications block -->
                  <div class="bg-slate-50 border border-slate-200 p-2.5 rounded-xl mb-3">
                    <span class="text-[9px] font-bold text-slate-400 uppercase block">QUY CÁCH KỸ THUẬT:</span>
                    <p class="text-xs font-bold text-slate-800 mt-0.5">{{ product.specifications }}</p>
                  </div>

                  <p class="text-slate-500 text-xs leading-relaxed line-clamp-2 font-normal">{{ product.description }}</p>
                </div>
              </div>

              <!-- Product Card Footer với Hiệu Ứng Nút Thêm Giỏ Hàng -->
              <div class="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
                <div>
                  <span class="block text-[9px] font-semibold text-slate-400 uppercase">ĐƠN GIÁ THAM KHẢO:</span>
                  <span class="text-sm font-extrabold text-[#004d40]">{{ formatPrice(product.pricePerUnit) }}</span>
                  <span v-if="product.pricePerUnit" class="text-[10px] text-slate-500 font-medium"> / {{ product.unit }}</span>
                </div>

                <div class="flex items-center gap-1.5">
                  <button 
                    @click="openProductDetail(product)"
                    class="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition shadow-xs cursor-pointer"
                    title="Xem Chi Tiết CO/CQ">
                    <Eye class="w-4 h-4" />
                  </button>
                  <button 
                    @click="handleAddToCartWithEffect(product)" 
                    :class="[
                      'font-semibold px-3 py-2 rounded-xl text-xs transition-all duration-300 flex items-center gap-1.5 whitespace-nowrap shadow-xs cursor-pointer',
                      addedIdMap[product.id] 
                        ? 'bg-amber-400 text-slate-950 font-bold scale-105 ring-2 ring-amber-300' 
                        : 'bg-[#004d40] hover:bg-teal-900 text-white'
                    ]"
                  >
                    <CheckCircle2 v-if="addedIdMap[product.id]" class="w-3.5 h-3.5 text-slate-950 animate-bounce" />
                    <ShoppingCart v-else class="w-3.5 h-3.5 text-white" />
                    {{ addedIdMap[product.id] ? '✓ Đã thêm!' : '+ Giỏ hàng' }}
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  </div>
</template>
