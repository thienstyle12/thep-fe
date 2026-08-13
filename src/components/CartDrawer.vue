<script setup lang="ts">
import { ref } from 'vue';
import { useCartStore } from '../stores/cart';
import { X, Trash2, CheckCircle, Send, Printer, ShoppingCart, User, Phone, MapPin, FileText } from 'lucide-vue-next';
import api from '../api';
import { useNotification } from '../composables/useNotification';

const { showNotification } = useNotification();

defineProps<{ isOpen: boolean }>();
const emit = defineEmits(['close']);

const cartStore = useCartStore();

const customerName = ref('');
const customerPhone = ref('');
const shippingAddress = ref('');
const note = ref('');

const isSubmitting = ref(false);
const orderSuccess = ref(false);
const orderCode = ref('');

const formatPrice = (val: number) => {
  if (!val || val === 0) return 'Liên hệ báo giá';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
};

const handleCheckout = async () => {
  if (!customerName.value || !customerPhone.value || !shippingAddress.value) {
    alert('Vui lòng điền đầy đủ Họ tên, SĐT và Địa chỉ giao hàng.');
    return;
  }

  isSubmitting.value = true;
  try {
    const payload = {
      customerName: customerName.value,
      customerPhone: customerPhone.value,
      shippingAddress: shippingAddress.value,
      note: note.value,
      items: cartStore.items.map(i => ({
        productId: i.product.id,
        quantity: i.quantity
      }))
    };

    const res = await api.post('/orders', payload);
    orderCode.value = res.data.orderCode;
    orderSuccess.value = true;
    cartStore.clearCart();
    showNotification('success', 'Gửi Đơn Hàng Thành Công!', `Mã đơn hàng của bạn là #${res.data.orderCode}`);
  } catch (err) {
    showNotification('error', 'Lỗi Gửi Đơn Hàng', 'Có lỗi xảy ra khi gửi đơn hàng. Vui lòng kiểm tra kết nối và thử lại!');
  } finally {
    isSubmitting.value = false;
  }
};

const closeDrawer = () => {
  orderSuccess.value = false;
  emit('close');
};

