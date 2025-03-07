<template>
  <div v-if="showLoginDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Login Required</h2>
        <button @click="closeDialog" class="text-gray-500 hover:text-gray-700">
          <Icon name="solar:close-circle-bold" class="text-2xl" />
        </button>
      </div>
      
      <p class="mb-4 text-gray-600">Please login to continue using all features of the application.</p>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            v-model="email" 
            type="email" 
            class="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="your@email.com"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input 
            v-model="password" 
            type="password" 
            class="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="••••••••"
          />
        </div>
        
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <input type="checkbox" id="remember" class="h-4 w-4 text-blue-600 rounded" />
            <label for="remember" class="ml-2 text-sm text-gray-600">Remember me</label>
          </div>
          <a href="#" class="text-sm text-blue-500 hover:text-blue-700">Forgot password?</a>
        </div>
        
        <button 
          @click="login" 
          class="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
        >
          Login
        </button>
        
        <div class="text-center text-sm text-gray-600">
          Don't have an account? 
          <a href="#" class="text-blue-500 hover:text-blue-700">Sign up</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { account } from '~/utils/appwrite'

const showLoginDialog = useState('showLoginDialog')
const isAuthenticated = useState('isAuthenticated')
const email = ref('')
const password = ref('')

const closeDialog = () => {
  showLoginDialog.value = false
}

const login = async () => {
  try {
    if (!email.value || !password.value) {
      alert('Please enter both email and password')
      return
    }
    
    // Login with Appwrite
    await account.createEmailPasswordSession(email.value, password.value)
    
    // Update authentication state
    isAuthenticated.value = true
    showLoginDialog.value = false
    
    // Optional: Show success notification
    alert('Login successful!')
  } catch (error) {
    console.error('Login error:', error)
    alert('Login failed. Please check your credentials and try again.')
  }
}
</script> 