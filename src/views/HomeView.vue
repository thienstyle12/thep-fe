<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';
import { Search, Phone, Factory, Truck, Award, CheckCircle2, Eye, ShoppingCart, ChevronLeft, ChevronRight, Sparkles, ArrowRight, Building2 } from 'lucide-vue-next';

const router = useRouter();
const cartStore = useCartStore();

const heroSlides = [
  {
    badge: 'Tổng Kho Sản Xuất & Phân Phối Trực Tiếp',
    badgeIcon: Factory,
    title: 'CUNG CẤP THÉP & DÂY THÉP',
    titleHighlight: 'GIÁ TẬN XƯỞNG',
    description: 'Chuyên Thép xây dựng VIS, Thép cây D10-D32, Dây buộc 1 ly, Thép rút đen 1ly-10ly, Lưới trát tường chống nứt công trình. Cam kết giao hàng xe cẩu tận chân công trình toàn quốc.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQO2OrauljcRycAsqIRxWQX5KTyBEs69WPjh_fmOZEQA&s=10',
    stockBadge: 'Kho Hàng Sẵn Có',
    tag: '+10.000 Tấn Thép',
    imageTitle: 'Kho tổng Thép Việt Tín - Thép Thanh Vằn D10 - D32'
  },
  {
    badge: 'Cam Kết Đạt Tiêu Chuẩn CO/CQ Nhà Máy',
    badgeIcon: Award,
    title: 'THÉP THANH VẰN & THÉP HỘP',
    titleHighlight: 'CHUẨN CÔNG TRÌNH',
    description: 'Đạt chuẩn mác thép CB300V, CB400V, CB500V, TCVN 1651-2. Cung cấp đầy đủ hồ sơ nghiệm thu, chứng chỉ xuất xưởng cho các dự án lớn toàn quốc.',
    image: 'https://bizweb.dktcdn.net/100/516/073/products/the-p-ho-p-chu-nha-t-jpeg-1502cbff-ba68-4a63-bc76-2d665954c645.jpg?v=1722150709270',
    stockBadge: 'Kiểm Định Quốc Gia',
    tag: 'Đạt Chuẩn TCVN 100%',
    imageTitle: 'Thép Hộp Mạ Kẽm & Thép Hình V/I/U Chiết Khấu Cao'
  },
  {
    badge: 'Vận Chuyển Chuyên Nghiệp 24/7',
    badgeIcon: Truck,
    title: 'ĐỘI XE CẨU 5T - 25T BỐC DỠ',
    titleHighlight: 'TẬN CÔNG TRÌNH',
    description: 'Đội xe cẩu tự hành chuyên nghiệp giao hàng tận chân công trình 24/7 miền Nam & Bắc, giúp chủ đầu tư chủ động tiến độ đổ bê tông.',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
    stockBadge: 'Vận Chuyển Hỏa Tốc',
    tag: 'Giao Xe Cẩu 24/7',
    imageTitle: 'Bốc dỡ hạ hàng tận chân công trình an toàn & đúng giờ'
  }
];

// Steel Partner Brands List (Matching Screenshot)
const partnerLogos = [
  { name: 'HÒA PHÁT', boxed: false },
  { name: 'THÉP MIỀN NAM', boxed: false },
  { name: 'VIS', boxed: true },
  { name: 'POMINA', boxed: false },
  { name: 'TISCO', boxed: false, hasIcon: true },
  { name: 'POSCO', boxed: false },
  { name: 'JFE', boxed: true },
  { name: 'VINA KYOEI', boxed: false },
  { name: 'VINAUSTEEL', boxed: true },
  { name: 'FORMOSA', boxed: false }
];

const partnerLogosMarquee = computed(() => {
  return [...partnerLogos, ...partnerLogos, ...partnerLogos, ...partnerLogos];
});

