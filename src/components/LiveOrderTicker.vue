<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { ShoppingBag, Truck, CheckCircle2, Building2, X } from 'lucide-vue-next';

interface TickerItem {
  id: number;
  actor: string;
  location: string;
  action: string;
  product: string;
  timeAgo: string;
  type: 'order' | 'delivery' | 'quote';
}

const isVisible = ref(false);
const isDismissed = ref(false);
const currentIndex = ref(0);

const tickerItems: TickerItem[] = [
  {
    id: 1,
    actor: 'Kỹ sư Minh',
    location: 'Dự án Q.2, TP.HCM',
    action: 'vừa gửi yêu cầu báo giá',
    product: '15 Tấn Thép VIS D16 CB400V',
    timeAgo: '1 phút trước',
    type: 'quote'
  },
  {
    id: 2,
    actor: 'Kho Miền Nam',
    location: 'Bình Tân, TP.HCM',
    action: 'vừa xuất xe cẩu 5T',
    product: '50 Cuộn Dây Buộc 1 Ly đi Đồng Nai',
    timeAgo: '3 phút trước',
    type: 'delivery'
  },
  {
    id: 3,
    actor: 'Nhà thầu Tân Phát',
    location: 'Bình Dương',
    action: 'vừa chốt đơn sỉ',
    product: '300 Tấm Lưới Thép Hàn D4 (2x6m)',
    timeAgo: '5 phút trước',
    type: 'order'
  },
  {
    id: 4,
    actor: 'Anh Quốc',
    location: 'CCN Yên Mỹ, Hưng Yên',
    action: 'vừa đặt mua thành công',
    product: '8 Tấn Thép Hộp 50x100 Mạ Kẽm',
    timeAgo: '7 phút trước',
    type: 'order'
  },
  {
    id: 5,
    actor: 'Trạm Xe Cẩu Miền Bắc',
    location: 'Hà Nội',
    action: 'đang giao hàng tận nơi',
    product: '12 Tấn Thép I150x75 Định Hình SS400',
    timeAgo: '9 phút trước',
    type: 'delivery'
  }
];

let timer: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  // Delay first appearance by 3s
  setTimeout(() => {
    if (!isDismissed.value) {
      isVisible.value = true;
    }
  }, 3000);

  // Cycle ticker items every 7s
  timer = setInterval(() => {
    if (isDismissed.value) return;
    isVisible.value = false;
    setTimeout(() => {
      currentIndex.value = (currentIndex.value + 1) % tickerItems.length;
      isVisible.value = true;
    }, 400);
  }, 7000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

const closeTicker = () => {
  isVisible.value = false;
  isDismissed.value = true;
};
</script>

<template>
  <div class="fixed bottom-6 left-6 z-40 max-w-sm pointer-events-none">
    <Transition name="slide-up">
      <div 
        v-if="isVisible && !isDismissed" 
        class="pointer-events-auto bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-slate-200/90 flex items-start gap-3.5 relative overflow-hidden group hover:border-[#004d40] transition-all duration-300"
      >
        <!-- Top Accent Line Animation -->
        <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#004d40] via-teal-400 to-amber-400"></div>

        <!-- Dynamic Icon Badge -->
        <div 
          :class="[
            'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-xs mt-0.5',
            tickerItems[currentIndex].type === 'delivery' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
            tickerItems[currentIndex].type === 'quote' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
            'bg-teal-100 text-[#004d40] border border-teal-200'
          ]"
        >
          <Truck v-if="tickerItems[currentIndex].type === 'delivery'" class="w-5 h-5" />
          <Building2 v-else-if="tickerItems[currentIndex].type === 'quote'" class="w-5 h-5" />
          <ShoppingBag v-else class="w-5 h-5" />
        </div>

        <!-- Content Details -->
        <div class="flex-1 min-w-0 pr-4 text-xs">
          <div class="flex items-center justify-between gap-1 mb-0.5">
            <span class="font-extrabold text-slate-900 truncate">{{ tickerItems[currentIndex].actor }}</span>
            <span class="text-[10px] text-slate-400 font-mono flex-shrink-0">{{ tickerItems[currentIndex].timeAgo }}</span>
          </div>
          
          <p class="text-slate-500 text-[11px] leading-tight font-medium">
            <span class="text-slate-600 font-semibold">{{ tickerItems[currentIndex].action }}</span>: 
            <strong class="text-[#004d40] font-bold block truncate mt-0.5">{{ tickerItems[currentIndex].product }}</strong>
          </p>

          <div class="flex items-center gap-1 mt-1 text-[10px] text-slate-400">
            <CheckCircle2 class="w-3 h-3 text-emerald-500" />
            <span>{{ tickerItems[currentIndex].location }}</span>
          </div>
        </div>

        <!-- Close Button -->
        <button 
          @click="closeTicker" 
          class="absolute top-2.5 right-2.5 text-slate-400 hover:text-slate-700 p-1 rounded-full transition cursor-pointer"
          title="Đóng thông báo"
        >
          <X class="w-3.5 h-3.5" />
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}
</style>
