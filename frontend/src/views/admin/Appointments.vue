<template>
  <div class="container">
    <h1>ตารางรายวัน</h1>
    
  </div>
</template>
  
  <script setup>
import api from "../../api/api";
import { ref, onMounted } from "vue";

const list = ref([]);

const load = async () => {
  const res = await api.get("/admin/appointments");
  list.value = res.data;
};

const approve = async (id) => {
  await api.post(`/admin/appointments/${id}/approve`);
  load();
};

const cancel = async (id) => {
  await api.post(`/admin/appointments/${id}/cancel`);
  load();
};

onMounted(load);
</script>