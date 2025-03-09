<template>
  <div class="max-w-4xl mx-auto bg-white">
    <!-- Cover Image -->
    <div class="h-56 bg-gray-100 relative rounded-2xl">
      <img 
        :src="user?.coverImage || '/images/default-cover.jpg'" 
        class="w-full h-full object-cover rounded-2xl"
        alt="Cover image"
      >
    </div>

    <div class="px-6">
      <!-- Profile Header -->
      <div class="relative">
        <img 
          :src="user?.profileImage" 
          :alt="user?.name"
          class="absolute -top-20 w-36 h-36 rounded-full border-4 border-white object-cover shadow-md "
        >
      </div>

      <div class="pt-20 pb-4 flex justify-between items-start">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ user?.name }}</h1>
          <p class="text-gray-600 font-medium">@{{ user?.username }}</p>
        </div>
        
        <button 
          v-if="isCurrentUser"
          @click="editProfile"
          class="px-5 py-2 border border-gray-300 font-medium rounded-full hover:bg-gray-50 transition-colors duration-200"
        >
          Edit profile
        </button>
        <!-- <button 
          v-else
          @click="toggleFollow"
          :class="[
            'px-5 py-2 rounded-full font-medium transition-colors duration-200',
            isFollowing 
              ? 'border border-gray-300 hover:border-gray-400 hover:bg-gray-50' 
              : 'bg-blue-500 text-white hover:bg-blue-600'
          ]"
        >
          {{ isFollowing ? 'Following' : 'Follow' }}
        </button> -->
      </div>

      <!-- Bio -->
      <p class="text-gray-800 mb-4 max-w-lg">{{ user?.bio }}</p>

      <!-- User Stats -->
      <!-- <div class="flex space-x-6 text-gray-600 mb-6">
        <div class="flex items-center">
          <span class="font-bold text-gray-900 hover:underline cursor-pointer">{{ user?.following || 0 }}</span>
          <span class="ml-1">Following</span>
        </div>
        <div class="flex items-center">
          <span class="font-bold text-gray-900 hover:underline cursor-pointer">{{ user?.followers || 0 }}</span>
          <span class="ml-1">Followers</span>
        </div>
      </div> -->
    </div>

    <!-- Posts Section -->
    <div class="border-t border-gray-100 mt-2">
      <div class="border-b border-gray-100 flex items-center justify-between px-6 py-4">
        <h2 class="font-semibold text-gray-900 text-lg">
          Content
        </h2>
        <div class="flex gap-4">
          <button 
            @click="toggleView('list')"
            :class="[
              'text-gray-500 hover:text-gray-900 transition-colors duration-200',
              { 'text-blue-500': !isGridView }
            ]"
          >
            <Icon name="solar:list-bold" class="text-xl" />
          </button>
          <button 
            @click="toggleView('grid')"
            :class="[
              'text-gray-500 hover:text-gray-900 transition-colors duration-200',
              { 'text-blue-500': isGridView }
            ]"
          >
            <Icon name="solar:gallery-wide-bold" class="text-xl" />
          </button>
        </div>
      </div>

      <!-- Posts List -->
      <div v-if="loading" class="py-8 text-center">
        <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto mb-2"></div>
        <p class="text-gray-600">Loading content...</p>
      </div>
      
      <div v-else-if="posts.length === 0" class="py-16 text-center text-gray-600">
        <Icon name="solar:document-text-bold" class="text-4xl text-gray-400 mb-2 mx-auto" />
        <p>No content published yet</p>
      </div>
      
      <div :class="[
        isGridView ? 'grid grid-cols-1 md:grid-cols-2 gap-6 px-6 py-6' : 'divide-y divide-gray-100'
      ]">
        <div v-for="post in posts" :key="post.id" :class="[
          isGridView 
            ? 'bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden' 
            : 'px-6 py-5 hover:bg-gray-50 transition-colors duration-200'
        ]">
          <!-- Post Header - Outside clickable area -->
          <div class="flex items-center justify-between mb-3" :class="{ 'px-4 pt-4': isGridView }">
            <div class="flex items-center space-x-2">
              <img :src="user?.profileImage" class="w-8 h-8 rounded-full" :alt="user?.name">
              <div class="flex flex-col">
                <span class="font-medium text-sm">{{ user?.name }}</span>
                <span class="text-gray-500 text-xs">{{ formatDate(post.createdAt) }}</span>
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
          <div class="cursor-pointer" :class="{ 'px-4 pb-4': isGridView }">
            <!-- Post Image -->
            <div @click="navigateTo(`/post/${post.id}`)">
              <img 
                v-if="post.coverImage"
                :src="post.coverImage" 
                :alt="post.title"
                class="w-full h-48 object-cover mb-3"
                :class="{ 'rounded-lg': !isGridView, 'rounded-none -mx-4 -mt-3 mb-4': isGridView }"
              >

              <!-- Post Title -->
              <h3 class="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{{ post.title }}</h3>

              <!-- Post Content -->
              <MDC :value="getExcerpt(post.Markdown)" class="text-gray-600 text-sm line-clamp-3 mb-3"></MDC>
            </div>
            
            <!-- Post Stats -->
            <div class="flex items-center text-gray-500 text-sm space-x-4 mt-2">
              <div class="flex items-center">
                <Icon name="solar:eye-bold" class="mr-1 text-gray-400" />
                <span>{{ post.views || 0 }}</span>
              </div>
              
              <!-- Like Button with Realtime Functionality -->
              <button @click="toggleLike(post)" class="flex items-center focus:outline-none group">
                <Icon 
                  :name="post.userLiked ? 'solar:heart-bold' : 'solar:heart-outline'" 
                  :class="post.userLiked ? 'text-red-500' : 'text-gray-400 group-hover:text-red-500'"
                  class="mr-1 transition-colors"
                />
                <span>{{ post.likes || 0 }}</span>
              </button>
              
              <!-- Read More for Articles -->
              <div v-if="post.type === 'article'" class="ml-auto">
                <span @click="navigateTo(`/post/${post.id}`)" class="text-blue-500 hover:text-blue-700 font-medium flex items-center">
                  Read More
                  <Icon name="solar:arrow-right-bold" class="ml-1" />
                </span>
              </div>
            </div>
          </div>
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
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { databases, client, DATABASE_ID, POSTS_COLLECTION_ID, USERS_COLLECTION_ID } from '~/utils/appwrite'
import { Query } from 'appwrite'

