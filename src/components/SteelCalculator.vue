<script setup lang="ts">
import { ref, computed } from 'vue';
import { Calculator, PlusCircle, Check, Scale, FileText, Layers, Box, Maximize2, Compass } from 'lucide-vue-next';
import { useCartStore } from '../stores/cart';

const cartStore = useCartStore();

const activeTab = ref<'rebar' | 'tube' | 'plate' | 'structural'>('rebar');

// Rebar (Thép cây) params
const rebarDiameter = ref(12); // mm
const rebarLength = ref(11.7); // m
const rebarQuantity = ref(100); // cây
const rebarPricePerKg = ref(16500); // VNĐ/kg

// Tube (Thép hộp) params
const tubeWidth = ref(50); // mm
const tubeHeight = ref(100); // mm
const tubeThickness = ref(1.8); // mm
const tubeLength = ref(6); // m
const tubeQuantity = ref(50); // cây
const tubePricePerKg = ref(17800); // VNĐ/kg

// Plate (Thép tấm) params
const plateThickness = ref(5); // mm
const plateWidth = ref(1.5); // m
const plateLength = ref(6.0); // m
const plateQuantity = ref(10); // tấm
const platePricePerKg = ref(16800); // VNĐ/kg

// Structural (Thép Hình V / I / U) params
const vSide = ref(50); // mm
const vThickness = ref(5); // mm
const structuralLength = ref(6); // m
const structuralQuantity = ref(20); // cây
const structuralPricePerKg = ref(17500); // VNĐ/kg

const addedNotice = ref(false);

// Formulas
const rebarWeightPerPiece = computed(() => {
  const d = rebarDiameter.value;
  return (d * d / 162) * rebarLength.value;
});
const totalRebarWeight = computed(() => rebarWeightPerPiece.value * rebarQuantity.value);
const totalRebarPrice = computed(() => totalRebarWeight.value * rebarPricePerKg.value);

const tubeWeightPerPiece = computed(() => {
  const a = tubeWidth.value;
  const b = tubeHeight.value;
  const t = tubeThickness.value;
  return (2 * (a + b) / 3.14159 - t) * t * 0.02466 * tubeLength.value;
});
const totalTubeWeight = computed(() => tubeWeightPerPiece.value * tubeQuantity.value);
const totalTubePrice = computed(() => totalTubeWeight.value * tubePricePerKg.value);

const plateWeightPerPiece = computed(() => plateThickness.value * plateWidth.value * plateLength.value * 7.85);
const totalPlateWeight = computed(() => plateWeightPerPiece.value * plateQuantity.value);
const totalPlatePrice = computed(() => totalPlateWeight.value * platePricePerKg.value);

const structuralWeightPerPiece = computed(() => {
  const a = vSide.value;
  const t = vThickness.value;
  return (2 * a - t) * t * 0.00785 * structuralLength.value;
});
const totalStructuralWeight = computed(() => structuralWeightPerPiece.value * structuralQuantity.value);
const totalStructuralPrice = computed(() => totalStructuralWeight.value * structuralPricePerKg.value);

const currentWeight = computed(() => {
  if (activeTab.value === 'rebar') return totalRebarWeight.value;
  if (activeTab.value === 'tube') return totalTubeWeight.value;
  if (activeTab.value === 'plate') return totalPlateWeight.value;
  return totalStructuralWeight.value;
});

const currentPrice = computed(() => {
  if (activeTab.value === 'rebar') return totalRebarPrice.value;
  if (activeTab.value === 'tube') return totalTubePrice.value;
  if (activeTab.value === 'plate') return totalPlatePrice.value;
  return totalStructuralPrice.value;
});

const currentQuantity = computed(() => {
  if (activeTab.value === 'rebar') return rebarQuantity.value;
  if (activeTab.value === 'tube') return tubeQuantity.value;
  if (activeTab.value === 'plate') return plateQuantity.value;
  return structuralQuantity.value;
});

const formatVND = (val: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
};

