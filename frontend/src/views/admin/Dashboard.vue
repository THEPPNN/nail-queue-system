<template>
  <div class="container">
    <h1>คิวทั้งหมด</h1>
    <span class="text-center text-muted">
      
      ระบบจองคิวร้านทำเล็บ (Nail Queue System) พัฒนาเพื่อ ฝึกเขียน Vue.js + Node.js และออกแบบโครงสร้างระบบจองคิวจริง
      <br />
      ⚠️ โปรเจคนี้เป็นโปรเจคเพื่อการเรียนรู้ <br />
      ฟีเจอร์บางส่วนยังไม่สมบูรณ์ และเปิดให้สามารถนำไปพัฒนาต่อได้ <br />
      <br>
    </span>
    <div class="table-responsive pb-3">
      <EasyDataTable
        :headers="headers"
        :items="items"
        :search-value="search"
        table-class="table table-hover align-middle"
        header-class="table-light"
      >
        <template #item-status="item">
          <span class="w-100" v-if="item.status == 'pending'">รอรับงาน</span>
          <span class="text-success w-100" v-if="item.status == 'approved'"
            >รับงานแล้ว</span
          >
          <span class="text-danger w-100" v-if="item.status == 'cancelled'"
            >ยกเลิกจอง</span
          >
        </template>
        <template #item-action="item">
          <button
            class="btn btn-primary btn-sm m-2"
            @click="approveAppointment(item.id)"
            :hidden="item.status == 'approved' || item.status == 'cancelled'"
          >
            รับงาน
          </button>
          <button
            class="btn btn-danger btn-sm m-2"
            @click="cancelAppointment(item.id)"
            :hidden="item.status == 'approved' || item.status == 'cancelled'"
          >
            ยกเลิกการจอง
          </button>
        </template>
      </EasyDataTable>
    </div>
    <BaseToast ref="toast" />
  </div>
</template>
  
  <script setup>
import EasyDataTable from "vue3-easy-data-table";
import api from "../../api/api";
import { ref, onMounted } from "vue";
import BaseToast from "../../components/BaseToast.vue";

import dayjs from "dayjs";
import "dayjs/locale/th";
dayjs.locale("th");

const headers = ref([
  { text: "บริการ", value: "service_name" },
  { text: "ชื่อ", value: "name" },
  { text: "อีเมล", value: "email" },
  { text: "เบอร์โทร", value: "phone" },
  { text: "วันที่", value: "date" },
  { text: "เวลาเริ่ม", value: "start_time" },
  { text: "เวลาสิ้นสุด", value: "end_time" },
  { text: "สถานะ", value: "status" },
  { text: "จัดการ", value: "action" },
]);

const items = ref([]);
const search = ref("");
const toast = ref(null);
onMounted(async () => {
  load();
});

const load = async () => {
  const res = await api.get("/admin/appointments");
  items.value = res.data.map((row, index) => ({
    ...row,
    date: dayjs(row.date).format("DD MMMM YYYY"),
  }));
};

const approveAppointment = async (id) => {
  await api.post(`/admin/appointments/${id}/approve`);
  toast.value.showToast("รับงานสำเร็จ", {
    title: "Success",
    duration: 2000,
  });
  load();
};

const cancelAppointment = async (id) => {
  await api.post(`/admin/appointments/${id}/cancel`);
  toast.value.showToast("ยกเลิกการจองสำเร็จ", {
    title: "Success",
    duration: 2000,
  });
  load();
};
</script>
  
  <style scoped>
</style>