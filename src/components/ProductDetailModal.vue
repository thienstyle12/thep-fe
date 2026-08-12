<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Product } from '../types';
import { useCartStore } from '../stores/cart';
import { X, CheckCircle2, ShieldCheck, Truck, Factory, Plus, Minus, ShoppingCart, Award } from 'lucide-vue-next';

const props = defineProps<{
  product: Product | null;
  isOpen: boolean;
}>();

const emit = defineEmits(['close', 'open-cart']);
const cartStore = useCartStore();

const quantity = ref(1);
const addedNotice = ref(false);

const formatPrice = (val: number) => {
  if (!val || val === 0) return 'Liên hệ báo giá';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
};

const totalPrice = computed(() => {
  if (!props.product || !props.product.pricePerUnit) return 0;
  return props.product.pricePerUnit * quantity.value;
});

const handleAddToCart = () => {
  if (!props.product) return;
  cartStore.addToCart(props.product, quantity.value);
  addedNotice.value = true;
  setTimeout(() => {
    addedNotice.value = false;
    emit('close');
    emit('open-cart');
  }, 1000);
};
</script>

<template>
  <Transition name="fade">
    <div v-if="isOpen && product" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" @click="emit('close')"></div>

      <div class="relative z-10 w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        <!-- Header -->
        <div class="px-6 py-4 bg-slate-950 text-white flex items-center justify-between flex-shrink-0">
          <div class="flex items-center gap-2">
            <span class="bg-[#006a64] text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider">
              {{ product.badge || 'Chính Hãng' }}
            </span>
            <span class="text-xs font-mono text-slate-400">SKU: {{ product.sku || 'VT-' + product.id }}</span>
          </div>
          <button @click="emit('close')" class="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition">
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 md:p-8 overflow-y-auto flex-grow grid grid-cols-1 md:grid-cols-12 gap-8">
          
          <!-- Image Column -->
          <div class="md:col-span-5 space-y-4">
            <div class="relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner h-64">
              <img :src="product.imageUrl" :alt="product.name" class="w-full h-full object-cover" />
            </div>

            <!-- Trust Badges -->
            <div class="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2.5 text-xs text-slate-700 font-semibold">
              <div class="flex items-center gap-2">
                <ShieldCheck class="w-4 h-4 text-[#006a64] flex-shrink-0" />
                <span>Chứng chỉ CO/CQ chuẩn nhà máy 100%</span>
              </div>
              <div class="flex items-center gap-2">
                <Truck class="w-4 h-4 text-[#006a64] flex-shrink-0" />
                <span>Giao hàng xe cẩu tận chân công trình</span>
              </div>
              <div class="flex items-center gap-2">
                <Factory class="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>Chiết khấu cao cho đơn dự án / đại lý</span>
              </div>
            </div>
          </div>

          <!-- Product Content Column -->
          <div class="md:col-span-7 flex flex-col justify-between space-y-6">
            <div>
              <span class="text-xs font-extrabold text-[#006a64] uppercase tracking-widest block mb-1">
                {{ product.category || 'Thép Công Trình' }}
              </span>
              <h2 class="text-2xl md:text-3xl font-black text-slate-900 leading-tight mb-3">
                {{ product.name }}
              </h2>

              <!-- Price Tag -->
              <div class="bg-teal-50/60 border border-teal-100 rounded-2xl p-4 mb-5 flex items-baseline justify-between">
                <div>
                  <span class="text-xs text-slate-500 font-bold uppercase block mb-0.5">Đơn giá niêm yết:</span>
                  <span class="text-2xl font-black text-[#006a64]">{{ formatPrice(product.pricePerUnit) }}</span>
                  <span class="text-xs text-slate-500 font-bold"> / {{ product.unit }}</span>
                </div>
                <div class="text-right">
                  <span class="text-[10px] bg-[#006a64] text-white font-extrabold px-2.5 py-1 rounded-full uppercase">
                    Tồn kho: {{ product.stockQuantity || 500 }} {{ product.unit }}
                  </span>
                </div>
              </div>

              <!-- Technical Specifications -->
              <div class="space-y-3 mb-5">
                <h4 class="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Thông Số & Quy Cách Kĩ Thuật:</h4>
                <div class="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 font-medium leading-relaxed">
                  <p class="font-extrabold text-slate-900 mb-1">📐 Quy cách: {{ product.specifications }}</p>
                  <p class="text-slate-600">{{ product.description }}</p>
                </div>
              </div>

              <!-- Custom Quantity Selector -->
              <div class="space-y-2">
                <label class="block text-xs font-extrabold text-slate-700 uppercase">
                  Số lượng đặt mua ({{ product.unit }}):
                </label>
                <div class="flex items-center gap-3">
                  <div class="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-slate-50">
                    <button @click="quantity > 1 ? quantity-- : null" class="px-3 py-2 text-slate-700 hover:bg-slate-200 font-black">-</button>
                    <input v-model.number="quantity" type="number" min="1" class="w-16 text-center font-bold text-sm bg-transparent outline-none" />
                    <button @click="quantity++" class="px-3 py-2 text-slate-700 hover:bg-slate-200 font-black">+</button>
                  </div>
                  <span class="text-xs font-bold text-slate-500">Thành tiền tạm tính: <strong class="text-[#006a64] text-sm font-black">{{ formatPrice(totalPrice) }}</strong></span>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="pt-4 border-t border-slate-200 flex gap-3">
              <button
                @click="handleAddToCart"
                :class="[
                  'flex-1 py-3.5 rounded-2xl font-black uppercase text-xs tracking-wider shadow-lg transition flex items-center justify-center gap-2',
                  addedNotice ? 'bg-emerald-600 text-white' : 'bg-[#006a64] hover:bg-[#00544f] text-white'
                ]">
                <template v-if="addedNotice">
                  <CheckCircle2 class="w-5 h-5" /> Đã thêm vào Giỏ Báo Giá!
                </template>
                <template v-else>
                  <ShoppingCart class="w-5 h-5" /> + Thêm Vào Giỏ Báo Giá
                </template>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
