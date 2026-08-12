<script setup lang="ts">
import { Calendar, Truck, Clock, Zap, ShieldCheck, HeartHandshake } from 'lucide-vue-next';

const COMMITMENTS = [
  {
    title: 'GIAO THEO KỲ HẠN',
    desc: 'Giao hàng đúng hẹn, sản phẩm luôn sẵn sàng, phục vụ liên tục – Chọn giao theo kỳ hạn, chọn sự tin cậy!',
    icon: Calendar
  },
  {
    title: 'GIAO THEO TIẾN ĐỘ',
    desc: 'Đúng tiến độ, đúng chất lượng – Đồng hành cùng bạn qua từng giai đoạn công trình, mang lại sự thành công bền vững.',
    icon: Truck
  },
  {
    title: 'GIAO THEO ĐỊNH KỲ',
    desc: 'Dịch vụ giao hàng thường xuyên – Đảm bảo sản phẩm luôn sẵn sàng, đúng thời gian, giúp bạn duy trì sự liên tục.',
    icon: Clock
  },
  {
    title: 'GIAO NGAY 24/7',
    desc: 'Nhanh chóng, tiện lợi, đáp ứng kịp thời mọi nhu cầu thi công của bạn mà không phải chờ đợi lâu.',
    icon: Zap
  }
];
</script>

<template>
  <section class="py-16 px-6 bg-teal-950 text-white relative border-b border-teal-900">
    <div class="max-w-7xl mx-auto">
      <!-- Quote Header -->
      <div class="text-center max-w-4xl mx-auto mb-14 animate-fade-in-up">
        <span class="inline-flex items-center gap-2 bg-teal-900/90 text-teal-300 text-xs font-black uppercase px-4 py-1.5 rounded-full border border-teal-700/60 tracking-widest mb-4 shadow-md">
          <HeartHandshake class="w-4 h-4 text-yellow-400" /> VĂN HÓA VÀ CAM KẾT VIỆT TÍN
        </span>
        <h3 class="text-2xl md:text-4xl font-black italic tracking-tight text-white leading-snug">
          “Thép là sản phẩm — nhưng <span class="text-yellow-400 underline decoration-red-600 decoration-4">chữ Tín</span> mới là tài sản lớn nhất của chúng tôi.”
        </h3>
      </div>

      <!-- 4 Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          v-for="(c, idx) in COMMITMENTS" 
          :key="idx"
          class="bg-teal-900/50 border border-teal-800 hover:border-yellow-400 rounded-3xl p-6 transition duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-teal-500/20 group animate-fade-in-up"
          :style="{ animationDelay: `${idx * 150}ms` }"
        >
          <div class="w-14 h-14 rounded-2xl bg-teal-950 border border-teal-700/60 text-teal-300 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white transition duration-300 shadow-lg">
            <component :is="c.icon" class="w-7 h-7 text-yellow-400 group-hover:text-white transition" />
          </div>

          <h4 class="text-lg font-black text-white group-hover:text-yellow-400 transition mb-3">
            {{ c.title }}
          </h4>
          <p class="text-xs text-teal-100/70 leading-relaxed font-medium">
            {{ c.desc }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
