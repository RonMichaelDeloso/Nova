<template>
  <div class="signup-page">

    <!-- =========================
         LEFT SIDE - CODE ONLY
    ========================== -->
    <div class="left-panel" :style="{ backgroundImage: `url(${authWallpaper})` }">

    </div>


    <!-- =========================
         RIGHT SIDE - SIGN UP
    ========================== -->
    <div class="right-panel">

      <div class="signup-container">

        <!-- LOGO -->
        <div class="logo-circle">
          <img :src="logoImage" alt="MOTOR & CAR Rental System logo" />
        </div>

        <!-- TITLE -->
        <h1>Create Account</h1>

        <p class="subtitle">
          Sign up to start your journey
        </p>


        <!-- FULL NAME -->
        <div class="input-group">
          <label>Full Name</label>

          <div class="input-wrapper">
            <span class="input-icon">♙</span>

            <input
              v-model="fullName"
              type="text"
              placeholder="Enter your full name"
            />
          </div>
        </div>


        <!-- EMAIL -->
        <div class="input-group">
          <label>Email Address</label>

          <div class="input-wrapper">
            <span class="input-icon"></span>

            <input
              v-model="email"
              type="email"
              placeholder="Enter your email"
            />
          </div>
        </div>


        <!-- PASSWORD -->
        <div class="input-group">
          <label>Password</label>

          <div class="input-wrapper">
            <span class="input-icon">♙</span>

            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Create your password"
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


        <!-- CONFIRM PASSWORD -->
        <div class="input-group">
          <label>Confirm Password</label>

          <div class="input-wrapper">
            <span class="input-icon">♙</span>

            <input
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Confirm your password"
            />

            <button
              type="button"
              class="eye-button"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              {{ showConfirmPassword ? '◉' : '◌' }}
            </button>
          </div>
        </div>

        <!-- Error Message -->
        <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

        <button
          class="signup-button"
          :disabled="isLoading"
          @click="signUp"
        >
          {{ isLoading ? 'Creating Account...' : 'Sign Up' }}
        </button>


        <!-- SIGN IN -->
        <p class="signin-text">
          Already have an account?

          <router-link to="/signin">
            Sign In
          </router-link>
        </p>

      </div>
    </div>

  </div>
</template>


<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { registerUser } from '../../auth'
import logoImage from '../../assets/logo.png'
import authWallpaper from '../../assets/authwallpaper.png'

const router = useRouter()
const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

