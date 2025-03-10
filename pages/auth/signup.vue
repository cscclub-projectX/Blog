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

      <!-- Step Indicator -->
      <div class="flex items-center justify-center mb-6">
        <div class="flex items-center">
          <div class="flex items-center justify-center w-8 h-8 rounded-full" 
               :class="currentStep === 1 ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'">
            1
          </div>
          <div class="w-16 h-1" :class="currentStep === 1 ? 'bg-gray-300' : 'bg-black'"></div>
          <div class="flex items-center justify-center w-8 h-8 rounded-full"
               :class="currentStep === 2 ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'">
            2
          </div>
        </div>
      </div>

      <!-- Step 1: Account Creation -->
      <div v-if="currentStep === 1">
        <h2 class="text-3xl font-bold mb-6 text-gray-800">Sign Up</h2>
        <form @submit.prevent="goToStep2" class="space-y-4">
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
            <p class="text-xs text-gray-500 mt-1">At least 8 characters with letters and numbers</p>
          </div>

          <!-- Confirm Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <div class="relative">
              <input 
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                class="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
                required
              />
              <button 
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500"
              >
                <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>

          <div class="flex items-center">
            <input type="checkbox" id="terms" v-model="agreeToTerms" class="h-4 w-4 text-blue-600 rounded" required />
            <label for="terms" class="ml-2 text-sm text-gray-600">
              I agree to the <a href="#" class="text-blue-500">Terms of Service</a> and <a href="#" class="text-blue-500">Privacy Policy</a>
            </label>
          </div>

          <!-- Continue Button -->
          <button 
            type="submit"
            class="w-full bg-black text-white py-2 px-4 rounded-full hover:bg-gray-800 transition"
            :disabled="!agreeToTerms"
            :class="{ 'opacity-50 cursor-not-allowed': !agreeToTerms }"
          >
            Continue
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
          <button 
            @click="signInWithGoogle"
            type="button"
            class="w-full flex items-center justify-center gap-3 border border-gray-300 py-2 px-4 rounded-full hover:bg-gray-50 transition"
          >
            <i class="fab fa-google text-xl"></i>
            <span class="font-medium text-gray-700">Sign up with Google</span>
          </button>
          
          <!-- Facebook Button -->
          <button 
            @click="signInWithFacebook"
            type="button"
            class="w-full flex items-center justify-center gap-3 border border-gray-300 py-2 px-4 rounded-full hover:bg-gray-50 transition"
          >
            <i class="fab fa-facebook text-xl text-[#1877f2]"></i>
            <span class="font-medium text-gray-700">Sign up with Facebook</span>
          </button>
        </div>

        <!-- Login Link -->
        <div class="mt-6 text-center">
          <p class="text-gray-600">
            Already have an account?
            <NuxtLink 
              to="/auth/login" 
              class="text-green-600 hover:text-green-700 font-medium ml-1"
            >
              Sign in
            </NuxtLink>
          </p>
        </div>
      </div>

      <!-- Step 2: Profile Setup -->
      <div v-if="currentStep === 2">
        <h2 class="text-3xl font-bold mb-6 text-gray-800">Complete Your Profile</h2>
        <form @submit.prevent="handleSignup" class="space-y-4">
          <!-- Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name*</label>
            <input 
              v-model="name" 
              type="text" 
              class="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your Name"
              required
            />
          </div>
          
          <!-- Username -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Username*</label>
            <input 
              v-model="username" 
              type="text" 
              class="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="username"
              required
            />
          </div>

          <!-- Bio -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea 
              v-model="bio" 
              class="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tell us about yourself"
              rows="3"
            ></textarea>
          </div>

          <!-- Profile Image Upload -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
            <div v-if="profileImagePreview" class="mb-3">
              <img :src="profileImagePreview" alt="Profile image preview"
                class="w-32 h-32 object-cover rounded-full mx-auto" />
              <button @click="removeProfileImage" type="button" class="mt-2 text-red-500 text-sm flex items-center mx-auto">
                <i class="fas fa-trash mr-1"></i>
                Remove image
              </button>
            </div>
            <div v-else
              class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition cursor-pointer"
              @click="$refs.profileImageInput.click()">
              <i class="fas fa-camera text-3xl text-gray-400 mb-2"></i>
              <p class="text-gray-500">Click to upload a profile image</p>
              <p class="text-xs text-gray-400 mt-1">Recommended: Square image, JPG or PNG</p>
            </div>
            <input ref="profileImageInput" type="file" accept="image/*" class="hidden"
              @change="uploadProfileImage" />
          </div>

          <!-- Buttons -->
          <div class="flex gap-3">
            <button 
              type="button"
              @click="currentStep = 1"
              class="w-1/3 border border-gray-300 text-gray-700 py-2 px-4 rounded-full hover:bg-gray-50 transition"
            >
              Back
            </button>
            <button 
              type="submit"
              class="w-2/3 bg-black text-white py-2 px-4 rounded-full hover:bg-gray-800 transition"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? 'Creating Account...' : 'Create Account' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { account, databases, storage, ID, DATABASE_ID, USERS_COLLECTION_ID, STORAGE_BUCKET_ID } from '~/utils/appwrite';

