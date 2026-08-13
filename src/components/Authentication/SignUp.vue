<template>
  <div class="signup-page">

    <!-- =========================
         LEFT SIDE - CODE ONLY
    ========================== -->
    <div class="left-panel">

      <!-- TOP BRAND -->
      <div class="brand">
        <h2>MOTOR & CAR</h2>
        <p>RENTAL SYSTEM</p>
        <div class="brand-icon"></div>
      </div>

      <!-- HERO TEXT -->
      <div class="hero-text">
        <h2>
          Move freely.<br>
          We'll <span>take care</span><br>
          of the ride
        </h2>

        <div class="yellow-line"></div>

        <p>
          Rent a car or motor with<br>
          confidence and enjoy every<br>
          journey.
        </p>
      </div>

      <!-- ROAD LINES -->
      <div class="road-line line-one"></div>
      <div class="road-line line-two"></div>

      <!-- MOTORCYCLE -->
      <div class="motorcycle"></div>

      <!-- CAR -->
      <div class="car"></div>

      <!-- STEPS -->
      <div class="steps">

        <div class="step active">
          <div class="step-icon">⌕</div>
          <div>
            <h4>CHOOSE</h4>
            <p>
              Pick your perfect<br>
              ride.
            </p>
          </div>
        </div>

        <div class="step">
          <div class="step-icon">▣</div>
          <div>
            <h4>BOOK</h4>
            <p>
              Select date and<br>
              time.
            </p>
          </div>
        </div>

        <div class="step">
          <div class="step-icon">▱</div>
          <div>
            <h4>DRIVE</h4>
            <p>
              Hit the road and<br>
              enjoy.
            </p>
          </div>
        </div>

        <div class="step">
          <div class="step-icon">✓</div>
          <div>
            <h4>DRIVE</h4>
            <p>
              Return it safely,<br>
              we'll handle the rest.
            </p>
          </div>
        </div>

      </div>

      <!-- BOTTOM INFO -->
      <div class="bottom-info">

        <div class="info-box">
          <div class="info-icon">♧</div>
          <div>
            <strong>Safe & Reliable</strong>
            <small>
              All vehicles are ensured<br>
              and well-maintained.
            </small>
          </div>
        </div>

        <div class="info-box">
          <div class="info-icon">♧</div>
          <div>
            <strong>24/7 Support</strong>
            <small>
              We're here for you<br>
              anytime, anywhere.
            </small>
          </div>
        </div>

      </div>
    </div>


    <!-- =========================
         RIGHT SIDE - SIGN UP
    ========================== -->
    <div class="right-panel">

      <div class="signup-container">

        <!-- LOGO -->
        <div class="logo-circle"></div>

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


        <!-- SIGN UP BUTTON -->
        <button
          class="signup-button"
          @click="signUp"
        >
          Sign Up
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

const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const signUp = () => {
  if (
    !fullName.value ||
    !email.value ||
    !password.value ||
    !confirmPassword.value
  ) {
    alert('Please fill in all fields.')
    return
  }

  if (password.value !== confirmPassword.value) {
    alert('Passwords do not match.')
    return
  }

  console.log('Full Name:', fullName.value)
  console.log('Email:', email.value)

  alert('Account created successfully!')
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
  width: 100vw;
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