const signUp = async () => {
  if (
    !fullName.value ||
    !email.value ||
    !password.value ||
    !confirmPassword.value
  ) {
    errorMessage.value = 'Please fill in all fields.'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match.'
    return
  }

  errorMessage.value = ''
  isLoading.value = true

  try {
    const result = await registerUser({
      fullName: fullName.value,
      email: email.value,
      password: password.value,
    })

    if (!result.success) {
      errorMessage.value = result.message || 'An account with this email already exists.'
      return
    }

    router.push('/dashboard/user')
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


/* =========================
   MAIN PAGE
========================= */

.signup-page {
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
  position: relative;
  width: 51%;
  height: 100vh;
  overflow: hidden;

  background: linear-gradient(
    145deg,
    #07162f 0%,
    #06152d 55%,
    #071a36 100%
  );

  color: white;
  flex-shrink: 0;
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
}


/* =========================
   BRAND
========================= */

.brand {
  position: absolute;
  top: 27px;
  left: 25px;
}

.brand h2 {
  margin: 0;
  font-size: 17px;
  font-weight: 800;
  letter-spacing: 0.3px;
}

.brand p {
  margin: 10px 0 0 25px;
  font-size: 11px;
  color: #ddd;
}

.brand-icon {
  margin-top: 32px;
  font-size: 24px;
}


/* =========================
   HERO TEXT
========================= */

.hero-text {
  position: absolute;
  top: 50px;
  right: 34px;
  text-align: right;
}

.hero-text h2 {
  margin: 0;
  font-size: 22px;
  line-height: 1.32;
  font-weight: 800;
}

.hero-text h2 span {
  color: #d5d900;
}

.hero-text p {
  margin-top: 20px;
  color: white;
  font-size: 11px;
  line-height: 1.55;
}

.yellow-line {
  width: 52px;
  height: 2px;
  background: #d5d900;
  margin: 27px 0 0 auto;
}


/* =========================
   ROAD LINES
========================= */

.road-line {
  position: absolute;
  width: 4px;
  height: 380px;
  background: white;
  opacity: 0.9;
  transform: rotate(-33deg);
}

.line-one {
  top: 110px;
  left: 145px;
}

.line-two {
  top: 125px;
  right: 135px;
}


/* =========================
   MOTORCYCLE
========================= */

.motorcycle {
  position: absolute;
  top: 205px;
  left: 195px;
  font-size: 70px;
  transform: rotate(-8deg);
  filter: grayscale(1);
}


/* =========================
   CAR
========================= */

.car {
  position: absolute;
  bottom: 15px;
  right: 145px;
  font-size: 130px;
  transform: rotate(-18deg);
  filter: grayscale(1);
}


/* =========================
   STEPS
========================= */

.steps {
  position: absolute;
  left: 25px;
  bottom: 105px;
}

.step {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 13px;
}

.step-icon {
  width: 38px;
  height: 38px;
  border-radius: 50%;

  background: white;
  color: #07162f;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 20px;
  font-weight: bold;
}

.step.active .step-icon {
  background: #d5d900;
}

.step h4 {
  margin: 0 0 3px;
  font-size: 11px;
  font-weight: 700;
}

.step p {
  margin: 0;
  color: #b9c0cb;
  font-size: 9px;
  line-height: 1.35;
}


/* =========================
   BOTTOM INFO
========================= */

.bottom-info {
  position: absolute;
  left: 25px;
  bottom: 17px;

  width: 260px;
  height: 50px;

  display: flex;

  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;

  background: rgba(255, 255, 255, 0.08);
}

.info-box {
  width: 50%;

  display: flex;
  align-items: center;

  padding: 5px;
  gap: 6px;
}

.info-icon {
  color: #d5d900;
  font-size: 17px;
}

.info-box strong {
  display: block;
  font-size: 8px;
}

.info-box small {
  display: block;
  margin-top: 3px;
  color: #aaa;
  font-size: 6px;
  line-height: 1.25;
}


/* =========================
   RIGHT PANEL
========================= */

.right-panel {
  width: 49%;
  height: 100vh;

  background: white;

  display: flex;
  justify-content: center;
  align-items: center;
}


/* =========================
   SIGN UP CONTAINER
========================= */

.signup-container {
  width: 400px;
  text-align: center;
}


/* =========================
   LOGO
========================= */

.logo-circle {
  width: 72px;
  height: 72px;

  margin: 0 auto 20px;

  border-radius: 50%;
  background: #003f70;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 29px;
  overflow: hidden;
}

.logo-circle img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  border-radius: inherit;
}


/* =========================
   TITLE
========================= */

.signup-container h1 {
  margin: 0;
  color: #050505;
  font-size: 34px;
  font-weight: 800;
}

.subtitle {
  margin: 8px 0 27px;
  color: #888;
  font-size: 14px;
}


/* =========================
   INPUT GROUP
========================= */

.input-group {
  margin-bottom: 14px;
  text-align: left;
}

.input-group label {
  display: block;
  margin-bottom: 7px;

  color: #111;
  font-size: 13px;
  font-weight: 500;
}


/* =========================
   INPUT
========================= */

.input-wrapper {
  width: 100%;
  height: 44px;

  padding: 0 14px;

  border: 1px solid #ddd;
  border-radius: 9px;

  display: flex;
  align-items: center;

  transition: 0.2s;
}

.input-wrapper:focus-within {
  border-color: #003f70;
  box-shadow: 0 0 0 2px rgba(0, 63, 112, 0.06);
}

.input-icon {
  margin-right: 12px;
  color: #777;
  font-size: 17px;
}

.input-wrapper input {
  flex: 1;
  width: 100%;

  border: none;
  outline: none;

  background: transparent;
  color: #222;

  font-size: 13px;
}

.input-wrapper input::placeholder {
  color: #aaa;
}


/* =========================
   EYE BUTTON
========================= */

.eye-button {
  border: none;
  background: transparent;

  color: #777;
  font-size: 16px;

  cursor: pointer;
  padding: 0;
}


/* =========================
   SIGN UP BUTTON
========================= */

.signup-button {
  width: 100%;
  height: 40px;

  margin-top: 7px;

  border: none;
  border-radius: 7px;

  background: #003f70;
  color: white;

  font-size: 13px;
  font-weight: bold;

  cursor: pointer;
  transition: 0.2s;
}

.signup-button:hover {
  background: #002c50;
}

.signup-button:disabled {
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


/* =========================
   SIGN IN
========================= */

.signin-text {
  margin-top: 17px;
  color: #555;
  font-size: 12px;
}

.signin-text a {
  color: #003f70;
  font-weight: bold;
  text-decoration: none;
}

.signin-text a:hover {
  text-decoration: underline;
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

  .signup-container {
    width: 90%;
    max-width: 400px;
  }
}
</style>