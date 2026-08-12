<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import api from './api';
import Navbar from './components/Navbar.vue';
import CartDrawer from './components/CartDrawer.vue';
import SteelCalculator from './components/SteelCalculator.vue';
import AdminOrdersModal from './components/AdminOrdersModal.vue';
import ProductDetailModal from './components/ProductDetailModal.vue';
import OrderTrackingModal from './components/OrderTrackingModal.vue';
import FloatingContact from './components/FloatingContact.vue';
import NotificationModal from './components/NotificationModal.vue';
import PartnerBrands from './components/PartnerBrands.vue';
import ProjectGallery from './components/ProjectGallery.vue';
import MarketNews from './components/MarketNews.vue';
import CategoryGrid from './components/CategoryGrid.vue';
import CommitmentCards from './components/CommitmentCards.vue';
import HeroSlider from './components/HeroSlider.vue';
import { useNotification } from './composables/useNotification';
import { useCartStore } from './stores/cart';

const { notification, closeNotification, handleConfirm } = useNotification();
import type { Product } from './types';
import { Search, Phone, ShieldCheck, Truck, Factory, MapPin, Award, CheckCircle2, MessageCircle, Eye } from 'lucide-vue-next';

interface Category {
  id: number;
  name: string;
  code: string;
}

const cartStore = useCartStore();

const products = ref<Product[]>([]);
const categories = ref<Category[]>([]);
const searchKeyword = ref('');
const selectedCategoryId = ref<number | null>(null);

const isCartOpen = ref(false);
const isAdminOpen = ref(false);
const isTrackingOpen = ref(false);
const isDetailOpen = ref(false);
const selectedProduct = ref<Product | null>(null);
const isLoadingProducts = ref(false);

const openDetail = (p: Product) => {
  selectedProduct.value = p;
  isDetailOpen.value = true;
};

const fetchCategories = async () => {
  try {
    const res = await api.get('/categories');
    categories.value = res.data;
  } catch (err) {
    console.error('Error fetching categories', err);
  }
};

const fetchProducts = async () => {
  isLoadingProducts.value = true;
  try {
    const url = selectedCategoryId.value
      ? `/products?categoryId=${selectedCategoryId.value}`
      : '/products';
    const res = await api.get(url);
    products.value = res.data;
  } catch (err) {
    console.error('Error fetching products', err);
  } finally {
    isLoadingProducts.value = false;
  }
};

