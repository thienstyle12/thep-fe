<script setup lang="ts">
import { ref } from 'vue';
import { useCartStore } from '../stores/cart';
import { X, Trash2, CheckCircle } from 'lucide-vue-next';
import api from '../api';

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
  } catch (err) {
    alert('Có lỗi xảy ra khi gửi đơn hàng. Vui lòng kiểm tra lại!');
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
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" @click="closeDrawer"></div>

    <div class="fixed inset-y-0 right-0 max-w-full flex pl-10">
      <div class="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">

        <!-- Header -->
        <div class="p-6 bg-slate-900 text-white flex justify-between items-center">
          <h3 class="text-xl font-black uppercase">Đơn Báo Giá & Đặt Hàng</h3>
          <button @click="closeDrawer" class="text-gray-400 hover:text-white"><X class="w-6 h-6"/></button>
        </div>

        <!-- Success Message -->
        <div v-if="orderSuccess" class="p-8 text-center my-auto space-y-4">
          <CheckCircle class="w-20 h-20 text-green-500 mx-auto"/>
          <h4 class="text-2xl font-black text-slate-900">ĐẶT HÀNG THÀNH CÔNG!</h4>
          <p class="text-gray-600">Mã đơn hàng của bạn: <strong class="text-red-600 font-mono text-xl block mt-1">{{ orderCode }}</strong></p>
          <p class="text-xs text-gray-500">Nhân viên kinh doanh Thép Việt Tín sẽ liên hệ chốt giá và xác nhận thời gian giao xe cẩu tận công trình trong 5 phút.</p>
          
          <div class="pt-4 flex flex-col gap-2">
            <button @click="handlePrintQuote" class="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-3 rounded-xl text-xs uppercase border border-slate-300">
              🖨️ In / Tải Bảng Báo Giá PDF
            </button>
            <button @click="closeDrawer" class="w-full bg-slate-900 text-white font-bold px-6 py-3 rounded-xl text-xs uppercase">Đóng cửa sổ</button>
          </div>
        </div>

        <!-- Cart List + Checkout Form -->
        <div v-else class="flex-grow overflow-y-auto p-6 space-y-6">
          <div v-if="cartStore.items.length === 0" class="text-center text-gray-400 py-12">
            Giỏ hàng của bạn đang trống.
          </div>

          <div v-else class="space-y-4">
            <div v-for="item in cartStore.items" :key="item.product.id" class="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
              <div class="flex items-center space-x-3">
                <img :src="item.product.imageUrl" class="w-14 h-14 object-cover rounded-lg"/>
                <div>
                  <h5 class="font-bold text-sm text-slate-900">{{ item.product.name }}</h5>
                  <p class="text-xs text-gray-500">{{ formatPrice(item.product.pricePerUnit) }} / {{ item.product.unit }}</p>

                  <!-- Quantity Controls -->
                  <div class="flex items-center space-x-2 mt-1">
                    <button @click="item.quantity > 1 ? item.quantity-- : null" class="px-2 py-0.5 bg-gray-200 rounded font-bold">-</button>
                    <span class="text-xs font-bold">{{ item.quantity }} {{ item.product.unit }}</span>
                    <button @click="item.quantity++" class="px-2 py-0.5 bg-gray-200 rounded font-bold">+</button>
                  </div>
                </div>
              </div>
              <button @click="cartStore.removeFromCart(item.product.id)" class="text-red-500 hover:text-red-700 p-2">
                <Trash2 class="w-5 h-5"/>
              </button>
            </div>

            <hr class="my-4"/>

            <!-- Total Price -->
            <div class="flex justify-between items-center text-lg font-black text-slate-900">
              <span>TỔNG TIỀN DỰ KIẾN:</span>
              <span class="text-red-600">{{ formatPrice(cartStore.totalPrice) }}</span>
            </div>

            <!-- Customer Form -->
            <div class="space-y-3 pt-4 border-t">
              <h5 class="font-bold text-sm text-slate-900 uppercase">Thông tin giao hàng</h5>
              <input v-model="customerName" type="text" placeholder="Họ và tên (*)" class="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500"/>
              <input v-model="customerPhone" type="tel" placeholder="Số điện thoại / Zalo (*)" class="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500"/>
              <input v-model="shippingAddress" type="text" placeholder="Địa chỉ nhận hàng công trình (*)" class="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500"/>
              <textarea v-model="note" placeholder="Ghi chú thêm (VD: Cần giao xe cẩu trước 9h sáng...)" class="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500" rows="2"></textarea>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div v-if="!orderSuccess && cartStore.items.length > 0" class="p-6 bg-gray-50 border-t">
          <button @click="handleCheckout" :disabled="isSubmitting" class="w-full bg-red-600 hover:bg-red-700 text-white font-black py-3.5 rounded-xl shadow-lg uppercase transition">
            {{ isSubmitting ? 'ĐANG XỬ LÝ...' : 'XÁC NHẬN GỬI ĐƠN BÁO GIÁ' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>