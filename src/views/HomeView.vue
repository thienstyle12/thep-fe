<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api';
import Navbar from '../components/Navbar.vue';
import {
  Phone, MapPin, Mail, Facebook, Youtube, MessageCircle,
  ChevronRight, ArrowRight, CheckCircle2, ChevronLeft,
  Calendar, TrendingUp, Clock, Truck, ShieldCheck,
  Users, Star, Package
} from 'lucide-vue-next';

import { FALLBACK_CATEGORIES } from '../data/fallbackData';

interface Category { id: number; name: string; code: string; }

const router = useRouter();
const categories = ref<Category[]>(FALLBACK_CATEGORIES);

const fetchCategories = async () => {
  try {
    const res = await api.get('/categories');
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      categories.value = res.data;
    }
  } catch {
    // Nếu backend chưa kết nối thì giữ nguyên dữ liệu mặc định FALLBACK_CATEGORIES
  }
};

onMounted(fetchCategories);

// ─── Category images ───────────────────────────────────────────────────────
const CATEGORY_META: Record<string, { image: string; desc: string }> = {
  THAP_XAY_DUNG: {
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSg6J3q4zJ7dDLvUA_RJv5_BUHjVQNPjaz0pRFkAAgOtA&s=10',
    desc: 'Thép cây CB300V, CB400V, Thép cuộn D6-D32 Hòa Phát, VIS, Pomina',
  },
  DAY_THAP_RUT: {
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&q=80',
    desc: 'Dây buộc 1 ly, Thép rút đen D1-D10, Dây kẽm mạ bóng công trình',
  },
  LUOI_THAP: {
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80',
    desc: 'Lưới trát tường chống nứt, Lưới thép hàn D4-D10 ô 100×100mm',
  },
  THAP_HOP: {
    image: 'https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?w=800&q=80',
    desc: 'Thép hộp mạ kẽm vuông 40×40, 50×100, Xà gồ C, Z mạ kẽm',
  },
  THAP_HINH: {
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80',
    desc: 'Thép V góc, Thép I150, I200, Thép U, thép tấm kết cấu',
  },
};

const goToProducts = (catId: number) =>
  router.push({ name: 'products', params: { categoryId: catId } });

// ─── Project Slider ────────────────────────────────────────────────────────
const projects = [
  {
    name: 'Dự án Nhà Xưởng Long An',
    desc: 'Cung cấp thép hình kết cấu cho nhà xưởng công nghiệp 5.000 m², đảm bảo tiến độ và chất lượng CO/CQ.',
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1200&q=80',
  },
  {
    name: 'Khu Đô Thị Bình Dương',
    desc: 'Phân phối thép cây CB400V cho hơn 200 tòa nhà dân cư, tổng sản lượng hơn 3.000 tấn.',
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80',
  },
  {
    name: 'Cầu đường Hưng Yên',
    desc: 'Cung cấp thép tấm, thép hình cho dự án hạ tầng cầu đường tỉnh lộ, đạt chuẩn công trình nhà nước.',
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=80',
  },
  {
    name: 'Trung Tâm Thương Mại Hà Nội',
    desc: 'Cung cấp xà gồ, thép hộp cho kết cấu mái và vách ngăn tòa nhà thương mại 12 tầng.',
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80',
  },
  {
    name: 'Khu Công Nghiệp Đồng Nai',
    desc: 'Phân phối dây buộc, thép rút cho 15 nhà máy trong khu công nghiệp, giao hàng theo tiến độ.',
    image: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=1200&q=80',
  },
];

const currentProject = ref(0);
let projectTimer: any = null;

const nextProject = () => { currentProject.value = (currentProject.value + 1) % projects.length; };
const prevProject = () => { currentProject.value = (currentProject.value - 1 + projects.length) % projects.length; };
const goProject = (i: number) => { currentProject.value = i; };

onMounted(() => { projectTimer = setInterval(nextProject, 4500); });
onUnmounted(() => { if (projectTimer) clearInterval(projectTimer); });

