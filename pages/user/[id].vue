<template>
  <div class="max-w-4xl mx-auto">
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <div v-else>
      <!-- Cover Image -->
      <div class="h-48 bg-gray-200 relative  rounded-2xl">
        <img 
          :src="user?.coverImage" 
          class="w-full h-full object-cover  rounded-2xl"
          alt="Cover image"
        >
      </div>

      <div class="px-4">
        <!-- Profile Header -->
        <div class="relative">
          <img 
            :src="user?.profileImage" 
            :alt="user?.name"
            class="absolute -top-16 w-32 h-32 rounded-full border-4 border-white object-cover"
          >
        </div>

        <div class="pt-20 pb-2 flex justify-between items-start">
          <div>
            <h1 class="text-xl font-bold">{{ user?.name }}</h1>
            <p class="text-gray-600">@{{ user?.username }}</p>
          </div>
          
          <!-- Edit/Follow Button -->
          <button 
            v-if="isCurrentUser"
            @click="editProfile"
            class="px-4 py-2 border border-gray-300 font-semibold rounded-full hover:bg-gray-100 cursor-pointer transition-colors"
          >
            Edit profile
          </button>
          <button 
            v-else
            @click="toggleFollow"
            :class="[
              'px-4 py-2 rounded-full font-semibold cursor-pointer transition-colors',
              isFollowing 
                ? 'border border-gray-300 hover:border-red-300 hover:text-red-600 hover:bg-red-50' 
                : 'bg-black text-white hover:bg-gray-800'
            ]"
          >
            {{ isFollowing ? 'Following' : 'Follow' }}
          </button>
        </div>

        <!-- Bio -->
        <p class="text-gray-500 mb-1 max-w-lg mt-2">About</p>
        <p class="text-gray-800 mb-1 max-w-lg mb-4">{{ user?.bio || 'No bio available' }}</p>

        <!-- User Stats -->
        <div class="flex space-x-3 text-gray-600 mb-4">
          <div class="flex items-center">
            <span class="font-bold text-black hover:underline cursor-pointer">{{ user?.following || 0 }}</span>
            <span class="ml-1">Following</span>
          </div>
          <span class="text-gray-800">•</span>
          <div class="flex items-center">
            <span class="font-bold text-black hover:underline cursor-pointer">{{ user?.followers || 0 }}</span>
            <span class="ml-1">Followers</span>
          </div>
        </div>
      </div>

      <!-- Posts Section -->
      <div class="border-t mt-4">
        <div class="border-b flex items-center justify-between px-4 py-3">
          <h1 class="font-semibold text-gray-900 w-1/3">
            Published Articles
          </h1>
          <div class="flex gap-3">
            <button 
              @click="toggleView('list')"
              :class="[
                'text-gray-500 hover:text-gray-900 cursor-pointer',
                { 'text-gray-900': !isGridView }
              ]"
            >
              <Icon name="solar:list-bold" class="text-lg" />
            </button>
            <button 
              @click="toggleView('grid')"
              :class="[
                'text-gray-500 hover:text-gray-900 cursor-pointer',
                { 'text-gray-900': isGridView }
              ]"
            >
              <Icon name="solar:squares-bold" class="text-lg" />
            </button>
          </div>
        </div>

        <!-- Posts List -->
        <div v-if="loadingPosts" class="py-8 flex justify-center">
          <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        
        <div v-else-if="posts.length === 0" class="py-8 text-center text-gray-600">
          <Icon name="solar:document-text-bold" class="text-4xl text-gray-400 mb-2" />
          <p>No posts yet</p>
        </div>
        
        <div :class="[
          isGridView ? 'grid grid-cols-1 md:grid-cols-2 gap-6 px-4 py-6 w-full' : 'divide-y'
        ]">
          <div v-for="post in posts" :key="post.id" :class="[
            isGridView ? 'bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-5 flex flex-col' : 'p-6 hover:bg-gray-50 transition-colors'
          ]">
            <!-- Post Header - Outside clickable area -->
            <div class="flex items-center space-x-2 mb-3">
              <img :src="user?.profileImage" class="w-8 h-8 rounded-full" :alt="user?.name">
              <div class="flex flex-col">
                <span class="font-medium text-sm">{{ user?.name }}</span>
                <div class="text-gray-500 text-xs">
                  <span>{{ formatDate(post.createdAt) }}</span>
                  <span> • </span>
                  <span>{{ calculateReadTime(post.excerpt) }} min read</span>
                </div>
              </div>
            </div>

            <!-- Clickable post content area -->
            <div 
              class="space-y-3 cursor-pointer rounded-lg flex-grow"
              @click="navigateToPost(post.id)"
            >
              <!-- Post Title -->
              <h3 class="text-xl font-bold leading-tight hover:text-blue-600 transition-colors">{{ post.title }}</h3>

              <!-- Post Content -->
              <p class="text-gray-600 line-clamp-3 text-sm">{{ post.excerpt }}</p>
              
              <!-- Post Image -->
              <div v-if="post.banner" class="w-full h-48 rounded-lg overflow-hidden mt-3">
                <img 
                  :src="post.banner" 
                  :alt="post.title"
                  class="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                >
              </div>
              
              <!-- Post Stats -->
              <div class="flex items-center text-sm text-gray-500 mt-4 pt-2 border-t border-gray-100">
                <div class="flex items-center mr-4">
                  <Icon name="solar:eye-bold" class="mr-1" />
                  <span>{{ formatNumber(post.views) }} views</span>
                </div>
                <div class="flex items-center">
                  <Icon name="solar:heart-bold" class="mr-1 text-red-500" />
                  <span>{{ formatNumber(post.likes) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { databases, DATABASE_ID, USERS_COLLECTION_ID, POSTS_COLLECTION_ID } from '~/utils/appwrite';
import { Query } from 'appwrite';

const route = useRoute();
const router = useRouter();
const currentUser = useState('currentUser', () => null);

const user = ref(null);
const loading = ref(true);
const loadingPosts = ref(true);
const posts = ref([]);
const isGridView = ref(false);

const isCurrentUser = computed(() => {
  return currentUser.value && user.value && currentUser.value.$id === user.value.$id;
});

const isFollowing = ref(false); // This would need to be implemented with actual following data

const fetchUser = async (userId) => {
  try {
    loading.value = true;
    
    const response = await databases.getDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      userId
    );
    
    user.value = response;
    
    // Initialize following stats if not present
    user.value.followers = user.value.followers || 0;
    user.value.following = user.value.following || 0;
    
  } catch (error) {
    console.error('Error fetching user:', error);
  } finally {
    loading.value = false;
  }
};

const fetchUserPosts = async (userId) => {
  try {
    loadingPosts.value = true;
    
    const response = await databases.listDocuments(
      DATABASE_ID,
      POSTS_COLLECTION_ID,
      [
        Query.equal('authorId', userId),
        Query.isNull('isDeletedAt'),
        Query.orderDesc('createdAt'),
        Query.limit(20)
      ]
    );
    
    posts.value = response.documents.map(doc => ({
      id: doc.$id,
      title: doc.title,
      excerpt: doc.Markdown ? doc.Markdown.substring(0, 150) + '...' : '',
      banner: doc.coverImage || null,
      createdAt: doc.createdAt,
      views: doc.views || 0,
      likes: doc.likes || 0
    }));
    
  } catch (error) {
    console.error('Error fetching user posts:', error);
  } finally {
    loadingPosts.value = false;
  }
};

const editProfile = () => {
  // Navigate to profile edit page
  router.push('/settings/profile');
};

const toggleFollow = () => {
  // This would need to be implemented with actual following functionality
  isFollowing.value = !isFollowing.value;
  if (user.value) {
    user.value.followers += isFollowing.value ? 1 : -1;
  }
};

const toggleView = (mode) => {
  isGridView.value = mode === 'grid';
};

const navigateToPost = (postId) => {
  router.push(`/post/${postId}`);
};

const calculateReadTime = (text) => {
  if (!text) return 1;
  // Average reading speed: 200 words per minute
  const wordCount = text.trim().split(/\s+/).length;
  const readTime = Math.ceil(wordCount / 200);
  return readTime < 1 ? 1 : readTime;
};

const formatNumber = (num) => {
  if (!num) return 0;
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 1) {
    return 'Today';
  } else if (diffDays <= 2) {
    return 'Yesterday';
  } else if (diffDays <= 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  }
};

onMounted(() => {
  const userId = route.params.id;
  fetchUser(userId);
  fetchUserPosts(userId);
});
</script>

<style scoped>
.hide-scrollbar {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.hide-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

button, a, img {
  transition: all 0.2s ease-in-out;
}
</style>
