<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Product } from '../types';
import { useCartStore } from '../stores/cart';
import { X, CheckCircle2, ShieldCheck, Truck, Factory, Plus, Minus, ShoppingCart } from 'lucide-vue-next';

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

const handleAddToCart = () => {
  if (!props.product) return;
  cartStore.addToCart(props.product, quantity.value);
  addedNotice.value = true;
  setTimeout(() => {
    addedNotice.value = false;
    emit('close');
    emit('open-cart');
  }, 900);
};
</script>

<template>
  <Transition name="fade">
    <div v-if="isOpen && product" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/70 backdrop-blur-xs" @click="emit('close')"></div>

      <div class="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        <!-- Header -->
        <div class="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between flex-shrink-0">
          <div class="flex items-center gap-2">
            <span class="bg-[#004d40] text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded shadow-xs">
              {{ product.badge || 'Chính Hãng' }}
            </span>
            <span class="text-xs font-mono text-slate-400">SKU: {{ product.sku || 'VT-' + product.id }}</span>
          </div>
          <button @click="emit('close')" class="p-1 rounded text-slate-400 hover:text-white transition cursor-pointer">
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 overflow-y-auto flex-grow grid grid-cols-1 md:grid-cols-12 gap-6">
          <div class="md:col-span-5 space-y-3">
            <div class="relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200 h-52">
              <img :src="product.imageUrl" :alt="product.name" class="w-full h-full object-cover" />
            </div>

            <div class="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2 text-xs text-slate-700 font-medium">
              <div class="flex items-center gap-2">
                <ShieldCheck class="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Chứng chỉ CO/CQ chuẩn nhà máy</span>
              </div>
              <div class="flex items-center gap-2">
                <Truck class="w-4 h-4 text-[#004d40] flex-shrink-0" />
                <span>Giao hàng xe cẩu tận công trình</span>
              </div>
            </div>
          </div>

          <div class="md:col-span-7 flex flex-col justify-between space-y-4">
            <div>
              <span class="text-xs font-bold text-teal-700 uppercase tracking-wider block mb-1">
                {{ product.category || 'Thép Công Trình' }}
              </span>
              <h2 class="text-xl font-bold text-slate-900 leading-snug mb-2">
                {{ product.name }}
              </h2>

              <div class="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-4">
                <span class="text-[11px] text-slate-500 font-medium block mb-0.5">Đơn giá niêm yết:</span>
                <span class="text-xl font-bold text-[#004d40]">{{ formatPrice(product.pricePerUnit) }}</span>
                <span class="text-xs text-slate-500 font-medium"> / {{ product.unit }}</span>
              </div>

              <div class="space-y-2 text-xs">
                <div>
                  <span class="font-semibold text-slate-700">Quy cách kỹ thuật:</span>
                  <p class="text-slate-600 mt-0.5 font-medium">{{ product.specifications }}</p>
                </div>
                <div>
                  <span class="font-semibold text-slate-700">Mô tả sản phẩm:</span>
                  <p class="text-slate-500 mt-0.5 leading-relaxed font-normal">{{ product.description }}</p>
                </div>
              </div>
            </div>

            <div class="pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
              <div class="flex items-center border border-slate-300 rounded-xl bg-slate-50 p-1">
                <button @click="quantity = Math.max(1, quantity - 1)" class="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer">
                  <Minus class="w-3.5 h-3.5" />
                </button>
                <span class="w-8 text-center text-xs font-bold font-mono">{{ quantity }}</span>
                <button @click="quantity++" class="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer">
                  <Plus class="w-3.5 h-3.5" />
                </button>
              </div>

              <button 
                @click="handleAddToCart"
                class="flex-1 bg-[#004d40] hover:bg-teal-900 text-white font-semibold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wide transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <template v-if="addedNotice">
                  <CheckCircle2 class="w-4 h-4 text-amber-400 animate-bounce" /> Đã Thêm Giỏ Báo Giá!
                </template>
                <template v-else>
                  <ShoppingCart class="w-4 h-4" /> Thêm Vào Giỏ Báo Giá
                </template>
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  </Transition>
</template>
