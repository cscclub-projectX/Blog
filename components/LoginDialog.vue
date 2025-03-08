<template>
  <div v-if="showLoginDialog" class="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">{{ isLoginMode ? 'Login Required' : 'Create Account' }}</h2>
        <button @click="closeDialog" class="text-gray-500 hover:text-gray-700">
          <Icon name="solar:close-circle-bold" class="text-2xl" />
        </button>
      </div>
      
      <p class="mb-4 text-gray-600">
        {{ isLoginMode ? 'Please login to continue using all features of the application.' : 'Sign up to join our community and start sharing your thoughts.' }}
      </p>
      
      <!-- Login Form -->
      <div v-if="isLoginMode" class="space-y-4">
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
          :disabled="isLoading"
          class="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
        >
          {{ isLoading ? 'Processing...' : 'Login' }}
        </button>
        
        <div class="text-center text-sm text-gray-600">
          Don't have an account? 
          <button @click="toggleMode" class="text-blue-500 hover:text-blue-700">Sign up</button>
        </div>
      </div>
      
      <!-- Signup Form -->
      <div v-else class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email*</label>
          <input 
            v-model="email" 
            type="email" 
            class="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="your@email.com"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password*</label>
          <input 
            v-model="password" 
            type="password" 
            class="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="••••••••"
          />
          <p class="text-xs text-gray-500 mt-1">At least 8 characters with letters and numbers</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Password*</label>
          <input 
            v-model="confirmPassword" 
            type="password" 
            class="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="••••••••"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Name*</label>
          <input 
            v-model="name" 
            type="text" 
            class="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Your Name"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Username*</label>
          <input 
            v-model="username" 
            type="text" 
            class="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="username"
          />
        </div>
        
        <div class="flex items-center">
          <input type="checkbox" id="terms" v-model="agreeToTerms" class="h-4 w-4 text-blue-600 rounded" />
          <label for="terms" class="ml-2 text-sm text-gray-600">
            I agree to the <a href="#" class="text-blue-500">Terms of Service</a> and <a href="#" class="text-blue-500">Privacy Policy</a>
          </label>
        </div>
        
        <button 
          @click="signup" 
          :disabled="isLoading || !agreeToTerms"
          class="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
          :class="{ 'opacity-50 cursor-not-allowed': !agreeToTerms }"
        >
          {{ isLoading ? 'Processing...' : 'Create Account' }}
        </button>
        
        <div class="text-center text-sm text-gray-600">
          Already have an account? 
          <button @click="toggleMode" class="text-blue-500 hover:text-blue-700">Login</button>
        </div>
      </div>
      
      <!-- Error Message -->
      <div v-if="errorMessage" class="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { account, databases, ID } from '~/utils/appwrite'
import { DATABASE_ID, USERS_COLLECTION_ID } from '~/utils/appwrite'

const showLoginDialog = useState('showLoginDialog')
const isAuthenticated = useState('isAuthenticated')
const currentUser = useState('currentUser', () => null)
const Profile = useState('Profile', () => null)

// Form fields
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const name = ref('')
const username = ref('')
const agreeToTerms = ref(false)

// UI state
const isLoginMode = ref(true)
const isLoading = ref(false)
const errorMessage = ref('')

const closeDialog = () => {
  showLoginDialog.value = false
  resetForm()
}

const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value
  resetForm()
}

const resetForm = () => {
  email.value = ''
  password.value = ''
  confirmPassword.value = ''
  name.value = ''
  username.value = ''
  agreeToTerms.value = false
  errorMessage.value = ''
}

const login = async () => {
  try {
    if (!email.value || !password.value) {
      errorMessage.value = 'Please enter both email and password'
      return
    }
    
    isLoading.value = true
    errorMessage.value = ''
    
    // Login with Appwrite
    const session = await account.createEmailSession(email.value, password.value)
    
    // Get user account info
    const user = await account.get()
    currentUser.value = user
    
    // Check if user has a profile
    await fetchUserProfile(user.$id)
    
    // Update authentication state
    isAuthenticated.value = true
    showLoginDialog.value = false
    
    // Reset form
    resetForm()
    
  } catch (error) {
    console.error('Login error:', error)
    errorMessage.value = 'Login failed. Please check your credentials and try again.'
  } finally {
    isLoading.value = false
  }
}

const signup = async () => {
  try {
    // Validate form
    if (!email.value || !password.value || !confirmPassword.value || !name.value || !username.value) {
      errorMessage.value = 'Please fill in all required fields'
      return
    }
    
    if (password.value !== confirmPassword.value) {
      errorMessage.value = 'Passwords do not match'
      return
    }
    
    if (password.value.length < 8) {
      errorMessage.value = 'Password must be at least 8 characters long'
      return
    }
    
    if (!agreeToTerms.value) {
      errorMessage.value = 'You must agree to the Terms of Service'
      return
    }
    
    isLoading.value = true
    errorMessage.value = ''
    
    // Create user account
    const user = await account.create(
      ID.unique(),
      email.value,
      password.value,
      name.value
    )
    
    // Login the user
    await account.createEmailPasswordSession(email.value, password.value)
    
    // Create user profile in database
    const profile = await databases.createDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      user.$id, // Use the user ID as the document ID
      {
        name: name.value,
        username: username.value,
        email: email.value,
        bio: '',
        profileImage: 'https://via.placeholder.com/150',
        createdAt: new Date().toISOString()
      }
    )
    
    // Update state
    currentUser.value = user
    Profile.value = profile
    isAuthenticated.value = true
    showLoginDialog.value = false
    
    // Reset form
    resetForm()
    
  } catch (error) {
    console.error('Signup error:', error)
    if (error.message.includes('already exists')) {
      errorMessage.value = 'An account with this email already exists'
    } else {
      errorMessage.value = 'Failed to create account. Please try again.'
    }
  } finally {
    isLoading.value = false
  }
}

// Fetch user profile from database
const fetchUserProfile = async (userId) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [`$id=${userId}`]
    )
    
    if (response.documents.length > 0) {
      Profile.value = response.documents[0]
    } else {
      // No profile found, might want to redirect to profile creation
      Profile.value = null
    }
  } catch (error) {
    console.error('Error fetching user profile:', error)
  }
}
</script> 