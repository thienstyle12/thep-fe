<script setup lang="ts">
import { X, CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-vue-next';

export interface NotificationState {
  isOpen: boolean;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

const props = defineProps<{
  notification: NotificationState;
}>();

const emit = defineEmits(['close']);

const ICON_MAP = {
  success: { icon: CheckCircle2, bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-200', btn: 'bg-emerald-600 hover:bg-emerald-700 text-white' },
  error:   { icon: AlertCircle,  bg: 'bg-rose-100',    text: 'text-rose-600',    border: 'border-rose-200',    btn: 'bg-rose-600 hover:bg-rose-700 text-white' },
  warning: { icon: AlertTriangle,bg: 'bg-amber-100',   text: 'text-amber-600',   border: 'border-amber-200',   btn: 'bg-amber-600 hover:bg-amber-700 text-white' },
  info:    { icon: Info,         bg: 'bg-blue-100',    text: 'text-blue-600',    border: 'border-blue-200',    btn: 'bg-blue-600 hover:bg-blue-700 text-white' }
};
</script>

<template>
  <Teleport to="body">
    <Transition name="fade-bounce">
      <div 
        v-if="notification.isOpen" 
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md"
        @click.self="emit('close')"
      >
        <div 
          class="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 transform transition-all duration-300 p-6 md:p-8 text-center"
        >
          <!-- Close Button -->
          <button 
            @click="emit('close')" 
            class="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition"
          >
            <X class="w-5 h-5" />
          </button>

          <!-- Icon Header -->
          <div class="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-inner"
               :class="[ICON_MAP[notification.type].bg, ICON_MAP[notification.type].border]">
            <component 
              :is="ICON_MAP[notification.type].icon" 
              class="w-9 h-9" 
              :class="ICON_MAP[notification.type].text" 
            />
          </div>

          <!-- Title & Message -->
          <h3 class="text-xl font-extrabold text-slate-900 mb-2 leading-tight">
            {{ notification.title }}
          </h3>
          <p class="text-sm font-medium text-slate-600 mb-6 leading-relaxed">
            {{ notification.message }}
          </p>

          <!-- Action Button -->
          <button 
            @click="emit('close')" 
            class="w-full py-3 px-6 font-extrabold rounded-2xl shadow-lg transition duration-200 text-sm tracking-wide"
            :class="ICON_MAP[notification.type].btn"
          >
            Đã Hiểu
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-bounce-enter-active,
.fade-bounce-leave-active {
  transition: all 0.25s ease-out;
}

.fade-bounce-enter-from,
.fade-bounce-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(10px);
}
</style>
