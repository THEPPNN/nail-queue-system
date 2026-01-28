<template>
  <div class="container">
    <div class="d-flex justify-content-between align-items-center">
      <h1>จัดการบริการ</h1>
      <button class="btn btn-primary" @click="addService">+ เพิ่มบริการ</button>
      <div
        class="modal fade"
        id="addServiceModal"
        tabindex="-1"
        aria-labelledby="addServiceModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">เพิ่มบริการ</h5>
              <button
                type="button"
                class="btn-close"
                @click="closeModal"
              ></button>
            </div>
            <div class="modal-body">
              <form>
                <div class="form-group">
                  <label for="name">ชื่อบริการ</label>
                  <input
                    type="text"
                    class="form-control"
                    id="name"
                    v-model="name"
                  />
                </div>
                <div class="form-group">
                  <label for="name">ราคา</label>
                  <input
                    type="number"
                    class="form-control"
                    id="price"
                    v-model="price"
                  />
                </div>
                <div class="form-group">
                  <label for="name">ระยะเวลา</label>
                  <input
                    type="number"
                    class="form-control"
                    id="duration_minutes"
                    v-model="duration_minutes"
                  />
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                @click="closeModal"
              >
                ปิด
              </button>
              <button
                type="button"
                class="btn btn-primary"
                @click="saveService"
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="table-responsive pb-3">
      <EasyDataTable
        :headers="headers"
        :items="items"
        :search-value="search"
        item-key="id"
        table-class="table table-hover align-middle"
        header-class="table-light"
      >
        <template #item-action="item">
          <div class="d-flex gap-2 align-items-center">
            <button
              class="btn btn-primary btn-sm"
              @click="editService(item.id)"
            >
              แก้ไข
            </button>
            <button
              class="btn btn-danger btn-sm"
              @click="statusService(item.id, 'D')"
            >
              ลบ
            </button>
            <div class="form-check form-switch ms-2">
              <input
                class="form-check-input"
                type="checkbox"
                :id="'status-' + item.id"
                :checked="item.status === 'A'"
                @change="statusService(item.id, item.status == 'A' ? 'W' : 'A')"
              />
              <label
                class="form-check-label"
                :for="'status-' + item.id"
              >
                {{ item.status === "A" ? "ใช้งาน" : "ปิดใช้งาน" }}
              </label>
            </div>
          </div>
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
import { Modal } from "bootstrap";
import BaseToast from "../../components/BaseToast.vue";
let modalInstance = null;
const toast = ref(null);

const headers = ref([
  { text: "ลำดับ", value: "index" },
  { text: "ชื่อบริการ", value: "name" },
  { text: "ราคา", value: "price" },
  { text: "ระยะเวลา", value: "duration_minutes" },
  { text: "จัดการ", value: "action" },
]);

const items = ref([]);
const search = ref("");

const name = ref("");
const price = ref("");
const duration_minutes = ref("");

onMounted(async () => {
  loadServices();
  const modalEl = document.getElementById("addServiceModal");
  modalInstance = new Modal(modalEl);
});

const addService = () => {
  modalInstance.show();
};

const saveService = async () => {
  if (!name.value || !price.value || !duration_minutes.value) {
    toast.value.showToast("กรุณากรอกข้อมูลให้ครบ", {
      title: "Error",
      duration: 3000,
    });
    return;
  }
  try {
    await api.post("/services", {
      name: name.value,
      price: price.value,
      duration_minutes: duration_minutes.value,
    });
    toast.value.showToast("บันทึกสำเร็จ", {
      title: "Success",
      duration: 3000,
    });
    modalInstance.hide();
    resetForm();
    loadServices();
  } catch (error) {
    console.log(error);
    toast.value.showToast("บันทึกไม่สำเร็จ", {
      title: "Error",
      duration: 3000,
    });
  }
};

const resetForm = () => {
  name.value = "";
  price.value = "";
  duration_minutes.value = "";
};

const status = ref("W");

const loadServices = async () => {
  try {
    const res = await api.get("/services");
    if (res.data && Array.isArray(res.data)) {
      items.value = res.data.map((row, index) => ({
        id: row.id, // <--- ต้องมีตัวนี้ เพราะ item-key="id"
        index: index + 1,
        name: row.name,
        price: row.price,
        duration_minutes: row.duration_minutes,
        status: row.status,
        action: true,
      }));
      console.log("Mapped Items:", items.value); // เช็กใน console อีกรอบว่ามี id หรือยัง
    }
  } catch (error) {
    console.error("Error loading services:", error);
    toast.value.showToast("โหลดข้อมูลไม่สำเร็จ", { title: "Error" });
  }
};

const closeModal = () => {
  modalInstance.hide();
};

const editService = async (id) => {
  // เปิด Modal แก้ไข ที่ใช้ด้วยกันกับตอนสร้าง
};

const updateService = async (id) => {
  try {
    const res = await api.put(`/services/${id}`, {
      name: name.value,
      price: price.value,
      duration_minutes: duration_minutes.value,
    });
    toast.value.showToast("อัพเดตสถานะ", { title: "Success" });
    resetForm();
    loadServices();
  } catch (error) {
    console.error("Error editing service:", error);
    toast.value.showToast("แก้ไขไม่สำเร็จ", { title: "Error" });
  }
};

const statusService = async (id, status) => {
  if(status == "D") {
    if(confirm("คุณต้องการลบบริการนี้หรือไม่?")) {
      updateStatusService(id, "D");
    }
    return;
  }
  updateStatusService(id, status);
};

const updateStatusService = async (id, status) => {
  try {
    const res = await api.patch(`/services/${id}`, {
      status: status,
    });
    const txt = (status == "D" ? "ลบสำเร็จ" : "แก้ไขสถานะสำเร็จ");
    toast.value.showToast(txt, { title: "Success" });
    loadServices();
  } catch (error) {
    console.error("Error changing status:", error);
    toast.value.showToast("แก้ไขสถานะไม่สำเร็จ", { title: "Error" });
  }
};
</script>

<style scoped>
</style>