<template>
  <div class="p-6 max-w-5xl mx-auto">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <h1 class="text-2xl font-bold text-gray-900">Your Stories</h1>
      
      <!-- Filter Tabs -->
      <div class="flex space-x-1 bg-gray-100 p-1 rounded-full">
        <button @click="filterPosts('all')" 
          :class="[activeFilter === 'all' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700', 
                  'px-4 py-2 rounded-full text-sm font-medium transition-colors']">
          All
        </button>
        <button @click="filterPosts('visible')" 
          :class="[activeFilter === 'visible' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700', 
                  'px-4 py-2 rounded-full text-sm font-medium transition-colors']">
          Published
        </button>
        <button @click="filterPosts('hidden')" 
          :class="[activeFilter === 'hidden' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700', 
                  'px-4 py-2 rounded-full text-sm font-medium transition-colors']">
          Private
        </button>
        <button @click="filterPosts('deleted')" 
          :class="[activeFilter === 'deleted' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700', 
                  'px-4 py-2 rounded-full text-sm font-medium transition-colors']">
          Trash
        </button>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-300"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="bg-red-50 text-red-700 p-4 rounded-lg border border-red-100">
      {{ error }}
    </div>

    <!-- Empty state -->
    <div v-else-if="filteredPosts.length === 0" class="bg-gray-50 p-8 rounded-lg text-center border border-gray-100">
      <Icon name="solar:document-text-bold" class="text-4xl text-gray-400 mb-2" />
      <p class="text-gray-600">No stories found</p>
      <button @click="navigateTo('/')" class="mt-4 px-4 py-2 bg-black text-white rounded-full text-sm hover:bg-gray-800 transition-colors">
        Write a story
      </button>
    </div>

    <!-- Posts list -->
    <div v-else class="space-y-4">
      <div v-for="post in filteredPosts" :key="post.id" 
        class="bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-sm transition-all duration-200">
        
        <!-- Card content -->
        <div class="flex flex-col md:flex-row">
          <!-- Post image (if available) -->
          <div v-if="post.banner" class="md:w-1/4 flex-shrink-0">
            <img :src="post.banner" alt="Post banner" 
              class="w-full h-40 md:h-full object-cover" :class="{'opacity-50': post.isDeletedAt}">
          </div>
          
          <!-- Post info -->
          <div class="p-5 flex-1" :class="{'opacity-70': post.isDeletedAt}">
            <!-- Status badges -->
            <div class="flex space-x-2 mb-3">
              <div v-if="post.isHidden" class="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                Private
              </div>
              <div v-if="post.isDeletedAt" class="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                Deleted
              </div>
              <div v-if="!post.isHidden && !post.isDeletedAt" class="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
                Published
              </div>
            </div>
            
            <h3 class="font-bold text-xl mb-2 line-clamp-2">{{ post.title }}</h3>
            <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ post.excerpt }}</p>
            
            <!-- Stats -->
            <div class="flex items-center text-sm text-gray-500 mb-4">
              <div class="flex items-center mr-4">
                <Icon name="solar:eye-bold" class="mr-1" />
                <span>{{ post.views }}</span>
              </div>
              <div class="flex items-center mr-4">
                <Icon name="solar:heart-bold" class="mr-1 text-red-500" />
                <span>{{ post.likes }}</span>
              </div>
              <span class="text-xs">{{ formatDate(post.createdAt) }}</span>
            </div>
            
            <!-- Action buttons -->
            <div class="flex flex-wrap gap-2">
              <!-- View button -->
              <button v-if="!post.isDeletedAt" @click="navigateTo(`/post/${post.id}`)" 
                class="px-3 py-1.5 text-sm rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                <Icon name="solar:eye-bold" class="mr-1" />
                View
              </button>
              
              <!-- Edit button -->
              <!-- <button v-if="!post.isDeletedAt" @click="navigateTo(`/post/${post.id}?edit=true`)" 
                class="px-3 py-1.5 text-sm rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                <Icon name="solar:pen-bold" class="mr-1" />
                Edit
              </button> -->
              
              <!-- Show/Hide button -->
              <button v-if="!post.isDeletedAt" @click="toggleHidePost(post)" 
                class="px-3 py-1.5 text-sm rounded-full border transition-colors"
                :class="post.isHidden ? 
                  'border-green-200 text-green-600 hover:bg-green-50' : 
                  'border-gray-200 text-gray-600 hover:bg-gray-50'">
                <Icon :name="post.isHidden ? 'solar:eye-bold' : 'solar:eye-closed-bold'" class="mr-1" />
                {{ post.isHidden ? 'Publish' : 'Hide' }}
              </button>
              
              <!-- Restore button for deleted posts -->
              <button v-if="post.isDeletedAt" @click="restorePost(post)" 
                class="px-3 py-1.5 text-sm rounded-full border border-green-200 text-green-600 hover:bg-green-50 transition-colors">
                <Icon name="solar:refresh-bold" class="mr-1" />
                Restore
              </button>
              
              <!-- Delete button -->
              <button @click="confirmDelete(post)" 
                class="px-3 py-1.5 text-sm rounded-full border border-red-200 text-red-600 hover:bg-red-50 transition-colors">
                <Icon name="solar:trash-bin-trash-bold" class="mr-1" />
                {{ post.isDeletedAt ? 'Delete Forever' : 'Move to Trash' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-xl font-bold mb-4">{{ postToDelete?.isDeletedAt ? 'Delete Forever' : 'Move to Trash' }}</h3>
        <p class="mb-6 text-gray-600" v-if="!postToDelete?.isDeletedAt">
          Are you sure you want to move "{{ postToDelete?.title }}" to trash? You can restore it later.
        </p>
        <p class="mb-6 text-gray-600" v-else>
          Are you sure you want to permanently delete "{{ postToDelete?.title }}"? This action cannot be undone.
        </p>
        <div class="flex justify-end space-x-3">
          <button @click="showDeleteModal = false" 
            class="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button @click="deletePost" 
            class="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700">
            {{ postToDelete?.isDeletedAt ? 'Delete Forever' : 'Move to Trash' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Define middleware
definePageMeta({
  middleware: ['auth']
});
import { ref, computed, onMounted } from 'vue';
import { databases, DATABASE_ID, POSTS_COLLECTION_ID } from '~/utils/appwrite';
import { Query } from 'appwrite';

// State
const posts = ref([]);
const isLoading = ref(true);
const error = ref(null);
const activeFilter = ref('all');
const showDeleteModal = ref(false);
const postToDelete = ref(null);
const Profile = useState('Profile', () => null)
console.log(Profile.value)

// Computed
const filteredPosts = computed(() => {
  if (activeFilter.value === 'all') {
    return posts.value.filter(post => !post.isDeletedAt);
  } else if (activeFilter.value === 'visible') {
    return posts.value.filter(post => !post.isHidden && !post.isDeletedAt);
  } else if (activeFilter.value === 'hidden') {
    return posts.value.filter(post => post.isHidden && !post.isDeletedAt);
  } else if (activeFilter.value === 'deleted') {
    return posts.value.filter(post => post.isDeletedAt);
  }
  return posts.value;
});

// Methods
const fetchPosts = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    
    const response = await databases.listDocuments(
      DATABASE_ID,
      POSTS_COLLECTION_ID,
      [
        Query.equal('authorId', Profile.value.$id),
        Query.orderDesc('createdAt'),
        Query.limit(100)
      ]
    );
    
    posts.value = response.documents.map(doc => ({
      id: doc.$id,
      authorId: doc.authorId,
      authorName: doc.authorId?.name || 'Anonymous',
      authorUsername: doc.authorId?.username || 'Anonymous',
      authorAvatar: doc.authorId?.profileImage || 'https://via.placeholder.com/150',
      title: doc.title,
      excerpt: doc.Markdown ? doc.Markdown.substring(0, 150) + '...' : '',
      banner: doc.coverImage || null,
      createdAt: doc.createdAt,
      views: doc.views || 0,
      likes: doc.likes || 0,
      isHidden: doc.isHidden || false,
      isDeletedAt: doc.isDeletedAt || null
    }));
    
  } catch (err) {
    console.error('Error fetching posts:', err);
    error.value = 'Failed to load posts. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

const toggleHidePost = async (post) => {
  try {
    // Update in Appwrite
    await databases.updateDocument(
      DATABASE_ID,
      POSTS_COLLECTION_ID,
      post.id,
      { isHidden: !post.isHidden }
    );
    
    // Update local state
    post.isHidden = !post.isHidden;
    
  } catch (err) {
    console.error('Error toggling post visibility:', err);
    alert('Failed to update post visibility. Please try again.');
  }
};

const confirmDelete = (post) => {
  postToDelete.value = post;
  showDeleteModal.value = true;
};

const deletePost = async () => {
  console.log(postToDelete.value.id);
  if (!postToDelete.value) return;
  
  try {
    if (postToDelete.value.isDeletedAt) {
      // Permanent deletion
      await databases.deleteDocument(
        DATABASE_ID,
        POSTS_COLLECTION_ID,
        postToDelete.value.id
      );
      
      // Remove from local state
      posts.value = posts.value.filter(p => p.id !== postToDelete.value.id);
    } else {
      // Soft deletion - mark with timestamp
      const now = new Date().toISOString();
      await databases.updateDocument(
        DATABASE_ID,
        POSTS_COLLECTION_ID,
        postToDelete.value.id,
        { isDeletedAt: now }
      );
      
      // Update local state
      const post = posts.value.find(p => p.id === postToDelete.value.id);
      if (post) {
        post.isDeletedAt = now;
      }
    }
    
    // Close modal
    showDeleteModal.value = false;
    postToDelete.value = null;
    
  } catch (err) {
    console.error('Error deleting post:', err);
    alert('Failed to delete post. Please try again.');
  }
};

const restorePost = async (post) => {
  try {
    // Update in Appwrite
    await databases.updateDocument(
      DATABASE_ID,
      POSTS_COLLECTION_ID,
      post.id,
      { isDeletedAt: null }
    );
    
    // Update local state
    post.isDeletedAt = null;
    
  } catch (err) {
    console.error('Error restoring post:', err);
    alert('Failed to restore post. Please try again.');
  }
};

const filterPosts = (filter) => {
  activeFilter.value = filter;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

// Lifecycle
onMounted(() => {
  fetchPosts();
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 