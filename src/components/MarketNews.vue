<script setup lang="ts">
import { Newspaper, Calendar, ArrowRight, TrendingUp } from 'lucide-vue-next';

const ARTICLES = [
  {
    id: 1,
    title: 'Bảng Giá Thép Xây Dựng Hôm Nay: Biến Động Nhẹ Ở Nhóm Thép Cây & Dây Thép',
    excerpt: 'Cập nhật diễn biến giá thép VIS, Hòa Phát, Pomina mới nhất trong ngày. Đánh giá xu hướng thị trường thép quý 3/2026.',
    date: '12 Tháng 08, 2026',
    category: 'Bảng Giá Thép',
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600'
  },
  {
    id: 2,
    title: 'Kinh Nghiệm Chọn Thép Cốt Thép Cho Móng Nhà & Cột Bê Tông Đúng Tiêu Chuẩn',
    excerpt: 'Hướng dẫn lựa chọn mác thép CB300V hay CB400V phù hợp với công trình dân dụng, biệt thự và nhà phố cao tầng.',
    date: '10 Tháng 08, 2026',
    category: 'Tư Vấn Kỹ Thuật',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=600'
  },
  {
    id: 3,
    title: 'Tại Sao Nên Chọn Lưới Trát Tường Chống Nứt 1cm Cho Công Trình Hiện Đại?',
    excerpt: 'Giải pháp thi công chống nứt chân chim tại vị trí tiếp giáp giữa tường gạch và cột bê tông hiệu quả nhất.',
    date: '08 Tháng 08, 2026',
    category: 'Kinh Nghiệm Xây Dựng',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600'
  }
];
</script>

<template>
  <section class="py-20 px-6 bg-white">
    <div class="max-w-7xl mx-auto">
      <!-- Section Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <span class="inline-flex items-center gap-2 bg-red-100 text-red-600 text-xs font-black uppercase px-3.5 py-1.5 rounded-full tracking-widest mb-3">
            <TrendingUp class="w-4 h-4 text-red-600" /> THỊ TRƯỜNG & TIN TỨC DỰ ÁN
          </span>
          <h3 class="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            TIN TỨC THỊ TRƯỜNG THÉP & TƯ VẤN XÂY DỰNG
          </h3>
        </div>
      </div>

      <!-- Articles Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <article 
          v-for="a in ARTICLES" 
          :key="a.id"
          class="group bg-slate-50 border border-slate-200 rounded-3xl overflow-hidden hover:shadow-xl transition duration-300 hover:border-red-400 flex flex-col"
        >
          <div class="relative h-48 overflow-hidden bg-slate-950">
            <img :src="a.image" :alt="a.title" class="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90" />
            <span class="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider shadow">
              {{ a.category }}
            </span>
          </div>

          <div class="p-6 flex-grow flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mb-3">
                <Calendar class="w-3.5 h-3.5 text-slate-400" />
                <span>{{ a.date }}</span>
              </div>

              <h4 class="text-lg font-extrabold text-slate-900 group-hover:text-red-600 transition leading-snug mb-3">
                {{ a.title }}
              </h4>

              <p class="text-xs text-slate-600 leading-relaxed font-normal">
                {{ a.excerpt }}
              </p>
            </div>

            <div class="pt-4 mt-6 border-t border-slate-200 flex items-center justify-between">
              <span class="text-xs font-black text-red-600 group-hover:translate-x-1 transition flex items-center gap-1">
                Đọc Chi Tiết <ArrowRight class="w-4 h-4" />
              </span>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
