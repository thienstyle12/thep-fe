<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import api from '../api';
import { useNotification } from '../composables/useNotification';

const { showNotification, showConfirm } = useNotification();
import {
  X, Plus, Edit3, Trash2, Package, ShoppingBag,
  Search, RefreshCw, CheckCircle2, ChevronDown,
  Save, AlertCircle, Info, Truck, Clock, Phone, MapPin
} from 'lucide-vue-next';

const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits(['close', 'product-updated']);

const activeTab = ref<'products' | 'orders'>('products');

interface Category { id: number; name: string; code: string; }

interface ProductItem {
  id?: number;
  name: string;
  sku: string;
  category?: string;
  categoryId?: number;
  specifications: string;
  unit: string;
  pricePerUnit: number;
  stockQuantity: number;
  description: string;
  badge: string;
  imageUrl: string;
}

interface OrderItem {
  productName: string;
  unit: string;
  quantity: number;
  pricePerUnit: number;
  subtotal: number;
}

interface Order {
  id: number;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

const products = ref<ProductItem[]>([]);
const categories = ref<Category[]>([]);
const isLoadingProducts = ref(false);
const productSearch = ref('');
const filterCategoryId = ref<number | null>(null);

const filteredProducts = computed(() => {
  let list = products.value;
  if (filterCategoryId.value !== null) {
    list = list.filter(p => p.categoryId === filterCategoryId.value);
  }
  if (productSearch.value.trim()) {
    const kw = productSearch.value.toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(kw) ||
      (p.sku || '').toLowerCase().includes(kw) ||
      (p.specifications || '').toLowerCase().includes(kw)
    );
  }
  return list;
});

const fetchProducts = async () => {
  isLoadingProducts.value = true;
  try {
    const res = await api.get('/products/admin');
    products.value = res.data;
  } catch (err) {
    console.error('fetchProducts error', err);
  } finally {
    isLoadingProducts.value = false;
  }
};

const fetchCategories = async () => {
  try {
    const res = await api.get('/categories');
    categories.value = res.data;
  } catch (err) {
    console.error('fetchCategories error', err);
  }
};

const EMPTY_FORM = (): ProductItem => ({
  name: '',
  sku: '',
  categoryId: undefined,
  specifications: '',
  unit: 'Kg',
  pricePerUnit: 0,
  stockQuantity: 500,
  description: '',
  badge: 'Sẵn Kho',
  imageUrl: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600',
});

const isFormOpen = ref(false);
const formMode = ref<'create' | 'edit'>('create');
const editingId = ref<number | null>(null);
const form = ref<ProductItem>(EMPTY_FORM());
const isSaving = ref(false);
const formError = ref('');
const saveSuccess = ref(false);

const openCreate = () => {
  formMode.value = 'create';
  editingId.value = null;
  formError.value = '';
  saveSuccess.value = false;
  form.value = {
    ...EMPTY_FORM(),
    categoryId: categories.value[0]?.id,
    sku: 'VT-' + Math.floor(1000 + Math.random() * 9000),
  };
  isFormOpen.value = true;
};

const openEdit = (p: ProductItem) => {
  formMode.value = 'edit';
  editingId.value = p.id ?? null;
  formError.value = '';
  saveSuccess.value = false;
  form.value = { ...p };
  isFormOpen.value = true;
};

const closeForm = () => {
  isFormOpen.value = false;
  isSaving.value = false;
  formError.value = '';
};

const validateForm = (): boolean => {
  if (!form.value.name.trim()) {
    formError.value = 'Tên sản phẩm không được để trống.';
    return false;
  }
  if (!form.value.categoryId) {
    formError.value = 'Vui lòng chọn danh mục sản phẩm.';
    return false;
  }
  if (!form.value.unit) {
    formError.value = 'Vui lòng chọn đơn vị tính.';
    return false;
  }
  return true;
};

const saveProduct = async () => {
  formError.value = '';
  if (!validateForm()) return;

  isSaving.value = true;
  try {
    if (formMode.value === 'edit' && editingId.value) {
      await api.put(`/products/${editingId.value}`, form.value);
    } else {
      await api.post('/products', form.value);
    }
    saveSuccess.value = true;
    showNotification('success', 'Lưu Thành Công!', 'Thông tin sản phẩm thép đã được lưu vào hệ thống.');
    await fetchProducts();
    emit('product-updated');
    setTimeout(() => {
      closeForm();
    }, 900);
  } catch (err: any) {
    formError.value = err?.response?.data?.message || 'Đã xảy ra lỗi khi lưu sản phẩm. Vui lòng kiểm tra lại.';
    showNotification('error', 'Lưu Sản Phẩm Thất Bại', formError.value);
  } finally {
    isSaving.value = false;
  }
};

