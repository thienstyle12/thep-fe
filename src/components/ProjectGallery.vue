<script setup lang="ts">
import { ref, computed } from 'vue';
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
  <section id="projects" class="py-20 px-6 bg-teal-950 text-white relative border-b border-teal-900">
    <div class="max-w-7xl mx-auto">
      <!-- Section Title & Tabs -->
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 animate-fade-in-up">
        <div>
          <span class="inline-flex items-center gap-2 bg-teal-900/90 text-teal-300 text-xs font-black uppercase px-4 py-1.5 rounded-full border border-teal-700/60 tracking-widest mb-3 shadow-md">
            <Building2 class="w-4 h-4 text-yellow-400" /> DỰ ÁN NỔI BẬT & NĂNG LỰC CUNG CẤP
          </span>
          <h3 class="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
            CÔNG TRÌNH TIÊU BIỂU SỬ DỤNG THÉP VIỆT TÍN
          </h3>
        </div>

        <!-- Filter Tabs -->
        <div class="flex flex-wrap gap-2 bg-teal-900/80 p-1.5 rounded-2xl shadow-lg border border-teal-800">
          <button 
            @click="activeTab = 'ALL'"
            class="px-4 py-2 text-xs font-extrabold rounded-xl transition duration-200"
            :class="activeTab === 'ALL' ? 'bg-red-600 text-white shadow-md' : 'text-teal-200 hover:bg-teal-800'"
          >
            Tất Cả Dự Án
          </button>
          <button 
            @click="activeTab = 'CAUDUONG'"
            class="px-4 py-2 text-xs font-extrabold rounded-xl transition duration-200"
            :class="activeTab === 'CAUDUONG' ? 'bg-red-600 text-white shadow-md' : 'text-teal-200 hover:bg-teal-800'"
          >
            Cầu Đường
          </button>
          <button 
            @click="activeTab = 'NHAXUONG'"
            class="px-4 py-2 text-xs font-extrabold rounded-xl transition duration-200"
            :class="activeTab === 'NHAXUONG' ? 'bg-red-600 text-white shadow-md' : 'text-teal-200 hover:bg-teal-800'"
          >
            Nhà Xưởng
          </button>
          <button 
            @click="activeTab = 'CHUNGCU'"
            class="px-4 py-2 text-xs font-extrabold rounded-xl transition duration-200"
            :class="activeTab === 'CHUNGCU' ? 'bg-red-600 text-white shadow-md' : 'text-teal-200 hover:bg-teal-800'"
          >
            Chung Cư
          </button>
          <button 
            @click="activeTab = 'KHOHANG'"
            class="px-4 py-2 text-xs font-extrabold rounded-xl transition duration-200"
            :class="activeTab === 'KHOHANG' ? 'bg-red-600 text-white shadow-md' : 'text-teal-200 hover:bg-teal-800'"
          >
            Kho Hàng
          </button>
        </div>
      </div>

      <!-- Projects Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div 
          v-for="(p, index) in filteredProjects" 
          :key="p.id"
          class="group bg-teal-900/50 rounded-3xl overflow-hidden shadow-lg border border-teal-800 hover:border-yellow-400 hover:shadow-2xl transition duration-300 flex flex-col animate-fade-in-up"
          :style="{ animationDelay: `${index * 150}ms` }"
        >
          <div class="relative h-56 overflow-hidden bg-teal-950">
            <img 
              :src="p.image" 
              :alt="p.title" 
              class="w-full h-full object-cover group-hover:scale-110 transition duration-700 opacity-80 group-hover:opacity-100"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-teal-950 via-teal-950/30 to-transparent"></div>
            
            <span class="absolute top-4 left-4 bg-teal-950/90 backdrop-blur-md text-white text-[10px] font-black uppercase px-3 py-1 rounded-full border border-teal-700/80 tracking-wider">
              {{ p.categoryLabel }}
            </span>
          </div>

          <div class="p-6 flex-grow flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-1.5 text-teal-200/70 text-xs font-semibold mb-2">
                <MapPin class="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                <span>{{ p.location }}</span>
              </div>

              <h4 class="text-lg font-extrabold text-white group-hover:text-yellow-400 transition leading-snug mb-3">
                {{ p.title }}
              </h4>
            </div>

            <div class="pt-4 border-t border-teal-800/80 mt-4 flex items-center justify-between text-xs font-extrabold">
              <span class="text-yellow-400 bg-teal-950/80 px-2.5 py-1 rounded-lg border border-teal-800">
                {{ p.volume }}
              </span>
              <span class="text-teal-200/80 font-mono">
                {{ p.date }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
