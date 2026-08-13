<script setup lang="ts">
import { ref } from 'vue';
import { Phone, MessageCircle, ClipboardList, X } from 'lucide-vue-next';

defineEmits(['open-tracking', 'open-cart']);
const isOpen = ref(false);
</script>

<template>
  <div class="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2.5">
    <Transition name="bounce">
      <div v-if="isOpen" class="flex flex-col items-end gap-2 mb-1">
        <button
          @click="$emit('open-tracking'); isOpen = false"
          class="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-3.5 py-2 rounded-xl shadow-md border border-slate-700 text-xs transition">
          <ClipboardList class="w-3.5 h-3.5 text-amber-400" /> Tra Cứu Đơn Hàng
        </button>

        <a
          href="https://zalo.me/0932283783"
          target="_blank"
          class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3.5 py-2 rounded-xl shadow-md text-xs transition">
          <MessageCircle class="w-3.5 h-3.5 text-white" /> Zalo Báo Giá 24/7
        </a>

        <a
          href="tel:0932283783"
          class="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3.5 py-2 rounded-xl shadow-md text-xs transition">
          <Phone class="w-3.5 h-3.5 text-slate-950" /> Gọi Hotline 093 228 37 83
        </a>
      </div>
    </Transition>

    <div class="relative group">
      <!-- Expanding Radar Ripple Pulse Waves -->
      <span v-if="!isOpen" class="absolute -inset-2 rounded-full bg-teal-400/50 animate-ping pointer-events-none opacity-75"></span>
      <span v-if="!isOpen" class="absolute -inset-4 rounded-full bg-[#004d40]/30 animate-pulse pointer-events-none"></span>

      <button
        @click="isOpen = !isOpen"
        class="relative z-10 w-13 h-13 rounded-full bg-[#004d40] hover:bg-[#003830] text-white flex items-center justify-center shadow-2xl border-2 border-amber-400/90 transition-all duration-300 active:scale-95 cursor-pointer"
        title="Hotline Tư Vấn 24/7"
      >
        <X v-if="isOpen" class="w-6 h-6 text-amber-400 transition-transform duration-300 rotate-90" />
        <Phone v-else class="w-6 h-6 fill-white text-white animate-phone-wiggle" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.bounce-enter-active, .bounce-leave-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.bounce-enter-from, .bounce-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.95);
}

@keyframes phoneWiggle {
  0%, 100% { transform: rotate(0deg) scale(1); }
  10%, 30%, 50%, 70%, 90% { transform: rotate(-14deg) scale(1.12); }
  20%, 40%, 60%, 80% { transform: rotate(14deg) scale(1.12); }
}

.animate-phone-wiggle {
  animation: phoneWiggle 2.2s ease-in-out infinite;
}
</style>
