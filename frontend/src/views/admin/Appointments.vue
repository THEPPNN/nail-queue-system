<template>
  <div class="container-fluid calendar-page">
    <div class="calendar-card">
      <div class="calendar-header">
        <h2>📅 ตารางการจอง</h2>
        <span class="subtitle">ภาพรวมคิวทั้งหมด</span>
      </div>

      <FullCalendar :options="calendarOptions" />
    </div>
  </div>
</template>

<script setup>
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import api from "../../api/api";
import dayjs from "dayjs";
import "dayjs/locale/th";
dayjs.locale("th");

const calendarOptions = {
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: "dayGridMonth",
  locale: "th",
  height: "auto",

  dayMaxEvents: true, // ⭐ ทำให้ขึ้น + more
  eventTimeFormat: {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  },

  events: async (info, successCallback) => {
    const res = await api.get("/admin/appointments/calendar", {
      params: {
        start: info.startStr,
        end: info.endStr,
      },
    });
    successCallback(res.data);
  },

  eventClick(info) {
    alert(`
      บริการ: ${info.event.title}
      ลูกค้า: ${info.event.extendedProps.name}
      เวลา: ${dayjs(info.event.start).format("HH:mm")} - ${dayjs(
      info.event.end
    ).format("HH:mm")}
      วันที่: ${dayjs(info.event.start).format("DD MMMM YYYY")}
      เบอร์โทร: ${info.event.extendedProps.phone}
    `);
  },
};
</script>

<style scoped>
.calendar-page {
  min-height: 100vh;
}

.calendar-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 20px 40px rgba(191, 191, 191, 0.12);
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.calendar-header h2 {
  font-weight: 700;
  margin: 0;
}

.calendar-header .subtitle {
  color: #6b7280;
  font-size: 14px;
}
</style>