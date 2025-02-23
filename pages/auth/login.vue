<template>
  <div class="login-container flex items-center justify-center min-h-screen p-4">
    <div class="bg-white/90 backdrop-blur-sm p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-md text-center">
      <!-- Logo Section -->
      <div class="flex flex-col items-center mb-8">
        <div class="relative group">
          <div class="absolute "></div>   
          <img 
            src="/images/logo.png" 
            alt="Logo" 
            class="relative w-32 h-32 "
          />
        </div>
      </div>

      <!-- Login Form -->
      <h2 class="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Log In</h2>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <!-- Email -->
        <div class="relative group">
          <i class="fas fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-200"></i>
          <input 
            v-model="email"
            type="email"
            placeholder="Email"
            class="w-full px-4 py-3 pl-10 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            required
          />
        </div>

        <!-- Password -->
        <div class="relative group">
          <i class="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-200"></i>
          <input 
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Password"
            class="w-full px-4 py-3 pl-10 pr-10 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            required
          />
          <button 
            type="button"
            @click="showPassword = !showPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors duration-200"
          >
            <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </button>
        </div>

        <!-- Submit Button -->
        <button 
          type="submit"
          class="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition duration-300 font-medium shadow-sm hover:shadow-md flex items-center justify-center gap-2"
        >
          <i class="fas fa-sign-in-alt"></i>
          <span>Login</span>
        </button>
      </form>

      <!-- Divider -->
      <div class="relative flex items-center justify-center my-6">
        <div class="absolute border-t border-gray-300 w-full"></div>
        <div class="relative bg-white px-4 text-sm text-gray-500 uppercase tracking-wider">or</div>
      </div>

      <!-- Social Buttons -->
      <div class="flex flex-col gap-3">
        <!-- Google Button -->
        <button class="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 px-4 rounded-xl hover:bg-gray-50 hover:shadow-md transition-all duration-300 ease-in-out group">
          <i class="fab fa-google text-xl group-hover:scale-110 transition-transform duration-300" 
             style="background: conic-gradient(from -45deg, #ea4335 110deg, #4285f4 90deg 180deg, #34a853 180deg 270deg, #fbbc05 270deg) no-repeat;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;">
          </i>
          <span class="font-medium text-gray-700">Continue with Google</span>
        </button>
        
        <!-- Facebook Button -->
        <button class="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 px-4 rounded-xl hover:bg-blue-50 hover:shadow-md transition-all duration-300 ease-in-out group">
          <i class="fab fa-facebook text-xl text-[#1877f2] group-hover:scale-110 transition-transform duration-300"></i>
          <span class="font-medium text-gray-700">Continue with Facebook</span>
        </button>
      </div>

      <!-- Sign Up Link -->
      <div class="mt-6 space-y-2">
        <p class="text-gray-600">
          Don't have an account? 
          <NuxtLink 
            to="/auth/signup" 
            class="text-blue-600 hover:text-blue-700 font-medium transition duration-200"
          >
            Sign up here
          </NuxtLink>
        </p>
        <p class="text-gray-600 text-sm">
          <NuxtLink 
            to="/auth/forgot-password" 
            class="text-blue-600 hover:text-blue-700 transition duration-200"
          >
            Forgot your password?
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
const email = ref('')
const password = ref('')
const showPassword = ref(false)

const handleLogin = async () => {
  try {
    console.log('Logging in with:', {
      email: email.value,
      password: password.value
    })
    // Add your login logic here
  } catch (error) {
    alert(error.message)
  }
}
</script>

<style scoped>
.login-container {
  background-image: url('/images/DECORATION.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  width: 100%;
}
</style>