<script setup lang="ts">
import { X, CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-vue-next';
import type { NotificationState } from '../composables/useNotification';

defineProps<{
  notification: NotificationState;
}>();

const emit = defineEmits(['close', 'confirm']);

const ICON_MAP = {
  success: { icon: CheckCircle2, bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', btn: 'bg-emerald-600 hover:bg-emerald-700 text-white' },
  error:   { icon: AlertCircle,  bg: 'bg-amber-50',    text: 'text-amber-600',    border: 'border-amber-200',   btn: 'bg-amber-600 hover:bg-amber-700 text-white' },
  warning: { icon: AlertTriangle,bg: 'bg-amber-50',   text: 'text-amber-600',   border: 'border-amber-200',   btn: 'bg-amber-600 hover:bg-amber-700 text-white' },
  info:    { icon: Info,         bg: 'bg-blue-50',    text: 'text-blue-600',    border: 'border-blue-200',    btn: 'bg-blue-600 hover:bg-blue-700 text-white' }
};
</script>

<template>
  <Teleport to="body">
    <Transition name="fade-bounce">
      <div 
        v-if="notification.isOpen" 
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
        @click.self="emit('close')"
      >
        <div 
          class="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 p-6 text-center"
        >
          <button 
            @click="emit('close')" 
            class="absolute top-3.5 right-3.5 p-1 text-slate-400 hover:text-slate-600 rounded-lg transition"
          >
            <X class="w-4 h-4" />
          </button>

          <div class="mx-auto w-12 h-12 rounded-xl flex items-center justify-center mb-4 border"
               :class="[ICON_MAP[notification.type].bg, ICON_MAP[notification.type].border]">
            <component 
              :is="ICON_MAP[notification.type].icon" 
              class="w-6 h-6" 
              :class="ICON_MAP[notification.type].text" 
            />
          </div>

          <h3 class="text-lg font-bold text-slate-900 mb-1.5 leading-snug">
            {{ notification.title }}
          </h3>
          <p class="text-xs font-medium text-slate-600 mb-5 leading-relaxed">
            {{ notification.message }}
          </p>

          <template v-if="notification.mode === 'confirm'">
            <div class="flex items-center gap-2.5">
              <button 
                @click="emit('close')" 
                class="flex-1 py-2.5 px-4 font-semibold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition text-xs"
              >
                {{ notification.cancelText || 'Hủy Bỏ' }}
              </button>
              <button 
                @click="emit('confirm')" 
                class="flex-1 py-2.5 px-4 font-semibold rounded-xl transition text-xs shadow-xs"
                :class="ICON_MAP[notification.type].btn"
              >
                {{ notification.confirmText || 'Xác Nhận' }}
              </button>
            </div>
          </template>

          <template v-else>
            <button 
              @click="emit('close')" 
              class="w-full py-2.5 px-5 font-semibold rounded-xl transition text-xs shadow-xs"
              :class="ICON_MAP[notification.type].btn"
            >
              Đã Hiểu
            </button>
          </template>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-bounce-enter-active, .fade-bounce-leave-active {
  transition: all 0.2s ease-out;
}
.fade-bounce-enter-from, .fade-bounce-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