const handleAddToCart = () => {
  let name = '';
  let specs = '';
  let unit = 'cây';
  let unitPrice = 0;

  if (activeTab.value === 'rebar') {
    name = `Thép Thanh Vằn D${rebarDiameter.value}`;
    specs = `Đường kính ${rebarDiameter.value}mm x Chiều dài ${rebarLength.value}m (~${rebarWeightPerPiece.value.toFixed(2)} kg/cây)`;
    unitPrice = (totalRebarPrice.value / rebarQuantity.value);
  } else if (activeTab.value === 'tube') {
    name = `Thép Hộp ${tubeWidth.value}x${tubeHeight.value}x${tubeThickness.value}mm`;
    specs = `Quy cách ${tubeWidth.value}x${tubeHeight.value}mm, Dày ${tubeThickness.value}mm x Dài ${tubeLength.value}m (~${tubeWeightPerPiece.value.toFixed(2)} kg/cây)`;
    unitPrice = (totalTubePrice.value / tubeQuantity.value);
  } else if (activeTab.value === 'plate') {
    name = `Thép Tấm Dày ${plateThickness.value}mm`;
    specs = `Kích thước ${plateWidth.value}m x ${plateLength.value}m (~${plateWeightPerPiece.value.toFixed(2)} kg/tấm)`;
    unit = 'tấm';
    unitPrice = (totalPlatePrice.value / plateQuantity.value);
  } else {
    name = `Thép Hình V${vSide.value}x${vThickness.value}mm`;
    specs = `Cạnh V ${vSide.value}mm, Độ dày ${vThickness.value}mm x Dài ${structuralLength.value}m (~${structuralWeightPerPiece.value.toFixed(2)} kg/cây)`;
    unitPrice = (totalStructuralPrice.value / structuralQuantity.value);
  }

  const customProduct = {
    id: Date.now(),
    name: `${name} (Tính từ công cụ)`,
    specifications: specs,
    pricePerUnit: Math.round(unitPrice),
    unit: unit,
    category: 'Thép Tính Theo Quy Cách',
    imageUrl: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=500',
    description: `Khối lượng dự toán: ${currentWeight.value.toFixed(2)} kg cho ${currentQuantity.value} ${unit}.`,
    stockQuantity: 9999,
    badge: 'Dự Toán'
  };

  cartStore.addToCart(customProduct, currentQuantity.value);
  addedNotice.value = true;
  setTimeout(() => {
    addedNotice.value = false;
  }, 2000);
};
</script>