const route = useRoute()
const user = ref(null)
const loading = ref(true)
const isCurrentUser = ref(false)
const isFollowing = ref(false)
const posts = ref([])
const isGridView = ref(false)
const currentUser = useState('currentUser', () => null)

// Realtime subscription
let unsubscribe = null

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Get excerpt from markdown content
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

// Toggle like for a post with realtime updates
const toggleLike = async (post) => {
  if (!currentUser.value) {
    alert('Please log in to like posts')
    return
  }

  try {
    const userId = currentUser.value.$id
    const postId = post.id
    
    // Get current post data
    const postDoc = await databases.getDocument(
      DATABASE_ID,
      POSTS_COLLECTION_ID,
      postId
    )
    
    // Check if user already liked this post
    const likedBy = postDoc.likedBy || []
    const userIndex = likedBy.indexOf(userId)
    
    let updatedLikes = postDoc.likes || 0
    let updatedLikedBy = [...likedBy]
    
    if (userIndex === -1) {
      // User hasn't liked the post yet, so add like
      updatedLikes++
      updatedLikedBy.push(userId)
      post.userLiked = true
    } else {
      // User already liked the post, so remove like
      updatedLikes = Math.max(0, updatedLikes - 1)
      updatedLikedBy.splice(userIndex, 1)
      post.userLiked = false
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
    )
    
    // Update local state (will be overridden by realtime update)
    post.likes = updatedLikes
  } catch (err) {
    console.error('Error toggling like:', err)
  }
}

