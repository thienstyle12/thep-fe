<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import api from '../api';
import { useNotification } from '../composables/useNotification';

const { showNotification, showConfirm } = useNotification();
import {
  X, Plus, Edit3, Trash2, Package, ShoppingBag,
  Search, RefreshCw, CheckCircle2, ChevronDown,
  ImageIcon, Save, AlertCircle, Info
} from 'lucide-vue-next';

const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits(['close', 'product-updated']);

const activeTab = ref<'products' | 'orders'>('products');

// ─────────────────────────────────────────────────
//  TYPES
// ─────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────
//  PRODUCTS STATE
// ─────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────
//  PRODUCT FORM
// ─────────────────────────────────────────────────
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
    'Bạn có chắc chắn muốn xóa sản phẩm thép này khỏi hệ thống? Thao tác này không thể hoàn tác.',
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

// ─────────────────────────────────────────────────
//  ORDERS STATE
// ─────────────────────────────────────────────────
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
  CHO_XU_LY:  { text: '⏳ Chờ Xử Lý',    cls: 'bg-amber-100 text-amber-800 border-amber-300' },
  DANG_GIAO:  { text: '🚛 Đang Giao Xe Cẩu', cls: 'bg-blue-100 text-blue-800 border-blue-300' },
  HOAN_THANH: { text: '✅ Hoàn Thành',    cls: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  HUY:        { text: '🚫 Đã Hủy',        cls: 'bg-rose-100 text-rose-800 border-rose-300' },
};

// ─────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────
const formatVND = (v: number) => {
  if (!v || v === 0) return 'Liên hệ';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);
};

const formatDate = (s: string) =>
  s ? new Date(s).toLocaleString('vi-VN') : '';

// ─────────────────────────────────────────────────
//  INIT ON OPEN
// ─────────────────────────────────────────────────
watch(() => props.isOpen, async (val) => {
  if (val) {
    await Promise.all([fetchProducts(), fetchOrders(), fetchCategories()]);
  }
});
</script>

