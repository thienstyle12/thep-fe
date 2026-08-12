<script setup lang="ts">
import { ArrowRight, Layers } from 'lucide-vue-next';

interface CategoryItem {
  id: number;
  name: string;
  code: string;
  image: string;
  desc: string;
  count: number;
}

defineProps<{
  categories: any[];
}>();

const emit = defineEmits(['select-category']);

const CATEGORY_IMAGES: Record<string, { image: string; desc: string }> = {
  THAP_XAY_DUNG: {
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=800',
    desc: 'Thép cây CB300V, CB400V, Thép cuộn D6, D8 Hòa Phát & VIS Việt-Ý'
  },
  DAY_THAP_RUT: {
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800',
    desc: 'Dây buộc 1 ly, Thép rút đen D1-D10, Dây kẽm mạ bóng công trình'
  },
  LUOI_THAP: {
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800',
    desc: 'Lưới trát tường chống nứt, Lưới thép hàn D4-D10 ô 100x100mm'
  },
  THAP_HOP: {
    image: 'https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?w=800',
    desc: 'Thép hộp mạ kẽm vuông 40x40, 50x100, Xà gồ C, Z mạ kẽm'
  },
  THAP_HINH: {
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
    desc: 'Thép V góc, Thép I150, I200, Thép tấm chịu lực cắt theo yêu cầu'
  }
};
</script>

<template>
  <section class="py-16 px-6 bg-slate-900 text-white relative">
    <div class="max-w-7xl mx-auto">
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-12">
        <span class="inline-flex items-center gap-2 bg-red-600/20 text-red-400 text-xs font-black uppercase px-3.5 py-1.5 rounded-full border border-red-500/30 tracking-widest mb-3">
          <Layers class="w-4 h-4 text-red-500" /> SIÊU THỊ DANH MỤC SẢN PHẨM THÉP
        </span>
        <h3 class="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
          DANH MỤC THÉP CÔNG TRÌNH VIỆT TÍN
        </h3>
        <p class="text-slate-400 text-sm mt-3">
          Nhấp vào từng loại thép bên dưới để chuyển ngay tới trang danh sách sản phẩm & báo giá chi tiết từng nhóm thép!
        </p>
      </div>

      <!-- Categories Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="cat in categories" 
          :key="cat.id"
          @click="emit('select-category', cat.id)"
          class="group relative bg-slate-950 border border-slate-800 hover:border-red-500 rounded-3xl overflow-hidden shadow-xl transition duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-600/20 cursor-pointer flex flex-col justify-between"
        >
          <!-- Category Card Image Header -->
          <div class="relative h-52 overflow-hidden bg-slate-900">
            <img 
              :src="CATEGORY_IMAGES[cat.code]?.image || 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800'" 
              :alt="cat.name"
              class="w-full h-full object-cover group-hover:scale-110 transition duration-700 opacity-80 group-hover:opacity-100"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

            <span class="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider shadow-lg shadow-red-600/40">
              Sẵn Kho Giá Sỉ
            </span>
          </div>

          <!-- Category Card Details -->
          <div class="p-6">
            <h4 class="text-2xl font-black text-white group-hover:text-red-400 transition mb-2">
              {{ cat.name }}
            </h4>
            <p class="text-xs text-slate-400 leading-relaxed font-normal mb-4">
              {{ CATEGORY_IMAGES[cat.code]?.desc || 'Đầy đủ kích thước, mác thép chuẩn CO/CQ nhà máy.' }}
            </p>
            
            <div class="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span class="text-xs font-black text-yellow-400 group-hover:translate-x-1 transition flex items-center gap-1">
                Xem Tất Cả Sản Phẩm <ArrowRight class="w-4 h-4 text-yellow-400" />
              </span>
              <span class="bg-slate-900 text-slate-300 text-[11px] font-bold px-3 py-1 rounded-full border border-slate-800">
                Click để chọn ➔
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
