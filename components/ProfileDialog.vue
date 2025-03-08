<template>
    <div v-if="show" class="fixed inset-0 bg-black/80  flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 class="text-xl font-bold mb-4">Complete Your Profile</h2>
            <p class="mb-4 text-gray-600">Please complete your profile before creating posts.</p>

            <form @submit.prevent="saveProfile">
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Name*</label>
                    <input v-model="profile.name" type="text" required class="w-full px-3 py-2 border rounded-md">
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Username*</label>
                    <input v-model="profile.username" type="text" required class="w-full px-3 py-2 border rounded-md">
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea v-model="profile.bio" class="w-full px-3 py-2 border rounded-md"></textarea>
                </div>

                <div class="mb-4">
                    <div v-if="coverImagePreview" class="mb-3">
                        <img :src="coverImagePreview" alt="Cover image preview"
                            class="w-full h-48 object-cover rounded-lg" />
                        <button @click="removeCoverImage" class="mt-2 text-red-500 text-sm flex items-center">
                            <Icon name="solar:trash-bin-trash-bold" class="mr-1" />
                            Remove image
                        </button>
                    </div>
                    <div v-else
                        class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition cursor-pointer"
                        @click="$refs.coverImageInput.click()">
                        <Icon name="solar:gallery-add-bold" class="text-3xl text-gray-400 mb-2" />
                        <p class="text-gray-500">Click to upload a cover image</p>
                        <p class="text-xs text-gray-400 mt-1">Recommended: 1200×630px, JPG or PNG</p>
                    </div>

                    <input ref="coverImageInput" type="file" accept="image/*" class="hidden"
                        @change="uploadCoverImage" />
                </div>

                <div class="flex justify-end space-x-2">
                    <button type="button" @click="$emit('close')" class="px-4 py-2 border rounded-md text-gray-700">
                        Cancel
                    </button>
                    <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md" :disabled="isSubmitting">
                        {{ isSubmitting ? 'Saving...' : 'Save Profile' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { account, databases, storage } from '~/utils/appwrite';
import { DATABASE_ID, USERS_COLLECTION_ID, STORAGE_BUCKET_ID } from '~/utils/appwrite';

const props = defineProps({
    show: Boolean
});

const emit = defineEmits(['close', 'profile-saved']);
const isSubmitting = ref(false);

const profile = reactive({
    name: '',
    username: '',
    bio: '',
    profileImage: ''
});
const coverImageFile = ref(null);
const coverImagePreview = ref(null);
const uploadCoverImage = (event) => {
    // console.log(event)
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.includes('image/')) {
        alert('Please upload an image file');
        return;
    }

    coverImageFile.value = file;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
        coverImagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
};
const uploadCoverImageToStorage = async (file) => {
    try {
        const response = await storage.createFile(
            STORAGE_BUCKET_ID,
            ID.unique(),
            file
        );
        // console.log('Cover image uploaded successfully:', response);
        return response.$id; // Return the file ID for reference in the post
    } catch (error) {
        console.error('Error uploading cover image:', error);
        throw error;
    }
}
const saveProfile = async () => {
    try {
        isSubmitting.value = true;

        // Get current user
        const session = await account.getSession('current');

        if (!session) {
            throw new Error('Not authenticated');
        }

        // Check if profile already exists
        const response = await databases.listDocuments(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            [`$id=${session.userId}`]
        ).catch(error => {
            console.error('Error fetching profile:', error);
        });
        const coverImageId = await uploadCoverImageToStorage(coverImageFile.value);
        const profileData = {
            name: profile.name,
            username: profile.username,
            email: session.providerUid,
            bio: profile.bio || '',
            profileImage: `https://appwrite-os08sgw04g4swk0s8owwoooc.beamzy.net/v1/storage/buckets/67c9dbab003009fc0a92/files/${coverImageId}/view?project=project-x&project=project-x`,
            createdAt: new Date()
        };
        // console.log(profileData)
        // console.log(response)
        if (response && response.documents && response.documents.length > 0) {
            // Update existing profile
            await databases.updateDocument(
                DATABASE_ID,
                USERS_COLLECTION_ID,
                session.userId,
                profileData
            );
        } else {
            // Create new profile
            await databases.createDocument(
                DATABASE_ID,
                USERS_COLLECTION_ID,
                session.userId,
                profileData
            );
        }

        emit('profile-saved');
        emit('close');

        // Refresh the page to update the UI
        window.location.reload();
    } catch (error) {
        console.error('Error saving profile:', error);
        alert('Failed to save profile. Please try again.');
    } finally {
        isSubmitting.value = false;
    }
};
</script>