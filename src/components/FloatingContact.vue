<script setup lang="ts">
import { ref } from 'vue';
import { Phone, MessageCircle, ClipboardList, ChevronUp, X } from 'lucide-vue-next';

defineEmits(['open-tracking', 'open-cart']);
const isOpen = ref(false);
</script>

<template>
  <div class="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
    <!-- Menu options -->
    <Transition name="bounce">
      <div v-if="isOpen" class="flex flex-col items-end gap-2.5 mb-1">
        <!-- Track Order -->
        <button
          @click="$emit('open-tracking'); isOpen = false"
          class="flex items-center gap-2.5 bg-slate-900 hover:bg-black text-white font-extrabold px-4 py-2.5 rounded-2xl shadow-xl border border-slate-700 text-xs transition duration-200 hover:scale-105">
          <ClipboardList class="w-4 h-4 text-yellow-400" /> Tra Cứu Đơn Hàng
        </button>

        <!-- Zalo Contact -->
        <a
          href="https://zalo.me/0932283783"
          target="_blank"
          class="flex items-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-4 py-2.5 rounded-2xl shadow-xl text-xs transition duration-200 hover:scale-105">
          <MessageCircle class="w-4 h-4 text-white" /> Zalo Báo Giá 24/7
        </a>

        <!-- Call Hotline -->
        <a
          href="tel:0932283783"
          class="flex items-center gap-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold px-4 py-2.5 rounded-2xl shadow-xl text-xs transition duration-200 hover:scale-105">
          <Phone class="w-4 h-4 text-yellow-300 fill-yellow-300 animate-pulse" /> Gọi Hotline 093 228 37 83
        </a>
      </div>
    </Transition>

    <!-- Main Trigger Button -->
    <button
      @click="isOpen = !isOpen"
      class="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-2xl border-2 border-white ring-4 ring-red-600/30 transition duration-300 hover:scale-110 active:scale-95 group">
      <X v-if="isOpen" class="w-7 h-7" />
      <Phone v-else class="w-7 h-7 fill-white group-hover:rotate-12 transition duration-300" />
    </button>
  </div>
</template>

<style scoped>
.bounce-enter-active {
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
.bounce-leave-active {
  transition: all 0.2s ease-in;
}
.bounce-enter-from,
.bounce-leave-to {
  opacity: 0;
  transform: translateY(15px) scale(0.9);
}
</style>
