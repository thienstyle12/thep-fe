<script setup lang="ts">
import { Factory, Award, Truck, ShieldCheck, MapPin, Phone, Building2 } from 'lucide-vue-next';
</script>

<template>
  <div class="bg-slate-50 min-h-screen py-10 px-6">
    <div class="max-w-7xl mx-auto space-y-8">
      
      <!-- Hero Header -->
      <div class="bg-[#004d40] text-white p-8 sm:p-12 rounded-3xl shadow-xl relative overflow-hidden banner-thut-tho animate-banner-sweep">
        <div class="absolute -right-20 -bottom-20 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="max-w-3xl relative z-10 space-y-3">
          <div class="inline-flex items-center gap-2 bg-[#003830] text-amber-400 border border-amber-400/30 text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider mb-2">
            <Building2 class="w-4 h-4 text-amber-400" /> VỀ THÉP VIỆT TÍN
          </div>
          <h1 class="text-3xl sm:text-4xl font-black leading-tight">TỔNG KHO PHÂN PHỐI THÉP CÔNG TRÌNH HÀNG ĐẦU</h1>
          <p class="text-teal-100 text-sm leading-relaxed font-normal">
            Thép Việt Tín là đơn vị phân phối uy tín hàng đầu chuyên cung cấp Thép Xây Dựng VIS, Thép Cây D10-D32, Dây buộc 1 ly, Thép rút đen, Lưới thép trát tường. Cam kết đầy đủ chứng chỉ CO/CQ xuất xưởng và giao xe cẩu 24/7 tận chân công trình.
          </p>
        </div>
      </div>

      <!-- Strengths Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3 reveal-on-scroll reveal-delay-1 hover:shadow-md hover:border-teal-200 transition">
          <div class="w-12 h-12 rounded-xl bg-teal-50 text-[#004d40] flex items-center justify-center border border-teal-100">
            <Factory class="w-6 h-6" />
          </div>
          <h3 class="font-bold text-slate-900 text-base">Tổng Kho Sản Xuất</h3>
          <p class="text-xs text-slate-500 leading-relaxed font-normal">Sở hữu hệ thống tổng kho quy mô lớn tại Miền Nam và Miền Bắc, đảm bảo nguồn hàng luôn có sẵn trữ lượng hơn 10.000 tấn thép.</p>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3 reveal-on-scroll reveal-delay-2 hover:shadow-md hover:border-teal-200 transition">
          <div class="w-12 h-12 rounded-xl bg-teal-50 text-[#004d40] flex items-center justify-center border border-teal-100">
            <Award class="w-6 h-6" />
          </div>
          <h3 class="font-bold text-slate-900 text-base">Chuẩn CO/CQ Nhà Máy</h3>
          <p class="text-xs text-slate-500 leading-relaxed font-normal">100% sản phẩm thép đều có chứng chỉ xuất xưởng, kiểm định chất lượng mác thép CB300V, CB400V, CB500V đạt chuẩn TCVN 1651-2.</p>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3 reveal-on-scroll reveal-delay-3 hover:shadow-md hover:border-teal-200 transition">
          <div class="w-12 h-12 rounded-xl bg-teal-50 text-[#004d40] flex items-center justify-center border border-teal-100">
            <Truck class="w-6 h-6" />
          </div>
          <h3 class="font-bold text-slate-900 text-base">Hội Đội Xe Cẩu 24/7</h3>
          <p class="text-xs text-slate-500 leading-relaxed font-normal">Đội xe cẩu tự hành từ 5T đến 25T phục vụ bốc dỡ tận nơi 24/7, giúp chủ đầu tư bảo đảm đúng tiến độ thi công công trình.</p>
        </div>
      </div>

      <!-- Warehouse Locations -->
      <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-6 reveal-on-scroll">
        <h2 class="text-xl font-bold text-slate-900 uppercase">Hệ Thống Kho Hàng & Văn Phòng</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:border-teal-200 transition">
            <div class="flex items-center gap-2 text-[#004d40] font-bold text-sm">
              <MapPin class="w-4 h-4 text-[#004d40]" />
              <span>KHO THÉP MIỀN NAM</span>
            </div>
            <p class="text-xs text-slate-600 font-medium">Địa chỉ: Quốc Lộ 1A, Phường Bình Hưng Hòa, Quận Bình Tân, TP. Hồ Chí Minh</p>
            <p class="text-xs text-slate-500">Hotline: 093 228 37 83 (Zalo / Call 24/7)</p>
          </div>

          <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:border-teal-200 transition">
            <div class="flex items-center gap-2 text-[#004d40] font-bold text-sm">
              <MapPin class="w-4 h-4 text-[#004d40]" />
              <span>KHO THÉP MIỀN BẮC</span>
            </div>
            <p class="text-xs text-slate-600 font-medium">Địa chỉ: Cụm Công Nghiệp Yên Mỹ, Tỉnh Hưng Yên</p>
            <p class="text-xs text-slate-500">Hotline: 093 228 37 83 (Zalo / Call 24/7)</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
