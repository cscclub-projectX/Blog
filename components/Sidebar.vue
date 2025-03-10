<template>
  <nav class="p-5 bg-white h-full border-r border-gray-100">
    <!-- Close Button (Mobile Only) -->
    <div class="flex justify-end mb-4 md:hidden">
      <button @click="closeSidebar" class="text-gray-500 hover:text-gray-700 p-1 rounded-full">
        <Icon name="solar:close-circle-bold" class="text-xl" />
      </button>
    </div>

    <!-- Logo and Brand -->
    <div class="flex items-center mb-8">
      <NuxtImg src="/images/cscc.jpg" alt="Logo" class="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-200 to-blue-200" />
      <span class="ml-3 font-bold text-xl">CSCC</span>
    </div>

    <!-- Profile Section -->
    <div class="flex items-center mb-8">
      <NuxtImg :src="Profile?.profileImage" alt="Profile Picture" class="w-10 h-10 rounded-full border border-gray-200" />
      <div class="ml-3">
        <h3 class="font-medium text-gray-800">{{ Profile?.name || 'Guest' }}</h3>
        <p class="text-sm text-gray-500">@{{ Profile?.username || 'guest' }}</p>
      </div>
    </div>

    <!-- Navigation Menu -->
    <div class="space-y-1 mb-8">
      <NuxtLink 
        to="/" 
        class="flex items-center px-4 py-3 text-gray-700 rounded-full hover:bg-gray-100 transition-all duration-200"
        :class="{ 'font-medium bg-gray-100': $route.path === '/' }"
      >
        <Icon name="solar:home-bold" class="mr-3 text-xl" />
        Home
      </NuxtLink>

      <NuxtLink 
        to="/authors" 
        class="flex items-center px-4 py-3 text-gray-700 rounded-full hover:bg-gray-100 transition-all duration-200"
        :class="{ 'font-medium bg-gray-100': $route.path === '/authors' }"
      >
        <Icon name="solar:users-group-rounded-bold" class="mr-3 text-xl" />
        <span class="flex justify-between w-full">
          Authors
          <span class="bg-gray-200 text-gray-700 text-xs rounded-full px-2 py-1">3</span>
        </span>
      </NuxtLink>

      <NuxtLink 
        to="/bookmarks" 
        class="flex items-center px-4 py-3 text-gray-700 rounded-full hover:bg-gray-100 transition-all duration-200"
        :class="{ 'font-medium bg-gray-100': $route.path === '/bookmarks' }"
      >
        <Icon name="solar:bookmark-bold" class="mr-3 text-xl" />
        Bookmarks
      </NuxtLink>

      <NuxtLink 
        to="/settings" 
        class="flex items-center px-4 py-3 text-gray-700 rounded-full hover:bg-gray-100 transition-all duration-200"
        :class="{ 'font-medium bg-gray-100': $route.path === '/settings' }"
      >
        <Icon name="solar:settings-bold" class="mr-3 text-xl" />
        Settings
      </NuxtLink>
    </div>

    <!-- Write Button -->
    <button class="w-full bg-black text-white py-3 px-4 rounded-full hover:bg-gray-800 transition-colors mb-8 flex items-center justify-center">
      <Icon name="solar:pen-bold" class="mr-2" />
      Write
    </button>

    <!-- Download App Section -->
    <div class="p-4 bg-gray-50 rounded-xl border border-gray-100">
      <h4 class="font-medium text-gray-800 mb-2">Get the app</h4>
      <p class="text-sm text-gray-600 mb-3">Read and write wherever you are</p>
      <div class="flex space-x-2">
        <button class="flex-1 bg-black text-white text-xs py-2 rounded-full hover:bg-gray-800 transition-colors flex items-center justify-center">
          <Icon name="solar:apple-bold" class="mr-1" />
          iOS
        </button>
        <button class="flex-1 bg-black text-white text-xs py-2 rounded-full hover:bg-gray-800 transition-colors flex items-center justify-center">
          <Icon name="solar:android-bold" class="mr-1" />
          Android
        </button>
      </div>
    </div>

    <!-- Footer Links -->
    <div class="mt-8 text-xs text-gray-500">
      <div class="flex flex-wrap gap-2 mb-2">
        <a href="#" class="hover:text-gray-700">Help</a>
        <span>·</span>
        <a href="#" class="hover:text-gray-700">Status</a>
        <span>·</span>
        <a href="#" class="hover:text-gray-700">About</a>
      </div>
      <p>© 2023 CSCC</p>
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
/* Use system font stack for Medium-like typography */
:deep(*) {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}
</style>
