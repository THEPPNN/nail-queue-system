<template>
    <div>
      <h2>📅 เลือกวัน</h2>
      <input type="date" v-model="date" @change="loadSlots" />
  
      <h2>⏰ เลือกเวลา</h2>
      <TimeSlot
        :slots="slots"
        @select="selectTime"
      />
  
      <h2>👤 ข้อมูลลูกค้า</h2>
      <input v-model="name" placeholder="ชื่อ" />
      <input v-model="email" placeholder="อีเมล" />
      <input v-model="phone" placeholder="เบอร์โทร" />
  
      <button
        :disabled="!startTime"
        @click="book"
      >
        จองคิว
      </button>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import api from '../../api/api'
  import TimeSlot from '../../components/TimeSlot.vue'
  
  const route = useRoute()
  const router = useRouter()
  
  const serviceId = route.params.serviceId
  const date = ref('')
  const slots = ref([])
  const startTime = ref(null)
  
  const name = ref('')
  const email = ref('')
  const phone = ref('')
  
  const loadSlots = async () => {
    const res = await api.get('/appointments/available', {
      params: { date: date.value, service_id: serviceId }
    })
    slots.value = res.data
  }
  
  const selectTime = time => {
    startTime.value = time
  }
  
  const book = async () => {
    await api.post('/appointments/book', {
      service_id: serviceId,
      date: date.value,
      start_time: startTime.value,
      name: name.value,
      email: email.value,
      phone: phone.value
    })
  
    router.push('/success')
  }
  </script>