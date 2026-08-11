<script setup lang="ts">
</script>

<template>
  <div class="login card">
    <h1>Welcome Back!</h1>
    <h3>Sign in to continue your account</h3>

    <form>
      <div>
            <div><label for="email">Email</label></div>
        <input type="email" placeholder="Enter your Email" id="email" required />
      </div>

      <div>
            <div><label for="password">Password</label></div>
        <input type="password" placeholder="Enter your Password" id="password" required />
      </div>

      <p>
        <a href="/forgot-password">Forgot your password?</a>
      </p>

      <button type="submit">Log in</button>

      <p>
        Don't have an account? <router-link to="/signup">Sign up</router-link>
      </p>
    </form>
  </div>
</template>