const handlePrintQuote = () => {
  window.print();
};
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-hidden">
    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" @click="closeDrawer"></div>

    <div class="fixed inset-y-0 right-0 max-w-full flex pl-10">
      <div class="w-screen max-w-md bg-white shadow-xl flex flex-col justify-between border-l border-slate-200">

        <!-- Header -->
        <div class="p-5 bg-slate-900 text-white flex justify-between items-center">
          <div class="flex items-center gap-2">
            <ShoppingCart class="w-5 h-5 text-amber-400" />
            <h3 class="text-base font-bold">Đơn Báo Giá & Đặt Hàng</h3>
          </div>
          <button @click="closeDrawer" class="text-slate-400 hover:text-white transition"><X class="w-5 h-5"/></button>
        </div>

        <!-- Success Message -->
        <div v-if="orderSuccess" class="p-6 text-center my-auto space-y-4">
          <CheckCircle class="w-16 h-16 text-emerald-500 mx-auto"/>
          <h4 class="text-xl font-bold text-slate-900">ĐẶT HÀNG THÀNH CÔNG!</h4>
          <p class="text-sm text-slate-600">Mã đơn hàng của bạn: <strong class="text-blue-600 font-mono text-lg block mt-1">#{{ orderCode }}</strong></p>
          <p class="text-xs text-slate-500">Nhân viên kinh doanh Thép Việt Tín sẽ liên hệ chốt giá và xác nhận thời gian giao hàng trong 5 phút.</p>
          
          <div class="pt-4 flex flex-col gap-2">
            <button @click="handlePrintQuote" class="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-200">
              <Printer class="w-4 h-4" /> In Báo Giá PDF
            </button>
            <button @click="closeDrawer" class="w-full bg-slate-900 text-white font-semibold px-6 py-2.5 rounded-xl text-xs">Đóng cửa sổ</button>
          </div>
        </div>

        <!-- Cart List + Form -->
        <div v-else class="flex-grow overflow-y-auto p-5 space-y-5">
          <div v-if="cartStore.items.length === 0" class="text-center text-slate-400 py-12 text-sm font-medium">
            Giỏ hàng của bạn đang trống.
          </div>

          <div v-else class="space-y-3">
            <div 
              v-for="item in cartStore.items" 
              :key="item.product.id" 
              class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs"
            >
              <div class="flex-grow pr-2">
                <h5 class="font-bold text-slate-800 text-xs">{{ item.product.name }}</h5>
                <span class="text-[11px] text-slate-500 font-medium block mt-0.5">{{ item.product.specifications }}</span>
                <span class="text-amber-600 font-semibold mt-1 block">{{ formatPrice(item.product.pricePerUnit) }} / {{ item.product.unit }}</span>
              </div>

              <div class="flex items-center gap-2 flex-shrink-0">
                <input 
                  type="number" 
                  v-model.number="item.quantity" 
                  min="1" 
                  class="w-14 bg-white border border-slate-300 rounded-lg text-center py-1 text-xs font-semibold focus:outline-none focus:border-blue-500"
                />
                <button @click="cartStore.removeFromCart(item.product.id)" class="text-slate-400 hover:text-amber-600 transition">
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Total Price Summary -->
            <div class="p-4 bg-slate-900 text-white rounded-xl space-y-1 text-xs">
              <div class="flex justify-between font-medium">
                <span class="text-slate-400">Tổng số mặt hàng:</span>
                <span>{{ cartStore.totalItemsCount }} item</span>
              </div>
              <div class="flex justify-between items-center pt-2 border-t border-slate-800">
                <span class="font-semibold text-slate-300">Tổng Giá Trị Dự Tính:</span>
                <span class="text-base font-bold text-amber-400 font-mono">{{ formatPrice(cartStore.totalPrice) }}</span>
              </div>
            </div>
          </div>

          <!-- Form Customer Info -->
          <div v-if="cartStore.items.length > 0" class="space-y-3 pt-3 border-t border-slate-200">
            <h5 class="font-bold text-slate-800 text-xs uppercase tracking-wider">Thông Tin Nhận Báo Giá</h5>

            <div>
              <label class="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
                <User class="w-3.5 h-3.5 text-slate-400" /> Họ & Tên Người Đặt *
              </label>
              <input 
                v-model="customerName" 
                type="text" 
                placeholder="Nguyễn Văn A" 
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label class="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
                <Phone class="w-3.5 h-3.5 text-slate-400" /> Số Điện Thoại *
              </label>
              <input 
                v-model="customerPhone" 
                type="text" 
                placeholder="0932283783" 
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label class="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
                <MapPin class="w-3.5 h-3.5 text-slate-400" /> Địa Chỉ Giao Hàng (Chân Công Trình) *
              </label>
              <input 
                v-model="shippingAddress" 
                type="text" 
                placeholder="Số 123 Dự án Vinhomes..." 
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label class="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
                <FileText class="w-3.5 h-3.5 text-slate-400" /> Ghi Chú Yêu Cầu Giao Hàng
              </label>
              <textarea 
                v-model="note" 
                rows="2" 
                placeholder="Ví dụ: Giao sau 17h, cần xe cẩu 15 tấn..." 
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div v-if="!orderSuccess && cartStore.items.length > 0" class="p-4 bg-slate-50 border-t border-slate-200">
          <button 
            @click="handleCheckout" 
            :disabled="isSubmitting"
            class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-semibold py-3 px-4 rounded-xl text-xs uppercase tracking-wide transition flex items-center justify-center gap-2 shadow-sm"
          >
            <Send class="w-4 h-4" /> {{ isSubmitting ? 'Đang Gửi...' : 'Xác Nhận Gửi Yêu Cầu Báo Giá' }}
          </button>
        </div>

      </div>
    </div>
  </div>
</template>