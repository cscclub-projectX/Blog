<template>
    <div class="bg-blue-100 p-4 rounded-2xl  mb-4">
        <h2 class="text-lg font-semibold mb-2">Create a New Post</h2>

        <div class="flex items-center   rounded-2xl bg-white mb-4 relative">
            <NuxtImg src="/images/image.webp" alt="User Avatar" class="w-10 h-10 rounded-full m-2" />
            <input v-model="postTitle" type="text" placeholder="Title of your post..."
                class="flex-1 p-2 bg-white border-none  focus:outline-none rounded-2xl" />
            <button @click="toggleVisibility" class="p-2 text-gray-600 hover:text-gray-800">
                <i class="fas fa-share-alt text-xl"></i>
            </button>
            <div v-if="isVisibilityOpen" class="absolute right-1 bg-gray-100  rounded-2xl p-2 flex space-x-3">
                <button @click="setVisibility('public')" class="flex items-center text-gray-600 hover:text-gray-800">
                    <i class="fas fa-globe text-xl"></i>
                </button>
                <button @click="setVisibility('friends')" class="flex items-center text-gray-600 hover:text-gray-800">
                    <i class="fas fa-users text-xl"></i>
                </button>
                <button @click="setVisibility('onlyMe')" class="flex items-center text-gray-600 hover:text-gray-800">
                    <i class="fas fa-lock text-xl"></i>
                </button>
            </div>
        </div>

        <!-- Markdown Editor -->
        <textarea
            v-model="postContent"
            placeholder="Write your post in markdown..."
            class="w-full h-48 p-4 bg-white border rounded-2xl focus:outline-none focus:border-blue-400 resize-none"
        ></textarea>

        <div class="flex items-center justify-end mt-2">


            <button @click="submitPost" class="bg-blue-400 text-white px-4 py-2 rounded-2xl w-24 hover:bg-blue-600">
                Post
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
const postTitle = ref('');
const postContent = ref('');
const isVisibilityOpen = ref(false);
const visibility = ref('public'); // Default visibility

const toggleVisibility = () => {
    isVisibilityOpen.value = !isVisibilityOpen.value;
};

const setVisibility = (option) => {
    visibility.value = option;
    isVisibilityOpen.value = false; // Close the visibility options after selection
    console.log('Visibility set to:', visibility.value);
};

const submitPost = () => {
    if (postTitle.value.trim() && postContent.value.trim()) {
        // Logic to handle post submission (e.g., API call)
        console.log('New Post:', { title: postTitle.value, content: postContent.value, visibility: visibility.value });
        postTitle.value = ''; // Clear the title input after submission
        postContent.value = ''; // Clear the content after submission
    }
};
</script>

<style scoped>
/* Additional styles can be added here */
textarea {
    transition: border-color 0.2s;
}

textarea:focus {
    border-color: #4A90E2;
    /* Change border color on focus */
    outline: none;
}
</style>
