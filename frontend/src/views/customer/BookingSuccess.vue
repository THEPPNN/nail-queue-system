<template>
    <div class="container d-flex justify-content-center align-items-center" style="min-height:80vh;">
      <div class="card shadow-lg p-4 text-center" style="max-width:500px; width:100%;">
        
        <div class="mb-3">
          <div style="font-size:60px;">✅</div>
        </div>
  
        <h2 class="mb-2">จองคิวสำเร็จ</h2>
        <p class="text-muted">
          ระบบได้ส่งอีเมลยืนยันการจองไปที่
        </p>
  
        <p class="fw-bold text-primary">
          {{ email }}
        </p>
  
        <div class="alert alert-light border mt-3">
          <small class="text-muted">รหัสการจอง</small>
          <h4 class="fw-bold mt-1">{{ bookingCode }}</h4>
        </div>
  
        <p class="text-muted mt-3" style="font-size:14px;">
          กรุณาตรวจสอบกล่องจดหมาย (Inbox หรือ Spam)<br />
          หรือแคปข้อมูลการจองไปที่หน้าร้าน <br />
        </p>
        <router-link to="/" class="btn btn-outline-primary mt-3 w-100">
          ดูเมนูเพิ่มเติม
        </router-link>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useRoute } from "vue-router";
  
  const route = useRoute();
  
  const detail = JSON.parse(route.query.detail) || "-";
  console.log("detail ", detail)
  const email = detail.email || "-";
  const bookingCode = detail.bookingCode || "-";
  </script>