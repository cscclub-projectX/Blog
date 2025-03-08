<template>
  <nav class=" p-4 bg-white rounded-r-2xl shadow">
    <!-- Close Button -->
    <div class="flex justify-end mb-4">
      <button @click="closeSidebar" class="text-gray-600 bg-red-200 rounded-full  text-xs   p-2 hover:text-gray-800 md:hidden lg:hidden">
        ❌ <!-- Close icon -->
      </button>
    </div>


    <!-- Profile Section -->
    <div class="flex flex-col items-center mb-6">
      <div class="flex -space-x-5">
        <NuxtImg src="/images/cscc.jpg" alt="Logo" class="w-12 h-12 rounded-2xl bg-gradient-to-r border-2 border-white from-purple-200 to-blue-200" />
        <NuxtImg :src="Profile?.profileImage" alt="Profile Picture" class="w-12 h-12 rounded-full border-2 border-white" />
      </div>
      <div class="text-center mt-2">
        <h3 class="font-semibold text-gray-800">{{ Profile?.name }}</h3>
        <p class="text-sm text-gray-500">@{{ Profile?.username }}</p>
      </div>
    </div>

    <!-- Navigation Menu -->
    <div class="space-y-4">
      <NuxtLink 
        to="/" 
        class="flex items-center p-3 text-gray-800 rounded-xl hover:bg-blue-100 transition-all duration-200"
        :class="{ 'bg-blue-100': $route.path === '/' }"
      >
        📰 News Feed
      </NuxtLink>

      <NuxtLink 
        to="/authors" 
        class="flex items-center p-3 text-gray-800 rounded-xl hover:bg-blue-100 transition-all duration-200"
        :class="{ 'bg-blue-100': $route.path === '/authors' }"
      >
        <span class="flex justify-between w-full">
          👋 Authors
          <span class="bg-gray-200 text-gray-700 text-xs rounded-full px-2 py-1">3</span>
        </span>
      </NuxtLink>

      <NuxtLink 
        to="/settings" 
        class="flex items-center p-3 text-gray-800 rounded-xl hover:bg-blue-100 transition-all duration-200"
        :class="{ 'bg-blue-100': $route.path === '/settings' }"
      >
        ⚙️ Settings
      </NuxtLink>
    </div>

    <!-- Download App Section -->
    <div class="mt-8 p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <h4 class="font-medium text-gray-800">Download the App</h4>
          <p class="text-sm text-gray-600 mt-1">Get our mobile app</p>
        </div>
        <div class="flex -space-x-2">
          <NuxtImg src="/images/cat-1.jpg" alt="User" class="w-8 h-8 rounded-full border-2 border-white" />
          <NuxtImg src="/images/cat-2.jpg" alt="User" class="w-8 h-8 rounded-full border-2 border-white" />
          <NuxtImg src="/images/cat-3.jpg" alt="User" class="w-8 h-8 rounded-full border-2 border-white" />
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
const { closeSidebar } = defineProps(['closeSidebar'])
const currentUser = useState('currentUser', () => null)
const Profile = useState('Profile', () => ({
  name: 'Guest',
  username: 'guest',
  profileImage: 'https://via.placeholder.com/150'
}))
</script>

<style scoped>
/* Additional styles can be added here */
</style>
