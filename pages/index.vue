<template>
    <div class="p-4">
        <!-- Login Dialog -->
        <LoginDialog />
        
        <!-- New Post Component -->
        <NewPost />
        
        <!-- Feed Section -->
        <div class="space-y-4">
            <div v-if="isLoading" class="text-center py-4">
                <p>Loading posts...</p>
            </div>
            <div v-else-if="error" class="text-center py-4 text-red-500">
                <p>{{ error }}</p>
            </div>
            <div v-else-if="featuredPosts.length === 0" class="text-center py-4">
                <p>No posts found.</p>
            </div>
            <div v-else v-for="post in featuredPosts" :key="post.id" class="bg-white p-4 rounded-lg shadow-md">
                <div class="flex items-center mb-2">
                    <img :src="post.authorAvatar" alt="Author" class="w-8 h-8 rounded-full mr-2" />
                    <span class="font-medium">{{ post.author }}</span>
                </div>
                <h3 class="font-semibold">{{ post.title }}</h3>
                <MDC :value="post.excerpt" tag="article" />
                <img v-if="post.banner" :src="post.banner" alt="Post banner" class="w-full h-40 object-cover mt-2 rounded-lg" />
            </div>
        </div>
    </div>
</template>

<script setup>
import NewPost from '@/components/NewPost.vue';
import LoginDialog from '@/components/LoginDialog.vue';
import { ref, onMounted } from 'vue';
import { account, databases } from '~/utils/appwrite';
import { Query } from 'appwrite';
import { DATABASE_ID, POSTS_COLLECTION_ID } from '~/utils/appwrite';

// Define middleware
definePageMeta({
  middleware: ['auth']
});

// const isAuthenticated = useState('isAuthenticated', () => false);

// // Check authentication status on page load
// onMounted(async () => {
//   try {
//     const session = await account.getSession('current');
//     if (session) {
//       isAuthenticated.value = true;
//     }
//   } catch (error) {
//     console.log('No active session');
//     isAuthenticated.value = false;
//   }
// });

const featuredPosts = ref([]);
const isLoading = ref(true);
const error = ref(null);

// Fetch posts from Appwrite on component mount
onMounted(async () => {
  try {
    isLoading.value = true;
    
    // Replace these values with your actual database and collection IDs
    const databaseId = DATABASE_ID;
    const collectionId = POSTS_COLLECTION_ID;
    
    const response = await databases.listDocuments(
      databaseId,
      collectionId,
      [
        Query.orderDesc('createdAt'), // Sort by creation date, newest first
        Query.limit(10) // Limit to 10 posts
      ]
    );
    
    featuredPosts.value = response.documents.map(doc => ({
      id: doc.$id,
      author: doc.authorName || 'Anonymous', // Adjust based on your schema
      authorAvatar: doc.authorAvatar || 'https://via.placeholder.com/150', // Default avatar if none exists
      title: doc.title,
      excerpt: doc.Markdown ? doc.Markdown.substring(0, 200) + '...' : '', // First 200 chars of content
      banner: doc.coverImage || null,
      // Add any other fields you need
    }));
    
    isLoading.value = false;
  } catch (err) {
    console.error('Error fetching posts:', err);
    error.value = 'Failed to load posts';
    isLoading.value = false;
  }
});
</script>

<style scoped>
/* Additional styles can be added here */
</style>