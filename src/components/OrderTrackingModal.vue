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
    desc: 'Đội ngũ NVKD đang liên hệ với nhà máy/kho tổng để xếp lịch chuyến xe cẩu giao hàng.'
  },
  DANG_GIAO: {
    text: 'Đang Giao Bằng Xe Cẩu',
    step: 2,
    color: 'bg-blue-600 text-white',
    desc: 'Xe cẩu chuyên dụng Thép Việt Tín đang vận chuyển hàng đến địa chỉ công trình của bạn.'
  },
  HOAN_THANH: {
    text: 'Hoàn Thành Giao Hàng & Nghiệm Thu',
    step: 3,
    color: 'bg-emerald-600 text-white',
    desc: 'Đã bốc dỡ hạ hàng tại công trình và hoàn tất ký nhận biên bản bàn giao.'
  },
  HUY: {
    text: 'Đơn Hàng Đã Hủy',
    step: 0,
    color: 'bg-rose-600 text-white',
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
      <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" @click="emit('close')"></div>

      <div class="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        <!-- Header -->
        <div class="px-6 py-5 bg-slate-950 text-white flex items-center justify-between flex-shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-[#006a64] flex items-center justify-center font-black text-lg shadow-md">
              VT
            </div>
            <div>
              <span class="text-[10px] font-black text-teal-400 uppercase tracking-widest block">Thép Việt Tín</span>
              <h3 class="text-xl font-black leading-tight">TRA CỨU TIẾN ĐỘ ĐƠN HÀNG</h3>
            </div>
          </div>
          <button @click="emit('close')" class="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition">
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Search Bar Body -->
        <div class="p-6 bg-slate-50 border-b border-slate-200 flex-shrink-0">
          <label class="block text-xs font-extrabold text-slate-700 mb-2 uppercase tracking-wide">
            Nhập Mã Đơn Hàng (VD: VT-A1B2C3D4) hoặc Số Điện Thoại Đặt Hàng:
          </label>
          <div class="flex gap-2">
            <div class="relative flex-grow">
              <Search class="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
              <input
                v-model="searchQuery"
                @keyup.enter="handleSearch"
                type="text"
                placeholder="Nhập mã đơn hàng hoặc SĐT của bạn..."
                class="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-2xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#006a64] focus:border-[#006a64] shadow-sm"
              />
            </div>
            <button
              @click="handleSearch"
              :disabled="isSearching"
              class="bg-[#006a64] hover:bg-[#00544f] text-white font-extrabold px-6 py-3 rounded-2xl text-xs uppercase shadow-md transition flex items-center gap-2 whitespace-nowrap">
              <span>{{ isSearching ? 'Đang tìm...' : 'Tra Cứu' }}</span>
            </button>
          </div>
        </div>

        <!-- Results Area -->
        <div class="p-6 overflow-y-auto flex-grow space-y-6">
          <div v-if="!searched" class="text-center py-10 text-slate-400 space-y-2">
            <Package class="w-12 h-12 text-slate-300 mx-auto" />
            <p class="font-bold text-sm text-slate-600">Nhập mã đơn hoặc số điện thoại để tra cứu hành trình vận chuyển thép.</p>
            <p class="text-xs text-slate-400">Ví dụ: Thử tra cứu SĐT đặt hàng hoặc mã đơn báo giá đã gửi.</p>
          </div>

          <div v-else-if="orders.length === 0" class="text-center py-10 text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
            <AlertCircle class="w-12 h-12 text-amber-500 mx-auto mb-2" />
            <p class="font-bold text-base text-slate-800">Không tìm thấy đơn hàng nào!</p>
            <p class="text-xs text-slate-500 mt-1">Vui lòng kiểm tra lại thông tin mã đơn hoặc SĐT đã đăng ký báo giá.</p>
          </div>

          <div v-else class="space-y-6">
            <div v-for="order in orders" :key="order.id" class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              
              <!-- Order Header Info -->
              <div class="p-4 bg-slate-900 text-white flex flex-wrap justify-between items-center gap-2">
                <div>
                  <span class="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Mã Đơn Báo Giá</span>
                  <span class="font-mono font-black text-yellow-400 text-lg">{{ order.orderCode }}</span>
                </div>
                <div class="text-right">
                  <span class="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Thời Gian Khởi Tạo</span>
                  <span class="text-xs font-semibold text-slate-200">{{ formatDate(order.createdAt) }}</span>
                </div>
              </div>

              <!-- Status Progress Tracker -->
              <div class="p-5 bg-slate-50 border-b border-slate-200">
                <div class="flex items-center justify-between mb-4">
                  <span class="text-xs font-extrabold text-slate-700 uppercase">Trạng Thái Đơn Hàng:</span>
                  <span :class="['px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider', STATUS_MAP[order.status]?.color || 'bg-slate-700 text-white']">
                    {{ STATUS_MAP[order.status]?.text || order.status }}
                  </span>
                </div>

                <!-- Step Bar -->
                <div v-if="order.status !== 'HUY'" class="grid grid-cols-3 gap-2 relative">
                  <div class="flex flex-col items-center text-center">
                    <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-xs font-black mb-1', (STATUS_MAP[order.status]?.step || 0) >= 1 ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-200 text-slate-500']">
                      1
                    </div>
                    <span class="text-[11px] font-extrabold text-slate-800">Chờ Xử Lý</span>
                  </div>

                  <div class="flex flex-col items-center text-center">
                    <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-xs font-black mb-1', (STATUS_MAP[order.status]?.step || 0) >= 2 ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-200 text-slate-500']">
                      2
                    </div>
                    <span class="text-[11px] font-extrabold text-slate-800">Giao Xe Cẩu</span>
                  </div>

                  <div class="flex flex-col items-center text-center">
                    <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-xs font-black mb-1', (STATUS_MAP[order.status]?.step || 0) >= 3 ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-200 text-slate-500']">
                      3
                    </div>
                    <span class="text-[11px] font-extrabold text-slate-800">Hoàn Thành</span>
                  </div>
                </div>

                <p class="text-xs text-slate-600 italic bg-white p-3 rounded-xl border border-slate-200 mt-3">
                  💬 {{ STATUS_MAP[order.status]?.desc || 'Đang cập nhật tiến độ giao hàng.' }}
                </p>
              </div>

              <!-- Receiver Details -->
              <div class="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs border-b border-slate-100">
                <div>
                  <span class="text-slate-400 font-extrabold uppercase text-[10px] block">Khách hàng:</span>
                  <strong class="text-slate-900 text-sm">{{ order.customerName }}</strong> ({{ order.customerPhone }})
                </div>
                <div>
                  <span class="text-slate-400 font-extrabold uppercase text-[10px] block">Địa chỉ giao hàng:</span>
                  <span class="text-slate-800 font-semibold flex items-center gap-1">
                    <MapPin class="w-3.5 h-3.5 text-red-500 flex-shrink-0" /> {{ order.shippingAddress }}
                  </span>
                </div>
              </div>

              <!-- Product List -->
              <div class="p-4">
                <span class="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2">Chi Tiết Danh Mục Thép:</span>
                <div class="space-y-2">
                  <div v-for="(item, i) in order.items" :key="i" class="flex justify-between items-center text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span class="font-bold text-slate-900">{{ item.productName }}</span>
                    <span class="font-extrabold text-red-600 bg-red-50 px-2 py-0.5 rounded-lg border border-red-100">
                      {{ item.quantity }} {{ item.unit }} • {{ formatVND(item.subtotal) }}
                    </span>
                  </div>
                </div>

                <div class="flex justify-between items-center mt-3 pt-3 border-t border-slate-200 text-sm font-black">
                  <span>TỔNG GIAO DỊCH:</span>
                  <span class="text-red-600 text-base">{{ formatVND(order.totalAmount) }}</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-4 bg-slate-50 border-t flex justify-between items-center text-xs text-slate-500">
          <span>Hotline hỗ trợ vận chuyển: <strong class="text-red-600 font-bold">093 228 37 83</strong></span>
          <button @click="emit('close')" class="bg-slate-900 text-white font-bold px-4 py-2 rounded-xl text-xs">Đóng</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
