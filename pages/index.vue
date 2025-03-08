<template>
  <div class="p-4">
    <!-- Login Dialog -->
    <LoginDialog />

    <!-- Profile Dialog -->
    <ProfileDialog :show="showProfileDialog" @close="showProfileDialog = false" />

    <!-- New Post Component -->
    <NewPost :disabled="!hasProfile" @request-profile="showProfileDialog = true" :currentUser="currentUser"
      :Profile="Profile" />

    <!-- Feed Section -->
    <div class="space-y-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">Your Feed</h2>
        <NuxtLink to="/posts" class="text-blue-500 hover:text-blue-700 flex items-center">
          <span>Manage Posts</span>
          <Icon name="solar:settings-bold" class="ml-1" />
        </NuxtLink>
      </div>

      <div v-if="isLoading" class="bg-white p-8 rounded-lg text-center">
        <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto mb-2"></div>
        <p class="text-gray-600">Loading posts...</p>
      </div>

      <div v-else-if="error" class="bg-red-100 text-red-700 p-4 rounded-lg">
        <p>{{ error }}</p>
      </div>

      <div v-else-if="filteredPosts.length === 0" class="bg-gray-100 p-8 rounded-lg text-center">
        <Icon name="solar:document-text-bold" class="text-4xl text-gray-400 mb-2" />
        <p class="text-gray-600">No posts found. Create your first post!</p>
      </div>

      <div v-else v-for="post in filteredPosts" :key="post.id"
        class="bg-white p-4 rounded-lg  hover:shadow-md transition-shadow duration-200">
        <div @click="navigateTo(`/post/${post.id}`)">
        <div class="flex items-center mb-2">
          <div class="flex justify-between w-full">
            <div class="flex items-center">
              <img :src="post.authorAvatar" alt="Author" class="w-10 h-10 rounded-full mr-2 " />
              <div class="flex flex-col">
                <span class="font-medium xs:text-sm sm:text-sm">{{ post.authorName }}</span>
                <span class="text-gray-500 text-sm xs:text-xs sm:text-xs">{{ post.authorUsername }}</span>
              </div>
            </div>
            <div class="flex gap-1 items-center">
              <span class="text-gray-500 text-sm xs:text-xs sm:text-xs ml-auto">{{ formatDate(post.createdAt) }}</span>
              <span v-if="post.isHidden" class="text-gray-500 text-sm xs:text-xs sm:text-xs ml-auto bg-red-100 rounded-full px-2 py-1 gap-1 flex items-center"><i class="fas fa-lock text-sm"></i> {{ post.isHidden ? 'Hidden' : 'Visible' }}</span>
              <span v-else class="text-gray-500 text-sm xs:text-xs sm:text-xs ml-auto bg-green-100 rounded-full px-2 py-1 gap-1 flex items-center"><i class="fas fa-globe text-sm"></i> {{ post.isHidden ? 'Hidden' : 'Visible' }}</span>
            </div>
          </div>
        </div>

        <h3 class="font-semibold text-lg mb-2">{{ post.title }}</h3>

        <img v-if="post.banner" :src="post.banner" alt="Post banner" class="w-full h-48 object-cover mb-3 rounded-lg" />

        <MDC :value="post.excerpt" tag="article" class="prose prose-sm max-w-none mb-3" />
      </div>
        <div class="flex items-center mt-3 text-gray-500 border-t pt-3">
          <div class="flex items-center mr-4">
            <Icon name="solar:eye-bold" class="mr-1" />
            <span>{{ post.views }}</span>
          </div>

          <button @click="toggleLike(post)" class="flex items-center mr-4 focus:outline-none">
            <Icon :name="post.userLiked ? 'solar:heart-bold' : 'solar:heart-outline'"
              :class="post.userLiked ? 'text-red-500' : 'text-gray-500'" class="mr-1" />
            <span>{{ post.likes }}</span>
          </button>

          <div v-if="post.authorId === currentUser?.$id" class="ml-auto flex space-x-2">
            <NuxtLink :to="`/posts?edit=${post.id}`" class="text-blue-500 hover:text-blue-700">
              <Icon name="solar:pen-bold" />
            </NuxtLink>
            <button @click="toggleHidePost(post)" class="text-gray-500 hover:text-gray-700">
              <Icon :name="post.isHidden ? 'solar:eye-closed-bold' : 'solar:eye-bold'" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import NewPost from '@/components/NewPost.vue';
