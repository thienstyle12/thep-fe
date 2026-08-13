<script setup lang="ts">
import { ref } from 'vue';
import { MapPin, Phone, Mail, Clock, Truck, ShieldCheck, Send, CheckCircle2, Building2, MessageCircle } from 'lucide-vue-next';
import { useNotification } from '../composables/useNotification';

const { showNotification } = useNotification();

const form = ref({
  fullName: '',
  phone: '',
  projectName: '',
  category: 'Thép Xây Dựng VIS',
  note: ''
});

const isSubmitting = ref(false);
const submitSuccess = ref(false);

const handleSubmitContact = () => {
  if (!form.value.fullName.trim() || !form.value.phone.trim()) {
    showNotification('error', 'Thiếu Thông Tin', 'Vui lòng nhập Họ tên và Số điện thoại liên hệ.');
    return;
  }

  isSubmitting.value = true;
  setTimeout(() => {
    isSubmitting.value = false;
    submitSuccess.value = true;
    showNotification('success', 'Gửi Yêu Cầu Thành Công!', 'Bộ phận kinh doanh Thép Việt Tín sẽ liên hệ báo giá qua Hotline/Zalo trong 5 phút.');
    form.value = {
      fullName: '',
      phone: '',
      projectName: '',
      category: 'Thép Xây Dựng VIS',
      note: ''
    };
    setTimeout(() => {
      submitSuccess.value = false;
    }, 4000);
  }, 600);
};
</script>

