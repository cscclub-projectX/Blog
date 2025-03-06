<template>
  <div class="flex items-center justify-between px-4 md:px-14 py-3 md:py-4 border-t transition-colors duration-300 w-full">
    <!-- Save Button -->
    <button @click="$emit('toggle-bookmark')" class="text-gray-500 cursor-pointer hover:text-gray-700">
      <i :class="['far fa-bookmark', { 'fas text-gray-700': isBookmarked }]"></i>
    </button>
    
    <!-- Repost Button -->
    <button @click="$emit('toggle-repost')" class="text-gray-500 cursor-pointer hover:text-gray-700">
      <i :class="['fas fa-retweet', { 'text-gray-700': isReposted }]"></i>
    </button>
    
    <!-- Like Button -->
    <button @click="$emit('toggle-like')" class="flex items-center cursor-pointer justify-center gap-1 text-gray-500 hover:text-gray-700">
      <i :class="['far fa-heart', { 'fas text-gray-700': isLiked }]"></i>
      <span>{{ likes }}</span>
    </button>

    <!-- Comment Button -->
    <button 
      @click="$emit('toggle-comment')"
      class="text-gray-500 cursor-pointer flex items-center justify-center gap-1 hover:text-gray-700"
    >
      <i class="far fa-comment"></i>
      <span>{{ commentCount }}</span>
    </button>

    <!-- Share Button -->
    <button @click="$emit('share')" class="text-gray-500 cursor-pointer hover:text-gray-700">
      <i class="far fa-share-square"></i>
    </button>
  </div>
</template>

<script setup>
defineProps({
  isBookmarked: Boolean,
  isReposted: Boolean,
  isLiked: Boolean,
  likes: Number,
  commentCount: Number
})
</script> 