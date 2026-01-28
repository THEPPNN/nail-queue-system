<template>
    <div class="container">
      <h1>💅 เลือกบริการ</h1>
      <div v-for="s in services" :key="s.id" class="card">
        <h3>{{ s.name }}</h3>
        <p>⏱ {{ s.duration_minutes }} นาที</p>
        <p>💰 {{ s.price }} บาท</p>
  
        <router-link :to="`/booking/${s.id}`">
          <button>จองคิว</button>
        </router-link>
      </div>
    </div>
  </template>
  
  <script setup>
  import api from '../../api/api'
  import { ref, onMounted } from 'vue'
  
  const services = ref([])
  
  onMounted(async () => {
    const res = await api.get('/services')
    services.value = res.data
  })
  </script>
  
  <style>
  .card {
    border: 1px solid #ddd;
    padding: 16px;
    margin-bottom: 10px;
  }
  </style>