const productGalleryList = [
  {
    id: 1,
    title: 'Thép Thanh Vằn D10 - D32 VIS',
    specs: 'Mác CB300V / CB400V / CB500V',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQO2OrauljcRycAsqIRxWQX5KTyBEs69WPjh_fmOZEQA&s=10',
    tag: 'Thép Cây',
    categoryId: 1,
    price: '16.500 đ/kg'
  },
  {
    id: 2,
    title: 'Thép Hộp Mạ Kẽm Vuông & Vuông Chữ Nhật',
    specs: 'Độ dày 1.2mm - 3.5mm x 6m',
    image: 'https://bizweb.dktcdn.net/100/516/073/products/the-p-ho-p-chu-nha-t-jpeg-1502cbff-ba68-4a63-bc76-2d665954c645.jpg?v=1722150709270',
    tag: 'Thép Hộp',
    categoryId: 4,
    price: '17.800 đ/kg'
  },
  {
    id: 3,
    title: 'Thép Tấm Công Nghiệp Cắt Theo Quy Cách',
    specs: 'Độ dày 3mm - 50mm, Cắt Khổ Rộng',
    image: 'https://thietbivntech.vn/wp-content/uploads/2026/03/cat-thep-tam-cnc-theo-quy-cach-4.webp',
    tag: 'Thép Tấm',
    categoryId: 5,
    price: '16.800 đ/kg'
  },
  {
    id: 4,
    title: 'Dây Buộc 1 Ly Ủ Mềm Công Trình',
    specs: 'Cuộn 50kg, Dẻo Dễ Buộc Giàn Giáo',
    image: 'https://steelonline.vn/web/image/product.template/1547/image',
    tag: 'Dây Buộc 1Ly',
    categoryId: 2,
    price: '18.500 đ/kg'
  },
  {
    id: 5,
    title: 'Thép Hình V / I / U Mạ Kẽm',
    specs: 'Cạnh V30 - V100, Thép Cấu Trúc',
    image: 'https://www.hungphatsteel.com/wp-content/uploads/2025/09/Thep-hinh-U-V-ma-kem-2-700x700.webp',
    tag: 'Thép Hình V',
    categoryId: 5,
    price: '17.500 đ/kg'
  },
  {
    id: 6,
    title: 'Lưới Trát Tường Chống Nứt',
    specs: 'Lưới Thép Ô Vuông 10x10mm',
    image: 'https://kholuoithep.com/wp-content/uploads/2022/11/Luoi-trat-tuong-chong-nut-kholuoithepxaydung.jpg',
    tag: 'Lưới Chống Nứt',
    categoryId: 3,
    price: '12.000 đ/m²'
  }
];

const currentSlide = ref(0);
const isPaused = ref(false);
let slideTimer: any = null;
let observer: IntersectionObserver | null = null;

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % heroSlides.length;
};

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + heroSlides.length) % heroSlides.length;
  startTimer();
};

const goToSlide = (idx: number) => {
  currentSlide.value = idx;
  startTimer();
};

const startTimer = () => {
  stopTimer();
  isPaused.value = false;
  slideTimer = setInterval(() => {
    nextSlide();
  }, 3000);
};

const stopTimer = () => {
  if (slideTimer) {
    clearInterval(slideTimer);
    slideTimer = null;
  }
};

const goToCategoryPage = (catId: number | null) => {
  if (catId !== null) {
    router.push({ name: 'products', query: { categoryId: catId } });
  } else {
    router.push({ name: 'products' });
  }
};

const displayCount1 = ref(10000);
const displayCount2 = ref(500);
const displayCount3 = ref(100);
const isCounted = ref(false);

const startCountingStats = () => {
  if (isCounted.value) return;
  isCounted.value = true;
  const duration = 1800;
  const startTime = performance.now();

  const animate = (now: number) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3);

    displayCount1.value = Math.floor(easeProgress * 10000);
    displayCount2.value = Math.floor(easeProgress * 500);
    displayCount3.value = Math.floor(easeProgress * 100);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
};

const initScrollObserver = () => {
  if (observer) observer.disconnect();
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          if (entry.target.classList.contains('banner-thut-tho')) {
            startCountingStats();
          }
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.reveal-on-scroll, .banner-thut-tho').forEach((el) => {
    observer?.observe(el);
  });
};

onMounted(() => {
  startTimer();
  nextTick(() => {
    initScrollObserver();
  });
});

onUnmounted(() => {
  stopTimer();
  if (observer) observer.disconnect();
});
</script>

