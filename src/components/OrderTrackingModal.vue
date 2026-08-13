<script setup lang="ts">
import { ref } from 'vue';
import api from '../api';
import { X, Search, Clock, Truck, CheckCircle, AlertCircle, Phone, Package, MapPin } from 'lucide-vue-next';

defineProps<{ isOpen: boolean }>();
const emit = defineEmits(['close']);

const searchQuery = ref('');
const isSearching = ref(false);
const searched = ref(false);
const orders = ref<any[]>([]);

const handleSearch = async () => {
  if (!searchQuery.value.trim()) return;
  isSearching.value = true;
  searched.value = true;
  try {
    const res = await api.get(`/orders/track?query=${encodeURIComponent(searchQuery.value.trim())}`);
    orders.value = res.data;
  } catch (err) {
    console.error('Error tracking order', err);
    orders.value = [];
  } finally {
    isSearching.value = false;
  }
};

const STATUS_MAP: Record<string, { text: string; step: number; color: string; desc: string }> = {
  CHO_XU_LY: {
    text: 'Chờ Xử Lý & Tiếp Nhận Đơn',
    step: 1,
    color: 'bg-amber-500 text-white',
    desc: 'Đội ngũ NVKD đang tiếp nhận và xếp lịch chuyến xe cẩu giao hàng.'
  },
  DANG_GIAO: {
    text: 'Đang Giao Bằng Xe Cẩu',
    step: 2,
    color: 'bg-[#004d40] text-white',
    desc: 'Xe cẩu chuyên dụng Thép Việt Tín đang vận chuyển hàng đến công trình.'
  },
  HOAN_THANH: {
    text: 'Hoàn Thành Giao Hàng & Nghiệm Thu',
    step: 3,
    color: 'bg-emerald-600 text-white',
    desc: 'Đã bốc dỡ hạ hàng tại công trình và hoàn tất nghiệm thu.'
  },
  HUY: {
    text: 'Đơn Hàng Đã Hủy',
    step: 0,
    color: 'bg-slate-600 text-white',
    desc: 'Đơn hàng báo giá đã bị hủy hoặc tạm ngưng.'
  }
};

const formatVND = (v: number) => {
  if (!v || v === 0) return 'Liên hệ báo giá';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);
};

const formatDate = (s: string) => (s ? new Date(s).toLocaleString('vi-VN') : '');
</script>

<template>
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/70 backdrop-blur-xs" @click="emit('close')"></div>

      <div class="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        <!-- Header đồng nhất màu sắc Dark Teal #004d40 -->
        <div class="px-5 py-4 bg-slate-900 text-white flex items-center justify-between flex-shrink-0">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-[#004d40] flex items-center justify-center font-bold text-sm text-white shadow-xs border border-teal-400/30">
              VT
            </div>
            <div>
              <h3 class="text-base font-bold">Tra Cứu Tiến Độ Đơn Hàng</h3>
              <p class="text-[11px] text-slate-400">Kiểm tra thông tin giao hàng & chuyến xe cẩu</p>
            </div>
          </div>
          <button @click="emit('close')" class="p-1.5 rounded-lg text-slate-400 hover:text-white transition cursor-pointer">
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Search Bar đồng nhất màu với Homepage -->
        <div class="p-5 bg-slate-50 border-b border-slate-200 flex-shrink-0">
          <label class="block text-xs font-semibold text-slate-700 mb-1.5">
            Nhập Mã Đơn Hàng (VD: VT-A1B2C3D4) hoặc Số Điện Thoại Đặt Hàng:
          </label>
          <div class="flex gap-2">
            <div class="relative flex-grow">
              <Search class="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                v-model="searchQuery"
                @keyup.enter="handleSearch"
                type="text"
                placeholder="Nhập mã đơn hàng hoặc SĐT..."
                class="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium outline-none focus:border-[#004d40] focus:ring-1 focus:ring-[#004d40] shadow-2xs"
              />
            </div>
            <button
              @click="handleSearch"
              :disabled="isSearching"
              class="bg-[#004d40] hover:bg-teal-900 disabled:bg-slate-400 text-white font-semibold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition flex-shrink-0 shadow-2xs cursor-pointer"
            >
              <Search class="w-3.5 h-3.5" />
              <span>{{ isSearching ? 'Đang tìm...' : 'Tra Cứu' }}</span>
            </button>
          </div>
        </div>

        <!-- Search Results List -->
        <div class="p-5 overflow-y-auto flex-grow space-y-4">
          <div v-if="!searched" class="text-center py-10 text-slate-400 text-xs font-medium">
            <Package class="w-10 h-10 mx-auto text-slate-300 mb-2" />
            Vui lòng nhập Mã đơn hàng hoặc Số điện thoại để tra cứu tiến độ chuyến xe.
          </div>

          <div v-else-if="orders.length === 0" class="text-center py-10 text-slate-500 text-xs font-medium">
            <AlertCircle class="w-10 h-10 mx-auto text-amber-500 mb-2" />
            Không tìm thấy thông tin đơn hàng phù hợp. Vui lòng kiểm tra lại mã hoặc SĐT.
          </div>

          <div v-else v-for="order in orders" :key="order.id" class="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-xs">
            <div class="flex flex-wrap justify-between items-start gap-2 border-b border-slate-100 pb-3">
              <div>
                <span class="text-[10px] font-semibold text-slate-400 block">Mã Đơn Hàng:</span>
                <span class="text-base font-bold text-slate-900 font-mono">#{{ order.orderCode }}</span>
              </div>
              <div>
                <span :class="['px-2.5 py-1 rounded-full text-[11px] font-semibold', (STATUS_MAP[order.status] || STATUS_MAP.CHO_XU_LY).color]">
                  {{ (STATUS_MAP[order.status] || STATUS_MAP.CHO_XU_LY).text }}
                </span>
              </div>
            </div>

            <!-- Customer & Shipping details -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span class="text-slate-400 font-medium block">Khách Hàng / Công Trình:</span>
                <span class="font-semibold text-slate-800">{{ order.customerName }}</span>
                <span class="text-slate-500 block text-[11px] mt-0.5 flex items-center gap-1">
                  <Phone class="w-3 h-3 text-slate-400" /> {{ order.customerPhone }}
                </span>
              </div>

              <div>
                <span class="text-slate-400 font-medium block">Địa Chỉ Giao Hàng:</span>
                <span class="font-semibold text-slate-800 text-[11px] flex items-start gap-1 mt-0.5">
                  <MapPin class="w-3.5 h-3.5 text-[#004d40] flex-shrink-0 mt-0.5" /> {{ order.shippingAddress }}
                </span>
              </div>
            </div>

            <!-- Status Timeline -->
            <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2">
              <span class="text-[11px] font-semibold text-slate-700 block">Trạng Thái Vận Chuyển:</span>
              <p class="text-xs text-slate-600 font-medium">
                {{ (STATUS_MAP[order.status] || STATUS_MAP.CHO_XU_LY).desc }}
              </p>
              <div class="text-[10px] text-slate-400 flex items-center gap-1">
                <Clock class="w-3 h-3" /> Cập nhật lúc: {{ formatDate(order.createdAt) }}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </Transition>
</template>