// ─── News ──────────────────────────────────────────────────────────────────
const news = [
  {
    title: 'Giá thép hôm nay 12/8: Thị trường thế giới biến động, giá nội địa đi ngang',
    date: '12/08/2026',
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600&q=80',
    tag: 'Giá Thép',
  },
  {
    title: 'Khả năng chịu lực của thép H phụ thuộc vào gì? Cách đọc thông số tiết diện',
    date: '10/08/2026',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80',
    tag: 'Kiến Thức',
  },
  {
    title: 'Thép cuộn CB300V vs CB400V: Khác nhau như thế nào, dùng cho công trình nào?',
    date: '08/08/2026',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80',
    tag: 'Tư Vấn',
  },
];
</script>

<template>
  <div class="bg-white text-slate-800 min-h-screen">
    <!-- ═══ NAVBAR ═══════════════════════════════════════════════════════════ -->
    <Navbar :categories="categories" />

    <!-- ═══ HERO BANNER ══════════════════════════════════════════════════════ -->
    <section class="relative overflow-hidden" style="height:240px">
      <img
        src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1600&q=80"
        alt="Thép Việt Tín"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-r from-slate-950 via-[#006a64]/90 to-[#00544f]/80"></div>
      <div class="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-center gap-8">
        <div>
          <div class="flex items-center gap-2 mb-3">
            <span class="w-1.5 h-8 bg-yellow-400 rounded-full"></span>
            <span class="text-xs font-bold text-teal-100 uppercase tracking-widest">Nhà phân phối thép công trình</span>
          </div>
          <h1 class="text-4xl md:text-5xl font-black text-white leading-tight drop-shadow-lg">
            THÉP VIỆT TÍN
          </h1>
          <p class="text-teal-100/90 text-sm mt-2 font-medium">
            Cung cấp thép xây dựng · Giá tận kho · Giao xe cẩu tận công trình
          </p>
        </div>
        <div class="ml-auto hidden md:flex flex-col gap-2">
          <a href="tel:0932283783"
            class="flex items-center gap-2 bg-[#006a64] hover:bg-[#00544f] border border-teal-400/40 text-white font-black px-5 py-3 rounded-xl text-sm transition shadow-xl">
            <Phone class="w-4 h-4 text-yellow-300" /> 093 228 37 83
          </a>
          <a href="https://zalo.me/0932283783" target="_blank"
            class="flex items-center gap-2 bg-slate-900/80 hover:bg-black text-white font-bold px-5 py-2.5 rounded-xl text-sm transition border border-white/20">
            <MessageCircle class="w-4 h-4 text-blue-300" /> Zalo Tư Vấn
          </a>
        </div>
      </div>
    </section>

    <!-- ═══ TRUST BAR ════════════════════════════════════════════════════════ -->
    <div class="bg-[#006a64] text-white py-2.5 px-4 shadow-md">
      <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-5 text-xs font-bold">
        <span class="flex items-center gap-1.5"><CheckCircle2 class="w-3.5 h-3.5 shrink-0 text-yellow-300" /> Cam kết CO/CQ đầy đủ</span>
        <span class="text-teal-300 hidden sm:inline">|</span>
        <span class="flex items-center gap-1.5"><CheckCircle2 class="w-3.5 h-3.5 shrink-0 text-yellow-300" /> Giao xe cẩu tận công trình</span>
        <span class="text-teal-300 hidden sm:inline">|</span>
        <span class="flex items-center gap-1.5"><CheckCircle2 class="w-3.5 h-3.5 shrink-0 text-yellow-300" /> Giá tận kho, không qua trung gian</span>
        <span class="text-teal-300 hidden sm:inline">|</span>
        <span class="flex items-center gap-1.5"><CheckCircle2 class="w-3.5 h-3.5 shrink-0 text-yellow-300" /> Hotline 24/7: 093 228 37 83</span>
      </div>
    </div>

    <!-- ═══ SẢN PHẨM (CATEGORY GRID) ════════════════════════════════════════ -->
    <section class="py-12 px-4 max-w-7xl mx-auto border-b border-slate-100">
      <div class="mb-8 flex items-end justify-between">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="w-1.5 h-6 bg-[#006a64] rounded-full"></span>
            <h2 class="text-2xl md:text-3xl font-black text-slate-900 tracking-tight uppercase">Sản Phẩm</h2>
          </div>
          <p class="text-slate-500 text-sm ml-3 pl-2 border-l-2 border-slate-200">
            Nhấp vào danh mục để xem đầy đủ sản phẩm và báo giá chi tiết
          </p>
        </div>
        <button @click="goToProducts(categories[0]?.id)"
          class="hidden sm:flex items-center gap-1.5 text-sm font-bold text-[#006a64] hover:text-[#00544f] transition">
          Xem tất cả <ArrowRight class="w-4 h-4" />
        </button>
      </div>

      <!-- Category Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
        <button
          v-for="(cat, idx) in categories"
          :key="cat.id"
          @click="goToProducts(cat.id)"
          class="group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-[#006a64] bg-white hover:-translate-y-1 cursor-pointer text-left focus:outline-none"
        >
          <div class="relative overflow-hidden" style="padding-bottom:66%">
            <img
              :src="CATEGORY_META[cat.code]?.image || 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&q=80'"
              :alt="cat.name"
              class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
            <!-- Watermark -->
            <div class="absolute bottom-0 left-0 right-0 flex items-center gap-1 px-2.5 py-1.5 bg-[#006a64]/90">
              <span class="w-5 h-5 bg-white rounded text-[8px] font-black text-[#006a64] flex items-center justify-center shrink-0">VT</span>
              <span class="text-white text-[10px] font-bold">THÉP VIỆT TÍN</span>
            </div>
          </div>
          <div class="bg-white px-3.5 py-3 flex items-center justify-between">
            <span class="font-black text-slate-800 text-sm group-hover:text-[#006a64] transition uppercase tracking-wide leading-tight">
              {{ cat.name }}
            </span>
            <ArrowRight class="w-3.5 h-3.5 text-slate-400 group-hover:text-[#006a64] group-hover:translate-x-0.5 transition-all shrink-0" />
          </div>
        </button>
      </div>
    </section>

    <!-- ═══ ĐỐI TÁC CỦA CHÚNG TÔI ══════════════════════════════════════════ -->
    <section class="py-12 px-4 border-t border-slate-100 bg-white">
      <div class="max-w-7xl mx-auto">
        <div class="flex items-center gap-2 mb-8">
          <span class="w-1.5 h-6 bg-[#006a64] rounded-full"></span>
          <h2 class="text-2xl font-black text-slate-800 uppercase tracking-tight">Đối Tác Của Chúng Tôi</h2>
        </div>
        <!-- Logo scroll row -->
        <div class="relative overflow-hidden">
          <div class="flex items-center gap-10 animate-marquee-slow">
            <!-- Logos duplicated for seamless loop -->
            <template v-for="round in 2" :key="round">
              <!-- Hòa Phát -->
              <div class="shrink-0 flex items-center justify-center h-14 px-4 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300">
                <div class="text-2xl font-black text-orange-600 tracking-tight">HÒA PHÁT</div>
              </div>
              <!-- VIS -->
              <div class="shrink-0 flex items-center justify-center h-14 px-4 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300">
                <div class="text-xl font-black text-blue-700 tracking-widest border-2 border-blue-700 px-3 py-1">VIS</div>
              </div>
              <!-- Pomina -->
              <div class="shrink-0 flex items-center justify-center h-14 px-4 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300">
                <div class="text-xl font-black text-red-700">POMINA</div>
              </div>
              <!-- VNSTEEL -->
              <div class="shrink-0 flex items-center justify-center h-14 px-4 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300">
                <div class="text-lg font-black text-slate-700 border border-slate-400 px-3 py-1">VNSTEEL</div>
              </div>
              <!-- Tisco -->
              <div class="shrink-0 flex items-center justify-center h-14 px-4 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300">
                <div class="text-xl font-black text-green-700 flex items-center gap-1">
                  <span class="text-3xl font-black">🏗</span> TISCO
                </div>
              </div>
              <!-- Posco -->
              <div class="shrink-0 flex items-center justify-center h-14 px-4 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300">
                <div class="text-lg font-black text-blue-900">POSCO</div>
              </div>
              <!-- JFE -->
              <div class="shrink-0 flex items-center justify-center h-14 px-4 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300">
                <div class="text-2xl font-black text-[#006a64] border-2 border-[#006a64] px-3">JFE</div>
              </div>
              <!-- Coil -->
              <div class="shrink-0 flex items-center justify-center h-14 px-4 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300">
                <div class="text-lg font-black text-slate-600">THÉP MIỀN NAM</div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ DỰ ÁN TIÊU BIỂU ════════════════════════════════════════════════ -->
    <section class="py-12 px-4 bg-slate-50 border-t border-slate-200">
      <div class="max-w-7xl mx-auto">
        <div class="flex items-center gap-2 mb-8">
          <span class="w-1.5 h-6 bg-[#006a64] rounded-full"></span>
          <h2 class="text-2xl font-black text-slate-800 uppercase tracking-tight">Dự Án Tiêu Biểu</h2>
        </div>

        <!-- Slider -->
        <div class="relative rounded-2xl overflow-hidden shadow-xl" style="height: 380px">
          <!-- Slides -->
          <TransitionGroup name="proj-fade">
            <div
              v-for="(proj, i) in projects"
              v-show="currentProject === i"
              :key="proj.name"
              class="absolute inset-0"
            >
              <img :src="proj.image" :alt="proj.name" class="w-full h-full object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent"></div>
              <!-- Caption -->
              <div class="absolute bottom-0 left-0 right-0 p-8">
                <h3 class="text-2xl font-black text-white mb-2">{{ proj.name }}</h3>
                <p class="text-slate-200 text-sm max-w-xl leading-relaxed">{{ proj.desc }}</p>
              </div>
            </div>
          </TransitionGroup>

          <!-- Arrows -->
          <button @click="prevProject"
            class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition z-10">
            <ChevronLeft class="w-5 h-5" />
          </button>
          <button @click="nextProject"
            class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition z-10">
            <ChevronRight class="w-5 h-5" />
          </button>

          <!-- Dots -->
          <div class="absolute bottom-4 right-8 flex items-center gap-2 z-10">
            <button
              v-for="(p, i) in projects" :key="i"
              @click="goProject(i)"
              :class="['h-2 rounded-full transition-all duration-300', currentProject === i ? 'w-6 bg-white' : 'w-2 bg-white/50']"
            ></button>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ CAM KẾT CHẤT LƯỢNG (4 CARDS TEAL) ═══════════════════════════════ -->
    <section class="py-12 px-4 bg-white border-t border-slate-100">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          <div class="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
            <div class="w-14 h-14 bg-[#006a64] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#00544f] transition">
              <ShieldCheck class="w-7 h-7 text-white" />
            </div>
            <h3 class="font-extrabold text-slate-800 text-base uppercase tracking-wide mb-2">
              Đảm Bảo Tiến Độ
            </h3>
            <p class="text-slate-500 text-sm leading-relaxed">
              Cam kết giao hàng đúng hẹn, hỗ trợ dự án của bạn luôn đúng lộ trình, giúp tiết kiệm thời gian và nâng cao hiệu quả công việc.
            </p>
          </div>

          <div class="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
            <div class="w-14 h-14 bg-[#006a64] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#00544f] transition">
              <Users class="w-7 h-7 text-white" />
            </div>
            <h3 class="font-extrabold text-slate-800 text-base uppercase tracking-wide mb-2">
              Đội Ngũ Chuyên Nghiệp
            </h3>
            <p class="text-slate-500 text-sm leading-relaxed">
              Tận tâm, giàu kinh nghiệm, luôn sẵn sàng hỗ trợ bạn từ A đến Z, mang lại giải pháp tối ưu và dịch vụ xuất sắc cho mọi nhu cầu của khách hàng.
            </p>
          </div>

          <div class="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
            <div class="w-14 h-14 bg-[#006a64] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#00544f] transition">
              <TrendingUp class="w-7 h-7 text-white" />
            </div>
            <h3 class="font-extrabold text-slate-800 text-base uppercase tracking-wide mb-2">
              Giá Cả Tốt Nhất
            </h3>
            <p class="text-slate-500 text-sm leading-relaxed">
              Chúng tôi cam kết mang đến sản phẩm chất lượng với mức giá hợp lý, giúp bạn tiết kiệm chi phí mà vẫn đạt được hiệu quả tối ưu.
            </p>
          </div>

          <div class="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
            <div class="w-14 h-14 bg-[#006a64] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#00544f] transition">
              <Star class="w-7 h-7 text-white" />
            </div>
            <h3 class="font-extrabold text-slate-800 text-base uppercase tracking-wide mb-2">
              Sản Phẩm Chất Lượng
            </h3>
            <p class="text-slate-500 text-sm leading-relaxed">
              Được chọn lọc kỹ lưỡng, cam kết bền bỉ và hiệu quả, mang đến giá trị lâu dài, giữ bạn yên tâm và hài lòng tuyệt đối với mỗi lựa chọn.
            </p>
          </div>

        </div>
      </div>
    </section>

    <!-- ═══ BANNER GIỚI THIỆU (SPLIT) ════════════════════════════════════════ -->
    <section class="flex flex-col md:flex-row" style="min-height: 280px">
      <!-- Left: Factory photo -->
      <div class="relative flex-1 min-h-[200px] md:min-h-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1513828583688-c52646db42da?w=900&q=80"
          alt="Kho thép Việt Tín"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-black/20"></div>
      </div>
      <!-- Right: Quote teal #006a64 -->
      <div class="flex-1 bg-[#006a64] flex flex-col items-center justify-center px-10 py-12 text-white text-center">
        <div class="text-4xl font-black text-white/20 mb-4 leading-none">"</div>
        <blockquote class="text-xl md:text-2xl font-extrabold leading-snug italic max-w-xs">
          Mỗi tấn thép giao đi – là một phần cam kết chúng tôi giữ trọn.
        </blockquote>
        <div class="w-12 h-0.5 bg-white/40 my-5"></div>
        <button
          @click="router.push({ name: 'products' })"
          class="px-6 py-2.5 border-2 border-white text-white font-black text-sm rounded-xl hover:bg-white hover:text-[#006a64] transition duration-200"
        >
          Xem Sản Phẩm
        </button>
      </div>
    </section>

    <!-- ═══ DỊCH VỤ GIAO HÀNG (4 CARDS) ═════════════════════════════════════ -->
    <section class="py-12 px-4 bg-slate-50 border-t border-slate-200">
      <div class="max-w-7xl mx-auto">
        <div class="flex items-center gap-2 mb-8">
          <span class="w-1.5 h-6 bg-[#006a64] rounded-full"></span>
          <h2 class="text-2xl font-black text-slate-800 uppercase tracking-tight">Dịch Vụ Giao Hàng</h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          <div class="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
            <div class="w-14 h-14 bg-[#006a64] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#00544f] transition">
              <Calendar class="w-7 h-7 text-white" />
            </div>
            <h3 class="font-extrabold text-slate-800 text-sm uppercase tracking-wide mb-2">Giao Theo Kỳ Hạn</h3>
            <p class="text-slate-500 text-sm leading-relaxed">Giao hàng đúng hẹn, sản phẩm luôn sẵn sàng, phục vụ liên tục – Chọn giao theo kỳ hạn, chọn sự tin cậy!</p>
          </div>

          <div class="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
            <div class="w-14 h-14 bg-[#006a64] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#00544f] transition">
              <Package class="w-7 h-7 text-white" />
            </div>
            <h3 class="font-extrabold text-slate-800 text-sm uppercase tracking-wide mb-2">Giao Theo Tiến Độ</h3>
            <p class="text-slate-500 text-sm leading-relaxed">Đúng tiến độ, đúng chất lượng – Đồng hành cùng bạn từng giai đoạn, mang lại sự thành công bền vững.</p>
          </div>

          <div class="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
            <div class="w-14 h-14 bg-[#006a64] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#00544f] transition">
              <Clock class="w-7 h-7 text-white" />
            </div>
            <h3 class="font-extrabold text-slate-800 text-sm uppercase tracking-wide mb-2">Giao Theo Định Kỳ</h3>
            <p class="text-slate-500 text-sm leading-relaxed">Dịch vụ giao hàng thường xuyên – Đảm bảo sản phẩm luôn sẵn sàng, đúng thời gian, giúp bạn duy trì sự liên tục.</p>
          </div>

          <div class="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
            <div class="w-14 h-14 bg-[#006a64] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#00544f] transition">
              <Truck class="w-7 h-7 text-white" />
            </div>
            <h3 class="font-extrabold text-slate-800 text-sm uppercase tracking-wide mb-2">Giao Ngay</h3>
            <p class="text-slate-500 text-sm leading-relaxed">Nhanh chóng, tiện lợi, đáp ứng kịp thời mọi nhu cầu của bạn mà không phải chờ đợi.</p>
          </div>

        </div>
      </div>
    </section>

    <!-- ═══ TIN TỨC VỀ THÉP ══════════════════════════════════════════════════ -->
    <section class="py-12 px-4 bg-white border-t border-slate-100">
      <div class="max-w-7xl mx-auto">
        <div class="flex items-end justify-between mb-8">
          <div class="flex items-center gap-2">
            <span class="w-1.5 h-6 bg-[#006a64] rounded-full"></span>
            <h2 class="text-2xl font-black text-slate-800 uppercase tracking-tight">Tin Tức Về Thép</h2>
          </div>
          <a href="#" class="hidden sm:flex items-center gap-1.5 text-sm font-bold text-[#006a64] hover:text-[#00544f] transition">
            Xem tất cả <ArrowRight class="w-4 h-4" />
          </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a
            v-for="item in news"
            :key="item.title"
            href="#"
            class="group block rounded-2xl overflow-hidden border border-slate-200 hover:border-[#006a64] hover:shadow-lg transition-all duration-300"
          >
            <div class="relative overflow-hidden h-48">
              <img :src="item.image" :alt="item.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <span class="absolute top-3 left-3 bg-[#006a64] text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                {{ item.tag }}
              </span>
            </div>
            <div class="p-5">
              <p class="text-[11px] text-slate-400 mb-2 font-medium">{{ item.date }}</p>
              <h3 class="font-extrabold text-slate-800 text-sm leading-snug group-hover:text-[#006a64] transition-colors line-clamp-3">
                {{ item.title }}
              </h3>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- ═══ FOOTER ════════════════════════════════════════════════════════════ -->
    <footer class="bg-[#004e4a] text-white py-12 px-4 border-t border-teal-900">
      <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Logo & About -->
        <div>
          <div class="flex items-center gap-3 mb-4 bg-white p-2.5 rounded-2xl w-fit shadow-md">
            <img src="/logo-viettin.svg" alt="THÉP VIỆT TÍN" class="h-12 w-auto" />
          </div>
          <p class="text-teal-100/80 text-xs leading-relaxed mb-5">
            Chuyên phân phối thép xây dựng, dây buộc 1 ly, thép rút đen, lưới thép trát tường. Cam kết chất lượng, đầy đủ CO/CQ.
          </p>
          <div class="flex items-center gap-2">
            <a href="#" class="w-8 h-8 bg-teal-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition">
              <Facebook class="w-4 h-4" />
            </a>
            <a href="#" class="w-8 h-8 bg-teal-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition">
              <Youtube class="w-4 h-4" />
            </a>
            <a href="https://zalo.me/0932283783" target="_blank"
              class="w-8 h-8 bg-teal-800 hover:bg-blue-500 rounded-lg flex items-center justify-center transition">
              <MessageCircle class="w-4 h-4" />
            </a>
          </div>
        </div>

        <!-- Product Links -->
        <div>
          <h5 class="font-extrabold text-sm uppercase text-white mb-4 tracking-wider pb-2 border-b border-teal-800">
            Danh Mục Sản Phẩm
          </h5>
          <ul class="space-y-2 text-xs text-teal-200">
            <li v-for="cat in categories" :key="cat.id">
              <button @click="goToProducts(cat.id)"
                class="hover:text-white transition flex items-center gap-1.5 text-left">
                <ChevronRight class="w-3 h-3 text-teal-400 shrink-0" /> {{ cat.name }}
              </button>
            </li>
            <li v-if="categories.length === 0" class="text-teal-400 italic">Đang tải...</li>
          </ul>
        </div>

        <!-- Warehouse -->
        <div>
          <h5 class="font-extrabold text-sm uppercase text-white mb-4 tracking-wider pb-2 border-b border-teal-800">
            Hệ Thống Kho Hàng
          </h5>
          <ul class="space-y-3 text-xs text-teal-200">
            <li class="flex items-start gap-2">
              <MapPin class="w-4 h-4 text-yellow-300 shrink-0 mt-0.5" />
              <span><strong class="text-white">Kho Miền Nam:</strong> Quốc Lộ 1A, Bình Tân, TP. Hồ Chí Minh</span>
            </li>
            <li class="flex items-start gap-2">
              <MapPin class="w-4 h-4 text-yellow-300 shrink-0 mt-0.5" />
              <span><strong class="text-white">Kho Miền Bắc:</strong> Cụm CN Yên Mỹ, Hưng Yên</span>
            </li>
            <li class="flex items-start gap-2">
              <Mail class="w-4 h-4 text-yellow-300 shrink-0 mt-0.5" />
              <span>thepviettin@gmail.com</span>
            </li>
          </ul>
        </div>

        <!-- Hotline -->
        <div>
          <h5 class="font-extrabold text-sm uppercase text-white mb-4 tracking-wider pb-2 border-b border-teal-800">
            Hotline Báo Giá 24/7
          </h5>
          <a href="tel:0932283783"
            class="flex items-center gap-2 bg-[#006a64] hover:bg-[#00544f] border border-teal-400/30 text-white font-black px-4 py-3 rounded-xl text-sm mb-3 transition shadow-lg w-full justify-center">
            <Phone class="w-4 h-4 text-yellow-300" /> 093 228 37 83
          </a>
          <a href="https://zalo.me/0932283783" target="_blank"
            class="flex items-center gap-2 bg-teal-900 hover:bg-teal-800 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition w-full justify-center mb-3 border border-teal-700">
            <MessageCircle class="w-4 h-4 text-blue-300" /> Zalo: 093 228 37 83
          </a>
          <p class="text-teal-300 text-xs leading-relaxed">
            Liên hệ để nhận báo giá chiết khấu đặc biệt cho đơn dự án lớn.
          </p>
        </div>
      </div>

      <div class="max-w-7xl mx-auto border-t border-teal-900 mt-10 pt-6 text-center text-xs text-teal-400">
        © 2026 THÉP VIỆT TÍN. Bản quyền thuộc về Thép Việt Tín — Chất Lượng Tạo Niềm Tin.
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Project slider transition */
.proj-fade-enter-active,
.proj-fade-leave-active {
  transition: opacity 0.6s ease;
}
.proj-fade-enter-from,
.proj-fade-leave-to {
  opacity: 0;
}

/* Marquee animation for partner logos */
@keyframes marquee-slow {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.animate-marquee-slow {
  animation: marquee-slow 28s linear infinite;
  white-space: nowrap;
  width: max-content;
}
.animate-marquee-slow:hover {
  animation-play-state: paused;
}
</style>