const selectCategory = (id: number | null) => {
  selectedCategoryId.value = id;
  fetchProducts();
  setTimeout(() => {
    const el = document.getElementById('products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, 50);
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

onMounted(() => {
  fetchCategories();
  fetchProducts();
});
</script>

<template>
  <div class="min-h-screen bg-teal-950 text-slate-100 font-sans selection:bg-teal-600 selection:text-white">
    <!-- Top Navigation Header -->
    <Navbar :categories="categories" @select-category="selectCategory" @open-cart="isCartOpen = true" @open-admin="isAdminOpen = true" @open-tracking="isTrackingOpen = true" />

    <!-- Animated Sliding Hero Banner (Corporate Teal Theme) -->
    <HeroSlider />

    <!-- Visual Category Grid Showcase (Inspired by theptranlong.vn) -->
    <CategoryGrid :categories="categories" @select-category="selectCategory" />

    <!-- Value Propositions -->
    <section class="bg-teal-950 border-b border-teal-900 py-10 px-6 shadow-sm">
      <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="flex items-start space-x-4 p-6 rounded-2xl bg-teal-900/50 border border-teal-800 hover:border-yellow-400 hover:shadow-xl transition duration-300 animate-fade-in-up">
          <div class="w-12 h-12 rounded-xl bg-teal-950 text-yellow-400 border border-teal-700/60 flex items-center justify-center flex-shrink-0">
            <Factory class="w-6 h-6" />
          </div>
          <div>
            <h4 class="font-extrabold text-white text-base">Giá Tận Kho Sản Xuất</h4>
            <p class="text-xs text-teal-200/70 mt-1 leading-relaxed">Cung cấp trực tiếp từ nhà máy thép không qua trung gian, chiết khấu cực tốt cho đại lý & dự án.</p>
          </div>
        </div>

        <div class="flex items-start space-x-4 p-6 rounded-2xl bg-teal-900/50 border border-teal-800 hover:border-yellow-400 hover:shadow-xl transition duration-300 animate-fade-in-up" style="animation-delay: 150ms">
          <div class="w-12 h-12 rounded-xl bg-teal-950 text-yellow-400 border border-teal-700/60 flex items-center justify-center flex-shrink-0">
            <Truck class="w-6 h-6" />
          </div>
          <div>
            <h4 class="font-extrabold text-white text-base">Vận Chuyển Xe Cẩu Tận Chân Công Trình</h4>
            <p class="text-xs text-teal-200/70 mt-1 leading-relaxed">Đội xe cẩu thùng chuyên nghiệp bốc dỡ tận công trình, đảm bảo tiến độ đổ bê tông.</p>
          </div>
        </div>

        <div class="flex items-start space-x-4 p-6 rounded-2xl bg-teal-900/50 border border-teal-800 hover:border-yellow-400 hover:shadow-xl transition duration-300 animate-fade-in-up" style="animation-delay: 300ms">
          <div class="w-12 h-12 rounded-xl bg-teal-950 text-yellow-400 border border-teal-700/60 flex items-center justify-center flex-shrink-0">
            <Award class="w-6 h-6" />
          </div>
          <div>
            <h4 class="font-extrabold text-white text-base">Cam Kết Đạt Tiêu Chuẩn CO/CQ</h4>
            <p class="text-xs text-teal-200/70 mt-1 leading-relaxed">Đầy đủ chứng chỉ xuất xưởng, đạt chuẩn mác thép CB300V, CB400V, TCVN 1651-2.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Partner Brands Section -->
    <PartnerBrands />

    <!-- Commitment Cards Section (Inspired by theptranlong.vn) -->
    <CommitmentCards />

    <!-- STEEL WEIGHT CALCULATOR SECTION -->
    <section class="max-w-7xl mx-auto px-6 py-6">
      <SteelCalculator />
    </section>

    <!-- PRODUCT CATALOG & SEARCH FILTER -->
    <section id="products" class="py-16 px-6 max-w-7xl mx-auto border-t border-teal-900">
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8 gap-6 animate-fade-in-up">
        <div>
          <span class="text-xs font-extrabold text-yellow-400 uppercase tracking-widest block mb-1">Bảng giá & Báo giá trực tuyến</span>
          <h3 class="text-3xl lg:text-4xl font-black text-white tracking-tight">DANH MỤC SẢN PHẨM THÉP</h3>
          <p class="text-teal-200/80 text-sm mt-1">Chọn quy cách sản phẩm để thêm vào Đơn Báo Giá nhanh</p>
        </div>

        <!-- Search Bar -->
        <div class="relative w-full lg:w-96">
          <input 
            v-model="searchKeyword" 
            type="text" 
            placeholder="Tìm tên thép, mác thép, quy cách (D12, D14, 1ly...)" 
            class="w-full pl-11 pr-4 py-3 bg-teal-900/90 border border-teal-700 text-white rounded-2xl shadow-sm text-sm outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition placeholder:text-teal-300/50"/>
          <Search class="w-5 h-5 text-teal-300 absolute left-3.5 top-3.5" />
        </div>
      </div>

      <!-- Category Tabs Filter -->
      <div class="flex items-center gap-2 overflow-x-auto pb-4 mb-8 text-xs font-extrabold border-b border-teal-900">
        <button 
          @click="selectCategory(null)" 
          :class="['px-5 py-2.5 rounded-xl transition whitespace-nowrap', selectedCategoryId === null ? 'bg-red-600 text-white shadow-md' : 'bg-teal-900/60 text-teal-200 border border-teal-800 hover:bg-teal-800']">
          TẤT CẢ SẢN PHẨM
        </button>

        <button 
          v-for="cat in categories" 
          :key="cat.id" 
          @click="selectCategory(cat.id)"
          :class="['px-5 py-2.5 rounded-xl transition whitespace-nowrap', selectedCategoryId === cat.id ? 'bg-red-600 text-white shadow-md' : 'bg-teal-900/60 text-teal-200 border border-teal-800 hover:bg-teal-800']">
          {{ cat.name.toUpperCase() }}
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="isLoadingProducts" class="text-center py-20 text-slate-400 font-bold">
        Đang tải dữ liệu sản phẩm thép...
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredProducts.length === 0" class="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8">
        <p class="text-slate-500 text-base font-bold mb-2">Không tìm thấy sản phẩm thép nào phù hợp với tìm kiếm của bạn.</p>
        <button @click="searchKeyword = ''; selectCategory(null)" class="text-red-600 font-extrabold text-sm underline">Xóa bộ lọc để xem lại tất cả</button>
      </div>

      <!-- Product Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="(product, idx) in filteredProducts" 
          :key="product.id" 
          class="bg-teal-900/60 rounded-3xl shadow-lg border border-teal-800 hover:border-yellow-400 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition duration-300 flex flex-col justify-between group animate-fade-in-up"
          :style="{ animationDelay: `${(idx % 6) * 100}ms` }">
          
          <div>
            <!-- Image & Badge -->
            <div class="relative overflow-hidden bg-teal-950 h-56">
              <img 
                :src="product.imageUrl" 
                :alt="product.name" 
                class="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90 group-hover:opacity-100"/>
              
              <span class="absolute top-3 left-3 bg-red-600 text-white text-[11px] font-black px-3 py-1 rounded-full uppercase shadow-md tracking-wider">
                {{ product.badge || 'Sẵn Kho' }}
              </span>

              <span class="absolute top-3 right-3 bg-teal-950/90 backdrop-blur-md text-teal-200 text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg border border-teal-700">
                SKU: {{ product.sku || 'VT-' + product.id }}
              </span>
            </div>

            <!-- Content -->
            <div class="p-6">
              <span class="text-[11px] font-extrabold text-yellow-400 uppercase tracking-widest block mb-1">
                {{ product.category || 'Thép Công Trình' }}
              </span>

              <h4 class="text-xl font-extrabold text-white mb-2 leading-snug group-hover:text-yellow-400 transition">
                {{ product.name }}
              </h4>

              <div class="bg-teal-950/80 border border-teal-800 p-3 rounded-xl mb-3">
                <span class="text-[10px] font-bold text-teal-300/70 uppercase block mb-0.5">Quy cách kĩ thuật:</span>
                <p class="text-xs font-extrabold text-teal-100">{{ product.specifications }}</p>
              </div>

              <p class="text-teal-200/70 text-xs leading-relaxed line-clamp-2">{{ product.description }}</p>
            </div>
          </div>

          <!-- Bottom Footer Card -->
          <div class="p-6 bg-teal-950/90 border-t border-teal-800/80 flex items-center justify-between gap-2">
            <div>
              <span class="block text-[10px] font-bold text-teal-300/70 uppercase">Đơn giá niêm yết:</span>
              <span class="text-lg font-black text-yellow-400">{{ formatPrice(product.pricePerUnit) }}</span>
              <span class="text-[10px] text-teal-200/70 font-bold"> / {{ product.unit }}</span>
            </div>

            <div class="flex items-center gap-1.5">
              <button 
                @click="openDetail(product)"
                class="p-2.5 rounded-xl bg-teal-800 hover:bg-teal-700 text-teal-100 transition"
                title="Xem Chi Tiết CO/CQ">
                <Eye class="w-4 h-4" />
              </button>
              <button 
                @click="cartStore.addToCart(product); isCartOpen = true" 
                class="bg-red-600 hover:bg-red-700 text-white font-black px-3.5 py-2.5 rounded-xl text-xs uppercase shadow-md transition duration-200 flex items-center gap-1.5 whitespace-nowrap">
                + Giỏ Báo Giá
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Project Gallery Showcase -->
    <ProjectGallery />

    <!-- Market News & Advice -->
    <MarketNews />

    <!-- Company About & Contact Info -->
    <section id="about" class="bg-teal-950 text-white py-16 px-6 border-t border-teal-900">
      <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Col 1 -->
        <div>
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-10 h-10 bg-teal-900 border-2 border-red-600 text-white font-black text-xl rounded-xl flex items-center justify-center">
              VT
            </div>
            <h4 class="text-xl font-black">THÉP VIỆT TÍN</h4>
          </div>
          <p class="text-teal-200/70 text-xs leading-relaxed mb-4">
            Công ty Chuyên phân phối Thép Xây Dựng, Dây buộc 1 ly, Thép rút đen, Lưới thép trát tường. Cam kết chất lượng hàng đầu, đầy đủ chứng chỉ CO/CQ.
          </p>
        </div>

        <!-- Col 2 -->
        <div>
          <h5 class="font-extrabold text-sm uppercase text-yellow-400 mb-4 tracking-wider">Danh Mục Sản Phẩm</h5>
          <ul class="space-y-2 text-xs font-semibold text-teal-200/80">
            <li><a href="#products" class="hover:text-yellow-400 transition">Thép Cây VIS CB300V / CB400V</a></li>
            <li><a href="#products" class="hover:text-yellow-400 transition">Dây Buộc 1 Ly (Thép Ủ Mềm)</a></li>
            <li><a href="#products" class="hover:text-yellow-400 transition">Thép Rút Đen D1 - D10</a></li>
            <li><a href="#products" class="hover:text-yellow-400 transition">Lưới Trát Tường Chống Nứt</a></li>
            <li><a href="#products" class="hover:text-yellow-400 transition">Thép Hộp Mạ Kẽm & Xà Gồ</a></li>
          </ul>
        </div>

        <!-- Col 3 -->
        <div id="contact">
          <h5 class="font-extrabold text-sm uppercase text-yellow-400 mb-4 tracking-wider">Hệ Thống Kho Hàng</h5>
          <ul class="space-y-2.5 text-xs text-teal-200/80">
            <li class="flex items-start gap-2">
              <MapPin class="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <span><strong>Kho Miền Nam:</strong> Quốc Lộ 1A, Bình Tân, TP. Hồ Chí Minh</span>
            </li>
            <li class="flex items-start gap-2">
              <MapPin class="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <span><strong>Kho Miền Bắc:</strong> Cụm CN Yên Mỹ, Hưng Yên</span>
            </li>
          </ul>
        </div>

        <!-- Col 4 -->
        <div>
          <h5 class="font-extrabold text-sm uppercase text-yellow-400 mb-4 tracking-wider">Hotline Báo Giá 24/7</h5>
          <a href="tel:0932283783" class="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-black px-4 py-3 rounded-xl text-sm mb-3 transition shadow-lg">
            <Phone class="w-4 h-4" /> 093 228 37 83
          </a>
          <p class="text-teal-200/70 text-xs">Liên hệ trực tiếp Zalo / Điện thoại để chốt giá chiết khấu đơn dự án lớn.</p>
        </div>
      </div>

      <div class="max-w-7xl mx-auto border-t border-teal-900 mt-12 pt-6 text-center text-xs text-teal-300/60">
        © 2026 THÉP VIỆT TÍN. Bản quyền thuộc về Thép Việt Tín - Chất Lượng Tạo Niềm Tin.
      </div>
    </section>

    <!-- Cart Drawer Modal -->
    <CartDrawer :isOpen="isCartOpen" @close="isCartOpen = false" />

    <!-- Admin Orders & Products Modal -->
    <AdminOrdersModal :isOpen="isAdminOpen" @close="isAdminOpen = false" @product-updated="fetchProducts" />

    <!-- Product Detail Modal -->
    <ProductDetailModal :product="selectedProduct" :isOpen="isDetailOpen" @close="isDetailOpen = false" @open-cart="isCartOpen = true" />

    <!-- Order Tracking Modal -->
    <OrderTrackingModal :isOpen="isTrackingOpen" @close="isTrackingOpen = false" />

    <!-- Floating Speed Dial Contact -->
    <FloatingContact @open-tracking="isTrackingOpen = true" @open-cart="isCartOpen = true" />

    <!-- Center Popup Notification / Confirm Modal -->
    <NotificationModal :notification="notification" @close="closeNotification" @confirm="handleConfirm" />
  </div>
</template>