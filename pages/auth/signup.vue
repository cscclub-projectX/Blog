<template>

  <div class="login-container flex items-center justify-center min-h-screen p-4">
    <div class="bg-white/90 backdrop-blur-sm p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-md text-center">
      <!-- Logo Section -->
      <div class="flex flex-col items-center mb-8">
        <div class="relative group">
          <img 
            src="/images/logo.png" 
            alt="Logo" 
            class="relative w-32 h-32 object-contain"
          />
        </div>
      </div>

      <!-- Signup Form -->
      <h2 class="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Create Account</h2>
      <form @submit.prevent="handleSignup" class="space-y-4">
        <!-- Full Name -->
        <div class="relative group">
          <i class="fas fa-user absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-200"></i>
          <input 
            v-model="name"
            type="text"
            placeholder="Full Name"
            class="w-full px-4 py-3 pl-10 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            required
          />
        </div>

        <!-- Username -->
        <div class="relative group">
          <i class="fas fa-at absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-200"></i>
          <input 
            v-model="username"
            type="text"
            placeholder="Username"
            class="w-full px-4 py-3 pl-10 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            required
          />
        </div>

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

        <!-- Confirm Password -->
        <div class="relative group">
          <i class="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-200"></i>
          <input 
            v-model="confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            placeholder="Confirm Password"
            class="w-full px-4 py-3 pl-10 pr-10 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            required
          />
          <button 
            type="button"
            @click="showConfirmPassword = !showConfirmPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors duration-200"
          >
            <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </button>
        </div>

        <!-- Submit Button -->
        <button 
          type="submit"
          class="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition duration-300 font-medium shadow-sm hover:shadow-md flex items-center justify-center gap-2"
        >
          <i class="fas fa-user-plus"></i>
          <span>Create Account</span>
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

      <!-- Login Link -->
      <p class="mt-6 text-gray-600">
        Already have an account? 
        <NuxtLink 
          to="/auth/login" 
          class="text-blue-600 hover:text-blue-700 font-medium transition duration-200"
        >
          Login here
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
const name = ref('')
const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const handleSignup = async () => {
  try {
    // Basic validation
    if (password.value !== confirmPassword.value) {
      throw new Error('Passwords do not match')
    }
    
    if (username.value.length < 3) {
      throw new Error('Username must be at least 3 characters long')
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(username.value)) {
      throw new Error('Username can only contain letters, numbers, and underscores')
    }

    // Password strength validation
    if (password.value.length < 8) {
      throw new Error('Password must be at least 8 characters long')
    }

    if (!/[A-Z]/.test(password.value)) {
      throw new Error('Password must contain at least one uppercase letter')
    }

    if (!/[a-z]/.test(password.value)) {
      throw new Error('Password must contain at least one lowercase letter')
    }

    if (!/[0-9]/.test(password.value)) {
      throw new Error('Password must contain at least one number')
    }

    console.log('Signing up with:', {
      name: name.value,
      username: username.value,
      email: email.value,
      password: password.value
    })
    // Add your signup logic here

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