// State variables
const currentStep = ref(1);
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const name = ref('');
const username = ref('');
const bio = ref('');
const agreeToTerms = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const errorMessage = ref('');
const isSubmitting = ref(false);

// Profile image handling
const profileImageFile = ref(null);
const profileImagePreview = ref(null);

// Auth state
const isAuthenticated = useState('isAuthenticated');
const currentUser = useState('currentUser', () => null);
const Profile = useState('Profile', () => null);

const uploadProfileImage = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.includes('image/')) {
    errorMessage.value = 'Please upload an image file';
    return;
  }

  profileImageFile.value = file;

  // Create preview
  const reader = new FileReader();
  reader.onload = (e) => {
    profileImagePreview.value = e.target.result;
  };
  reader.readAsDataURL(file);
};

const removeProfileImage = () => {
  profileImageFile.value = null;
  profileImagePreview.value = null;
};

const goToStep2 = () => {
  try {
    // Validate step 1
    if (!email.value || !password.value || !confirmPassword.value) {
      errorMessage.value = 'Please fill in all required fields';
      return;
    }
    
    if (password.value !== confirmPassword.value) {
      errorMessage.value = 'Passwords do not match';
      return;
    }
    
    if (password.value.length < 8) {
      errorMessage.value = 'Password must be at least 8 characters long';
      return;
    }
    
    if (!agreeToTerms.value) {
      errorMessage.value = 'You must agree to the Terms of Service';
      return;
    }
    
    // Clear any previous error
    errorMessage.value = '';
    
    // Move to step 2
    currentStep.value = 2;
  } catch (error) {
    errorMessage.value = error.message;
  }
};

// Upload profile image to Appwrite storage
const uploadProfileImageToStorage = async (file) => {
  try {
    const response = await storage.createFile(
      STORAGE_BUCKET_ID,
      ID.unique(),
      file
    );
    return response.$id; // Return the file ID
  } catch (error) {
    console.error('Error uploading profile image:', error);
    throw error;
  }
};

// Sign up with email/password
const handleSignup = async () => {
  try {
    isSubmitting.value = true;
    errorMessage.value = '';
    
    // Validate step 2
    if (!name.value || !username.value) {
      throw new Error('Please fill in all required fields');
    }
    
    if (username.value.length < 3) {
      throw new Error('Username must be at least 3 characters long');
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(username.value)) {
      throw new Error('Username can only contain letters, numbers, and underscores');
    }

    // 1. Create the user account with Appwrite
    const userId = ID.unique();
    const user = await account.create(
      userId,
      email.value,
      password.value,
      name.value
    );
    
    // 2. Log the user in
    await account.createEmailPasswordSession(email.value, password.value);
    
    // 3. Upload profile image if provided
    let profileImageUrl = null; // Default image
    
    if (profileImageFile.value) {
      const fileId = await uploadProfileImageToStorage(profileImageFile.value);
      profileImageUrl = `https://appwrite-os08sgw04g4swk0s8owwoooc.beamzy.net/v1/storage/buckets/${STORAGE_BUCKET_ID}/files/${fileId}/view?project=project-x&project=project-x`;
    }
    
    // 4. Create user profile in database
    const profile = await databases.createDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      userId, // Use the user ID as the document ID
      {
        name: name.value,
        username: username.value,
        email: email.value,
        bio: bio.value || '',
        profileImage: profileImageUrl,
        createdAt: new Date().toISOString()
      }
    );
    
    // 5. Update application state
    currentUser.value = user;
    Profile.value = profile;
    isAuthenticated.value = true;
    
    // 6. Redirect to home page or dashboard
    navigateTo('/');
    
  } catch (error) {
    console.error('Signup error:', error);
    if (error.message.includes('already exists')) {
      errorMessage.value = 'An account with this email already exists';
    } else {
      errorMessage.value = error.message || 'Failed to create account. Please try again.';
    }
  } finally {
    isSubmitting.value = false;
  }
};

// Social login methods
const signInWithGoogle = async () => {
  try {
    // Create OAuth2 session with Google
    account.createOAuth2Session('google', 
      window.location.origin + '/', // Success URL (redirect to home after success)
      window.location.origin + '/auth/login?error=oauth-failed' // Failure URL
    );
  } catch (error) {
    console.error('Google sign-in error:', error);
    errorMessage.value = 'Failed to sign in with Google. Please try again.';
  }
};

const signInWithFacebook = async () => {
  try {
    // Create OAuth2 session with Facebook
    account.createOAuth2Session('facebook',
      window.location.origin + '/', // Success URL
      window.location.origin + '/auth/login?error=oauth-failed' // Failure URL
    );
  } catch (error) {
    console.error('Facebook sign-in error:', error);
    errorMessage.value = 'Failed to sign in with Facebook. Please try again.';
  }
};
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

