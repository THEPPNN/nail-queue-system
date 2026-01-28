<template>
  <div class="container">
    <h1>คิวทั้งหมด</h1>
    <div class="table-responsive pb-3">
      <EasyDataTable
        :headers="headers"
        :items="items"
        :search-value="search"
        table-class="table table-hover align-middle"
        header-class="table-light"
      >
      </EasyDataTable>
    </div>
  </div>
</template>
  
  <script setup>
import EasyDataTable from "vue3-easy-data-table";
import api from "../../api/api";
import { ref, onMounted } from "vue";

const headers = ref([
  { text: "บริการ", value: "service" },
  { text: "ชื่อ", value: "name" },
  { text: "อีเมล", value: "email" },
  { text: "เบอร์โทร", value: "phone" },
  { text: "เวลาเริ่ม", value: "start_time" },
  { text: "เวลาสิ้นสุด", value: "end_time" },
  { text: "สถานะ", value: "status" },
  { text: "จัดการ", value: "action" },
]);

const items = ref([]);
const search = ref("");

onMounted(async () => {
  const res = await api.get("/appointments");
  items.value = res.data;
});
</script>
  
  <style scoped>
</style>