import LoginDialog from '@/components/LoginDialog.vue';
import ProfileDialog from '@/components/ProfileDialog.vue';
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { account, databases, client } from '~/utils/appwrite';
import { Query } from 'appwrite';
import { DATABASE_ID, POSTS_COLLECTION_ID, USERS_COLLECTION_ID } from '~/utils/appwrite';

// Define middleware
definePageMeta({
  middleware: ['auth']
});

const featuredPosts = ref([]);
const isLoading = ref(true);
const error = ref(null);
const currentUser = useState('currentUser', () => null);
const hasProfile = ref(false);
const Profile = useState('Profile', () => null);
const showProfileDialog = ref(false);
const userLikedPosts = ref(new Set());

// Filtered posts (exclude deleted posts)
const filteredPosts = computed(() => {
  return featuredPosts.value.filter(post => !post.isDeletedAt);
});

// Realtime subscription
let unsubscribe = null;

// Check if user has a profile
const checkUserProfile = async (userId) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.equal('$id', userId)]
    );
    Profile.value = response.documents[0];
    if (response.documents.length > 0) {
      // Check if required profile fields are filled
      const profile = response.documents[0];
      hasProfile.value = !!(profile.name && profile.username);
    } else {
      hasProfile.value = false;
      showProfileDialog.value = true; // Show profile dialog if no profile exists
    }
  } catch (err) {
    console.error('Error checking user profile:', err);
    hasProfile.value = false;
  }
};

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Increment view count for a post
const incrementViews = async (postId) => {
  try {
    const post = featuredPosts.value.find(p => p.id === postId);
    if (!post || post.viewIncremented) return;

    // Mark as incremented to prevent multiple increments
    post.viewIncremented = true;

    // Get current post data
    const postDoc = await databases.getDocument(
      DATABASE_ID,
      POSTS_COLLECTION_ID,
      postId
    );

    // Increment views
    const updatedViews = (postDoc.views || 0) + 1;

    // Update in Appwrite
    await databases.updateDocument(
      DATABASE_ID,
      POSTS_COLLECTION_ID,
      postId,
      { views: updatedViews }
    );

    // Update local state
    post.views = updatedViews;
  } catch (err) {
    console.error('Error incrementing views:', err);
  }
};

// Toggle like for a post
const toggleLike = async (post) => {
  if (!currentUser.value) {
    alert('Please log in to like posts');
    return;
  }

  try {
    const userId = currentUser.value.$id;
    const postId = post.id;

    // Get current post data
    const postDoc = await databases.getDocument(
      DATABASE_ID,
      POSTS_COLLECTION_ID,
      postId
    );

    // Check if user already liked this post
    const likedBy = postDoc.likedBy || [];
    const userIndex = likedBy.indexOf(userId);

    let updatedLikes = postDoc.likes || 0;
    let updatedLikedBy = [...likedBy];

    if (userIndex === -1) {
      // User hasn't liked the post yet, so add like
      updatedLikes++;
      updatedLikedBy.push(userId);
      userLikedPosts.value.add(postId);
      post.userLiked = true;
    } else {
      // User already liked the post, so remove like
      updatedLikes = Math.max(0, updatedLikes - 1);
      updatedLikedBy.splice(userIndex, 1);
      userLikedPosts.value.delete(postId);
      post.userLiked = false;
    }

    // Update in Appwrite
    await databases.updateDocument(
      DATABASE_ID,
      POSTS_COLLECTION_ID,
      postId,
      {
        likes: updatedLikes,
        likedBy: updatedLikedBy
      }
    );

    // Update local state
    post.likes = updatedLikes;
  } catch (err) {
    console.error('Error toggling like:', err);
  }
};

