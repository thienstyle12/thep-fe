<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { ChevronLeft, ChevronRight, Phone, Factory, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-vue-next';

interface Slide {
  id: number;
  tag: string;
  title: string;
  highlight: string;
  titleEnd: string;
  desc: string;
  image: string;
  badge: string;
  primaryBtn: string;
  secondaryBtn: string;
}

const slides: Slide[] = [
  {
    id: 1,
    tag: 'TỔNG KHO SẢN XUẤT & PHÂN PHỐI TRỰC TIẾP',
    title: 'CUNG CẤP THÉP & DÂY THÉP',
    highlight: 'GIÁ TẬN XƯỞNG',
    titleEnd: '',
    desc: 'Chuyên Thép xây dựng VIS, Thép cây D10-D32, Dây buộc 1 ly, Thép rút đen 1ly-10ly, Lưới trát tường chống nứt. Hỗ trợ xe cẩu giao tận chân công trình toàn quốc.',
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1200',
    badge: '+10.000 Tấn Thép Sẵn Kho',
    primaryBtn: 'Xem Bảng Giá Hôm Nay',
    secondaryBtn: 'Gọi Hotline: 093 228 37 83'
  },
  {
    id: 2,
    tag: 'ĐẠI LÝ PHÂN PHỐI CẤP 1 CHÍNH HÃNG',
    title: 'THÉP HÌNH H, I, U, V & THÉP TẤM',
    highlight: 'ĐẠT CHUẨN CO/CQ',
    titleEnd: '',
    desc: 'Cung cấp thép hình kết cấu nhà xưởng, cầu đường, thép tấm chịu lực cắt quy cách theo yêu cầu. Đầy đủ chứng chỉ CO/CQ xuất xưởng nhà máy Hòa Phát, VIS, Pomina.',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200',
    badge: 'Cam Kết CO/CQ Xuất Xưởng',
    primaryBtn: 'Báo Giá Thép Kết Cấu',
    secondaryBtn: 'Tư Vấn Kỹ Thuật Dự Án'
  },
  {
    id: 3,
    tag: 'HỆ THỐNG KHO VẬN CHUYÊN NGHIỆP',
    title: 'GIAO HÀNG TẬN CÔNG TRÌNH',
    highlight: '24/7 SIÊU TỐC',
    titleEnd: '',
    desc: 'Đội xe cẩu chuyên dụng bốc dỡ tận nơi tại TP.HCM, Bình Dương, Đồng Nai, Hưng Yên, Hà Nội... Đảm bảo tiến độ đổ bê tông liên tục không bị gián đoạn.',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=1200',
    badge: 'Vận Chuyển Xe Cẩu Thùng',
    primaryBtn: 'Tra Cứu Tiến Độ Đơn Hàng',
    secondaryBtn: 'Hotline: 093 228 37 83'
  }
];

const currentSlide = ref(0);
let timer: any = null;

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length;
};

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length;
};

const goToSlide = (idx: number) => {
  currentSlide.value = idx;
};

