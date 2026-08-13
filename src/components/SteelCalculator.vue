<script setup lang="ts">
import { ref, computed } from 'vue';
import { Calculator, PlusCircle, Check } from 'lucide-vue-next';
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
// Rebar: W = (d^2 / 162) * length (kg/cây)
const rebarWeightPerPiece = computed(() => {
  const d = rebarDiameter.value;
  return (d * d / 162) * rebarLength.value;
});

const totalRebarWeight = computed(() => rebarWeightPerPiece.value * rebarQuantity.value);
const totalRebarPrice = computed(() => totalRebarWeight.value * rebarPricePerKg.value);

// Tube: W = [2*(a+b)/3.14 - t] * t * 0.02466 * length (kg/cây)
const tubeWeightPerPiece = computed(() => {
  const a = tubeWidth.value;
  const b = tubeHeight.value;
  const t = tubeThickness.value;
  return (2 * (a + b) / 3.14159 - t) * t * 0.02466 * tubeLength.value;
});

const totalTubeWeight = computed(() => tubeWeightPerPiece.value * tubeQuantity.value);
const totalTubePrice = computed(() => totalTubeWeight.value * tubePricePerKg.value);

// Plate: W = t(mm) * W(m) * L(m) * 7.85 (kg/tấm)
const plateWeightPerPiece = computed(() => {
  return plateThickness.value * plateWidth.value * plateLength.value * 7.85;
});

const totalPlateWeight = computed(() => plateWeightPerPiece.value * plateQuantity.value);
const totalPlatePrice = computed(() => totalPlateWeight.value * platePricePerKg.value);

// Structural V: W = (2*a - t) * t * 0.00785 * length (kg/cây)
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
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Math.round(val));
};

const handleAddToCart = () => {
  let productName = '';
  let specs = '';
  let qty = 1;
  let unit = 'Kg';
  let price = 0;

  if (activeTab.value === 'rebar') {
    productName = `Thép Cây D${rebarDiameter.value} (Tính theo khối lượng)`;
    specs = `Ø ${rebarDiameter.value}mm • Dài ${rebarLength.value}m • ${rebarQuantity.value} cây (${totalRebarWeight.value.toFixed(1)} kg)`;
    qty = Math.round(totalRebarWeight.value);
    price = rebarPricePerKg.value;
  } else if (activeTab.value === 'tube') {
    productName = `Thép Hộp ${tubeWidth.value}x${tubeHeight.value}x${tubeThickness.value}mm`;
    specs = `Quy cách ${tubeWidth.value}x${tubeHeight.value}mm • Dày ${tubeThickness.value}mm • Dài ${tubeLength.value}m • ${tubeQuantity.value} cây`;
    qty = Math.round(totalTubeWeight.value);
    price = tubePricePerKg.value;
  } else if (activeTab.value === 'plate') {
    productName = `Thép Tấm Dày ${plateThickness.value}mm (${plateWidth.value}x${plateLength.value}m)`;
    specs = `Dày ${plateThickness.value}mm • Rộng ${plateWidth.value}m • Dài ${plateLength.value}m • ${plateQuantity.value} tấm`;
    qty = Math.round(totalPlateWeight.value);
    price = platePricePerKg.value;
  } else {
    productName = `Thép Góc V${vSide.value}x${vSide.value}x${vThickness.value}mm`;
    specs = `Cánh ${vSide.value}mm • Dày ${vThickness.value}mm • Dài ${structuralLength.value}m • ${structuralQuantity.value} cây`;
    qty = Math.round(totalStructuralWeight.value);
    price = structuralPricePerKg.value;
  }

  cartStore.addToCart({
    id: Date.now(),
    name: productName,
    category: 'Tính Khối Lượng',
    specifications: specs,
    unit: unit,
    pricePerUnit: price,
    stockQuantity: 999,
    description: `Yêu cầu báo giá tính toán tự động: ${specs}`,
    badge: 'Dự Toán',
    imageUrl: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600'
  }, qty);

  addedNotice.value = true;
  setTimeout(() => addedNotice.value = false, 2500);
};
</script>