<template>
  <div>
    <!-- Hero Banner Carousel với Hiệu Ứng Chuyển Cảnh Mượt Mà Tự Động 3s -->
    <section 
      class="bg-gradient-to-b from-slate-950 via-[#003830] to-slate-950 text-white py-14 md:py-18 px-6 relative overflow-hidden group border-b border-slate-800"
    >
      <!-- Background Ambient Glow Animations -->
      <div class="absolute -top-32 right-0 w-[550px] h-[550px] bg-[#004d40]/30 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div class="absolute bottom-0 left-0 w-[450px] h-[450px] bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Carousel Navigation Arrows -->
      <button 
        @click="prevSlide" 
        class="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-2xl bg-slate-900/80 hover:bg-[#004d40] text-slate-300 hover:text-white border border-slate-700/80 flex items-center justify-center transition-all duration-300 shadow-xl backdrop-blur-md opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer"
        title="Trang trước"
      >
        <ChevronLeft class="w-6 h-6" />
      </button>

      <button 
        @click="nextSlide" 
        class="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-2xl bg-slate-900/80 hover:bg-[#004d40] text-slate-300 hover:text-white border border-slate-700/80 flex items-center justify-center transition-all duration-300 shadow-xl backdrop-blur-md opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer"
        title="Trang kế tiếp"
      >
        <ChevronRight class="w-6 h-6" />
      </button>

      <div class="max-w-7xl mx-auto relative z-10">
        <!-- Hiệu ứng Chuyển Cảnh Fade & Slide Transition -->
        <Transition name="banner-fade" mode="out-in">
          <div :key="currentSlide" class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <!-- Text Content -->
            <div class="lg:col-span-7 space-y-5">
              <div class="inline-flex items-center gap-2 bg-[#004d40]/60 border border-teal-400/30 text-teal-200 text-xs font-bold px-4 py-1.5 rounded-full backdrop-blur-md shadow-xs">
                <component :is="heroSlides[currentSlide].badgeIcon" class="w-4 h-4 text-amber-400 flex-shrink-0" /> 
                <span>{{ heroSlides[currentSlide].badge }}</span>
              </div>

              <h2 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white">
                {{ heroSlides[currentSlide].title }}
                <span class="text-amber-400 font-extrabold inline-block sm:inline ml-1">
                  {{ heroSlides[currentSlide].titleHighlight }}
                </span>
              </h2>

              <p class="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl font-normal">
                {{ heroSlides[currentSlide].description }}
              </p>

              <div class="flex flex-wrap gap-3.5 items-center pt-2">
                <router-link to="/products" class="bg-[#004d40] hover:bg-teal-700 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-[#004d40]/30 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 uppercase tracking-wide text-xs flex items-center gap-2">
                  <Sparkles class="w-4 h-4 text-amber-300 flex-shrink-0" /> Xem Trang Phân Loại Sản Phẩm
                </router-link>
                <a href="tel:0932283783" class="bg-slate-800/90 hover:bg-slate-800 text-slate-100 border border-slate-700 hover:border-amber-400/60 hover:text-amber-400 font-bold px-5 py-3.5 rounded-xl shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-200 flex items-center gap-2 text-xs">
                  <Phone class="w-4 h-4 text-amber-400 flex-shrink-0" /> Hotline: 093 228 37 83
                </a>
              </div>

              <div class="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4 border-t border-slate-800/90 text-xs font-medium text-slate-300">
                <div class="flex items-center gap-2">
                  <CheckCircle2 class="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Chứng chỉ CO/CQ chuẩn nhà máy</span>
                </div>
                <div class="flex items-center gap-2">
                  <CheckCircle2 class="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Giao xe cẩu 24/7 toàn quốc</span>
                </div>
                <div class="flex items-center gap-2">
                  <CheckCircle2 class="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Giá tận xưởng sỉ & lẻ</span>
                </div>
              </div>
            </div>

            <!-- Image Card với Hiệu ứng Scale Zoom -->
            <div class="lg:col-span-5 relative">
              <div class="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900 group/img">
                <img 
                  :src="heroSlides[currentSlide].image" 
                  :alt="heroSlides[currentSlide].imageTitle"
                  class="object-cover h-[320px] sm:h-[370px] w-full group-hover/img:scale-108 transition-transform duration-700 ease-out"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90"></div>
                <span class="absolute top-4 right-4 bg-[#004d40] text-white text-[11px] font-bold px-3 py-1 rounded-full border border-teal-400/30 shadow-md">
                  {{ heroSlides[currentSlide].tag }}
                </span>
                <div class="absolute bottom-4 left-4 right-4 p-4 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-700/80 shadow-lg">
                  <span class="text-amber-400 uppercase tracking-widest text-[11px] font-bold block mb-1">{{ heroSlides[currentSlide].stockBadge }}</span>
                  <p class="text-slate-100 text-xs font-bold leading-snug">{{ heroSlides[currentSlide].imageTitle }}</p>
                </div>
              </div>
            </div>
          </div>
        </Transition>

      </div>
    </section>

    <!-- SECTION ĐỐI TÁC CỦA CHÚNG TÔI (THAY THẾ CHỖ SẢN PHẨM BÁN CHẠY VỚI HIỆU ỨNG CUỘN 24/7 CHUẨN MẪU) -->
    <section class="bg-white border-y border-slate-200 py-6 overflow-hidden shadow-2xs">
      <div class="max-w-7xl mx-auto px-6 mb-4 flex items-center gap-2 text-sm font-extrabold text-[#004d40] uppercase tracking-wider">
        <span class="w-1.5 h-4 bg-[#004d40] rounded-full inline-block"></span>
        <span>ĐỐI TÁC CỦA CHÚNG TÔI</span>
      </div>

      <div class="relative overflow-hidden w-full py-2">
        <div class="animate-marquee flex items-center gap-10 whitespace-nowrap">
          <div 
            v-for="(brand, idx) in partnerLogosMarquee" 
            :key="idx"
            class="inline-flex items-center gap-2 text-slate-500 hover:text-[#004d40] font-black text-sm md:text-base tracking-wider uppercase px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 shadow-2xs hover:border-[#004d40] hover:bg-teal-50/50 transition duration-300 flex-shrink-0 group cursor-pointer"
          >
            <Building2 v-if="brand.hasIcon" class="w-4 h-4 text-slate-400 group-hover:text-[#004d40] transition" />
            <span v-if="brand.boxed" class="border border-slate-400 group-hover:border-[#004d40] px-2 py-0.5 rounded text-xs font-mono font-extrabold transition">
              {{ brand.name }}
            </span>
            <span v-else class="font-extrabold font-sans">
              {{ brand.name }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION HÌNH ẢNH SẢN PHẨM THÉP SẴN KHO (CHUYỂN THẲNG SANG TRANG PHÂN LOẠI KHI CLICK) -->
    <section class="bg-white border-b border-slate-200 py-12 px-6">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 reveal-on-scroll">
          <div>
            <span class="inline-flex items-center gap-1.5 text-xs font-bold text-[#004d40] uppercase tracking-wider block mb-1">
              <Sparkles class="w-4 h-4 text-amber-500" /> Thư viện hình ảnh thực tế
            </span>
            <h3 class="text-2xl font-black text-slate-900">DANH SÁCH HÌNH ẢNH SẢN PHẨM THÉP SẴN KHO</h3>
            <p class="text-slate-500 text-xs mt-0.5">Click vào hình ảnh sản phẩm bất kỳ để chuyển thẳng sang Trang Phân Loại Danh Mục riêng biệt</p>
          </div>

          <button 
            @click="goToCategoryPage(null)" 
            class="text-xs font-bold text-[#004d40] hover:text-teal-900 underline flex items-center gap-1 cursor-pointer"
          >
            Xem Trang Phân Loại {{ productGalleryList.length }} Quy Cách <ArrowRight class="w-3.5 h-3.5" />
          </button>
        </div>

        <!-- Grid 6 Hình Ảnh Sản Phẩm Trực Quan -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="(item, idx) in productGalleryList" 
            :key="item.id"
            @click="goToCategoryPage(item.categoryId)"
            :class="['bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-[#004d40] transition-all duration-500 group reveal-on-scroll cursor-pointer', `reveal-delay-${(idx % 3) + 1}`]"
          >
            <div class="relative h-56 overflow-hidden bg-slate-200">
              <img :src="item.image" :alt="item.title" class="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
              <span class="absolute top-3 left-3 bg-[#004d40] text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase shadow-xs">
                {{ item.tag }}
              </span>
              <span class="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-xs text-amber-400 text-[11px] font-bold px-2.5 py-1 rounded-lg font-mono">
                {{ item.price }}
              </span>
            </div>

            <div class="p-4 flex items-center justify-between">
              <div>
                <h4 class="font-bold text-slate-900 text-sm leading-snug group-hover:text-[#004d40] transition">{{ item.title }}</h4>
                <p class="text-xs text-slate-500 mt-0.5 font-medium">{{ item.specs }}</p>
              </div>

              <button 
                @click.stop="goToCategoryPage(item.categoryId)" 
                class="p-2.5 rounded-xl bg-white hover:bg-[#004d40] hover:text-white text-slate-700 border border-slate-200 transition shadow-xs flex items-center gap-1 text-xs font-semibold cursor-pointer"
                title="Mở Trang Phân Loại Danh Mục"
              >
                <Eye class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Value Propositions Section -->
    <section class="bg-slate-50 border-b border-slate-200 py-10 px-6">
      <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="flex items-start space-x-4 p-5 rounded-2xl bg-white border border-slate-200/80 reveal-on-scroll reveal-delay-1 hover:shadow-md transition">
          <div class="w-12 h-12 rounded-xl bg-teal-50 text-[#004d40] flex items-center justify-center flex-shrink-0 border border-teal-100">
            <Factory class="w-6 h-6" />
          </div>
          <div>
            <h4 class="font-bold text-slate-900 text-base">Giá Tận Kho Sản Xuất</h4>
            <p class="text-xs text-slate-500 mt-1 leading-relaxed">Cung cấp trực tiếp từ nhà máy thép không qua trung gian, chiết khấu dự án lớn.</p>
          </div>
        </div>

        <div class="flex items-start space-x-4 p-5 rounded-2xl bg-white border border-slate-200/80 reveal-on-scroll reveal-delay-2 hover:shadow-md transition">
          <div class="w-12 h-12 rounded-xl bg-teal-50 text-[#004d40] flex items-center justify-center flex-shrink-0 border border-teal-100">
            <Truck class="w-6 h-6" />
          </div>
          <div>
            <h4 class="font-bold text-slate-900 text-base">Vận Chuyển Xe Cẩu Công Trình</h4>
            <p class="text-xs text-slate-500 mt-1 leading-relaxed">Đội xe cẩu thùng chuyên nghiệp bốc dỡ tận nơi, đảm bảo tiến độ đổ bê tông.</p>
          </div>
        </div>

        <div class="flex items-start space-x-4 p-5 rounded-2xl bg-white border border-slate-200/80 reveal-on-scroll reveal-delay-3 hover:shadow-md transition">
          <div class="w-12 h-12 rounded-xl bg-teal-50 text-[#004d40] flex items-center justify-center flex-shrink-0 border border-teal-100">
            <Award class="w-6 h-6" />
          </div>
          <div>
            <h4 class="font-bold text-slate-900 text-base">Đạt Tiêu Chuẩn CO/CQ</h4>
            <p class="text-xs text-slate-500 mt-1 leading-relaxed">Đầy đủ chứng chỉ xuất xưởng, đạt chuẩn mác thép CB300V, CB400V, TCVN 1651-2.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- STATS COUNTER IMPACT SECTION WITH SCROLL ANIMATIONS -->
    <section class="bg-gradient-to-r from-slate-950 via-[#003830] to-slate-950 text-white py-12 px-6 border-b border-slate-800 banner-thut-tho animate-banner-sweep">
      <div class="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div class="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-md reveal-on-scroll reveal-delay-1 hover:border-amber-400/50 hover:-translate-y-1 transition duration-300 shadow-xl group">
          <div class="text-3xl md:text-4xl font-black text-amber-400 mb-1 font-mono group-hover:scale-105 transition">+{{ displayCount1.toLocaleString('vi-VN') }}</div>
          <p class="text-xs text-slate-300 font-extrabold uppercase tracking-wider">Tấn Thép Sẵn Kho</p>
        </div>
        <div class="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-md reveal-on-scroll reveal-delay-2 hover:border-amber-400/50 hover:-translate-y-1 transition duration-300 shadow-xl group">
          <div class="text-3xl md:text-4xl font-black text-amber-400 mb-1 font-mono group-hover:scale-105 transition">{{ displayCount2 }}+</div>
          <p class="text-xs text-slate-300 font-extrabold uppercase tracking-wider">Dự Án Đã Cung Cấp</p>
        </div>
        <div class="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-md reveal-on-scroll reveal-delay-3 hover:border-amber-400/50 hover:-translate-y-1 transition duration-300 shadow-xl group">
          <div class="text-3xl md:text-4xl font-black text-amber-400 mb-1 font-mono group-hover:scale-105 transition">{{ displayCount3 }}%</div>
          <p class="text-xs text-slate-300 font-extrabold uppercase tracking-wider">Chuẩn CO/CQ Nhà Máy</p>
        </div>
        <div class="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-md reveal-on-scroll reveal-delay-4 hover:border-amber-400/50 hover:-translate-y-1 transition duration-300 shadow-xl group">
          <div class="text-3xl md:text-4xl font-black text-amber-400 mb-1 font-mono group-hover:scale-105 transition">24/7</div>
          <p class="text-xs text-slate-300 font-extrabold uppercase tracking-wider">Giao Xe Cẩu Tận Nơi</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* HERO BANNER SMOOTH TRANSITION ANIMATIONS */
.banner-fade-enter-active,
.banner-fade-leave-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.banner-fade-enter-from {
  opacity: 0;
  transform: scale(0.97) translateY(12px);
}

.banner-fade-leave-to {
  opacity: 0;
  transform: scale(1.02) translateY(-12px);
}

/* BANNER COUNTDOWN PROGRESS BAR ANIMATION */
@keyframes slideProgress {
  0% { width: 0%; }
  100% { width: 100%; }
}

.animate-slide-progress {
  animation: slideProgress 3s linear infinite;
}

/* MARQUEE INFINITE AUTO-SCROLLING */
@keyframes marquee {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-marquee {
  display: flex;
  width: max-content;
  animation: marquee 25s linear infinite;
}

.animate-marquee:hover {
  animation-play-state: paused;
}
</style>