const deleteProduct = (id?: number) => {
  if (!id) return;
  showConfirm(
    'Xác Nhận Xóa Sản Phẩm',
    'Bạn có chắc chắn muốn xóa sản phẩm thép này khỏi hệ thống?',
    async () => {
      try {
        await api.delete(`/products/${id}`);
        showNotification('success', 'Đã Xóa Sản Phẩm', 'Sản phẩm thép đã được xóa khỏi hệ thống thành công.');
        await fetchProducts();
        emit('product-updated');
      } catch (err) {
        showNotification('error', 'Không Thể Xóa', 'Có lỗi xảy ra khi xóa sản phẩm!');
      }
    },
    { confirmText: 'Xác Nhận Xóa', cancelText: 'Hủy Bỏ', type: 'error' }
  );
};

const orders = ref<Order[]>([]);
const isLoadingOrders = ref(false);
const filterStatus = ref('ALL');

const filteredOrders = computed(() => {
  if (filterStatus.value === 'ALL') return orders.value;
  return orders.value.filter(o => o.status === filterStatus.value);
});

const orderCounts = computed(() => ({
  all: orders.value.length,
  pending: orders.value.filter(o => o.status === 'CHO_XU_LY').length,
  shipping: orders.value.filter(o => o.status === 'DANG_GIAO').length,
  done: orders.value.filter(o => o.status === 'HOAN_THANH').length,
  cancelled: orders.value.filter(o => o.status === 'HUY').length,
}));

const fetchOrders = async () => {
  isLoadingOrders.value = true;
  try {
    const res = await api.get('/orders');
    orders.value = res.data;
  } catch (err) {
    console.error('fetchOrders error', err);
  } finally {
    isLoadingOrders.value = false;
  }
};

const updateOrderStatus = async (orderId: number, status: string) => {
  try {
    await api.patch(`/orders/${orderId}/status?status=${status}`);
    showNotification('success', 'Cập Nhật Đơn Hàng', 'Trạng thái đơn hàng đã được cập nhật thành công!');
    await fetchOrders();
  } catch (err) {
    showNotification('error', 'Lỗi Cập Nhật', 'Không thể cập nhật trạng thái đơn hàng!');
  }
};

const STATUS_MAP: Record<string, { text: string; cls: string }> = {
  CHO_XU_LY:  { text: 'Chờ Xử Lý', cls: 'bg-amber-100 text-amber-800 border-amber-200' },
  DANG_GIAO:  { text: 'Đang Giao Xe Cẩu', cls: 'bg-blue-100 text-blue-800 border-blue-200' },
  HOAN_THANH: { text: 'Hoàn Thành', cls: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  HUY:        { text: 'Đã Hủy', cls: 'bg-slate-100 text-slate-800 border-slate-200' },
};

const formatVND = (v: number) => {
  if (!v || v === 0) return 'Liên hệ';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);
};

const formatDate = (s: string) => s ? new Date(s).toLocaleString('vi-VN') : '';

watch(() => props.isOpen, async (val) => {
  if (val) {
    await Promise.all([fetchProducts(), fetchOrders(), fetchCategories()]);
  }
});
</script>

