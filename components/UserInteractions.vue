<template>
  <div>
    <!-- User Interaction Section -->
    <div class="flex items-center justify-between px-4 md:px-14 py-3 md:py-4 border-t transition-colors duration-300 w-full">
      <!-- Save Button -->
      <button @click="toggleBookmark" class="text-gray-500 cursor-pointer hover:text-gray-700">
        <i :class="['far fa-bookmark', { 'fas text-gray-700': isBookmarked }]"></i>
      </button>
      
      <!-- Repost Button -->
      <button @click="toggleRepost" class="text-gray-500 cursor-pointer hover:text-gray-700">
        <i :class="['fas fa-retweet', { 'text-gray-700': isReposted }]"></i>
      </button>
      
      <!-- Like Button -->
      <button @click="toggleLike" class="flex items-center cursor-pointer justify-center gap-1 text-gray-500 hover:text-gray-700">
        <i :class="['far fa-heart', { 'fas text-gray-700': isLiked }]"></i>
        <span>{{ likes }}</span>
      </button>

      <!-- Comment Button -->
      <button 
        @click="toggleCommentInput"
        class="text-gray-500 cursor-pointer flex items-center justify-center gap-1 hover:text-gray-700"
      >
        <i class="far fa-comment"></i>
        <span>{{ commentCount }}</span>
      </button>

      <!-- Share Button -->
      <button @click="copyLink" class="text-gray-500 cursor-pointer hover:text-gray-700">
        <i class="far fa-share-square"></i>
      </button>
    </div>

    <!-- Comments Section -->
    <div v-if="showComments" class="mt-1 border-t pt-6">
      <!-- Add Comment -->
      <div v-if="showCommentInput" class="flex gap-3 mb-6">
        <img 
          :src="currentUser.avatar"
          :alt="currentUser.name"
          class="w-8 h-8 rounded-full"
        />
        <div class="flex-1">
          <textarea
            v-model="newComment"
            placeholder="Write a comment..."
            class="w-full p-2 border rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-gray-400"
            rows="2"
            ref="commentInput"
            @keyup.enter="addComment"
          ></textarea>
          <div class="flex justify-end gap-2 mt-2">
            <button 
              @click="showCommentInput = false"
              class="px-4 py-1 text-gray-600 rounded-full hover:bg-gray-100 cursor-pointer"
            >
              Cancel
            </button>
            <button 
              @click="addComment"
              :disabled="!newComment.trim()"
              class="px-4 py-1 bg-gray-900 text-white rounded-full disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed hover:bg-gray-800"
            >
              Comment
            </button>
          </div>
        </div>
      </div>

      <!-- Comments List -->
      <div class="space-y-4">
        <slot name="comments"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const props = defineProps({
  postId: {
    type: [String, Number],
    required: true
  },
  initialLikes: {
    type: Number,
    default: 0
  },
  initialCommentCount: {
    type: Number,
    default: 0
  },
  initialIsLiked: {
    type: Boolean,
    default: false
  },
  initialIsBookmarked: {
    type: Boolean,
    default: false
  },
  initialIsReposted: {
    type: Boolean,
    default: false
  },
  showComments: {
    type: Boolean,
    default: false
  },
  currentUser: {
    type: Object,
    required: true
  }
})

const emit = defineEmits([
  'update:likes',
  'update:commentCount',
  'update:isLiked',
  'update:isBookmarked',
  'update:isReposted',
  'comment-added'
])

// Local state
const likes = ref(props.initialLikes)
const commentCount = ref(props.initialCommentCount)
const isLiked = ref(props.initialIsLiked)
const isBookmarked = ref(props.initialIsBookmarked)
const isReposted = ref(props.initialIsReposted)
const showCommentInput = ref(false)
const newComment = ref('')
const commentInput = ref(null)

// Methods
const toggleLike = () => {
  isLiked.value = !isLiked.value
  likes.value += isLiked.value ? 1 : -1
  emit('update:isLiked', isLiked.value)
  emit('update:likes', likes.value)
}

const toggleBookmark = () => {
  isBookmarked.value = !isBookmarked.value
  emit('update:isBookmarked', isBookmarked.value)
}

const toggleRepost = () => {
  isReposted.value = !isReposted.value
  emit('update:isReposted', isReposted.value)
}

const toggleCommentInput = () => {
  showCommentInput.value = !showCommentInput.value
  if (showCommentInput.value) {
    nextTick(() => {
      commentInput.value?.focus()
    })
  }
}

const addComment = () => {
  if (!newComment.value.trim()) return

  const comment = {
    id: Date.now(),
    content: newComment.value,
    user: props.currentUser,
    date: 'Just now',
    likes: 0,
    isLiked: false
  }

  emit('comment-added', comment)
  commentCount.value++
  emit('update:commentCount', commentCount.value)
  newComment.value = ''
  showCommentInput.value = false
}

const copyLink = () => {
  const url = window.location.origin + '/posts/' + props.postId
  navigator.clipboard.writeText(url)
}
</script> 