<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div class="container-fluid">
        <!-- Logo / Brand -->
        <router-link to="/admin" class="navbar-brand fw-bold">
          💅 Nail Queue
        </router-link>
  
        <!-- Mobile toggle -->
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#adminNavbar"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
  
        <!-- Menu -->
        <div class="collapse navbar-collapse" id="adminNavbar">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link
                to="/admin"
                class="nav-link"
                exact-active-class="active"
              >
                Dashboard
              </router-link>
            </li>
  
            <li class="nav-item">
              <router-link
                to="/admin/appointments"
                class="nav-link"
                active-class="active"
              >
                Appointments
              </router-link>
            </li>
  
            <li class="nav-item">
              <router-link
                to="/admin/services"
                class="nav-link"
                active-class="active"
              >
                Services
              </router-link>
            </li>
          </ul>
  
          <!-- Right -->
          <div class="d-flex align-items-center gap-3">
            <span class="text-light small">
              👤 Admin
            </span>
  
            <button class="btn btn-outline-danger btn-sm" @click="logout">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  </template>
  
  <script setup>
  import { useRouter } from "vue-router";
  
  const router = useRouter();
  
  const logout = () => {
    localStorage.removeItem("token");
    router.push("/admin/login");
  };
  </script>
  
  <style scoped>
  .navbar-brand {
    letter-spacing: 0.5px;
  }
  
  .nav-link.active {
    font-weight: 600;
    color: #fff !important;
    border-bottom: 2px solid #0d6efd;
  }
  </style>