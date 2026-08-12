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
  <div class="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-red-600 selection:text-white">
    <!-- Top Navigation Header -->
    <Navbar @open-cart="isCartOpen = true" @open-admin="isAdminOpen = true" @open-tracking="isTrackingOpen = true" />

    <!-- Hero Banner -->
    <section class="bg-slate-950 text-white py-16 md:py-24 px-6 relative overflow-hidden">
      <!-- Background Glow Effects -->
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        <div class="lg:col-span-7">
          <span class="inline-flex items-center gap-2 bg-red-600 text-white text-xs font-black uppercase px-3.5 py-1.5 rounded-lg tracking-wider mb-4 shadow-lg shadow-red-600/30">
            <Factory class="w-4 h-4" /> Tổng Kho Sản Xuất & Phân Phối Trực Tiếp
          </span>
          <h2 class="text-4xl md:text-5xl lg:text-6xl font-black mt-2 mb-6 leading-tight tracking-tight">
            CUNG CẤP THÉP & DÂY THÉP <span class="text-red-500">GIÁ TẬN XƯỞNG</span>
          </h2>
          <p class="text-slate-300 text-base md:text-lg mb-8 leading-relaxed max-w-2xl font-normal">
            Chuyên Thép xây dựng VIS, Thép cây D10-D32, Dây buộc 1 ly, Thép rút đen 1ly-10ly, Lưới trát tường chống nứt công trình. Cam kết giao hàng xe cẩu tận chân công trình toàn quốc.
          </p>

          <div class="flex flex-wrap gap-4 items-center">
            <a href="#products" class="bg-red-600 hover:bg-red-700 text-white font-extrabold px-8 py-4 rounded-2xl shadow-xl shadow-red-600/30 hover:scale-105 transition duration-300 uppercase tracking-wide text-sm">
              Xem Bảng Giá Hôm Nay
            </a>
            <a href="tel:0932283783" class="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-extrabold px-6 py-4 rounded-2xl shadow-xl hover:scale-105 transition duration-300 flex items-center gap-2 text-sm">
              <Phone class="w-5 h-5 text-slate-900 fill-slate-900"/> Gọi Hotline: 093 228 37 83
            </a>
          </div>

          <!-- Trust Badges Under Hero -->
          <div class="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-slate-800/80 text-xs font-bold text-slate-300">
            <div class="flex items-center gap-2">
              <CheckCircle2 class="w-5 h-5 text-red-500 flex-shrink-0" />
              <span>Chứng chỉ CO/CQ chuẩn nhà máy</span>
            </div>
            <div class="flex items-center gap-2">
              <CheckCircle2 class="w-5 h-5 text-red-500 flex-shrink-0" />
              <span>Giao xe cẩu 24/7 toàn miền Nam & Bắc</span>
            </div>
            <div class="flex items-center gap-2">
              <CheckCircle2 class="w-5 h-5 text-red-500 flex-shrink-0" />
              <span>Bán sỉ & lẻ theo kilôgam / cây</span>
            </div>
          </div>
        </div>

        <div class="lg:col-span-5 relative">
          <div class="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800 group">
            <img src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800" class="object-cover h-[420px] w-full group-hover:scale-105 transition duration-700"/>
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
            <div class="absolute bottom-6 left-6 right-6 p-4 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-700">
              <div class="flex justify-between items-center text-xs font-bold">
                <span class="text-yellow-400 uppercase tracking-widest">Kho Hàng Sẵn Có</span>
                <span class="bg-red-600 text-white px-2.5 py-0.5 rounded-full">+10.000 Tấn Thép</span>
              </div>
              <p class="text-white text-sm font-black mt-1">Kho tổng Thép Việt Tín - Hỗ trợ vận chuyển ngay trong ngày</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Value Propositions -->
    <section class="bg-white border-b border-slate-200 py-8 px-6 shadow-sm">
      <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="flex items-start space-x-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-red-200 hover:shadow-md transition">
          <div class="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
            <Factory class="w-6 h-6" />
          </div>
          <div>
            <h4 class="font-extrabold text-slate-900 text-base">Giá Tận Kho Sản Xuất</h4>
            <p class="text-xs text-slate-500 mt-1 leading-relaxed">Cung cấp trực tiếp từ nhà máy thép không qua trung gian, chiết khấu cực tốt cho đại lý & dự án.</p>
          </div>
        </div>

        <div class="flex items-start space-x-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-red-200 hover:shadow-md transition">
          <div class="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
            <Truck class="w-6 h-6" />
          </div>
          <div>
            <h4 class="font-extrabold text-slate-900 text-base">Vận Chuyển Xe Cẩu Tận Chân Công Trình</h4>
            <p class="text-xs text-slate-500 mt-1 leading-relaxed">Đội xe cẩu thùng chuyên nghiệp bốc dỡ tận công trình, đảm bảo tiến độ đổ bê tông.</p>
          </div>
        </div>

        <div class="flex items-start space-x-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-red-200 hover:shadow-md transition">
          <div class="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
            <Award class="w-6 h-6" />
          </div>
          <div>
            <h4 class="font-extrabold text-slate-900 text-base">Cam Kết Đạt Tiêu Chuẩn CO/CQ</h4>
            <p class="text-xs text-slate-500 mt-1 leading-relaxed">Đầy đủ chứng chỉ xuất xưởng, đạt chuẩn mác thép CB300V, CB400V, TCVN 1651-2.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- STEEL WEIGHT CALCULATOR SECTION -->
    <section class="max-w-7xl mx-auto px-6">
      <SteelCalculator />
    </section>

    <!-- PRODUCT CATALOG & SEARCH FILTER -->
    <section id="products" class="py-12 px-6 max-w-7xl mx-auto">
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8 gap-6">
        <div>
          <span class="text-xs font-extrabold text-red-600 uppercase tracking-widest block mb-1">Bảng giá & Báo giá trực tuyến</span>
          <h3 class="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">DANH MỤC SẢN PHẨM THÉP</h3>
          <p class="text-slate-500 text-sm mt-1">Chọn quy cách sản phẩm để thêm vào Đơn Báo Giá nhanh</p>
        </div>

        <!-- Search Bar -->
        <div class="relative w-full lg:w-96">
          <input 
            v-model="searchKeyword" 
            type="text" 
            placeholder="Tìm tên thép, mác thép, quy cách (D12, D14, 1ly...)" 
            class="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm text-sm outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"/>
          <Search class="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
        </div>
      </div>

      <!-- Category Tabs Filter -->
      <div class="flex items-center gap-2 overflow-x-auto pb-4 mb-8 text-xs font-extrabold border-b border-slate-200">
        <button 
          @click="selectCategory(null)" 
          :class="['px-5 py-2.5 rounded-xl transition whitespace-nowrap', selectedCategoryId === null ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-600 border hover:bg-slate-100']">
          TẤT CẢ SẢN PHẨM
        </button>

        <button 
          v-for="cat in categories" 
          :key="cat.id" 
          @click="selectCategory(cat.id)"
          :class="['px-5 py-2.5 rounded-xl transition whitespace-nowrap', selectedCategoryId === cat.id ? 'bg-red-600 text-white shadow-md' : 'bg-white text-slate-600 border hover:bg-slate-100']">
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
          v-for="product in filteredProducts" 
          :key="product.id" 
          class="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition duration-300 flex flex-col justify-between group">
          
          <div>
            <!-- Image & Badge -->
            <div class="relative overflow-hidden bg-slate-100 h-56">
              <img 
                :src="product.imageUrl" 
                :alt="product.name" 
                class="w-full h-full object-cover group-hover:scale-105 transition duration-500"/>
              
              <span class="absolute top-3 left-3 bg-red-600 text-white text-[11px] font-black px-3 py-1 rounded-full uppercase shadow-md tracking-wider">
                {{ product.badge || 'Sẵn Kho' }}
              </span>

              <span class="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-slate-200 text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg">
                SKU: {{ product.sku || 'VT-' + product.id }}
              </span>
            </div>

            <!-- Content -->
            <div class="p-6">
              <span class="text-[11px] font-extrabold text-red-600 uppercase tracking-widest block mb-1">
                {{ product.category || 'Thép Công Trình' }}
              </span>

              <h4 class="text-xl font-extrabold text-slate-900 mb-2 leading-snug group-hover:text-red-600 transition">
                {{ product.name }}
              </h4>

              <div class="bg-slate-50 border border-slate-100 p-3 rounded-xl mb-3">
                <span class="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Quy cách kĩ thuật:</span>
                <p class="text-xs font-extrabold text-slate-800">{{ product.specifications }}</p>
              </div>

              <p class="text-slate-500 text-xs leading-relaxed line-clamp-2">{{ product.description }}</p>
            </div>
          </div>

          <!-- Bottom Footer Card -->
          <div class="p-6 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
            <div>
              <span class="block text-[10px] font-bold text-slate-400 uppercase">Đơn giá niêm yết:</span>
              <span class="text-lg font-black text-red-600">{{ formatPrice(product.pricePerUnit) }}</span>
              <span class="text-[10px] text-slate-500 font-bold"> / {{ product.unit }}</span>
            </div>

            <div class="flex items-center gap-1.5">
              <button 
                @click="openDetail(product)"
                class="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                title="Xem Chi Tiết CO/CQ">
                <Eye class="w-4 h-4" />
              </button>
              <button 
                @click="cartStore.addToCart(product); isCartOpen = true" 
                class="bg-slate-950 hover:bg-red-600 text-white font-extrabold px-3.5 py-2.5 rounded-xl text-xs uppercase shadow-md transition duration-200 flex items-center gap-1.5 whitespace-nowrap">
                + Giỏ Báo Giá
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Company About & Contact Info -->
    <section id="about" class="bg-slate-900 text-white py-16 px-6 mt-16 border-t border-slate-800">
      <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Col 1 -->
        <div>
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-10 h-10 bg-red-600 text-white font-black text-xl rounded-xl flex items-center justify-center">
              VT
            </div>
            <h4 class="text-xl font-black">THÉP VIỆT TÍN</h4>
          </div>
          <p class="text-slate-400 text-xs leading-relaxed mb-4">
            Công ty Chuyên phân phối Thép Xây Dựng, Dây buộc 1 ly, Thép rút đen, Lưới thép trát tường. Cam kết chất lượng hàng đầu, đầy đủ chứng chỉ CO/CQ.
          </p>
        </div>

        <!-- Col 2 -->
        <div>
          <h5 class="font-extrabold text-sm uppercase text-red-500 mb-4 tracking-wider">Danh Mục Sản Phẩm</h5>
          <ul class="space-y-2 text-xs font-semibold text-slate-300">
            <li><a href="#products" class="hover:text-red-400 transition">Thép Cây VIS CB300V / CB400V</a></li>
            <li><a href="#products" class="hover:text-red-400 transition">Dây Buộc 1 Ly (Thép Ủ Mềm)</a></li>
            <li><a href="#products" class="hover:text-red-400 transition">Thép Rút Đen D1 - D10</a></li>
            <li><a href="#products" class="hover:text-red-400 transition">Lưới Trát Tường Chống Nứt</a></li>
            <li><a href="#products" class="hover:text-red-400 transition">Thép Hộp Mạ Kẽm & Xà Gồ</a></li>
          </ul>
        </div>

        <!-- Col 3 -->
        <div id="contact">
          <h5 class="font-extrabold text-sm uppercase text-red-500 mb-4 tracking-wider">Hệ Thống Kho Hàng</h5>
          <ul class="space-y-2.5 text-xs text-slate-300">
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
          <h5 class="font-extrabold text-sm uppercase text-red-500 mb-4 tracking-wider">Hotline Báo Giá 24/7</h5>
          <a href="tel:0932283783" class="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-black px-4 py-3 rounded-xl text-sm mb-3 transition shadow-lg">
            <Phone class="w-4 h-4" /> 093 228 37 83
          </a>
          <p class="text-slate-400 text-xs">Liên hệ trực tiếp Zalo / Điện thoại để chốt giá chiết khấu đơn dự án lớn.</p>
        </div>
      </div>

      <div class="max-w-7xl mx-auto border-t border-slate-800 mt-12 pt-6 text-center text-xs text-slate-500">
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