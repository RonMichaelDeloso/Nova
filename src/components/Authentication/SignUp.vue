<script setup lang="ts">
</script>

<template>
  <div class="login card">
    <h1>Create Your Account</h1>
    <h3>Sign up to get started with your journey </h3>

        <form>
      <div>
            <div><label for="FirstName">First Name</label></div>
        <input type="text" placeholder="Enter your First Name" id="FirstName" required />
      </div>

      <div>
            <div><label for="LastName">Last Name</label></div>
        <input type="text" placeholder="Enter your Last Name" id="LastName" required />
      </div>

      <div>
            <div><label for="email">Email</label></div>
        <input type="email" placeholder="Enter your Email" id="email" required />
      </div>

      <div>
            <div><label for="Number">Phone Number</label></div>
        <input type="text" placeholder="Enter your Phone Number" id="Number" required />
      </div>

      <div>
            <div><label for="password">Password</label></div>
        <input type="password" placeholder="Enter your Password" id="password" required />
      </div>

      <div>
            <div><label for="confirmPassword">Confirm Password</label></div>
        <input type="password" placeholder="Confirm your Password" id="confirmPassword" required />
      </div>

      <button type="submit">Create Account</button>

      <p>
       Already have an account?  <router-link to="/signin">Sign in</router-link>
      </p>
    </form>
  </div>
</template>

