<template>
  <div class="login-bg">
    <div class="login-card">
      <h2 class="title">Admin Login</h2>
      <p class="subtitle">Nail Queue Management</p>

      <div class="form-group">
        <label>Email</label>
        <input v-model="email" type="email" />
      </div>

      <div class="form-group">
        <label>Password</label>
        <input v-model="password" type="password" />
      </div>
      <button class="login-btn" @click="login" :disabled="loading">
        <span v-if="loading">Loading...</span>
        <span v-else>Login</span>
      </button>
    </div>
    <BaseToast ref="toast" />
  </div>
</template>
  
  <script setup>
import api from "../../api/api";
import { ref } from "vue";
import { useRouter } from "vue-router";
import BaseToast from "../../components/BaseToast.vue";

const email = ref("");
const password = ref("");
const loading = ref(false);

const toast = ref(null);
const router = useRouter();

const login = async () => {
  loading.value = true;

  try {
    const res = await api.post("/admin/login", {
      email: email.value,
      password: password.value,
    });
    if (res.data.success) {
      localStorage.setItem("token", res.data.token);
      toast.value.showToast("Login สำเร็จ", {
        title: "Success",
        duration: 2000,
      });

      setTimeout(() => {
        router.push("/admin");
      }, 500);
    } else {
      toast.value.showToast(res.data.message, {
        title: "Error",
        duration: 3000,
      });
    }
  } catch (err) {
    toast.value.showToast("กรุณาตรวจสอบอีเมลและรหัสผ่าน", {
      title: "Error",
      duration: 3000,
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-bg {
  height: 100vh;
  background: linear-gradient(135deg, #fbc2eb, #a6c1ee);
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-card {
  width: 360px;
  padding: 32px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(14px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  animation: fadeUp 0.8s ease;
}

.title {
  text-align: center;
  font-weight: 700;
  margin-bottom: 4px;
}

.subtitle {
  text-align: center;
  font-size: 14px;
  color: #555;
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  font-size: 13px;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 10px 14px;
  border-radius: 12px;
  border: none;
  outline: none;
  margin-top: 6px;
}

.form-group input:focus {
  box-shadow: 0 0 0 2px #a6c1ee;
}

.login-btn {
  width: 100%;
  padding: 12px;
  border-radius: 14px;
  border: none;
  background: #6a5af9;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
}

.login-btn:hover {
  background: #5848e5;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>