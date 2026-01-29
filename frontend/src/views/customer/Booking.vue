<template>
  <div class="container p-4">
    <div class="row">
      <div class="col-lg-3 col-md-4 col-sm-12 mt-2">
        <h2>📅 เลือกวัน</h2>
        <input
          type="date"
          v-model="date"
          :min="today"
          @change="loadSlots"
          class="form-control"
        />
      </div>
      <div class="col-lg-3 col-md-4 col-sm-12 mt-2">
        <h2>⏰ เลือกเวลา</h2>
        <TimeSlot
          v-if="isOpen && slots.length > 0"
          :slots="slots"
          :selected="startTime"
          @select="startTime = $event"
        />

        <div
          v-else
          class="alert alert-warning mt-3"
          :class="{ 'd-none': date == '' }"
        >
          {{ notice || "วันนี้คิวเต็ม" }}
        </div>
      </div>
    </div>

    <br />
    <h2>👤 ข้อมูลลูกค้า</h2>
    <div class="row">
      <div class="col-lg-3 col-md-4 col-sm-12">
        <label for="name">ชื่อ</label>
        <input v-model="name" placeholder="" class="form-control" />
      </div>
      <div class="col-lg-3 col-md-4 col-sm-12">
        <label for="email">อีเมล</label>
        <input v-model="email" placeholder="" class="form-control" />
      </div>
      <div class="col-lg-3 col-md-4 col-sm-12">
        <label for="phone">เบอร์โทร</label>
        <input v-model="phone" placeholder="" class="form-control" />
      </div>
      <div class="col-lg-3 col-md-4 col-sm-12">
        <label for="book" class="text-white">ยืนยันการจอง</label>
        <button
          class="btn btn-primary w-100"
          :disabled="!isOpen || !startTime"
          @click="book"
        >
          จองคิว
        </button>
      </div>
    </div>
    <BaseToast ref="toast" />
  </div>
</template>
  
  <script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../../api/api";
import TimeSlot from "../../components/TimeSlot.vue";
import BaseToast from "../../components/BaseToast.vue";
const route = useRoute();
const router = useRouter();

const serviceId = route.params.serviceId;
const date = ref("");
const today = ref(new Date().toISOString().split("T")[0]);
const name = ref("");
const email = ref("");
const phone = ref("");

const slots = ref([]);
const startTime = ref(null);
const isOpen = ref(true);
const notice = ref("");
const toast = ref(null);
const loadSlots = async () => {
  const res = await api.get("/appointments/available_time", {
    params: {
      service_id: serviceId,
      date: date.value,
    },
  });

  isOpen.value = res.data.is_open;
  notice.value = res.data.message || "";
  slots.value = res.data.available_times || [];
  startTime.value = null;
};

const book = async () => {
  try {
    let res = await api.post("/appointments/book", {
      service_id: serviceId,
      date: date.value,
      start_time: startTime.value,
      name: name.value,
      email: email.value,
      phone: phone.value,
    });
    if (res.data.error) {
      toast.value.showToast(res.data.message, {
        title: "แจ้งเตือน",
        duration: 3000,
      });
    } else {
      router.push({
        path: "/success",
        query: {
          detail: JSON.stringify(res.data.detail),
        },
      });
    }
  } catch (error) {
    console.log("error booking ", error);
  }
  // router.push("/success");
};
</script>