<template>
  <div class="bg-slate-50 min-h-screen py-10 px-6">
    <div class="max-w-7xl mx-auto space-y-8">
      
      <!-- Hero Header cho trang Liên Hệ Kho -->
      <div class="bg-[#004d40] text-white p-8 sm:p-12 rounded-3xl shadow-xl relative overflow-hidden banner-thut-tho-right animate-banner-sweep">
        <div class="absolute -right-20 -bottom-20 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="max-w-3xl relative z-10 space-y-3">
          <div class="inline-flex items-center gap-2 bg-[#003830] text-amber-400 border border-amber-400/30 text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider mb-1">
            <Building2 class="w-4 h-4 text-amber-400" /> HỆ THỐNG KHO HÀNG 24/7
          </div>
          <h1 class="text-3xl sm:text-4xl font-black leading-tight">LIÊN HỆ TỔNG KHO & TRẠM XE CẨU THÉP VIỆT TÍN</h1>
          <p class="text-teal-100 text-sm leading-relaxed font-normal">
            Liên hệ trực tiếp bộ phận kinh doanh dự án Thép Việt Tín tại Kho Miền Nam & Kho Miền Bắc. Chúng tôi hỗ trợ báo giá sỉ tận gốc và điều động xe cẩu giao hàng tận chân công trình 24/7 toàn quốc.
          </p>
        </div>
      </div>

      <!-- Grid 2 Kho Hàng Chính -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- Kho Miền Nam Card -->
        <div class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5 reveal-on-scroll reveal-delay-1 hover:border-teal-300 transition">
          <div class="flex items-center justify-between border-b border-slate-100 pb-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-teal-50 text-[#004d40] flex items-center justify-center border border-teal-100 flex-shrink-0">
                <MapPin class="w-6 h-6 text-[#004d40]" />
              </div>
              <div>
                <h3 class="font-extrabold text-slate-900 text-lg">KHO THÉP MIỀN NAM</h3>
                <span class="text-xs text-amber-600 font-bold bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">Trữ lượng >6.000 Tấn</span>
              </div>
            </div>
          </div>

          <ul class="space-y-3 text-xs text-slate-600 font-medium">
            <li class="flex items-start gap-2.5">
              <MapPin class="w-4 h-4 text-[#004d40] flex-shrink-0 mt-0.5" />
              <span><strong>Địa chỉ kho:</strong> Quốc Lộ 1A, Phường Bình Hưng Hòa, Quận Bình Tân, TP. Hồ Chí Minh</span>
            </li>
            <li class="flex items-center gap-2.5">
              <Phone class="w-4 h-4 text-[#004d40] flex-shrink-0" />
              <span><strong>Hotline báo giá:</strong> <a href="tel:0932283783" class="text-[#004d40] font-bold hover:underline">093 228 37 83</a> (Zalo 24/7)</span>
            </li>
            <li class="flex items-center gap-2.5">
              <Mail class="w-4 h-4 text-[#004d40] flex-shrink-0" />
              <span><strong>Email tiếp nhận dự án:</strong> thepviettin@gmail.com</span>
            </li>
            <li class="flex items-center gap-2.5">
              <Truck class="w-4 h-4 text-[#004d40] flex-shrink-0" />
              <span><strong>Đội xe cẩu bốc dỡ:</strong> 5 Xe Cẩu 5T - 25T bốc hàng liên tục</span>
            </li>
          </ul>

          <div class="flex gap-3 pt-2">
            <a href="tel:0932283783" class="flex-1 bg-[#004d40] hover:bg-[#003830] text-white font-bold py-3 rounded-xl text-center text-xs flex items-center justify-center gap-2 transition shadow-md">
              <Phone class="w-4 h-4 text-amber-400" /> Gọi Kho Miền Nam
            </a>
            <a href="https://zalo.me/0932283783" target="_blank" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-center text-xs flex items-center justify-center gap-2 transition shadow-md">
              <MessageCircle class="w-4 h-4 text-white" /> Zalo Báo Giá
            </a>
          </div>
        </div>

        <!-- Kho Miền Bắc Card -->
        <div class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5 reveal-on-scroll reveal-delay-2 hover:border-teal-300 transition">
          <div class="flex items-center justify-between border-b border-slate-100 pb-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-teal-50 text-[#004d40] flex items-center justify-center border border-teal-100 flex-shrink-0">
                <MapPin class="w-6 h-6 text-[#004d40]" />
              </div>
              <div>
                <h3 class="font-extrabold text-slate-900 text-lg">KHO THÉP MIỀN BẮC</h3>
                <span class="text-xs text-amber-600 font-bold bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">Trữ lượng >5.000 Tấn</span>
              </div>
            </div>
          </div>

          <ul class="space-y-3 text-xs text-slate-600 font-medium">
            <li class="flex items-start gap-2.5">
              <MapPin class="w-4 h-4 text-[#004d40] flex-shrink-0 mt-0.5" />
              <span><strong>Địa chỉ kho:</strong> Cụm Công Nghiệp Yên Mỹ, Tỉnh Hưng Yên</span>
            </li>
            <li class="flex items-center gap-2.5">
              <Phone class="w-4 h-4 text-[#004d40] flex-shrink-0" />
              <span><strong>Hotline báo giá:</strong> <a href="tel:0932283783" class="text-[#004d40] font-bold hover:underline">093 228 37 83</a> (Zalo 24/7)</span>
            </li>
            <li class="flex items-center gap-2.5">
              <Mail class="w-4 h-4 text-[#004d40] flex-shrink-0" />
              <span><strong>Email tiếp nhận dự án:</strong> thepviettin@gmail.com</span>
            </li>
            <li class="flex items-center gap-2.5">
              <Truck class="w-4 h-4 text-[#004d40] flex-shrink-0" />
              <span><strong>Đội xe cẩu bốc dỡ:</strong> 4 Xe Cẩu Tự Hành giao hàng nhanh 24/7</span>
            </li>
          </ul>

          <div class="flex gap-3 pt-2">
            <a href="tel:0932283783" class="flex-1 bg-[#004d40] hover:bg-[#003830] text-white font-bold py-3 rounded-xl text-center text-xs flex items-center justify-center gap-2 transition shadow-md">
              <Phone class="w-4 h-4 text-amber-400" /> Gọi Kho Miền Bắc
            </a>
            <a href="https://zalo.me/0932283783" target="_blank" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-center text-xs flex items-center justify-center gap-2 transition shadow-md">
              <MessageCircle class="w-4 h-4 text-white" /> Zalo Báo Giá
            </a>
          </div>
        </div>

      </div>

      <!-- Form Gửi Yêu Cầu Báo Giá Nhanh -->
      <div class="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xs space-y-6 reveal-on-scroll">
        <div>
          <h2 class="text-xl font-black text-slate-900 uppercase">GỬI YÊU CẦU BÁO GIÁ THÉP DỰ ÁN</h2>
          <p class="text-xs text-slate-500 mt-1 font-medium">Nhập thông tin công trình của bạn để nhận bảng báo giá chiết khấu trực tiếp từ đại diện tổng kho</p>
        </div>

        <div v-if="submitSuccess" class="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 text-xs font-bold">
          <CheckCircle2 class="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>Cảm ơn bạn! Yêu cầu báo giá đã gửi thành công. Chuyên viên sẽ gọi điện cho bạn trong 5 phút.</span>
        </div>

        <form @submit.prevent="handleSubmitContact" class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label class="block font-bold text-slate-700 mb-1">Họ & Tên Của Bạn <span class="text-red-500">*</span></label>
            <input v-model="form.fullName" type="text" placeholder="Ví dụ: Nguyễn Văn A" class="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-[#004d40] focus:ring-1 focus:ring-[#004d40] font-medium" />
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Số Điện Thoại / Zalo <span class="text-red-500">*</span></label>
            <input v-model="form.phone" type="tel" placeholder="Ví dụ: 0932283783" class="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-[#004d40] focus:ring-1 focus:ring-[#004d40] font-medium" />
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Tên Công Trình / Công Ty</label>
            <input v-model="form.projectName" type="text" placeholder="Ví dụ: Dự án nhà xưởng Bình Dương" class="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-[#004d40] focus:ring-1 focus:ring-[#004d40] font-medium" />
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Loại Thép Cần Báo Giá</label>
            <select v-model="form.category" class="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-[#004d40] focus:ring-1 focus:ring-[#004d40] font-medium">
              <option value="Thép Xây Dựng VIS">Thép Xây Dựng VIS CB300V / CB400V</option>
              <option value="Dây Thép & Thép Rút">Dây Buộc 1 Ly & Thép Rút Đen</option>
              <option value="Lưới Thép Công Trình">Lưới Trát Tường & Lưới Thép Hàn</option>
              <option value="Thép Hộp & Xà Gồ">Thép Hộp Mạ Kẽm & Xà Gồ</option>
              <option value="Thép Hình V/I/U">Thép Hình V / I / U & Thép Tấm</option>
            </select>
          </div>

          <div class="sm:col-span-2">
            <label class="block font-bold text-slate-700 mb-1">Ghi Chú Khối Lượng / Quy Cách Chi Tiết</label>
            <textarea v-model="form.note" rows="3" placeholder="Nhập quy cách thép, độ dày, mác thép hoặc địa điểm giao hàng..." class="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-[#004d40] focus:ring-1 focus:ring-[#004d40] font-medium"></textarea>
          </div>

          <div class="sm:col-span-2 flex justify-end pt-2">
            <button type="submit" :disabled="isSubmitting" class="bg-[#004d40] hover:bg-[#003830] text-white font-bold px-8 py-3.5 rounded-xl shadow-lg flex items-center gap-2 uppercase tracking-wide text-xs transition cursor-pointer">
              <Send class="w-4 h-4 text-amber-400" /> {{ isSubmitting ? 'ĐANG GỬI...' : 'GỬI YÊU CẦU BÁO GIÁ DỰ ÁN' }}
            </button>
          </div>
        </form>
      </div>

    </div>
  </div>
</template>