<template>
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div class="absolute inset-0 bg-slate-900/70 backdrop-blur-xs" @click="emit('close')" />

      <div class="relative z-10 flex flex-col w-full max-w-7xl h-[92vh] bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">

        <!-- HEADER -->
        <div class="flex items-center justify-between gap-4 px-6 py-3.5 bg-slate-900 text-white border-b border-slate-800 flex-shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-[#004d40] text-amber-400 font-extrabold text-sm border border-teal-400/30 flex items-center justify-center flex-shrink-0 shadow-md">VT</div>
            <div>
              <h2 class="text-base font-bold leading-none">BẢNG ĐIỀU KHIỂN QUẢN TRỊ</h2>
              <span class="text-[11px] text-slate-400 font-medium">Quản lý sản phẩm & đơn báo giá</span>
            </div>
          </div>

          <!-- Tabs -->
          <div class="flex p-1 bg-slate-800 rounded-xl border border-slate-700/80 gap-1 shadow-inner">
            <button
              @click="activeTab = 'products'"
              :class="['flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-95 cursor-pointer',
                activeTab === 'products' ? 'bg-[#004d40] text-white shadow-md shadow-[#004d40]/40 scale-[1.02]' : 'text-slate-400 hover:text-white hover:bg-slate-700/60']">
              <Package class="w-3.5 h-3.5" />
              Sản Phẩm Thép ({{ products.length }})
            </button>
            <button
              @click="activeTab = 'orders'"
              :class="['flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-95 cursor-pointer',
                activeTab === 'orders' ? 'bg-[#004d40] text-white shadow-md shadow-[#004d40]/40 scale-[1.02]' : 'text-slate-400 hover:text-white hover:bg-slate-700/60']">
              <ShoppingBag class="w-3.5 h-3.5" />
              Đơn Báo Giá
              <span v-if="orderCounts.pending > 0" class="ml-1 bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full text-[10px] font-bold animate-pulse">
                {{ orderCounts.pending }} mới
              </span>
            </button>
          </div>

          <button @click="emit('close')" class="p-1.5 rounded-lg text-slate-400 hover:text-white transition cursor-pointer">
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- TAB 1: PRODUCTS MANAGEMENT -->
        <div v-if="activeTab === 'products'" class="flex flex-col flex-grow overflow-hidden">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-3 bg-slate-50 border-b border-slate-200 flex-shrink-0">
            <div class="flex items-center gap-2.5 w-full sm:w-auto">
              <div class="relative flex-grow sm:w-64">
                <Search class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  v-model="productSearch"
                  type="text"
                  placeholder="Tìm tên, SKU, quy cách..."
                  class="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 shadow-xs"
                />
              </div>

              <select
                v-model="filterCategoryId"
                class="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 shadow-xs">
                <option :value="null">Tất cả danh mục</option>
                <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
              </select>

              <button @click="fetchProducts" :disabled="isLoadingProducts" class="p-1.5 rounded-lg bg-white border border-slate-300 text-slate-600 hover:bg-slate-100 transition cursor-pointer">
                <RefreshCw :class="['w-3.5 h-3.5', isLoadingProducts && 'animate-spin text-[#004d40]']" />
              </button>
            </div>

            <button
              @click="openCreate"
              class="flex items-center gap-1.5 bg-[#004d40] hover:bg-[#003830] active:scale-95 text-white font-semibold px-4 py-2 rounded-xl text-xs transition shadow-md shadow-[#004d40]/20 whitespace-nowrap cursor-pointer">
              <Plus class="w-3.5 h-3.5 text-amber-400" />
              Thêm Thép Mới
            </button>
          </div>

          <!-- Products Table -->
          <div class="flex-grow overflow-auto">
            <div v-if="isLoadingProducts" class="flex items-center justify-center h-full text-slate-400 text-xs font-semibold">
              <RefreshCw class="w-5 h-5 mr-2 animate-spin text-[#004d40]" /> Đang tải dữ liệu sản phẩm...
            </div>

            <div v-else-if="filteredProducts.length === 0" class="flex flex-col items-center justify-center h-full text-slate-400 gap-2 py-12 text-xs">
              <Package class="w-10 h-10 text-slate-300" />
              <p class="font-semibold">Không tìm thấy sản phẩm phù hợp.</p>
            </div>

            <table v-else class="w-full min-w-[850px] text-left text-xs border-collapse">
              <thead class="sticky top-0 z-10">
                <tr class="bg-slate-100 text-slate-600 font-semibold text-[11px] uppercase tracking-wide border-b border-slate-200">
                  <th class="px-4 py-2.5">Sản Phẩm Thép</th>
                  <th class="px-4 py-2.5">Quy Cách</th>
                  <th class="px-4 py-2.5">Danh Mục</th>
                  <th class="px-4 py-2.5 text-right">Đơn Giá</th>
                  <th class="px-4 py-2.5 text-center">Tồn Kho</th>
                  <th class="px-4 py-2.5 text-center">Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="p in filteredProducts" :key="p.id" class="border-b border-slate-100 hover:bg-teal-50/30 transition">
                  <td class="px-4 py-2.5">
                    <div class="flex items-center gap-2.5">
                      <img :src="p.imageUrl" class="w-10 h-10 object-cover rounded-lg border border-slate-200 flex-shrink-0" />
                      <div>
                        <h5 class="font-bold text-slate-900 text-xs leading-snug">{{ p.name }}</h5>
                        <span class="font-mono text-[10px] text-slate-400">SKU: {{ p.sku || '—' }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-2.5 text-slate-600 font-medium">{{ p.specifications }}</td>
                  <td class="px-4 py-2.5">
                    <span class="bg-teal-50 text-[#004d40] border border-teal-200/60 px-2 py-0.5 rounded text-[11px] font-semibold">{{ p.category }}</span>
                  </td>
                  <td class="px-4 py-2.5 text-right font-extrabold text-[#004d40]">
                    {{ formatVND(p.pricePerUnit) }} / {{ p.unit }}
                  </td>
                  <td class="px-4 py-2.5 text-center font-semibold text-slate-700">{{ p.stockQuantity }} {{ p.unit }}</td>
                  <td class="px-4 py-2.5 text-center">
                    <div class="flex items-center justify-center gap-1">
                      <button @click="openEdit(p)" class="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer" title="Chỉnh sửa">
                        <Edit3 class="w-3.5 h-3.5" />
                      </button>
                      <button @click="deleteProduct(p.id)" class="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-600 transition cursor-pointer" title="Xóa">
                        <Trash2 class="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- TAB 2: ORDERS -->
        <div v-else class="flex flex-col flex-grow overflow-hidden">
          <div class="flex items-center gap-2 px-5 py-2.5 bg-slate-50 border-b overflow-x-auto text-xs font-semibold flex-shrink-0">
            <button @click="filterStatus = 'ALL'" :class="['px-3 py-1.5 rounded-lg transition cursor-pointer', filterStatus === 'ALL' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-700']">
              Tất Cả ({{ orderCounts.all }})
            </button>
            <button @click="filterStatus = 'CHO_XU_LY'" :class="['px-3 py-1.5 rounded-lg transition cursor-pointer', filterStatus === 'CHO_XU_LY' ? 'bg-amber-500 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700']">
              Chờ Xử Lý ({{ orderCounts.pending }})
            </button>
            <button @click="filterStatus = 'DANG_GIAO'" :class="['px-3 py-1.5 rounded-lg transition cursor-pointer', filterStatus === 'DANG_GIAO' ? 'bg-[#004d40] text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700']">
              Đang Giao Xe Cẩu ({{ orderCounts.shipping }})
            </button>
            <button @click="filterStatus = 'HOAN_THANH'" :class="['px-3 py-1.5 rounded-lg transition cursor-pointer', filterStatus === 'HOAN_THANH' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700']">
              Hoàn Thành ({{ orderCounts.done }})
            </button>
          </div>

          <div class="flex-grow overflow-auto p-5 space-y-4">
            <div v-if="filteredOrders.length === 0" class="text-center py-12 text-slate-400 text-xs font-semibold">
              Không có đơn hàng nào trong danh mục này.
            </div>

            <div v-else v-for="order in filteredOrders" :key="order.id" class="bg-white rounded-xl border border-slate-200 p-4 text-xs space-y-3 shadow-xs hover:border-teal-200 transition">
              <div class="flex justify-between items-center border-b border-slate-100 pb-2.5">
                <div>
                  <span class="font-bold text-slate-900 text-sm font-mono">#{{ order.orderCode }}</span>
                  <span class="text-slate-400 text-[11px] ml-2">({{ formatDate(order.createdAt) }})</span>
                </div>
                <div class="flex items-center gap-2">
                  <select 
                    :value="order.status"
                    @change="updateOrderStatus(order.id, ($event.target as HTMLSelectElement).value)"
                    class="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-semibold outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="CHO_XU_LY">Chờ Xử Lý</option>
                    <option value="DANG_GIAO">Đang Giao Xe Cẩu</option>
                    <option value="HOAN_THANH">Hoàn Thành</option>
                    <option value="HUY">Hủy Đơn</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <span class="text-slate-400 font-medium">Khách hàng:</span>
                  <span class="font-semibold text-slate-800 ml-1">{{ order.customerName }}</span> ({{ order.customerPhone }})
                </div>
                <div>
                  <span class="text-slate-400 font-medium">Địa chỉ:</span>
                  <span class="font-semibold text-slate-800 ml-1">{{ order.shippingAddress }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- CREATE / EDIT PRODUCT SUB-MODAL -->
        <Transition name="fade">
          <div v-if="isFormOpen" class="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
              <div class="flex justify-between items-center px-6 py-4 bg-[#004d40] text-white border-b border-teal-800">
                <h3 class="font-bold text-sm flex items-center gap-2">
                  <Package class="w-4 h-4 text-amber-400" />
                  {{ formMode === 'create' ? 'THÊM MỚI SẢN PHẨM THÉP' : 'CHỈNH SỬA THÔNG TIN SẢN PHẨM' }}
                </h3>
                <button @click="closeForm" class="p-1 text-teal-200 hover:text-white transition cursor-pointer">
                  <X class="w-5 h-5" />
                </button>
              </div>

              <div class="p-6 overflow-auto space-y-4 text-xs">
                <div v-if="formError" class="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2 font-medium">
                  <AlertCircle class="w-4 h-4 flex-shrink-0" />
                  <span>{{ formError }}</span>
                </div>

                <div v-if="saveSuccess" class="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-center gap-2 font-medium">
                  <CheckCircle2 class="w-4 h-4 flex-shrink-0" />
                  <span>Lưu thành công sản phẩm thép!</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="sm:col-span-2">
                    <label class="block font-bold text-slate-700 mb-1">Tên Sản Phẩm Thép <span class="text-red-500">*</span></label>
                    <input v-model="form.name" type="text" placeholder="Ví dụ: Thép Thanh Vằn D10 VIS CB300V" class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 font-medium" />
                  </div>

                  <div>
                    <label class="block font-bold text-slate-700 mb-1">Mã SKU</label>
                    <input v-model="form.sku" type="text" class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-teal-500 font-mono font-medium" />
                  </div>

                  <div>
                    <label class="block font-bold text-slate-700 mb-1">Danh Mục <span class="text-red-500">*</span></label>
                    <select v-model="form.categoryId" class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-teal-500 font-medium">
                      <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
                    </select>
                  </div>

                  <div>
                    <label class="block font-bold text-slate-700 mb-1">Quy Cách / Mác Thép</label>
                    <input v-model="form.specifications" type="text" placeholder="CB300V / CB400V" class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-teal-500 font-medium" />
                  </div>

                  <div>
                    <label class="block font-bold text-slate-700 mb-1">Đơn Vị Tính <span class="text-red-500">*</span></label>
                    <select v-model="form.unit" class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-teal-500 font-medium">
                      <option value="Kg">Kg</option>
                      <option value="Tấn">Tấn</option>
                      <option value="Cây">Cây</option>
                      <option value="Cuộn">Cuộn</option>
                      <option value="Cặp">Cặp</option>
                      <option value="m²">m²</option>
                    </select>
                  </div>

                  <div>
                    <label class="block font-bold text-slate-700 mb-1">Đơn Giá (VNĐ / Đơn vị)</label>
                    <input v-model.number="form.pricePerUnit" type="number" step="100" class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-teal-500 font-bold text-[#004d40]" />
                  </div>

                  <div>
                    <label class="block font-bold text-slate-700 mb-1">Số Lượng Tồn Kho</label>
                    <input v-model.number="form.stockQuantity" type="number" class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-teal-500 font-medium" />
                  </div>

                  <div class="sm:col-span-2">
                    <label class="block font-bold text-slate-700 mb-1">Link Hình Ảnh URL</label>
                    <input v-model="form.imageUrl" type="text" placeholder="https://..." class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-teal-500 font-mono text-[11px]" />
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-end gap-3 px-6 py-3.5 bg-slate-50 border-t border-slate-200">
                <button @click="closeForm" class="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold transition cursor-pointer">
                  Hủy Bỏ
                </button>
                <button @click="saveProduct" :disabled="isSaving" class="px-5 py-2 rounded-xl bg-[#004d40] hover:bg-[#003830] text-white font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-[#004d40]/20">
                  <Save class="w-4 h-4 text-amber-400" />
                  <span>{{ isSaving ? 'Đang Lưu...' : 'Lưu Thay Đổi' }}</span>
                </button>
              </div>
            </div>
          </div>
        </Transition>

      </div>
    </div>
  </Transition>
</template>
