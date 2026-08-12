<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ArrowRight } from 'lucide-vue-next';

defineProps<{
  categories: any[];
}>();

const router = useRouter();

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

const goToProducts = (catId: number) => {
  router.push({ name: 'products', params: { categoryId: catId } });
};
</script>

<template>
  <section class="py-16 px-6 bg-teal-950 text-white relative border-b border-teal-900">
    <div class="max-w-7xl mx-auto">
      <div class="text-center max-w-3xl mx-auto mb-12 animate-fade-in-up">
        <h3 class="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
          DANH MỤC THÉP CÔNG TRÌNH VIỆT TÍN
        </h3>
        <p class="text-teal-200/80 text-sm mt-3">
          Nhấp vào từng loại thép để chuyển tới trang danh sách sản phẩm & báo giá chi tiết!
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="(cat, index) in categories"
          :key="cat.id"
          @click="goToProducts(cat.id)"
          class="group relative bg-teal-900/60 border border-teal-800 hover:border-yellow-400 rounded-3xl overflow-hidden shadow-xl transition duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-teal-500/20 cursor-pointer flex flex-col justify-between animate-fade-in-up"
          :style="{ animationDelay: `${index * 150}ms` }"
        >
          <div class="relative h-52 overflow-hidden bg-teal-950">
            <img
              :src="CATEGORY_IMAGES[cat.code]?.image || 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800'"
              :alt="cat.name"
              class="w-full h-full object-cover group-hover:scale-110 transition duration-700 opacity-80 group-hover:opacity-100"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-teal-950 via-teal-950/30 to-transparent"></div>
            <span class="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider shadow-lg shadow-red-600/40">
              Sẵn Kho Giá Sỉ
            </span>
          </div>

          <div class="p-6">
            <h4 class="text-2xl font-black text-white group-hover:text-yellow-400 transition mb-2">
              {{ cat.name }}
            </h4>
            <p class="text-xs text-teal-100/70 leading-relaxed font-normal mb-4">
              {{ CATEGORY_IMAGES[cat.code]?.desc || 'Đầy đủ kích thước, mác thép chuẩn CO/CQ nhà máy.' }}
            </p>
            <div class="pt-4 border-t border-teal-800/80 flex items-center justify-between">
              <span class="text-xs font-black text-yellow-400 group-hover:translate-x-1 transition flex items-center gap-1">
                Xem Tất Cả Sản Phẩm <ArrowRight class="w-4 h-4 text-yellow-400" />
              </span>
              <span class="bg-teal-950 text-teal-200 text-[11px] font-bold px-3 py-1 rounded-full border border-teal-800">
                Click để chọn ➔
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
