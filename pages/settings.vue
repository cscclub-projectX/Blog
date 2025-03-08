<template>
  <div class="p-4 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Account Settings</h1>
    
    <div class="bg-white rounded-2xl p-6">
      <form @submit.prevent="updateProfile">
        <!-- Profile Image Section -->
        <div class="mb-6 flex flex-col items-center">
          <div class="relative mb-4">
            <img 
              :src="profileData.profileImage || 'https://via.placeholder.com/150'" 
              alt="Profile" 
              class="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
            />
            <button 
              type="button"
              @click="$refs.profileImageInput.click()" 
              class="absolute bottom-0 right-0 bg-blue-500 text-white px-2 pt-2 pb-1 rounded-2xl  hover:bg-blue-600"
            >
              <Icon name="solar:camera-bold" class="text-lg" />
            </button>
          </div>
          <input 
            ref="profileImageInput" 
            type="file" 
            accept="image/*" 
            class="hidden" 
            @change="handleProfileImageUpload" 
          />
        </div>
        
        <!-- Profile Information -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name*</label>
            <input 
              v-model="profileData.name" 
              type="text" 
              required 
              class="w-full px-4 py-2 border rounded-xl focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Username*</label>
            <input 
              v-model="profileData.username" 
              type="text" 
              required 
              class="w-full px-4 py-2 border rounded-xl focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">Email</label>
            <input 
              v-model="profileData.email" 
              type="email" 
              disabled
              class="w-full px-4 py-2 border rounded-xl bg-gray-100 text-gray-500 "
            />
            <p class="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea 
              v-model="profileData.bio" 
              rows="4" 
              class="w-full px-4 py-2 border rounded-xl focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tell us about yourself..."
            ></textarea>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex justify-end mt-6 space-x-3">
          <button 
            type="button" 
            @click="resetForm" 
            class="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            class="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>
    
    <!-- Success/Error Messages -->
    <div v-if="message" :class="`mt-4 p-3 rounded-xl ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['auth']
});
import { ref, onMounted, reactive } from 'vue';
import { client, ID } from '~/utils/appwrite';
import { Databases, Storage } from 'appwrite';
import { DATABASE_ID, USERS_COLLECTION_ID, STORAGE_BUCKET_ID } from '~/utils/appwrite';

// Initialize Appwrite services
const databases = new Databases(client);
const storage = new Storage(client);

// Use the shared state
const currentUser = useState('currentUser', () => null);
const Profile = useState('Profile', () => null);

// Form state
const profileData = reactive({
  name: '',
  username: '',
  email: '',
  bio: '',
  profileImage: ''
});

const isSubmitting = ref(false);
const message = ref('');
const messageType = ref('');
const newProfileImage = ref(null);

// Load user data on component mount
onMounted(() => {
  if (Profile.value) {
    profileData.name = Profile.value.name || '';
    profileData.username = Profile.value.username || '';
    profileData.email = Profile.value.email || '';
    profileData.bio = Profile.value.bio || '';
    profileData.profileImage = Profile.value.profileImage || '';
  }
});

// Handle profile image upload
const handleProfileImageUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  if (!file.type.includes('image/')) {
    message.value = 'Please upload an image file';
    messageType.value = 'error';
    return;
  }
  
  // Store the file for later upload
  newProfileImage.value = file;
  
  // Create preview
  const reader = new FileReader();
  reader.onload = (e) => {
    profileData.profileImage = e.target.result;
  };
  reader.readAsDataURL(file);
};

// Upload profile image to storage
const uploadProfileImage = async (file) => {
  try {
    const response = await storage.createFile(
      STORAGE_BUCKET_ID,
      ID.unique(),
      file
    );
    return `https://appwrite-os08sgw04g4swk0s8owwoooc.beamzy.net/v1/storage/buckets/${STORAGE_BUCKET_ID}/files/${response.$id}/view?project=project-x`;
  } catch (error) {
    console.error('Error uploading profile image:', error);
    throw error;
  }
};

// Update profile
const updateProfile = async () => {
  try {
    isSubmitting.value = true;
    message.value = '';
    
    if (!currentUser.value || !currentUser.value.$id) {
      throw new Error('User not authenticated');
    }
    
    let profileImageUrl = profileData.profileImage;
    
    // Upload new profile image if selected
    if (newProfileImage.value) {
      profileImageUrl = await uploadProfileImage(newProfileImage.value);
    }
    
    // Update profile in database
    const updatedProfile = await databases.updateDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      currentUser.value.$id,
      {
        name: profileData.name,
        username: profileData.username,
        bio: profileData.bio,
        profileImage: profileImageUrl,
        // Don't update email as it's managed by auth system
      }
    );
    
    // Update local state
    Profile.value = updatedProfile;
    
    message.value = 'Profile updated successfully!';
    messageType.value = 'success';
    newProfileImage.value = null;
    
  } catch (error) {
    console.error('Error updating profile:', error);
    message.value = 'Failed to update profile. Please try again.';
    messageType.value = 'error';
  } finally {
    isSubmitting.value = false;
  }
};

// Reset form to original values
const resetForm = () => {
  if (Profile.value) {
    profileData.name = Profile.value.name || '';
    profileData.username = Profile.value.username || '';
    profileData.email = Profile.value.email || '';
    profileData.bio = Profile.value.bio || '';
    profileData.profileImage = Profile.value.profileImage || '';
  }
  newProfileImage.value = null;
  message.value = '';
};
</script> 