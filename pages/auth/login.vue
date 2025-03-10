<template>
  <div class="flex items-center justify-center min-h-screen p-4 bg-white">
    <div class="w-full max-w-md">
      <!-- Logo Section -->
      <div class="flex flex-col items-center mb-8">
        <NuxtImg 
          src="/images/cscc.jpg" 
          alt="Logo" 
          class="w-16 h-16 rounded-2xl bg-gradient-to-r border-2 border-white from-purple-200 to-blue-200"
        />
      </div>

      <!-- Login Form -->
      <h2 class="text-3xl font-bold mb-6 text-gray-800">Sign In</h2>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            v-model="email" 
            type="email" 
            class="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="your@email.com"
            required
          />
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div class="relative">
            <input 
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
              required
            />
            <button 
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500"
            >
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
        </div>

        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <input type="checkbox" id="remember" class="h-4 w-4 text-blue-600 rounded" />
            <label for="remember" class="ml-2 text-sm text-gray-600">Remember me</label>
          </div>
          <NuxtLink to="/auth/forgot-password" class="text-sm text-blue-500 hover:text-blue-700">
            Forgot password?
          </NuxtLink>
        </div>

        <!-- Submit Button -->
        <button 
          type="submit"
          class="w-full bg-black text-white py-2 px-4 rounded-full hover:bg-gray-800 transition"
        >
          Sign in
        </button>
      </form>

      <!-- Divider -->
      <div class="relative flex items-center justify-center my-6">
        <div class="absolute border-t border-gray-300 w-full"></div>
        <div class="relative bg-white px-4 text-sm text-gray-500">or</div>
      </div>

      <!-- Social Buttons -->
      <div class="flex flex-col gap-3">
        <!-- Google Button -->
        <button class="w-full flex items-center justify-center gap-3 border border-gray-300 py-2 px-4 rounded-full hover:bg-gray-50 transition">
          <i class="fab fa-google text-xl"></i>
          <span class="font-medium text-gray-700">Sign in with Google</span>
        </button>
        
        <!-- Facebook Button -->
        <button class="w-full flex items-center justify-center gap-3 border border-gray-300 py-2 px-4 rounded-full hover:bg-gray-50 transition">
          <i class="fab fa-facebook text-xl text-[#1877f2]"></i>
          <span class="font-medium text-gray-700">Sign in with Facebook</span>
        </button>
      </div>

      <!-- Sign Up Link -->
      <div class="mt-6 text-center">
        <p class="text-gray-600">
          No account?
          <NuxtLink 
            to="/auth/signup" 
            class="text-green-600 hover:text-green-700 font-medium ml-1"
          >
            Create one
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

</style>

