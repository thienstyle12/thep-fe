<script setup lang="ts">
import SteelCalculator from '../components/SteelCalculator.vue';
import { Calculator } from 'lucide-vue-next';
</script>

<template>
  <div class="bg-slate-50 min-h-screen py-10 px-6">
    <div class="max-w-7xl mx-auto space-y-6">
      <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs reveal-on-scroll">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-teal-50 text-[#004d40] flex items-center justify-center border border-teal-100">
            <Calculator class="w-5 h-5" />
          </div>
          <div>
            <h1 class="text-2xl font-black text-slate-900">BẢNG TÍNH TRỌNG LƯỢNG THÉP XÂY DỰNG</h1>
            <p class="text-xs text-slate-500 mt-0.5">Tra cứu công thức và tính toán trọng lượng thép cây, thép hộp, thép hình chính xác</p>
          </div>
        </div>
      </div>

      <div class="reveal-on-scroll reveal-delay-1">
        <SteelCalculator />
      </div>
    </div>
  </div>
</template>
