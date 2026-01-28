<template>
    <div
      v-if="visible"
      class="toast-container"
    >
      <div class="toast-card">
        <div class="toast-header">
          <strong class="me-auto">{{ title }}</strong>
          <button class="btn-close" @click="hide"></button>
        </div>
        <div class="toast-body">
          {{ message }}
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, defineExpose } from 'vue'
  
  const visible = ref(false)
  const message = ref('')
  const title = ref('แจ้งเตือน')
  let timer = null
  
  const showToast = (msg, options = {}) => {
    message.value = msg
    title.value = options.title || 'แจ้งเตือน'
    visible.value = true
  
    clearTimeout(timer)
    timer = setTimeout(() => {
      visible.value = false
    }, options.duration || 3000)
  }
  
  const hide = () => {
    visible.value = false
  }
  
  defineExpose({ showToast })
  </script>
  
  <style scoped>
  .toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
  }
  
  .toast-card {
    min-width: 260px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    animation: slideIn 0.3s ease;
  }
  
  .toast-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 14px;
    border-bottom: 1px solid #eee;
    font-weight: 600;
  }
  
  .toast-body {
    padding: 14px;
    font-size: 14px;
  }
  
  .btn-close {
    background: none;
    border: none;
    font-size: 16px;
    cursor: pointer;
  }
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  </style>