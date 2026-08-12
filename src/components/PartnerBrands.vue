<script setup lang="ts">
import { ShieldCheck, Award, Factory, Truck } from 'lucide-vue-next';

const BRANDS = [
  { name: 'Thép Việt Ý (VIS)', desc: 'CB300V - CB400V Mác Thép Chuẩn', badge: 'Đối Tác Chiến Lược', logo: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300' },
  { name: 'Thép Hòa Phát', desc: 'Thép Cuộn & Thép Cây Cường Độ Cao', badge: 'Nhà Phân Phối Cấp 1', logo: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=300' },
  { name: 'Thép Pomina', desc: 'Đạt Chuẩn TCVN 1651-2 / JIS G3112', badge: 'Chính Hãng 100%', logo: 'https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?w=300' },
  { name: 'Thép Hoa Sen', desc: 'Thép Hộp & Tấm Mạ Kẽm Chống Ăn Mòn', badge: 'Tổng Kho Miền Nam', logo: 'https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?w=300' },
];
</script>

<template>
  <section class="py-16 px-6 bg-teal-950 text-white relative overflow-hidden border-b border-teal-900">
    <!-- Background Accents -->
    <div class="absolute top-0 right-0 w-80 h-80 bg-teal-600/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

    <div class="max-w-7xl mx-auto relative z-10">
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-12 animate-fade-in-up">
        <span class="inline-flex items-center gap-2 bg-teal-900/90 text-teal-300 text-xs font-black uppercase px-4 py-1.5 rounded-full border border-teal-700/60 tracking-widest mb-3 shadow-md">
          <Award class="w-4 h-4 text-yellow-400" /> THƯƠNG HIỆU THÉP HÀNG ĐẦU VIỆT NAM
        </span>
        <h3 class="text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
          ĐỐI TÁC CHÍNH THỨC CỦA CÁC TẬP ĐOÀN THÉP LỚN
        </h3>
        <p class="text-teal-200/80 text-sm md:text-base mt-3">
          Thép Việt Tín tự hào là đại lý phân phối cấp 1 trực tiếp từ các nhà máy sản xuất thép uy tín hàng đầu, đầy đủ chứng chỉ CO/CQ và hóa đơn VAT.
        </p>
      </div>

      <!-- Brands Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          v-for="(b, idx) in BRANDS" 
          :key="idx"
          class="group relative bg-teal-900/50 border border-teal-800 hover:border-yellow-400 rounded-3xl p-6 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-teal-500/20 animate-fade-in-up"
          :style="{ animationDelay: `${idx * 150}ms` }"
        >
          <div class="h-40 rounded-2xl overflow-hidden mb-4 relative bg-teal-950 border border-teal-800/80">
            <img :src="b.logo" :alt="b.name" class="w-full h-full object-cover group-hover:scale-110 transition duration-500 opacity-80 group-hover:opacity-100" />
            <div class="absolute inset-0 bg-gradient-to-t from-teal-950 via-teal-950/40 to-transparent"></div>
            <span class="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider shadow">
              {{ b.badge }}
            </span>
          </div>

          <h4 class="text-lg font-black text-white group-hover:text-yellow-400 transition mb-1">
            {{ b.name }}
          </h4>
          <p class="text-xs text-teal-100/70 leading-relaxed font-medium">
            {{ b.desc }}
          </p>

          <div class="mt-4 pt-4 border-t border-teal-800/80 flex items-center justify-between text-[11px] text-teal-200/80 font-bold">
            <span class="flex items-center gap-1 text-emerald-400">
              <ShieldCheck class="w-3.5 h-3.5" /> Có sẵn CO/CQ
            </span>
            <span class="text-yellow-400">Giao ngay 24/7</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
