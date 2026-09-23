<template>
  <div class="login-page">

    <!-- LEFT SIDE -->
    <div class="left-panel" :style="{ backgroundImage: `url(${authWallpaper})` }">

    </div>


    <!-- RIGHT SIDE -->
    <div class="right-panel">

      <div class="login-container">

        <!-- Logo -->
        <div class="logo-circle">
          <img :src="logoImage" alt="MOTOR & CAR Rental System logo" />
        </div>

        <h1>Welcome Back!</h1>

        <p class="subtitle">
          Sign in to continue your account
        </p>

        <!-- Email -->
        <div class="input-group">
          <label>Email Address</label>

          <div class="input-wrapper">
            <span class="input-icon">✉</span>

            <input
              v-model="email"
              type="email"
              placeholder="Enter your email"
            />
          </div>
        </div>


        <!-- Password -->
        <div class="input-group">
          <label>Password</label>

          <div class="input-wrapper">
            <span class="input-icon">♙</span>

            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter your password"
            />

            <button
              type="button"
              class="eye-button"
              @click="showPassword = !showPassword"
            >
              {{ showPassword ? '◉' : '◌' }}
            </button>
          </div>
        </div>


        <!-- Forgot Password -->
        <div class="forgot">
          <a href="#">Forgot Password?</a>
        </div>


        <!-- Error Message -->
        <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

        <!-- Login -->
        <button class="login-button" :disabled="isLoading" @click="login">
          {{ isLoading ? 'Signing In...' : 'Log In' }}
        </button>


        <!-- Sign Up -->
        <p class="signup-text">
          Don't have an account?
          <router-link to="/signup">Sign Up</router-link>
        </p>

      </div>

    </div>

  </div>
</template>


<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getSessionUser, loginUser } from '../../auth'
import { checkBackendHealth } from '../../api/client'
import logoImage from '../../assets/logo.png'
import authWallpaper from '../../assets/authwallpaper.png'

const router = useRouter()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const isBackendConnected = ref(false)

onMounted(async () => {
  email.value = 'admin@nova.com'
  password.value = 'admin123'
  
  const health = await checkBackendHealth()
  isBackendConnected.value = health.ok
})

const login = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Please enter your email and password.'
    return
  }

  errorMessage.value = ''
  isLoading.value = true

  try {
    const result = await loginUser(email.value, password.value)

    if (!result.success) {
      errorMessage.value = result.message || 'Invalid email or password.'
      return
    }

    const role = result.user?.role || getSessionUser()?.role
    const route = role === 'admin' ? '/dashboard/admin' : '/dashboard/user'
    router.push(route)
  } catch (err) {
    errorMessage.value = err.message || 'Failed to connect to backend server.'
  } finally {
    isLoading.value = false
  }
}
</script>


<style scoped>

* {
  box-sizing: border-box;
}

.login-page {
  width: 100%;
  height: 100vh;
  display: flex;
  overflow: hidden;
  font-family: Arial, Helvetica, sans-serif;
}


/* =========================
   LEFT PANEL
========================= */

.left-panel {
  width: 48%;
  height: 100vh;
  position: relative;
  overflow: hidden;

  background:
    linear-gradient(
      rgba(7, 20, 43, 0.88),
      rgba(7, 20, 43, 0.94)
    ),
    radial-gradient(
      circle at 70% 30%,
      #274064,
      #07142b 70%
    );

  color: white;
  padding: 32px 38px;
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
}


/* Brand */

.brand {
  position: relative;
  z-index: 5;
}

.brand h2 {
  font-size: 17px;
  margin: 0;
  font-weight: 800;
  letter-spacing: 0.5px;
}

.brand p {
  margin: 8px 0 0 25px;
  font-size: 12px;
  color: #ddd;
}


/* Small yellow icon */

.yellow-icon {
  margin-top: 20px;
  color: #d2d900;
  font-size: 28px;
}


/* Hero text */

.hero-text {
  position: absolute;
  top: 65px;
  right: 35px;
  z-index: 5;
}

.hero-text h1 {
  font-size: 22px;
  line-height: 1.35;
  margin: 0;
  font-weight: 700;
}

.hero-text h1 span {
  color: #d1d900;
}

.yellow-line {
  width: 52px;
  height: 2px;
  background: #d1d900;
  margin: 25px 0 18px auto;
}

.hero-text p {
  font-size: 12px;
  line-height: 1.5;
  color: #eee;
  text-align: right;
}


/* Vehicles */

.vehicles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.motorcycle {
  position: absolute;
  top: 170px;
  left: 170px;
  font-size: 100px;
  transform: rotate(-25deg);
  filter: grayscale(1);
}

