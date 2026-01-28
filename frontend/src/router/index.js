import { createRouter, createWebHistory } from 'vue-router'

// customer
import ServiceList from '../views/customer/ServiceList.vue'
import Booking from '../views/customer/Booking.vue'
import BookingSuccess from '../views/customer/BookingSuccess.vue'

// admin
import AdminLayout from '../layouts/AdminLayout.vue'
import AdminLogin from '../views/admin/Login.vue'
import AdminDashboard from '../views/admin/Dashboard.vue'
import AdminAppointments from '../views/admin/Appointments.vue'
import AdminServices from '../views/admin/Services.vue'

const routes = [
  // customer
  { path: '/', component: ServiceList },
  { path: '/booking/:serviceId', component: Booking },
  { path: '/success', component: BookingSuccess },

  // admin login (ไม่มี navbar)
  { path: '/admin/login', component: AdminLogin },

  // admin layout
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      { path: '', component: AdminDashboard },
      { path: 'appointments', component: AdminAppointments },
      { path: 'services', component: AdminServices }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  if (to.path !== "/admin/login" && !token) {
      next("/admin/login"); // ❌ ยังไม่ login
  } else {
      next(); // ✅ ผ่าน
  }
});

export default router;