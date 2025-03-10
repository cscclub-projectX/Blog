<template>
  <div class="p-4 max-w-4xl mx-auto md:mb-3 sm:mb-15 xs:mb-15">
    <!-- Login Dialog -->
    <LoginDialog />

    <!-- Profile Dialog -->
    <ProfileDialog :show="showProfileDialog" @close="showProfileDialog = false" />

    <!-- New Post Component -->
    <NewPost :disabled="!hasProfile" @request-profile="showProfileDialog = true" :currentUser="currentUser"
      :Profile="Profile" @post-created="handleNewPost" />

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

      <div v-else-if="error" class="bg-red-100 text-red-700 p-4 rounded-lg shadow-sm">
        <p>{{ error }}</p>
      </div>

      <div v-else-if="filteredPosts.length === 0" class="bg-gray-100 p-8 rounded-lg text-center shadow-sm">
        <Icon name="solar:document-text-bold" class="text-4xl text-gray-400 mb-2" />
        <p class="text-gray-600">No posts found. Create your first post!</p>
      </div>

      <!-- Posts List -->
      <div v-else class="space-y-4">
        <div v-for="post in filteredPosts" :key="post.id"
          class="bg-gray-100 p-4 rounded-xl  hover:shadow-md transition-shadow duration-200">
          
          <!-- Post Header -->
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center" @click="navigateToProfile(post.authorId)" style="cursor: pointer;">
              <img :src="post.authorAvatar" alt="Author" class="w-10 h-10 rounded-full mr-3 border border-gray-200" />
              <div class="flex flex-col">
                <span class="font-medium text-gray-900">{{ post.authorName }}</span>
                <div class="flex items-center text-gray-500 text-sm">
                  <span>{{ post.authorUsername }}</span>
                  <span class="mx-1">·</span>
                  <span>{{ formatDate(post.createdAt) }}</span>
                </div>
              </div>
            </div>
            
            <!-- Post Type Badge -->
            <span 
              :class="[
                'text-xs px-2 py-1 rounded-full font-medium',
                post.type === 'article' 
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-blue-100 text-blue-800'
              ]"
            >
              {{ post.type || 'Post' }}
            </span>
          </div>
          
          <!-- Post Content -->
          <div class="cursor-pointer" @click="navigateTo(`/post/${post.id}`)">
            <!-- Post Title -->
            <h3 class="text-lg font-bold text-gray-900 mb-3 line-clamp-2">{{ post.title }}</h3>
            
            <!-- Post Cover Image -->
            <img v-if="post.banner" :src="post.banner" alt="Post banner"
              class="w-full h-48 object-cover mb-4 rounded-lg" />
            
            <!-- Post Excerpt -->
            <div class="text-gray-600 text-sm line-clamp-3 mb-4">
              <MDC :value="getExcerpt(post.excerpt)" tag="article" class="prose prose-sm max-w-none" />
            </div>
          </div>
          
          <!-- Post Actions -->
          <div class="flex items-center justify-between pt-3 border-t border-gray-100">
            <div class="flex items-center space-x-4">
              <!-- Views -->
              <div class="flex items-center text-gray-500">
                <Icon name="solar:eye-bold" class="mr-1 text-gray-400" />
                <span>{{ post.views }}</span>
              </div>
              
              <!-- Like Button with Realtime Functionality -->
              <button @click="toggleLike(post)" class="flex items-center focus:outline-none group">
                <Icon 
                  :name="post.userLiked ? 'solar:heart-bold' : 'solar:heart-outline'" 
                  :class="post.userLiked ? 'text-red-500' : 'text-gray-400 group-hover:text-red-500'"
                  class="mr-1 transition-colors"
                />
                <span>{{ post.likes }}</span>
              </button>
              
              <!-- Visibility Badge -->
              <span v-if="post.isHidden" class="text-xs bg-red-100 text-red-600 rounded-full px-2 py-0.5 flex items-center">
                <Icon name="solar:lock-bold" class="mr-1 text-xs" />
                Private
              </span>
              <span v-else class="text-xs bg-green-100 text-green-600 rounded-full px-2 py-0.5 flex items-center">
                <Icon name="solar:globe-bold" class="mr-1 text-xs" />
                Public
              </span>
            </div>
            
            <div class="flex items-center space-x-3">
              <!-- Read More for Articles -->
              <NuxtLink v-if="post.type === 'article'" :to="`/post/${post.id}`" 
                class="text-blue-500 hover:text-blue-700 text-sm font-medium flex items-center">
                Read More
                <Icon name="solar:arrow-right-bold" class="ml-1" />
              </NuxtLink>
              
              <!-- Author Actions -->
              <div v-if="post.authorId === currentUser?.$id" class="flex space-x-2">
                <NuxtLink :to="`/posts?edit=${post.id}`" class="text-gray-500 hover:text-blue-600 p-1 rounded-full hover:bg-gray-100">
                  <Icon name="solar:pen-bold" />
                </NuxtLink>
                <button @click="toggleHidePost(post)" class="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100">
                  <Icon :name="post.isHidden ? 'solar:eye-closed-bold' : 'solar:eye-bold'" />
                </button>
              </div>
            </div>
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
import { useRouter } from 'vue-router';

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
const router = useRouter();
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