// Toggle hide post
const toggleHidePost = async (post) => {
  if (!currentUser.value || post.authorId !== currentUser.value.$id) {
    return;
  }

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

// Subscribe to realtime updates for posts
const subscribeToRealtimeUpdates = () => {
  unsubscribe = client.subscribe(`databases.${DATABASE_ID}.collections.${POSTS_COLLECTION_ID}.documents`, response => {
    // Handle realtime updates
    if (response.events.includes('databases.*.collections.*.documents.*.update')) {
      const updatedDoc = response.payload;

      // Find and update the post in our local state
      const postIndex = featuredPosts.value.findIndex(p => p.id === updatedDoc.$id);
      if (postIndex !== -1) {
        // Update post properties
        featuredPosts.value[postIndex].likes = updatedDoc.likes || 0;
        featuredPosts.value[postIndex].views = updatedDoc.views || 0;
        featuredPosts.value[postIndex].isHidden = updatedDoc.isHidden || false;
        featuredPosts.value[postIndex].isDeletedAt = updatedDoc.isDeletedAt || null;

        // Update liked status if current user is available
        if (currentUser.value) {
          const userId = currentUser.value.$id;
          const likedBy = updatedDoc.likedBy || [];
          featuredPosts.value[postIndex].userLiked = likedBy.includes(userId);
        }
      }
    }
  });
};

// Fetch posts from Appwrite on component mount
onMounted(async () => {
  try {
    isLoading.value = true;

    // Check if user is logged in and has a profile
    try {
      const session = await account.getSession('current');
      if (session) {
        await checkUserProfile(session.userId);
      }
    } catch (error) {
      console.log('No active session');
    }

    // Replace these values with your actual database and collection IDs
    const databaseId = DATABASE_ID;
    const collectionId = POSTS_COLLECTION_ID;

    const response = await databases.listDocuments(
      databaseId,
      collectionId,
      [
        Query.isNull("isDeletedAt"), // Only fetch non-deleted posts
        Query.orderDesc('createdAt'),     // Sort by creation date, newest first
        Query.limit(10)                   // Limit to 10 posts
      ]
    );

    featuredPosts.value = await Promise.all(response.documents.map(async doc => {
      // Check if current user has liked this post
      const userLiked = currentUser.value &&
        doc.likedBy &&
        doc.likedBy.includes(currentUser.value.$id);

      if (userLiked) {
        userLikedPosts.value.add(doc.$id);
      }

      return {
        id: doc.$id,
        authorId: doc.authorId,
        authorName: doc.authorId?.name || 'Anonymous',
        authorUsername: doc.authorId?.username || 'Anonymous',
        authorAvatar: doc.authorId?.profileImage || 'https://via.placeholder.com/150',
        title: doc.title,
        excerpt: doc.Markdown ? doc.Markdown.substring(0, 200) + '...' : '',
        banner: doc.coverImage || null,
        createdAt: doc.createdAt,
        views: doc.views || 0,
        likes: doc.likes || 0,
        isHidden: doc.isHidden || false,
        isDeletedAt: doc.isDeletedAt || null,
        userLiked: userLiked,
        viewIncremented: false
      };
    }));

    // Increment view count for all visible posts
    for (const post of featuredPosts.value) {
      await incrementViews(post.id);
    }

    // Subscribe to realtime updates
    subscribeToRealtimeUpdates();

    isLoading.value = false;
  } catch (err) {
    console.error('Error fetching posts:', err);
    error.value = 'Failed to load posts';
    isLoading.value = false;
  }
});

// Clean up subscription when component is unmounted
onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();
  }
});
</script>

<style scoped>
/* Additional styles can be added here */
</style>