<template>
  <div id="calculator" class="bg-slate-900 text-white rounded-3xl p-6 md:p-10 shadow-2xl border border-slate-800 my-12">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <span class="inline-flex items-center gap-2 bg-[#006a64]/20 text-teal-300 border border-[#006a64]/40 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
          <Calculator class="w-4 h-4" /> Tiện ích kĩ sư & công trình
        </span>
        <h3 class="text-2xl md:text-3xl font-black text-white">BỘ TÍNH TRỌNG LƯỢNG THÉP</h3>
        <p class="text-slate-400 text-sm mt-1">Tính khối lượng (Kg/Tấn) và dự toán chi phí chính xác theo mác thép tiêu chuẩn</p>
      </div>

      <!-- Tab Buttons -->
      <div class="flex p-1 bg-slate-800/80 rounded-xl border border-slate-700 w-full md:w-auto overflow-x-auto">
        <button 
          @click="activeTab = 'rebar'" 
          :class="['flex-1 md:flex-none px-3.5 py-2 rounded-lg text-xs md:text-sm font-bold transition whitespace-nowrap', activeTab === 'rebar' ? 'bg-[#006a64] text-white shadow' : 'text-slate-400 hover:text-white']">
          Thép Cây / Cuộn
        </button>
        <button 
          @click="activeTab = 'tube'" 
          :class="['flex-1 md:flex-none px-3.5 py-2 rounded-lg text-xs md:text-sm font-bold transition whitespace-nowrap', activeTab === 'tube' ? 'bg-[#006a64] text-white shadow' : 'text-slate-400 hover:text-white']">
          Thép Hộp
        </button>
        <button 
          @click="activeTab = 'plate'" 
          :class="['flex-1 md:flex-none px-3.5 py-2 rounded-lg text-xs md:text-sm font-bold transition whitespace-nowrap', activeTab === 'plate' ? 'bg-[#006a64] text-white shadow' : 'text-slate-400 hover:text-white']">
          Thép Tấm
        </button>
        <button 
          @click="activeTab = 'structural'" 
          :class="['flex-1 md:flex-none px-3.5 py-2 rounded-lg text-xs md:text-sm font-bold transition whitespace-nowrap', activeTab === 'structural' ? 'bg-[#006a64] text-white shadow' : 'text-slate-400 hover:text-white']">
          Thép Góc V / Hình
        </button>
      </div>
    </div>

    <!-- Inputs & Results Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      
      <!-- Inputs Column -->
      <div class="lg:col-span-7 bg-slate-800/50 p-6 rounded-2xl border border-slate-700/60 space-y-5">

        <!-- TAB 1: THÉP CÂY -->
        <div v-if="activeTab === 'rebar'" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Đường kính (D - mm)</label>
              <select v-model="rebarDiameter" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:border-[#006a64] focus:outline-none">
                <option :value="6">D6 (Ø 6mm)</option>
                <option :value="8">D8 (Ø 8mm)</option>
                <option :value="10">D10 (Ø 10mm)</option>
                <option :value="12">D12 (Ø 12mm)</option>
                <option :value="14">D14 (Ø 14mm)</option>
                <option :value="16">D16 (Ø 16mm)</option>
                <option :value="18">D18 (Ø 18mm)</option>
                <option :value="20">D20 (Ø 20mm)</option>
                <option :value="22">D22 (Ø 22mm)</option>
                <option :value="25">D25 (Ø 25mm)</option>
                <option :value="28">D28 (Ø 28mm)</option>
                <option :value="32">D32 (Ø 32mm)</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Chiều dài cây (L - mét)</label>
              <input v-model.number="rebarLength" type="number" step="0.1" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:border-[#006a64] focus:outline-none"/>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Số lượng cây</label>
              <input v-model.number="rebarQuantity" type="number" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:border-[#006a64] focus:outline-none"/>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Đơn giá tham khảo (VNĐ / Kg)</label>
              <input v-model.number="rebarPricePerKg" type="number" step="100" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:border-[#006a64] focus:outline-none"/>
            </div>
          </div>
        </div>

        <!-- TAB 2: THÉP HỘP -->
        <div v-else-if="activeTab === 'tube'" class="space-y-4">
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Cạnh A (mm)</label>
              <input v-model.number="tubeWidth" type="number" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm font-semibold focus:border-[#006a64] focus:outline-none"/>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Cạnh B (mm)</label>
              <input v-model.number="tubeHeight" type="number" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm font-semibold focus:border-[#006a64] focus:outline-none"/>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Độ dày (t - mm)</label>
              <input v-model.number="tubeThickness" type="number" step="0.1" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm font-semibold focus:border-[#006a64] focus:outline-none"/>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Chiều dài (m)</label>
              <input v-model.number="tubeLength" type="number" step="0.5" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm font-semibold focus:border-[#006a64] focus:outline-none"/>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Số lượng cây</label>
              <input v-model.number="tubeQuantity" type="number" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm font-semibold focus:border-[#006a64] focus:outline-none"/>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Giá (VNĐ / Kg)</label>
              <input v-model.number="tubePricePerKg" type="number" step="100" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm font-semibold focus:border-[#006a64] focus:outline-none"/>
            </div>
          </div>
        </div>

        <!-- TAB 3: THÉP TẤM -->
        <div v-else-if="activeTab === 'plate'" class="space-y-4">
          <div class="grid grid-cols-3 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Độ dày (mm)</label>
              <input v-model.number="plateThickness" type="number" step="0.5" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm font-semibold focus:border-[#006a64] focus:outline-none"/>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Chiều rộng (m)</label>
              <input v-model.number="plateWidth" type="number" step="0.1" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm font-semibold focus:border-[#006a64] focus:outline-none"/>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Chiều dài (m)</label>
              <input v-model.number="plateLength" type="number" step="0.5" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm font-semibold focus:border-[#006a64] focus:outline-none"/>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Số lượng tấm</label>
              <input v-model.number="plateQuantity" type="number" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:border-[#006a64] focus:outline-none"/>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Giá (VNĐ / Kg)</label>
              <input v-model.number="platePricePerKg" type="number" step="100" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:border-[#006a64] focus:outline-none"/>
            </div>
          </div>
        </div>

        <!-- TAB 4: THÉP HÌNH V -->
        <div v-else class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Cánh V (mm)</label>
              <input v-model.number="vSide" type="number" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm font-semibold focus:border-[#006a64] focus:outline-none"/>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Độ dày (t - mm)</label>
              <input v-model.number="vThickness" type="number" step="0.5" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm font-semibold focus:border-[#006a64] focus:outline-none"/>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Chiều dài (m)</label>
              <input v-model.number="structuralLength" type="number" step="0.5" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm font-semibold focus:border-[#006a64] focus:outline-none"/>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Số lượng cây</label>
              <input v-model.number="structuralQuantity" type="number" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:border-[#006a64] focus:outline-none"/>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Giá (VNĐ / Kg)</label>
              <input v-model.number="structuralPricePerKg" type="number" step="100" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:border-[#006a64] focus:outline-none"/>
            </div>
          </div>
        </div>

        <div class="text-xs text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          💡 Công thức chuẩn: Trọng lượng thép <strong>W = d² / 162 × L</strong> (Thép cây), <strong>W = (2a-t) × t × 0.00785 × L</strong> (Thép V) hoặc <strong>W = T × W × L × 7.85</strong> (Thép tấm).
        </div>
      </div>

      <!-- Results & Action Card -->
      <div class="lg:col-span-5 bg-gradient-to-br from-[#006a64] to-[#004e4a] p-6 md:p-8 rounded-2xl flex flex-col justify-between shadow-xl relative overflow-hidden">
        <div class="relative z-10">
          <span class="text-xs font-bold text-teal-200 uppercase tracking-widest block mb-1">Kết quả tính toán</span>
          <h4 class="text-xl font-black text-white mb-6">TỔNG KHỐI LƯỢNG & CHI PHÍ</h4>

          <div class="space-y-4 mb-6">
            <div class="bg-black/30 backdrop-blur-md p-4 rounded-xl border border-white/10 flex justify-between items-center">
              <span class="text-sm font-medium text-slate-200">Trọng lượng 1 đơn vị:</span>
              <span class="text-lg font-black text-yellow-300">
                {{ (currentWeight / (currentQuantity || 1)).toFixed(2) }} kg
              </span>
            </div>

            <div class="bg-black/30 backdrop-blur-md p-4 rounded-xl border border-white/10 flex justify-between items-center">
              <span class="text-sm font-medium text-slate-200">TỔNG KHỐI LƯỢNG:</span>
              <div class="text-right">
                <span class="text-2xl font-black text-white block">{{ currentWeight.toFixed(1) }} Kg</span>
                <span class="text-xs text-teal-200 font-mono">~ {{ (currentWeight / 1000).toFixed(3) }} Tấn</span>
              </div>
            </div>

            <div class="bg-black/30 backdrop-blur-md p-4 rounded-xl border border-white/10 flex justify-between items-center">
              <span class="text-sm font-medium text-slate-200">DỰ TOÁN TIỀN THÉP:</span>
              <span class="text-2xl font-black text-yellow-300">{{ formatVND(currentPrice) }}</span>
            </div>
          </div>
        </div>

        <button 
          @click="handleAddToCart"
          :class="[
            'w-full py-4 rounded-xl font-black uppercase text-sm shadow-2xl transition flex items-center justify-center gap-2 relative z-10',
            addedNotice ? 'bg-emerald-600 text-white' : 'bg-slate-900 hover:bg-black text-white'
          ]">
          <template v-if="addedNotice">
            <Check class="w-5 h-5" /> Đã thêm vào Giỏ Báo Giá!
          </template>
          <template v-else>
            <PlusCircle class="w-5 h-5 text-teal-300" /> Thêm kết quả vào Giỏ Báo Giá
          </template>
        </button>
      </div>

    </div>
  </div>
</template>
