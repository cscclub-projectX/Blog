<template>
    <div class="bg-blue-100 p-4 rounded-2xl  mb-4">
        <h2 class="text-lg font-semibold mb-2">Create a New Post</h2>

        <div class="flex items-center   rounded-2xl bg-white mb-4 relative">
            <NuxtImg src="/images/image.webp" alt="User Avatar" class="w-10 h-10 rounded-full m-2" />
            <input v-model="postTitle" type="text" placeholder="Title of your post..."
                class="flex-1 p-2 bg-white border-none  focus:outline-none rounded-2xl" />
            <button @click="toggleVisibility" class="p-2 text-gray-600 hover:text-gray-800">
                <Icon name="solar:share-circle-bold-duotone"  class="text-3xl"></Icon> <!-- Default icon for visibility -->
            </button>
            <div v-if="isVisibilityOpen" class="absolute right-1 bg-gray-100  rounded-2xl p-2 flex space-x-3">
                <button @click="setVisibility('public')" class="flex items-center text-gray-600 hover:text-gray-800">
                    <Icon name="solar:earth-bold" class="text-2xl"></Icon> <!-- Earth Icon for Public -->
                </button>
                <button @click="setVisibility('friends')" class="flex items-center text-gray-600 hover:text-gray-800">
                    <Icon name="solar:users-group-two-rounded-bold-duotone" class="text-2xl"></Icon>
                    <!-- Friends Icon -->
                </button>
                <button @click="setVisibility('onlyMe')" class="flex items-center text-gray-600 hover:text-gray-800">
                    <Icon name="solar:lock-password-bold-duotone" class="text-2xl"></Icon>
                    <!-- Lock Icon for Only Me -->
                </button>
            </div>
        </div>

        <textarea v-model="postContent" placeholder="Write your content here..."
            class="w-full p-2 border border-blue-200 rounded-2xl resize-none bg-gray-50 text-gray-800 placeholder-gray-400"
            rows="6"></textarea>

        <div class="flex items-center justify-end mt-2">


            <button @click="submitPost" class="bg-blue-400 text-white px-4 py-2 rounded-2xl w-24 hover:bg-blue-600">
                Post
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'NewPost',
    data() {
        return {
            postTitle: '',
            postContent: '',
            isVisibilityOpen: false,
            visibility: 'public' // Default visibility
        }
    },
    methods: {
        toggleVisibility() {
            this.isVisibilityOpen = !this.isVisibilityOpen;
        },
        setVisibility(option) {
            this.visibility = option;
            this.isVisibilityOpen = false; // Close the visibility options after selection
            console.log('Visibility set to:', this.visibility);
        },
        submitPost() {
            if (this.postTitle.trim() && this.postContent.trim()) {
                // Logic to handle post submission (e.g., API call)
                console.log('New Post:', { title: this.postTitle, content: this.postContent, visibility: this.visibility });
                this.postTitle = ''; // Clear the title input after submission
                this.postContent = ''; // Clear the content after submission
            }
        }
    }
}
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