<template>
  <div id="calculator" class="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 my-10 shadow-sm">
    <!-- Header -->
    <div class="flex items-center gap-3 pb-6 border-b border-slate-200 mb-6">
      <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
        <Calculator class="w-5 h-5" />
      </div>
      <div>
        <h3 class="text-xl font-bold text-slate-900">Công Cụ Tính Trọng Lượng Thép TCVN</h3>
        <p class="text-xs text-slate-500 font-medium">Tính toán nhanh số kg, Tấn & quy đổi chi phí ước tính theo TCVN 1651-2</p>
      </div>
    </div>

    <!-- Category Tabs Filter -->
    <div class="flex flex-wrap gap-2 mb-6 bg-slate-100/70 p-1.5 rounded-2xl border border-slate-200/80">
      <button 
        @click="activeTab = 'rebar'"
        :class="['flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95', 
          activeTab === 'rebar' ? 'bg-slate-900 text-white shadow-sm shadow-slate-900/20 scale-[1.01]' : 'text-slate-600 hover:text-slate-900 hover:bg-white/80']">
        <Layers class="w-3.5 h-3.5 text-blue-400" v-if="activeTab === 'rebar'" />
        <Layers class="w-3.5 h-3.5 text-slate-400" v-else />
        Thép Thanh Vằn (Cây)
      </button>

      <button 
        @click="activeTab = 'tube'"
        :class="['flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95', 
          activeTab === 'tube' ? 'bg-slate-900 text-white shadow-sm shadow-slate-900/20 scale-[1.01]' : 'text-slate-600 hover:text-slate-900 hover:bg-white/80']">
        <Box class="w-3.5 h-3.5 text-blue-400" v-if="activeTab === 'tube'" />
        <Box class="w-3.5 h-3.5 text-slate-400" v-else />
        Thép Hộp Vuông / Chữ Nhật
      </button>

      <button 
        @click="activeTab = 'plate'"
        :class="['flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95', 
          activeTab === 'plate' ? 'bg-slate-900 text-white shadow-sm shadow-slate-900/20 scale-[1.01]' : 'text-slate-600 hover:text-slate-900 hover:bg-white/80']">
        <Maximize2 class="w-3.5 h-3.5 text-blue-400" v-if="activeTab === 'plate'" />
        <Maximize2 class="w-3.5 h-3.5 text-slate-400" v-else />
        Thép Tấm
      </button>

      <button 
        @click="activeTab = 'structural'"
        :class="['flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95', 
          activeTab === 'structural' ? 'bg-slate-900 text-white shadow-sm shadow-slate-900/20 scale-[1.01]' : 'text-slate-600 hover:text-slate-900 hover:bg-white/80']">
        <Compass class="w-3.5 h-3.5 text-blue-400" v-if="activeTab === 'structural'" />
        <Compass class="w-3.5 h-3.5 text-slate-400" v-else />
        Thép Hình V
      </button>
    </div>

    <!-- Main Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Input Controls -->
      <div class="lg:col-span-7 space-y-4">
        <!-- Rebar form -->
        <div v-if="activeTab === 'rebar'" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Đường Kính d (mm)</label>
            <select v-model="rebarDiameter" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500">
              <option v-for="d in [6,8,10,12,14,16,18,20,22,25,28,32]" :key="d" :value="d">Phi {{ d }} (d{{ d }}mm)</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Chiều Dài Thanh (m)</label>
            <input v-model.number="rebarLength" type="number" step="0.1" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Số Lượng Thanh (Cây)</label>
            <input v-model.number="rebarQuantity" type="number" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Đơn Giá Tham Khảo (Đồng/kg)</label>
            <input v-model.number="rebarPricePerKg" type="number" step="100" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500" />
          </div>
        </div>

        <!-- Tube form -->
        <div v-if="activeTab === 'tube'" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Cạnh Rộng a (mm)</label>
            <input v-model.number="tubeWidth" type="number" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Cạnh Cao b (mm)</label>
            <input v-model.number="tubeHeight" type="number" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Độ Dày t (mm)</label>
            <input v-model.number="tubeThickness" type="number" step="0.1" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Chiều Dài (m)</label>
            <input v-model.number="tubeLength" type="number" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Số Lượng Cây</label>
            <input v-model.number="tubeQuantity" type="number" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Đơn Giá Tham Khảo (Đồng/kg)</label>
            <input v-model.number="tubePricePerKg" type="number" step="100" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500" />
          </div>
        </div>

        <!-- Plate form -->
        <div v-if="activeTab === 'plate'" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Độ Dày t (mm)</label>
            <input v-model.number="plateThickness" type="number" step="0.5" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Chiều Rộng W (m)</label>
            <input v-model.number="plateWidth" type="number" step="0.1" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Chiều Dài L (m)</label>
            <input v-model.number="plateLength" type="number" step="0.1" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Số Lượng Tấm</label>
            <input v-model.number="plateQuantity" type="number" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Đơn Giá Tham Khảo (Đồng/kg)</label>
            <input v-model.number="platePricePerKg" type="number" step="100" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500" />
          </div>
        </div>

        <!-- Structural form -->
        <div v-if="activeTab === 'structural'" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Cạnh V a (mm)</label>
            <input v-model.number="vSide" type="number" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Độ Dày t (mm)</label>
            <input v-model.number="vThickness" type="number" step="0.5" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Chiều Dài Cây (m)</label>
            <input v-model.number="structuralLength" type="number" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Số Lượng Cây</label>
            <input v-model.number="structuralQuantity" type="number" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Đơn Giá Tham Khảo (Đồng/kg)</label>
            <input v-model.number="structuralPricePerKg" type="number" step="100" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500" />
          </div>
        </div>
      </div>

      <!-- Output Results Panel -->
      <div class="lg:col-span-5 bg-slate-900 text-white rounded-2xl p-6 flex flex-col justify-between border border-slate-800">
        <div>
          <div class="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-4 pb-3 border-b border-slate-800">
            <Scale class="w-4 h-4 text-amber-400" />
            <span>KẾT QUẢ TÍNH LÝ THUYẾT TCVN</span>
          </div>

          <div class="mb-4">
            <span class="text-xs text-slate-400 font-medium block mb-1">Trọng Lượng 1 Đơn Vị (Cây/Tấm):</span>
            <div class="text-2xl font-bold text-white font-mono">
              <template v-if="activeTab === 'rebar'">{{ rebarWeightPerPiece.toFixed(2) }} kg</template>
              <template v-else-if="activeTab === 'tube'">{{ tubeWeightPerPiece.toFixed(2) }} kg</template>
              <template v-else-if="activeTab === 'plate'">{{ plateWeightPerPiece.toFixed(2) }} kg</template>
              <template v-else>{{ structuralWeightPerPiece.toFixed(2) }} kg</template>
            </div>
          </div>

          <div class="mb-4">
            <span class="text-xs text-slate-400 font-medium block mb-1">Tổng Trọng Lượng Dự Tính:</span>
            <div class="text-3xl font-bold text-emerald-400 font-mono">
              {{ currentWeight.toFixed(2) }} <span class="text-sm font-semibold text-slate-300">kg</span> 
              <span class="text-sm font-medium text-slate-400 ml-2">({{ (currentWeight / 1000).toFixed(3) }} Tấn)</span>
            </div>
          </div>

          <div class="mb-6">
            <span class="text-xs text-slate-400 font-medium block mb-1">Tổng Chi Phí Ước Tính:</span>
            <div class="text-2xl font-bold text-amber-400 font-mono">
              {{ formatVND(currentPrice) }}
            </div>
          </div>
        </div>

        <button 
          @click="handleAddToCart"
          :class="[
            'w-full font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wide transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98',
            addedNotice 
              ? 'bg-emerald-600 text-white' 
              : 'bg-[#004d40] hover:bg-[#003830] text-white border border-amber-400/50 shadow-amber-400/20'
          ]">
          <template v-if="addedNotice">
            <Check class="w-4 h-4 text-white" /> Đã Thêm Vào Giỏ Báo Giá Thành Công!
          </template>
          <template v-else>
            <PlusCircle class="w-4 h-4 text-amber-400" /> Thêm Khối Lượng Này Vào Đơn Báo Giá
          </template>
        </button>
      </div>
    </div>
  </div>
</template>
