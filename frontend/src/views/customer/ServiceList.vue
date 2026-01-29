<template>
  <div class="container p-2">
    <h1>💅 เลือกบริการ</h1>
    <div class="row">
      <div
        v-for="s in services"
        :key="s.id"
        class="col-lg-3 col-md-6 col-sm-12"
      >
        <div class="card shadow-sm p-0">
          <div class="card-header p-0">
            <img
              :src="s.image"
              alt="service image"
              class="img-fluid rounded object-fit-cover"
            />
          </div>
          <div class="card-body mt-2">
            <h3>{{ s.name }}</h3>
            <p>⏱ {{ s.duration_minutes }} นาที</p>
            <p>💰 {{ s.price }} บาท</p>

            <router-link :to="`/booking/${s.id}`">
              <button class="btn btn-primary w-100">จองคิว</button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
import api from "../../api/api";
import { ref, onMounted } from "vue";

const services = ref([]);

onMounted(async () => {
  const res = await api.get("/services");
  services.value = res.data.map((s) => ({
    image: s.image
      ? s.image
      : "https://as1.ftcdn.net/v2/jpg/10/22/24/80/1000_F_1022248039_7LDxHRi3Mlt9BK3wzLBUGZp9XAO1gt2s.jpg",
    name: s.name,
    duration_minutes: s.duration_minutes,
    price: s.price,
    id: s.id,
  }));
});
</script>
  
  <style>
.card {
  border: 1px solid #ddd;
  padding: 16px;
  margin-bottom: 10px;
}
.img-fluid {
  height: 200px !important;
  width: 100% !important;
  object-fit: cover;
}
</style>