// Subscribe to realtime updates for posts
const subscribeToRealtimeUpdates = () => {
  unsubscribe = client.subscribe(`databases.${DATABASE_ID}.collections.${POSTS_COLLECTION_ID}.documents`, response => {
    // Handle realtime updates
    if (response.events.includes('databases.*.collections.*.documents.*.update')) {
      const updatedDoc = response.payload
      
      // Find and update the post in our local state
      const postIndex = posts.value.findIndex(p => p.id === updatedDoc.$id)
      if (postIndex !== -1) {
        // Update post properties
        posts.value[postIndex].likes = updatedDoc.likes || 0
        posts.value[postIndex].views = updatedDoc.views || 0
        posts.value[postIndex].isHidden = updatedDoc.isHidden || false
        
        // Update liked status if current user is available
        if (currentUser.value) {
          const userId = currentUser.value.$id
          const likedBy = updatedDoc.likedBy || []
          posts.value[postIndex].userLiked = likedBy.includes(userId)
        }
      }
    }
  })
}

// Fetch user profile
const fetchUser = async (userId) => {
  try {
    loading.value = true
    
    // Get user profile from database
    const response = await databases.getDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      userId
    )
    
    user.value = response
    
    // Check if this is the current user
    isCurrentUser.value = currentUser.value && currentUser.value.$id === userId
    
    // Fetch user's posts
    await fetchUserPosts(userId)
    
    // Subscribe to realtime updates
    subscribeToRealtimeUpdates()
    
  } catch (error) {
    console.error('Error fetching user:', error)
  } finally {
    loading.value = false
  }
}

// Fetch user's posts
const fetchUserPosts = async (userId) => {
  try {
    // Create query conditions
    const queryConditions = [
      Query.equal("authorId", userId),
      Query.isNull("isDeletedAt"),
      Query.orderDesc('createdAt')
    ]
    
    // If not the profile owner, only show public posts
    if (!isCurrentUser.value) {
      queryConditions.push(Query.equal("isHidden", false))
    }
    
    const response = await databases.listDocuments(
      DATABASE_ID,
      POSTS_COLLECTION_ID,
      queryConditions
    )
    
    // Process posts
    posts.value = response.documents.map(doc => {
      // Check if current user has liked this post
      const userLiked = currentUser.value &&
        doc.likedBy &&
        doc.likedBy.includes(currentUser.value.$id)
        
      return {
        id: doc.$id,
        title: doc.title,
        Markdown: doc.Markdown,
        coverImage: doc.coverImage,
        authorId: doc.authorId,
        tags: doc.tags || [],
        views: doc.views || 0,
        likes: doc.likes || 0,
        status: doc.status || 'published',
        createdAt: doc.createdAt,
        likedBy: doc.likedBy || [],
        isHidden: doc.isHidden || false,
        type: doc.type || 'post',
        userLiked: userLiked
      }
    })
    
  } catch (error) {
    console.error('Error fetching user posts:', error)
  }
}

const editProfile = () => {
  // Show profile edit dialog
  const showProfileDialog = useState('showProfileDialog')
  if (showProfileDialog) {
    showProfileDialog.value = true
  }
}

const toggleFollow = () => {
  // This would need to be implemented with actual follow functionality
  isFollowing.value = !isFollowing.value
  if (user.value) {
    user.value.followers = (user.value.followers || 0) + (isFollowing.value ? 1 : -1)
  }
}

const toggleView = (mode) => {
  isGridView.value = mode === 'grid'
}

onMounted(() => {
  const userId = route.params.id
  if (userId) {
    fetchUser(userId)
  }
})

// Clean up subscription when component is unmounted
onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe()
  }
})
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