const navigateToProfile = (userId) => {
  console.log(userId);
  router.push(`/user/${userId.$id}`);
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
const getExcerpt = (markdown) => {
  if (!markdown) return ''
  // Remove markdown formatting for excerpt
  const plainText = markdown
    .replace(/#+\s/g, '') // Remove headings
    .replace(/\*\*/g, '')  // Remove bold
    // .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace links with just text
    .replace(/!\[([^\]]+)\]\([^)]+\)/g, '') // Remove images
    .replace(/```[^`]*```/g, '') // Remove code blocks
    
  return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText
}
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

// Function to handle new post creation
const handleNewPost = async (newPostData) => {
  try {
    // Format the new post to match the structure of posts in featuredPosts
    const newPost = {
      id: newPostData.$id,
      authorId: newPostData.authorId,
      authorName: Profile.value?.name || 'Anonymous',
      authorUsername: Profile.value?.username || 'Anonymous',
      authorAvatar: Profile.value?.profileImage || 'https://via.placeholder.com/150',
      title: newPostData.title,
      excerpt: newPostData.Markdown ? newPostData.Markdown.substring(0, 200) + '...' : '',
      banner: newPostData.coverImage || null,
      createdAt: newPostData.createdAt,
      views: newPostData.views || 0,
      likes: newPostData.likes || 0,
      isHidden: newPostData.isHidden || false,
      isDeletedAt: newPostData.isDeletedAt || null,
      userLiked: false,
      viewIncremented: false,
      type: newPostData.type || 'post' // Add the post type
    };

    // Add the new post to the beginning of the featuredPosts array
    featuredPosts.value.unshift(newPost);
  } catch (err) {
    console.error('Error handling new post:', err);
  }
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

    // Create query conditions
    const queryConditions = [
      Query.isNull("isDeletedAt"), // Only fetch non-deleted posts
      Query.orderDesc('createdAt'), // Sort by creation date, newest first
      Query.limit(10)              // Limit to 10 posts
    ];

    // Add condition to only show public posts OR the current user's hidden posts
    if (currentUser.value) {
      queryConditions.push(
        Query.or([
          Query.equal("isHidden", false),                      // Public posts
          Query.and([
            Query.equal("isHidden", true),                     // Hidden posts
            Query.equal("authorId", currentUser.value.$id)     // That belong to current user
          ])
        ])
      );
    } else {
      // If no user is logged in, only show public posts
      queryConditions.push(Query.equal("isHidden", false));
    }

    const response = await databases.listDocuments(
      databaseId,
      collectionId,
      queryConditions
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
        viewIncremented: false,
        type: doc.type || 'post' // Add the post type with default value
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
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>