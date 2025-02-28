<template>
  <div class="max-w-3xl mx-auto">
    <!-- Cover Image -->
    <div class="h-48 bg-gray-200 relative">
      <img 
        :src="user?.coverImage || '/images/default-cover.jpg'" 
        class="w-full h-full object-cover"
        alt="Cover image"
      >
    </div>

    <div class="px-4">
      <!-- Profile Header -->
      <div class="relative">
        <img 
          :src="user?.avatar" 
          :alt="user?.name"
          class="absolute -top-16 w-32 h-32 rounded-full border-4 border-white object-cover"
        >
      </div>

      <div class="pt-20 pb-2 flex justify-between items-start">
        <div>
          <h1 class="text-xl font-bold">{{ user?.name }}</h1>
          <p class="text-gray-600">@{{ user?.username }}</p>
        </div>
        
        <button 
          v-if="isCurrentUser"
          @click="editProfile"
          class="px-4 py-2 border border-gray-300 font-semibold rounded-full hover:bg-gray-100 cursor-pointer"
        >
          Edit profile
        </button>
        <button 
          v-else
          @click="toggleFollow"
          :class="[
            'px-4 py-2 rounded-full font-semibold cursor-pointer',
            isFollowing 
              ? 'border border-gray-300 hover:border-gray-400 hover:text-gray-700 hover:bg-gray-50' 
              : 'bg-black text-white hover:bg-gray-800'
          ]"
        >
          {{ isFollowing ? 'Following' : 'Follow' }}
        </button>
      </div>

      <!-- Bio -->
      <p class="text-gray-800 mb-1 max-w-lg">{{ user?.bio }}</p>

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
    <div class="border-t">
      <div class="border-b flex items-center justify-between px-4 py-3">
        <h1 class="font-semibold text-gray-900 w-1/3">
          POSTS
        </h1>
        <div class="flex gap-3">
          <button 
            @click="toggleView('list')"
            :class="[
              'text-gray-500 hover:text-gray-900 cursor-pointer',
              { 'text-gray-900': !isGridView }
            ]"
          >
            <i class="fas fa-list text-lg"></i>
          </button>
          <button 
            @click="toggleView('grid')"
            :class="[
              'text-gray-500 hover:text-gray-900 cursor-pointer',
              { 'text-gray-900': isGridView }
            ]"
          >
            <i class="fas fa-th-large text-lg"></i>
          </button>
        </div>
      </div>

      <!-- Posts List -->
      <div v-if="loading" class="py-4 text-center">
        <p>Loading...</p>
      </div>
      
      <div v-else-if="posts.length === 0" class="py-8 text-center text-gray-600">
        <p>No posts yet</p>
      </div>
      
      <div :class="[
        isGridView ? 'grid grid-cols-2 gap-4 px-4 py-4 w-full' : 'divide-y'
      ]">
        <div v-for="post in posts" :key="post.id" :class="[
          isGridView ? 'bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-4' : 'p-4'
        ]">
          <!-- Post Header - Outside clickable area -->
          <div class="flex items-center space-x-2 mb-2">
            <img :src="user?.avatar" class="w-10 h-10 rounded-full" :alt="user?.name">
            <div class="flex flex-col">
              <span class="font-medium">{{ user?.name }}</span>
              <div class="text-gray-500 text-sm">
                <span>@{{ user?.username }}</span>
                <span> • </span>
                <span>{{ post.date }}</span>
              </div>
            </div>
          </div>

          <!-- Clickable post content area -->
          <div 
            class="space-y-3 hover:bg-gray-50 cursor-pointer rounded-lg p-2 -mx-2"
            @click="navigateTo(`/posts/${post.id}`)"
          >
            <!-- Post Title -->
            <h3 class="text-xl font-bold">{{ post.title }}</h3>

            <!-- Post Image -->
            <img 
              v-if="post.image"
              :src="post.image" 
              :alt="post.title"
              class="w-full h-48 object-cover rounded-lg"
            >

            <!-- Post Content -->
            <p class="text-gray-600 line-clamp-3">{{ post.content }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const user = ref(null)
const loading = ref(true)
const isCurrentUser = ref(false)
const isFollowing = ref(false)
const posts = ref([])
const isGridView = ref(false)

const fetchUser = async (userId) => {
  try {
    // Simulate API call
    const mockUser = {
      id: userId,
      name: 'Frieren',
      username: 'frieren',
      bio: 'O ii a o ii a o ii a',
      avatar: '/images/cat-1.jpg',
      coverImage: '/images/black.png',
      followers: 1234,
      following: 567
    }
    
    user.value = mockUser
    // Mock blog posts
    posts.value = [
      {
        id: 1,
        title: 'Nooooooooooooooooooo',
        content: 'lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. asdfasdfasdfasdf lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. asdfasdfasdfasdf', 
        image: '/images/img-1.jpg',
        date: 'Feb 23, 2025',
        replies: 3,
        likes: 25,
        isLiked: false,
        isBookmarked: false,
        isReposted: false
      },
      {
        id: 2,
        title: 'Yessssssssssssssssssss',
        content: 'some dummy text',
        image: '/images/img-1.jpg',
        date: 'Feb 22, 2025',
        replies: 8,
        likes: 45,
        isLiked: false,
        isBookmarked: false,
        isReposted: false
      },
      {
        id: 3,
        title: 'my blog\'s title',
        content: 'coca frit is way better than carantita',
        image: '/images/img-1.jpg',
        date: 'Feb 21, 2025',
        replies: 12,
        likes: 67,
        isLiked: false,
        isBookmarked: false,
        isReposted: false
      },
      {
        id: 4,
        title: 'next or nuxt?',
        content: 'lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. asdfasdfasdfasdf lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. asdfasdfasdfasdf',
        image: '/images/img-1.jpg',
        date: 'Feb 20, 2025',
        replies: 15,
        likes: 89,
        isLiked: false,
        isBookmarked: false,
        isReposted: false
      }
    ]
    
    isCurrentUser.value = userId === 'current-user-id'
  } catch (error) {
    console.error('Error fetching user:', error)
  } finally {
    loading.value = false
  }
}

const editProfile = () => {
  // Implement edit profile functionality
  console.log('Edit profile clicked')
}

const toggleFollow = () => {
  isFollowing.value = !isFollowing.value
  if (user.value) {
    user.value.followers += isFollowing.value ? 1 : -1
  }
}

const toggleView = (mode) => {
  isGridView.value = mode === 'grid'
}

onMounted(() => {
  fetchUser(route.params.id)
})
</script>

<style scoped>
.hide-scrollbar {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.hide-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}
</style>
