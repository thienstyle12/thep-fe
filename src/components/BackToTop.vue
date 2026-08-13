<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { ArrowUp } from 'lucide-vue-next';

const isVisible = ref(false);
const scrollPercent = ref(0);

const handleScroll = () => {
  const scrollY = window.scrollY;
  const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
  
  isVisible.value = scrollY > 280;
  if (totalHeight > 0) {
    scrollPercent.value = Math.min(100, Math.round((scrollY / totalHeight) * 100));
  }
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <Transition name="fade-pop">
    <button
      v-if="isVisible"
      @click="scrollToTop"
      class="fixed bottom-22 right-6 z-40 w-11 h-11 rounded-full bg-slate-900/90 hover:bg-[#004d40] text-white flex items-center justify-center shadow-xl border border-slate-700 hover:border-amber-400/80 transition-all duration-300 active:scale-95 group cursor-pointer"
      title="Cuộn lên đầu trang"
    >
      <!-- Circular Progress Ring SVG -->
      <svg class="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-0.5" viewBox="0 0 36 36">
        <path
          class="text-slate-700/40"
          stroke-width="2.5"
          stroke="currentColor"
          fill="none"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
          class="text-amber-400 transition-all duration-150"
          stroke-dasharray="100, 100"
          :stroke-dashoffset="100 - scrollPercent"
          stroke-linecap="round"
          stroke-width="2.5"
          stroke="currentColor"
          fill="none"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
      </svg>

      <ArrowUp class="w-4 h-4 text-amber-400 group-hover:-translate-y-0.5 transition-transform duration-300 relative z-10" />
    </button>
  </Transition>
</template>

<style scoped>
.fade-pop-enter-active,
.fade-pop-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-pop-enter-from,
.fade-pop-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.85);
}
</style>