onMounted(() => {
  timer = setInterval(nextSlide, 5000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<template>
  <section class="relative bg-teal-950 text-white overflow-hidden py-16 md:py-24 px-6 border-b border-teal-900">
    <!-- Background Glow Effects in Corporate Teal/Emerald -->
    <div class="absolute -top-40 -right-40 w-[500px] h-[500px] bg-teal-600/20 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

    <div class="max-w-7xl mx-auto relative z-10">
      <!-- Slides Container -->
      <div class="relative min-h-[440px] flex items-center">
        <TransitionGroup name="slide-fade">
          <div 
            v-for="(slide, idx) in slides" 
            :key="slide.id"
            v-show="currentSlide === idx"
            class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full"
          >
            <!-- Left Text Content -->
            <div class="lg:col-span-7 space-y-6">
              <span class="inline-flex items-center gap-2 bg-teal-900/90 text-teal-300 text-xs font-black uppercase px-4 py-2 rounded-xl border border-teal-700/50 shadow-lg tracking-wider">
                <Factory class="w-4 h-4 text-yellow-400" /> {{ slide.tag }}
              </span>

              <h2 class="text-3xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white">
                {{ slide.title }} <span class="text-yellow-400 underline decoration-[#006a64] decoration-4">{{ slide.highlight }}</span> {{ slide.titleEnd }}
              </h2>

              <p class="text-teal-100/90 text-base md:text-lg leading-relaxed max-w-2xl font-normal">
                {{ slide.desc }}
              </p>

              <div class="flex flex-wrap gap-4 items-center pt-2">
                <a 
                  href="#products" 
                  class="bg-[#006a64] hover:bg-[#00544f] text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-[#006a64]/30 hover:scale-105 transition duration-300 uppercase tracking-wide text-sm flex items-center gap-2"
                >
                  {{ slide.primaryBtn }} <ArrowRight class="w-4 h-4" />
                </a>
                <a 
                  href="tel:0932283783" 
                  class="bg-yellow-400 hover:bg-yellow-300 text-teal-950 font-black px-6 py-4 rounded-2xl shadow-xl hover:scale-105 transition duration-300 flex items-center gap-2 text-sm"
                >
                  <Phone class="w-5 h-5 text-teal-950 fill-teal-950" /> {{ slide.secondaryBtn }}
                </a>
              </div>

              <!-- Trust Badges -->
              <div class="grid grid-cols-3 gap-4 pt-6 border-t border-teal-900/80 text-xs font-bold text-teal-200">
                <div class="flex items-center gap-2">
                  <CheckCircle2 class="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  <span>Chứng chỉ CO/CQ chuẩn nhà máy</span>
                </div>
                <div class="flex items-center gap-2">
                  <CheckCircle2 class="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  <span>Giao xe cẩu 24/7 toàn quốc</span>
                </div>
                <div class="flex items-center gap-2">
                  <CheckCircle2 class="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  <span>Bán sỉ & lẻ theo kg / cây</span>
                </div>
              </div>
            </div>

            <!-- Right Image Showcase -->
            <div class="lg:col-span-5 relative">
              <div class="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-teal-800/80 group">
                <img 
                  :src="slide.image" 
                  :alt="slide.title"
                  class="object-cover h-[420px] w-full group-hover:scale-105 transition duration-700"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-teal-950 via-teal-950/20 to-transparent"></div>
                <div class="absolute bottom-6 left-6 right-6 p-4 bg-teal-900/90 backdrop-blur-md rounded-2xl border border-teal-700/60 shadow-xl">
                  <div class="flex justify-between items-center text-xs font-bold mb-1">
                    <span class="text-yellow-400 uppercase tracking-widest">Kho Hàng Sẵn Có</span>
                    <span class="bg-[#006a64] text-white px-3 py-0.5 rounded-full font-black text-[11px]">{{ slide.badge }}</span>
                  </div>
                  <p class="text-white text-sm font-black">Kho tổng Thép Việt Tín — Hỗ trợ vận chuyển ngay trong ngày</p>
                </div>
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>

      <!-- Carousel Navigation Controls -->
      <div class="flex justify-between items-center mt-8 pt-4 border-t border-teal-900/60">
        <!-- Dots -->
        <div class="flex items-center space-x-3">
          <button 
            v-for="(s, i) in slides" 
            :key="s.id"
            @click="goToSlide(i)"
            :class="[
              'h-3 rounded-full transition-all duration-300',
              currentSlide === i ? 'w-10 bg-yellow-400 shadow-md shadow-yellow-400/50' : 'w-3 bg-teal-800 hover:bg-teal-600'
            ]"
            :title="`Slide ${i + 1}`"
          ></button>
        </div>

        <!-- Arrows -->
        <div class="flex items-center space-x-3">
          <button 
            @click="prevSlide" 
            class="w-11 h-11 rounded-2xl bg-teal-900 hover:bg-teal-800 text-teal-200 hover:text-white flex items-center justify-center border border-teal-700/60 transition duration-200 shadow-lg"
          >
            <ChevronLeft class="w-6 h-6" />
          </button>
          <button 
            @click="nextSlide" 
            class="w-11 h-11 rounded-2xl bg-teal-900 hover:bg-teal-800 text-teal-200 hover:text-white flex items-center justify-center border border-teal-700/60 transition duration-200 shadow-lg"
          >
            <ChevronRight class="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.6s ease-in-out;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(40px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-40px);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}
</style>