<template>
  <!-- ── BACKDROP ─────────────────────────────── -->
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" @click="emit('close')" />

      <!-- ── MAIN PANEL ─────────────────────── -->
      <div class="relative z-10 flex flex-col w-full max-w-7xl h-[95vh] bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">

        <!-- HEADER -->
        <div class="flex items-center justify-between gap-4 px-6 py-4 bg-slate-950 text-white border-b border-slate-800 flex-shrink-0">
          <div class="flex items-center gap-4">
            <!-- Logo -->
            <div class="w-10 h-10 rounded-xl bg-red-600 font-black text-xl flex items-center justify-center flex-shrink-0 shadow-lg">VT</div>
            <div>
              <span class="text-[10px] font-extrabold text-red-500 uppercase tracking-widest block">Thép Việt Tín</span>
              <h2 class="text-lg font-black leading-none">BẢNG ĐIỀU KHIỂN QUẢN TRỊ</h2>
            </div>
          </div>

          <!-- Tabs -->
          <div class="flex p-1.5 bg-slate-900 rounded-2xl border border-slate-800 gap-1 overflow-x-auto">
            <button
              @click="activeTab = 'products'"
              :class="['flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition whitespace-nowrap',
                activeTab === 'products' ? 'bg-red-600 text-white shadow-md' : 'text-slate-400 hover:text-white']">
              <Package class="w-4 h-4" />
              Quản Lý Sản Phẩm
              <span class="ml-1 bg-white/20 px-1.5 py-0.5 rounded-full text-[10px]">{{ products.length }}</span>
            </button>
            <button
              @click="activeTab = 'orders'"
              :class="['flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition whitespace-nowrap',
                activeTab === 'orders' ? 'bg-red-600 text-white shadow-md' : 'text-slate-400 hover:text-white']">
              <ShoppingBag class="w-4 h-4" />
              Đơn Báo Giá
              <span v-if="orderCounts.pending > 0" class="ml-1 bg-amber-400 text-slate-900 px-1.5 py-0.5 rounded-full text-[10px] font-black animate-pulse">
                {{ orderCounts.pending }} mới
              </span>
            </button>
          </div>

          <button @click="emit('close')" class="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex-shrink-0">
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- ══════════════════════════════════════
             TAB 1: PRODUCTS MANAGEMENT
        ══════════════════════════════════════════ -->
        <div v-if="activeTab === 'products'" class="flex flex-col flex-grow overflow-hidden">

          <!-- Toolbar -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-6 py-4 bg-slate-50 border-b border-slate-200 flex-shrink-0">
            <div class="flex items-center gap-3 w-full sm:w-auto">
              <!-- Search -->
              <div class="relative flex-grow sm:w-72">
                <Search class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  v-model="productSearch"
                  type="text"
                  placeholder="Tìm tên, mã SKU, quy cách..."
                  class="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-red-500 shadow-sm"
                />
              </div>

              <!-- Category Filter -->
              <select
                v-model="filterCategoryId"
                class="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-red-500 shadow-sm">
                <option :value="null">Tất cả danh mục</option>
                <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
              </select>

              <!-- Refresh -->
              <button @click="fetchProducts" :disabled="isLoadingProducts" class="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition shadow-sm">
                <RefreshCw :class="['w-4 h-4', isLoadingProducts && 'animate-spin text-red-500']" />
              </button>
            </div>

            <!-- Add New -->
            <button
              @click="openCreate"
              class="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs uppercase shadow-lg hover:scale-[1.02] transition duration-200 whitespace-nowrap">
              <Plus class="w-4 h-4" />
              Thêm Sản Phẩm Thép Mới
            </button>
          </div>

          <!-- Products Table -->
          <div class="flex-grow overflow-auto">
            <div v-if="isLoadingProducts" class="flex items-center justify-center h-full text-slate-400 font-bold">
              <RefreshCw class="w-6 h-6 mr-2 animate-spin text-red-500" /> Đang tải dữ liệu sản phẩm...
            </div>

            <div v-else-if="filteredProducts.length === 0" class="flex flex-col items-center justify-center h-full text-slate-400 gap-3 py-16">
              <Package class="w-14 h-14 text-slate-300" />
              <p class="font-bold text-sm">Không tìm thấy sản phẩm phù hợp.</p>
              <button @click="productSearch = ''; filterCategoryId = null" class="text-red-500 font-extrabold text-xs underline">Xóa bộ lọc</button>
            </div>

            <table v-else class="w-full min-w-[900px] text-left text-xs border-collapse">
              <thead class="sticky top-0 z-10">
                <tr class="bg-slate-100 text-slate-600 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <th class="px-4 py-3">Sản Phẩm Thép</th>
                  <th class="px-4 py-3">Quy Cách / Kĩ Thuật</th>
                  <th class="px-4 py-3">Danh Mục</th>
                  <th class="px-4 py-3 text-right">Đơn Giá Niêm Yết</th>
                  <th class="px-4 py-3 text-center">Tồn Kho</th>
                  <th class="px-4 py-3 text-center">Nhãn</th>
                  <th class="px-4 py-3 text-center">Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="p in filteredProducts"
                  :key="p.id"
                  class="border-b border-slate-100 hover:bg-red-50/40 transition-colors group">

                  <!-- Product Name + Image -->
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-3">
                      <div class="relative flex-shrink-0">
                        <img
                          :src="p.imageUrl || 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=200'"
                          class="w-14 h-14 object-cover rounded-xl border border-slate-200 shadow-sm"
                        />
                      </div>
                      <div>
                        <h5 class="font-extrabold text-slate-900 text-sm mb-0.5 leading-tight group-hover:text-red-600 transition">{{ p.name }}</h5>
                        <span class="font-mono text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">SKU: {{ p.sku || '—' }}</span>
                      </div>
                    </div>
                  </td>

                  <!-- Specs -->
                  <td class="px-4 py-3 max-w-[160px]">
                    <p class="text-slate-600 font-semibold text-xs leading-relaxed line-clamp-2">{{ p.specifications || '—' }}</p>
                  </td>

                  <!-- Category -->
                  <td class="px-4 py-3">
                    <span class="bg-blue-50 text-blue-700 border border-blue-200 font-bold px-2 py-0.5 rounded-lg whitespace-nowrap">
                      {{ p.category || '—' }}
                    </span>
                  </td>

                  <!-- Price -->
                  <td class="px-4 py-3 text-right">
                    <span class="font-black text-red-600 text-sm">{{ formatVND(p.pricePerUnit) }}</span>
                    <span class="text-slate-400 font-medium"> / {{ p.unit }}</span>
                  </td>

                  <!-- Stock -->
                  <td class="px-4 py-3 text-center">
                    <span :class="['font-extrabold text-sm', p.stockQuantity > 100 ? 'text-emerald-600' : p.stockQuantity > 0 ? 'text-amber-600' : 'text-rose-600']">
                      {{ p.stockQuantity }}
                    </span>
                    <span class="text-slate-400 font-medium text-[10px] block">{{ p.unit }}</span>
                  </td>

                  <!-- Badge -->
                  <td class="px-4 py-3 text-center">
                    <span class="bg-slate-900 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider whitespace-nowrap">
                      {{ p.badge || 'Sẵn Kho' }}
                    </span>
                  </td>

                  <!-- Actions -->
                  <td class="px-4 py-3 text-center">
                    <div class="flex items-center justify-center gap-1.5">
                      <button
                        @click="openEdit(p)"
                        class="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 font-extrabold transition text-[10px] uppercase">
                        <Edit3 class="w-3.5 h-3.5" /> Sửa
                      </button>
                      <button
                        @click="deleteProduct(p.id)"
                        class="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 font-extrabold transition text-[10px] uppercase">
                        <Trash2 class="w-3.5 h-3.5" /> Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Footer count -->
          <div class="px-6 py-3 bg-slate-50 border-t text-xs font-bold text-slate-500 flex-shrink-0">
            Hiển thị {{ filteredProducts.length }} / {{ products.length }} sản phẩm
          </div>
        </div>

        <!-- ══════════════════════════════════════
             TAB 2: ORDERS
        ══════════════════════════════════════════ -->
        <div v-else class="flex flex-col flex-grow overflow-hidden">

          <!-- Status Tabs -->
          <div class="flex items-center gap-2 px-6 py-3 bg-slate-50 border-b overflow-x-auto flex-shrink-0 text-xs font-extrabold">
            <button @click="filterStatus = 'ALL'" :class="['px-4 py-2 rounded-xl transition whitespace-nowrap', filterStatus === 'ALL' ? 'bg-slate-900 text-white' : 'bg-white border text-slate-600 hover:bg-slate-100']">
              Tất Cả ({{ orderCounts.all }})
            </button>
            <button @click="filterStatus = 'CHO_XU_LY'" :class="['px-4 py-2 rounded-xl transition whitespace-nowrap', filterStatus === 'CHO_XU_LY' ? 'bg-amber-600 text-white' : 'bg-white border text-slate-600 hover:bg-slate-100']">
              ⏳ Chờ Xử Lý ({{ orderCounts.pending }})
            </button>
            <button @click="filterStatus = 'DANG_GIAO'" :class="['px-4 py-2 rounded-xl transition whitespace-nowrap', filterStatus === 'DANG_GIAO' ? 'bg-blue-600 text-white' : 'bg-white border text-slate-600 hover:bg-slate-100']">
              🚛 Đang Giao ({{ orderCounts.shipping }})
            </button>
            <button @click="filterStatus = 'HOAN_THANH'" :class="['px-4 py-2 rounded-xl transition whitespace-nowrap', filterStatus === 'HOAN_THANH' ? 'bg-emerald-600 text-white' : 'bg-white border text-slate-600 hover:bg-slate-100']">
              ✅ Hoàn Thành ({{ orderCounts.done }})
            </button>
            <button @click="filterStatus = 'HUY'" :class="['px-4 py-2 rounded-xl transition whitespace-nowrap', filterStatus === 'HUY' ? 'bg-rose-600 text-white' : 'bg-white border text-slate-600 hover:bg-slate-100']">
              🚫 Đã Hủy ({{ orderCounts.cancelled }})
            </button>
            <button @click="fetchOrders" :disabled="isLoadingOrders" class="ml-auto p-2 rounded-xl bg-white border text-slate-600 hover:bg-slate-100 transition">
              <RefreshCw :class="['w-4 h-4', isLoadingOrders && 'animate-spin text-red-500']" />
            </button>
          </div>

          <!-- Orders List -->
          <div class="flex-grow overflow-y-auto p-6 space-y-4">
            <div v-if="isLoadingOrders" class="text-center py-16 text-slate-400 font-bold flex items-center justify-center gap-2">
              <RefreshCw class="w-5 h-5 animate-spin text-red-500" /> Đang tải danh sách đơn hàng...
            </div>
            <div v-else-if="filteredOrders.length === 0" class="text-center py-16 text-slate-400">
              <ShoppingBag class="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p class="font-bold">Không có đơn hàng nào trong trạng thái này.</p>
            </div>

            <div v-for="order in filteredOrders" :key="order.id" class="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden">
              <!-- Order Head -->
              <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-3 p-4 bg-slate-50 border-b border-slate-100">
                <div class="flex items-center gap-3 flex-wrap">
                  <span class="font-mono font-black text-red-600 bg-red-50 border border-red-200 px-3 py-1 rounded-xl text-sm">{{ order.orderCode }}</span>
                  <span :class="['text-[11px] font-extrabold px-3 py-1 rounded-full border', STATUS_MAP[order.status]?.cls || 'bg-gray-100 text-gray-700 border-gray-300']">
                    {{ STATUS_MAP[order.status]?.text || order.status }}
                  </span>
                  <span class="text-slate-400 text-xs">{{ formatDate(order.createdAt) }}</span>
                </div>

                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold text-slate-500">Cập nhật:</span>
                  <select
                    :value="order.status"
                    @change="updateOrderStatus(order.id, ($event.target as HTMLSelectElement).value)"
                    class="text-xs font-bold bg-white border border-slate-300 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm">
                    <option value="CHO_XU_LY">⏳ Chờ xử lý</option>
                    <option value="DANG_GIAO">🚛 Đang giao hàng</option>
                    <option value="HOAN_THANH">✅ Hoàn thành</option>
                    <option value="HUY">🚫 Hủy đơn</option>
                  </select>
                </div>
              </div>

              <!-- Customer + Address + Total -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 px-5 py-4 text-xs border-b border-slate-100">
                <div>
                  <span class="text-slate-400 font-extrabold uppercase text-[10px] tracking-wider block mb-1">Khách Hàng</span>
                  <strong class="text-slate-900 text-sm block">{{ order.customerName }}</strong>
                  <a :href="'tel:' + order.customerPhone" class="text-red-600 font-bold hover:underline flex items-center gap-1 mt-0.5">
                    📞 {{ order.customerPhone }}
                  </a>
                </div>
                <div>
                  <span class="text-slate-400 font-extrabold uppercase text-[10px] tracking-wider block mb-1">Địa Chỉ Nhận Hàng</span>
                  <p class="text-slate-700 font-semibold leading-relaxed">{{ order.shippingAddress }}</p>
                </div>
                <div class="text-right sm:text-left">
                  <span class="text-slate-400 font-extrabold uppercase text-[10px] tracking-wider block mb-1">Tổng Dự Toán</span>
                  <span class="text-xl font-black text-red-600 block">{{ formatVND(order.totalAmount) }}</span>
                </div>
              </div>

              <!-- Items -->
              <div class="p-4">
                <table class="w-full text-xs">
                  <thead>
                    <tr class="text-slate-400 font-extrabold uppercase text-[10px] border-b border-slate-100">
                      <th class="pb-2 text-left">Sản phẩm thép</th>
                      <th class="pb-2 text-center">SL</th>
                      <th class="pb-2 text-right">Đơn giá</th>
                      <th class="pb-2 text-right">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-50">
                    <tr v-for="(item, i) in order.items" :key="i" class="font-medium text-slate-700">
                      <td class="py-2">{{ item.productName }}</td>
                      <td class="py-2 text-center font-black text-slate-900">{{ item.quantity }} {{ item.unit }}</td>
                      <td class="py-2 text-right text-slate-500">{{ formatVND(item.pricePerUnit) }}</td>
                      <td class="py-2 text-right font-black text-slate-900">{{ formatVND(item.subtotal) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

      </div><!-- /main panel -->
    </div><!-- /backdrop -->
  </Transition>

  <!-- ══════════════════════════════════════════════
       PRODUCT FORM MODAL (Create / Edit)
  ══════════════════════════════════════════════════ -->
  <Transition name="slide-up">
    <div v-if="isFormOpen" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-950/85 backdrop-blur-md" @click="closeForm" />

      <div class="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[95vh]">

        <!-- Form Header -->
        <div class="px-6 py-5 bg-slate-950 text-white flex items-center justify-between flex-shrink-0">
          <div>
            <span class="text-[10px] font-extrabold text-red-400 uppercase tracking-widest block">
              {{ formMode === 'create' ? 'Thêm Mới Sản Phẩm' : 'Chỉnh Sửa Sản Phẩm' }}
            </span>
            <h3 class="text-xl font-black">
              {{ formMode === 'create' ? 'NHẬP THÔNG TIN SẢN PHẨM THÉP' : 'CẬP NHẬT SẢN PHẨM THÉP' }}
            </h3>
          </div>
          <button @click="closeForm" class="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition">
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Success Overlay -->
        <div v-if="saveSuccess" class="absolute inset-0 z-20 bg-white/95 flex flex-col items-center justify-center gap-3">
          <CheckCircle2 class="w-16 h-16 text-emerald-500" />
          <p class="text-xl font-black text-slate-900">{{ formMode === 'create' ? 'Đã thêm sản phẩm thành công!' : 'Đã cập nhật thành công!' }}</p>
        </div>

        <!-- Form Body (scrollable) -->
        <div class="overflow-y-auto p-6 space-y-5 text-xs flex-grow">

          <!-- Error Alert -->
          <div v-if="formError" class="flex items-start gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold p-3 rounded-xl">
            <AlertCircle class="w-4 h-4 flex-shrink-0 mt-0.5" />
            {{ formError }}
          </div>

          <!-- Preview Image + URL -->
          <div class="flex gap-4 items-start">
            <div class="flex-shrink-0">
              <img
                :src="form.imageUrl || 'https://placehold.co/100x100?text=No+Image'"
                @error="($event.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=No+Image'"
                class="w-24 h-24 object-cover rounded-2xl border-2 border-slate-200 shadow-sm"
              />
            </div>
            <div class="flex-grow">
              <label class="block font-extrabold text-slate-700 mb-1">🖼️ URL Ảnh Sản Phẩm</label>
              <input
                v-model="form.imageUrl"
                type="text"
                placeholder="https://images.unsplash.com/..."
                class="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-mono text-[11px] outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-slate-50"
              />
              <p class="text-slate-400 mt-1 font-normal">Nhập link ảnh từ Unsplash, Cloudinary hoặc bất kỳ URL công khai nào.</p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Name -->
            <div class="sm:col-span-2">
              <label class="block font-extrabold text-slate-700 mb-1">
                Tên Sản Phẩm Thép <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.name"
                type="text"
                placeholder="VD: Thép Cây VIS D16 CB400V"
                class="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-semibold text-sm outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <!-- SKU -->
            <div>
              <label class="block font-extrabold text-slate-700 mb-1">Mã SKU / Mã Kho</label>
              <input
                v-model="form.sku"
                type="text"
                placeholder="VIS-D16"
                class="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-mono text-sm outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <!-- Category -->
            <div>
              <label class="block font-extrabold text-slate-700 mb-1">
                Danh Mục Sản Phẩm <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.categoryId"
                class="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white">
                <option :value="undefined" disabled>-- Chọn danh mục --</option>
                <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
              </select>
            </div>

            <!-- Specifications -->
            <div class="sm:col-span-2">
              <label class="block font-extrabold text-slate-700 mb-1">Quy Cách Kĩ Thuật</label>
              <input
                v-model="form.specifications"
                type="text"
                placeholder="VD: Đường kính 16mm • Dài 11.7m | CB400V"
                class="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-semibold text-sm outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <!-- Unit -->
            <div>
              <label class="block font-extrabold text-slate-700 mb-1">
                Đơn Vị Tính <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.unit"
                class="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white">
                <option value="Cây">Cây</option>
                <option value="Kg">Kg</option>
                <option value="Tấn">Tấn</option>
                <option value="Cuộn">Cuộn</option>
                <option value="Tấm">Tấm</option>
                <option value="Mét">Mét</option>
              </select>
            </div>

            <!-- Badge -->
            <div>
              <label class="block font-extrabold text-slate-700 mb-1">Nhãn Hiển Thị</label>
              <select
                v-model="form.badge"
                class="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white">
                <option value="Bán Chạy">Bán Chạy</option>
                <option value="Phổ Biến">Phổ Biến</option>
                <option value="Mới">Mới</option>
                <option value="Sẵn Kho">Sẵn Kho</option>
                <option value="Giá Kho">Giá Kho</option>
                <option value="Dự Án">Dự Án</option>
                <option value="Hết Hàng">Hết Hàng</option>
              </select>
            </div>

            <!-- Price -->
            <div>
              <label class="block font-extrabold text-slate-700 mb-1">
                Đơn Giá Niêm Yết (VNĐ / Đơn vị)
                <span class="text-slate-400 font-normal">(0 = Liên hệ)</span>
              </label>
              <div class="relative">
                <input
                  v-model.number="form.pricePerUnit"
                  type="number"
                  min="0"
                  step="1000"
                  class="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-mono text-sm text-red-600 font-black outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <p class="text-slate-400 mt-1 font-normal">
                ≈ {{ form.pricePerUnit ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(form.pricePerUnit) : 'Liên hệ báo giá' }}
              </p>
            </div>

            <!-- Stock -->
            <div>
              <label class="block font-extrabold text-slate-700 mb-1">Tồn Kho Hiện Tại ({{ form.unit }})</label>
              <input
                v-model.number="form.stockQuantity"
                type="number"
                min="0"
                class="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-semibold text-sm outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <!-- Description -->
            <div class="sm:col-span-2">
              <label class="block font-extrabold text-slate-700 mb-1">Mô Tả Sản Phẩm</label>
              <textarea
                v-model="form.description"
                rows="3"
                placeholder="Đặc tính vật liệu, ứng dụng trong công trình, lưu ý kĩ thuật..."
                class="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-medium text-sm outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
              />
            </div>
          </div>
        </div><!-- /form body -->

        <!-- Form Footer -->
        <div class="flex items-center justify-between gap-3 px-6 py-4 bg-slate-50 border-t flex-shrink-0">
          <button @click="closeForm" class="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-extrabold hover:bg-slate-100 text-xs uppercase transition">
            Hủy Bỏ
          </button>
          <div class="flex items-center gap-3">
            <div v-if="formMode === 'edit'" class="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold">
              <Info class="w-3.5 h-3.5" /> Đang chỉnh sửa ID #{{ editingId }}
            </div>
            <button
              @click="saveProduct"
              :disabled="isSaving"
              class="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-slate-300 text-white font-extrabold text-xs uppercase shadow-lg transition">
              <Save class="w-4 h-4" />
              <span>{{ isSaving ? 'Đang lưu...' : formMode === 'create' ? 'Tạo Sản Phẩm Mới' : 'Lưu Thay Đổi' }}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.97);
}
</style>
