<template>
    <!-- Houcine was here :) -->
    <div class="w-full md:max-w-2xl lg:max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8 h-screen overflow-y-auto hide-scrollbar">
        <!-- Blog's Header  -->
        <div class="mb-3 md:mb-4">
            <div class="flex items-center gap-2 md:gap-3 text-gray-600">
                <img 
                :src="user.avatar"
                :alt="`${user.fullName}'s profile picture`"
                class="w-8 h-8 md:w-10 md:h-10 rounded-full cursor-pointer"
                />
                <div class="flex flex-col my-1 md:my-2">
                    <p class="font-medium text-sm md:text-base">{{ user.fullName }}</p>
                    <p class="text-xs md:text-sm">
                        <span class="cursor-pointer">@{{ user.username }}</span> • {{ date }}
                    </p>
                </div>
            </div>
            <h1 class="text-2xl md:text-3xl font-bold mt-2">Coca Frite</h1>
        </div>

        <!-- Blog's Image -->
        <div class="mb-3 md:mb-4">
            <img 
                src="/public/images/img-1.jpg" 
                alt="Blog's image" 
                class="w-full h-[250px] md:h-[400px] object-cover rounded-lg"
            />
        </div>

        <!-- Blog's Content -->
        <article class="prose prose-slate max-w-none mb-6 md:mb-8">
            <div v-html="markdownContent" class="
                [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mb-6
                [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mb-4
                [&>h3]:text-xl [&>h3]:font-bold [&>h3]:mb-3
                [&>p]:text-gray-600 [&>p]:text-base
                [&>a]:text-blue-600">
            </div>
        </article>

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
                <i :class="['far fa-heart ', { 'fas text-gray-700': isLiked }]"></i>
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
        <div class="mt-1 border-t pt-6">
            <!-- Add Comment -->
            <div v-if="showCommentInput" class="flex gap-3 mb-6">
                <img 
                    :src="user.avatar"
                    :alt="user.fullName"
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
                <div v-for="comment in displayedComments" :key="comment.id" class="flex gap-3">
                    <img 
                        :src="comment.user.avatar"
                        :alt="comment.user.fullName"
                        class="w-8 h-8 rounded-full cursor-pointer"
                    />
                    <div class="flex-1">
                        <div class="flex items-center gap-2 justify-between">
                            <div class="flex items-center gap-2">
                                <span class="font-medium text-sm cursor-pointer">{{ comment.user.fullName }}</span>
                                <span class="text-xs text-gray-500">{{ comment.date }}</span>
                            </div>
                            <!-- Simple dropdown for comment actions -->
                            <div class="relative" v-if="canDeleteComment(comment)">
                                <button 
                                    @click="comment.showActions = !comment.showActions"
                                    class="text-gray-500 hover:text-gray-700 cursor-pointer"
                                >
                                    <i class="fas fa-ellipsis-h"></i>
                                </button>
                                <!-- Simple dropdown menu -->
                                <div 
                                    v-if="comment.showActions" 
                                    class="absolute right-0 mt-1 bg-white rounded-lg shadow-lg z-10 w-24"
                                >
                                    <button 
                                        @click="deleteComment(comment)"
                                        class="w-full text-sm text-gray-700 hover:bg-gray-100 py-2 cursor-pointer"
                                    >
                                        Delete
                                    </button>
                                    <button 
                                        @click="comment.showActions = false"
                                        class="w-full text-sm text-gray-700 hover:bg-gray-100 py-2 border-t border-gray-100 cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                        <p class="text-sm mt-1">{{ comment.content }}</p>
                        <div class="flex gap-4 mt-2 text-sm text-gray-500">
                            <button 
                                @click="toggleCommentLike(comment)" 
                                class="flex items-center cursor-pointer justify-center gap-1 text-gray-500 hover:text-gray-700"
                            >
                                <i :class="['far fa-heart', { 'fas text-gray-700': comment.isLiked }]"></i>
                                <span>{{ comment.likes }}</span>
                            </button>
                            <button 
                                @click="toggleReplyInput(comment)"
                                class="hover:text-gray-700 cursor-pointer"
                            >
                                Reply
                            </button>
                        </div>

                        <!-- Reply Input Section -->
                        <div v-if="comment.showReplyInput" class="mt-3">
                            <div class="flex gap-3">
                                <img 
                                    :src="user.avatar"
                                    :alt="user.fullName"
                                    class="w-8 h-8 rounded-full"
                                />
                                <div class="flex-1">
                                    <textarea
                                        v-model="comment.newReply"
                                        placeholder="Write a reply..."
                                        class="w-full p-2 border rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-gray-400"
                                        rows="2"
                                        @keyup.enter="addReply(comment)"
                                    ></textarea>
                                    <div class="flex justify-end gap-2 mt-2">
                                        <button 
                                            @click="toggleReplyInput(comment)"
                                            class="cursor-pointer px-4 py-1 text-gray-600 rounded-full hover:bg-gray-100"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            @click="addReply(comment)"
                                            :disabled="!comment.newReply?.trim()"
                                            class="px-4 py-1 bg-gray-900 text-white rounded-full disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed hover:bg-gray-800"
                                        >
                                            Reply
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Replies List -->
                        <div v-if="comment.replies?.length" class="mt-3 space-y-3">
                            <div v-for="reply in displayedReplies(comment)" :key="reply.id" class="flex gap-3">
                                <img 
                                    :src="reply.user.avatar"
                                    :alt="reply.user.fullName"
                                    class="w-8 h-8 rounded-full cursor-pointer"
                                />
                                <div class="flex-1">
                                    <div class="flex items-center gap-2 justify-between">
                                        <div class="flex items-center gap-2">
                                            <span class="font-medium text-sm cursor-pointer">{{ reply.user.fullName }}</span>
                                            <span class="text-xs text-gray-500">{{ reply.date }}</span>
                                        </div>
                                        <!-- Simple dropdown for reply actions -->
                                        <div class="relative" v-if="canDeleteReply(reply)">
                                            <button 
                                                @click="reply.showActions = !reply.showActions"
                                                class="text-gray-500 hover:text-gray-700 cursor-pointer"
                                            >
                                                <i class="fas fa-ellipsis-h"></i>
                                            </button>
                                            <!-- Simple dropdown menu -->
                                            <div 
                                                v-if="reply.showActions" 
                                                class="absolute right-0 mt-1 bg-white rounded-lg shadow-lg z-10 w-24"
                                            >
                                                <button 
                                                    @click="deleteReply(comment, reply)"
                                                    class="w-full text-sm text-gray-700 hover:bg-gray-100 py-2 cursor-pointer"
                                                >
                                                    Delete
                                                </button>
                                                <button 
                                                    @click="reply.showActions = false"
                                                    class="w-full text-sm text-gray-700 hover:bg-gray-100 py-2 border-t border-gray-100 cursor-pointer"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <p class="text-sm mt-1">{{ reply.content }}</p>
                                    <div class="flex gap-4 mt-2 text-sm text-gray-500">
                                        <button 
                                            @click="toggleReplyLike(reply)" 
                                            class="flex items-center cursor-pointer justify-center gap-1 text-gray-500 hover:text-gray-700"
                                        >
                                            <i :class="['far fa-heart', { 'fas text-gray-700': reply.isLiked }]"></i>
                                            <span>{{ reply.likes }}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Show More Replies Button -->
                            <button 
                                v-if="shouldShowMoreReplies(comment)"
                                @click="toggleShowAllReplies(comment)"
                                class="ml-11 text-sm text-gray-600 hover:text-gray-800 cursor-pointer"
                            >
                                {{ comment.showAllReplies ? 'Hide replies' : `Show ${comment.replies.length} ${comment.replies.length === 1 ? 'reply' : 'replies'}` }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Show More Comments Button -->
            <button 
                v-if="shouldShowMoreComments"
                @click="toggleShowAllComments"
                class="w-full text-sm text-gray-600 hover:text-gray-800 cursor-pointer py-2"
            >
                {{ showAllComments ? 'Show less comments' : `Show ${comments.length - 3} more comments` }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt()

// User information object
const user = ref({
    fullName: 'Houcine Abdaoui',
    username: 'houcineabdaoui',
    avatar: '/images/black.png',
})

// Post interaction states
const date = ref('Feb 23, 2025')
const likes = ref(122)
const isLiked = ref(false)
const isBookmarked = ref(false)
const isReposted = ref(false)

// Blog post content
const content = `
# Welcome to My Nuxt.js Blog
This is a **Markdown** example that you can use in your Nuxt.js project.

## Features

- ✅ **bold**, *italic*, \`inline code\`, *[link](https://www.google.com)*

- ✅ Code blocks:

\`\`\`javascript
console.log('Hello, Nuxt.js!');
\`\`\`

### Hellllloo

`

// Comment input state
const newComment = ref('')
const showCommentInput = ref(false)
const commentInput = ref(null) // Reference to comment textarea for focus

// Comments data structure with nested replies
const comments = ref([
    {
        id: 1,
        content: 'asdfasfdasdf!!',
        date: '2h ago',
        likes: 5,
        isLiked: false,
        showReplyInput: false,
        showActions: false,
        newReply: '',
        replies: [],
        showAllReplies: false,
        user: {
            fullName: 'Frieren',
            avatar: '/images/cat-1.jpg'
        }
    },
    {
        id: 2,
        content: 'Yokoso',
        date: '5h ago',
        likes: 3,
        isLiked: false,
        showReplyInput: false,
        newReply: '',
        replies: [],
        showAllReplies: false,
        user: {
            fullName: 'Karim',
            avatar: '/images/cat-2.jpg'
        }
    }
])

// Comment input handling
const toggleCommentInput = () => {
    showCommentInput.value = !showCommentInput.value
    if (showCommentInput.value) {
        // Focus textarea after it's rendered
        nextTick(() => {
            commentInput.value?.focus()
        })
    }
}

// Comment like functionality
const toggleCommentLike = (comment) => {
    comment.isLiked = !comment.isLiked
    comment.likes += comment.isLiked ? 1 : -1
}

// Add new comment functionality
const addComment = () => {
    if (!newComment.value.trim()) return
    
    comments.value.unshift({
        id: Date.now(),
        content: newComment.value,
        date: 'Just now',
        likes: 0,
        isLiked: false,
        showReplyInput: false,
        showActions: false,
        newReply: '',
        replies: [],
        showAllReplies: false,
        user: {
            fullName: user.value.fullName,
            avatar: user.value.avatar
        }
    })
    
    newComment.value = ''
    showCommentInput.value = false
}

// Reply functionality
const toggleReplyInput = (comment) => {
    comment.showReplyInput = !comment.showReplyInput
}

const addReply = (comment) => {
    if (!comment.newReply?.trim()) return
    
    if (!comment.replies) {
        comment.replies = []
    }
    
    comment.replies.push({
        id: Date.now(),
        content: comment.newReply,
        date: 'Just now',
        likes: 0,
        isLiked: false,
        showActions: false,
        user: {
            fullName: user.value.fullName,
            avatar: user.value.avatar
        }
    })
    
    comment.newReply = ''
    comment.showReplyInput = false
}

// Reply like functionality
const toggleReplyLike = (reply) => {
    reply.isLiked = !reply.isLiked
    reply.likes += reply.isLiked ? 1 : -1
}

// Comment display management
const displayedComments = computed(() => {
    if (showAllComments.value || comments.value.length <= 3) {
        return comments.value
    }
    return comments.value.slice(0, 3)
})

const shouldShowMoreComments = computed(() => {
    return comments.value.length > 3
})

// Add this ref
const showAllComments = ref(false)

// Add this function
const toggleShowAllComments = () => {
    showAllComments.value = !showAllComments.value
}

// Modify the displayedReplies function
const displayedReplies = (comment) => {
    if (!comment.showAllReplies) {
        return [] // Return empty array if replies are not expanded
    }
    return comment.replies // Show all replies when expanded
}

// Modify shouldShowMoreReplies to show button for any replies
const shouldShowMoreReplies = (comment) => {
    return comment.replies.length > 0
}

// Total comment count including replies
const commentCount = computed(() => {
    return comments.value.reduce((total, comment) => {
        return total + 1 + (comment.replies?.length || 0)
    }, 0)
})

// Add isPostOwner prop
const props = defineProps({
    isPostOwner: {
        type: Boolean,
        default: false
    }
})

// Add delete functionality
const canDeleteComment = (comment) => {
    return comment.user.fullName === user.value.fullName || props.isPostOwner
}

const canDeleteReply = (reply) => {
    return reply.user.fullName === user.value.fullName || props.isPostOwner
}

const deleteComment = (comment) => {
    if (!canDeleteComment(comment)) return
    
    const index = comments.value.findIndex(c => c.id === comment.id)
    if (index !== -1) {
        comments.value.splice(index, 1)
    }
}

const deleteReply = (comment, reply) => {
    if (!canDeleteReply(reply)) return
    
    const replyIndex = comment.replies.findIndex(r => r.id === reply.id)
    if (replyIndex !== -1) {
        comment.replies.splice(replyIndex, 1)
    }
}

// Add this function back after shouldShowMoreReplies
const toggleShowAllReplies = (comment) => {
    comment.showAllReplies = !comment.showAllReplies
}

// Add back the interaction handlers
const toggleLike = () => {
    isLiked.value = !isLiked.value
    likes.value += isLiked.value ? 1 : -1 // Increment/decrement likes
}

const toggleBookmark = () => {
    isBookmarked.value = !isBookmarked.value
}

const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
}

const toggleRepost = () => {
    isReposted.value = !isReposted.value
}

// Add this computed property
const markdownContent = computed(() => {
    return md.render(content)
})
</script>