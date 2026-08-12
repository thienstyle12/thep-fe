<script setup lang="ts">
import { ref } from 'vue';
import { Building2, MapPin, CheckCircle2, ArrowUpRight, Eye } from 'lucide-vue-next';

interface ProjectItem {
  id: number;
  title: string;
  category: 'ALL' | 'NHAXUONG' | 'CAUDUONG' | 'CHUNGCU' | 'KHOHANG';
  categoryLabel: string;
  location: string;
  volume: string;
  image: string;
  date: string;
}

const activeTab = ref<'ALL' | 'NHAXUONG' | 'CAUDUONG' | 'CHUNGCU' | 'KHOHANG'>('ALL');

const PROJECTS: ProjectItem[] = [
  {
    id: 1,
    title: 'Dự Án Cầu Đường Cao Tốc Bắc Nam - Gói Thầu XL02',
    category: 'CAUDUONG',
    categoryLabel: 'Cầu Đường & Hạ Tầng',
    location: 'Bình Thuận - Đồng Nai',
    volume: '2.500 Tấn Thép VIS CB400V',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=800',
    date: 'Tháng 05/2026'
  },
  {
    id: 2,
    title: 'Nhà Xưởng Sản Xuất Điện Tử Foxconn Mới',
    category: 'NHAXUONG',
    categoryLabel: 'Nhà Xưởng Công Nghiệp',
    location: 'KCN Bắc Giang',
    volume: '1.800 Tấn Thép Hộp & Xà Gồ Mạ Kẽm',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800',
    date: 'Tháng 03/2026'
  },
  {
    id: 3,
    title: 'Khu Đô Thị Cao Cấp Masteri Waterfront',
    category: 'CHUNGCU',
    categoryLabel: 'Chung Cư Cao Tầng',
    location: 'Hà Nội',
    volume: '3.200 Tấn Thép Cây D12 - D32',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
    date: 'Tháng 01/2026'
  },
  {
    id: 4,
    title: 'Tổng Kho Thép Việt Tín Trung Tâm Miền Nam',
    category: 'KHOHANG',
    categoryLabel: 'Hệ Thống Kho Hàng',
    location: 'Bình Dương (Diện tích 15.000m²)',
    volume: 'Sức chứa +15.000 Tấn Thép',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
    date: 'Sẵn Sàng Giao Hàng'
  }
];

const filteredProjects = computed(() => {
  if (activeTab.value === 'ALL') return PROJECTS;
  return PROJECTS.filter(p => p.category === activeTab.value);
});
</script>

<template>
  <section class="py-20 px-6 bg-slate-100 border-t border-b border-slate-200">
    <div class="max-w-7xl mx-auto">
      <!-- Section Title & Tabs -->
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <span class="inline-flex items-center gap-2 bg-red-100 text-red-600 text-xs font-black uppercase px-3.5 py-1.5 rounded-full tracking-widest mb-3">
            <Building2 class="w-4 h-4" /> DỰ ÁN NỔI BẬT & NĂNG LỰC CUNG CẤP
          </span>
          <h3 class="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            CÔNG TRÌNH TIÊU BIỂU SỬ DỤNG THÉP VIỆT TÍN
          </h3>
        </div>

        <!-- Filter Tabs -->
        <div class="flex flex-wrap gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
          <button 
            @click="activeTab = 'ALL'"
            class="px-4 py-2 text-xs font-extrabold rounded-xl transition duration-200"
            :class="activeTab === 'ALL' ? 'bg-red-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'"
          >
            Tất Cả Dự Án
          </button>
          <button 
            @click="activeTab = 'CAUDUONG'"
            class="px-4 py-2 text-xs font-extrabold rounded-xl transition duration-200"
            :class="activeTab === 'CAUDUONG' ? 'bg-red-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'"
          >
            Cầu Đường
          </button>
          <button 
            @click="activeTab = 'NHAXUONG'"
            class="px-4 py-2 text-xs font-extrabold rounded-xl transition duration-200"
            :class="activeTab === 'NHAXUONG' ? 'bg-red-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'"
          >
            Nhà Xưởng
          </button>
          <button 
            @click="activeTab = 'CHUNGCU'"
            class="px-4 py-2 text-xs font-extrabold rounded-xl transition duration-200"
            :class="activeTab === 'CHUNGCU' ? 'bg-red-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'"
          >
            Chung Cư
          </button>
          <button 
            @click="activeTab = 'KHOHANG'"
            class="px-4 py-2 text-xs font-extrabold rounded-xl transition duration-200"
            :class="activeTab === 'KHOHANG' ? 'bg-red-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'"
          >
            Kho Hàng
          </button>
        </div>
      </div>

      <!-- Projects Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div 
          v-for="p in filteredProjects" 
          :key="p.id"
          class="group bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-200 hover:border-red-500 hover:shadow-2xl transition duration-300 flex flex-col"
        >
          <div class="relative h-56 overflow-hidden bg-slate-950">
            <img 
              :src="p.image" 
              :alt="p.title" 
              class="w-full h-full object-cover group-hover:scale-110 transition duration-700 opacity-90 group-hover:opacity-100"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
            
            <span class="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md text-white text-[10px] font-black uppercase px-3 py-1 rounded-full border border-slate-700 tracking-wider">
              {{ p.categoryLabel }}
            </span>
          </div>

          <div class="p-6 flex-grow flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-1.5 text-slate-500 text-xs font-semibold mb-2">
                <MapPin class="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                <span>{{ p.location }}</span>
              </div>

              <h4 class="text-lg font-extrabold text-slate-900 group-hover:text-red-600 transition leading-snug mb-3">
                {{ p.title }}
              </h4>
            </div>

            <div class="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs font-extrabold">
              <span class="text-red-600 bg-red-50 px-2.5 py-1 rounded-lg">
                {{ p.volume }}
              </span>
              <span class="text-slate-400 font-mono">
                {{ p.date }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