.car {
  position: absolute;
  top: 350px;
  left: 245px;
  font-size: 190px;
  transform: rotate(-20deg);
  filter: grayscale(1);
}


/* White road lines */

.vehicles::before {
  content: "";
  position: absolute;
  width: 4px;
  height: 390px;
  background: white;
  opacity: 0.9;
  transform: rotate(-33deg);
  left: 180px;
  top: 110px;
}

.vehicles::after {
  content: "";
  position: absolute;
  width: 4px;
  height: 390px;
  background: white;
  opacity: 0.9;
  transform: rotate(-33deg);
  left: 420px;
  top: 120px;
}


/* Steps */

.steps {
  position: absolute;
  bottom: 110px;
  left: 38px;
  z-index: 5;
}

.step {
  display: flex;
  align-items: center;
  margin-bottom: 13px;
  gap: 12px;
}

.step-icon {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: white;
  color: #07142b;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 20px;
  font-weight: bold;
}

.step.active .step-icon {
  background: #d1d900;
}

.step strong {
  display: block;
  font-size: 11px;
}

.step p {
  margin: 3px 0 0;
  color: #aaa;
  font-size: 10px;
  line-height: 1.3;
}


/* Bottom info */

.bottom-info {
  position: absolute;
  bottom: 18px;
  left: 38px;
  width: 260px;

  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255,255,255,0.15);

  border-radius: 8px;

  padding: 9px;

  display: flex;
  gap: 15px;
}

.bottom-info > div {
  display: flex;
  align-items: center;
  gap: 6px;
}

.info-icon {
  color: #d1d900;
  font-size: 20px;
}

.bottom-info strong {
  font-size: 8px;
}

.bottom-info p {
  margin: 2px 0 0;
  font-size: 6px;
  color: #bbb;
  line-height: 1.3;
}


/* =========================
   RIGHT PANEL
========================= */

.right-panel {
  width: 52%;
  height: 100vh;

  background: #fff;

  display: flex;
  justify-content: center;
  align-items: center;
}


.login-container {
  width: 400px;
  text-align: center;
}


/* Logo */

.logo-circle {
  width: 72px;
  height: 72px;

  border-radius: 50%;

  background: #003c6b;

  margin: 0 auto 16px;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 30px;
  overflow: hidden;
}

.logo-circle img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  border-radius: inherit;
}


/* Heading */

.login-container h1 {
  margin: 0;

  font-size: 34px;
  font-weight: 800;

  color: #050505;
}

.subtitle {
  margin: 8px 0 8px;

  color: #888;
  font-size: 14px;
}

.demo-note {
  margin: 0 0 24px;
  color: #0f6fff;
  font-size: 12px;
  font-weight: 700;
}


/* Inputs */

.input-group {
  text-align: left;
  margin-bottom: 20px;
}

.input-group label {
  display: block;

  font-size: 13px;
  font-weight: 500;

  margin-bottom: 8px;

  color: #111;
}

.input-wrapper {
  height: 46px;

  border: 1px solid #ddd;
  border-radius: 9px;

  display: flex;
  align-items: center;

  padding: 0 14px;

  transition: 0.2s;
}

.input-wrapper:focus-within {
  border-color: #003c6b;
}

.input-icon {
  color: #777;
  font-size: 18px;
  margin-right: 12px;
}

.input-wrapper input {
  flex: 1;

  border: none;
  outline: none;

  font-size: 13px;
}

.input-wrapper input::placeholder {
  color: #aaa;
}

.eye-button {
  border: none;
  background: none;

  cursor: pointer;

  color: #777;
  font-size: 17px;
}


/* Forgot */

.forgot {
  text-align: right;
  margin-top: -7px;
  margin-bottom: 32px;
}

.forgot a {
  color: #003c6b;

  text-decoration: none;

  font-size: 11px;
}


/* Login button */

.login-button {
  width: 100%;
  height: 40px;

  border: none;
  border-radius: 7px;

  background: #003c6b;
  color: white;

  font-weight: bold;
  font-size: 13px;

  cursor: pointer;

  transition: 0.2s;
}

.login-button:hover {
  background: #002c50;
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-msg {
  margin-bottom: 10px;
  padding: 9px 12px;
  background: #fff0f0;
  border: 1px solid #ffcdd2;
  border-radius: 7px;
  color: #c62828;
  font-size: 12px;
  text-align: center;
}


/* Signup */

.signup-text {
  margin-top: 18px;

  color: #555;

  font-size: 12px;
}

.signup-text a {
  color: #003c6b;
  font-weight: bold;

  text-decoration: none;
}


/* =========================
   RESPONSIVE
========================= */

@media (max-width: 900px) {

  .left-panel {
    display: none;
  }

  .right-panel {
    width: 100%;
  }

}

</style>