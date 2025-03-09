<template>
    <!-- Houcine was here :) -->
    <div class="w-full md:max-w-2xl lg:max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8 h-screen overflow-y-auto hide-scrollbar bg-gray-50 ">
        <!-- Loading state -->
        <div v-if="isLoading" class="bg-white p-8 rounded-lg text-center shadow-sm">
            <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p class="text-gray-600">Loading post...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="bg-red-100 text-red-700 p-4 rounded-lg shadow-sm">
            <p>{{ error }}</p>
        </div>

        <!-- Post not found -->
        <div v-else-if="!post" class="bg-gray-100 p-8 rounded-lg text-center shadow-sm">
            <Icon name="solar:document-text-bold" class="text-4xl text-gray-400 mb-2" />
            <p class="text-gray-600">Post not found</p>
        </div>

        <!-- Post content -->
        <div v-else>
            <!-- Author info and metadata - Medium style top bar -->
            <div class="bg-white rounded-lg shadow-sm p-4 mb-6 sticky top-0  w-11/12 mx-auto rounded-xl border border-gray-200">
                <div class="flex items-center justify-between ">
                    <div class="flex items-center">
                        <NuxtLink :to="`/user/${post.authorId.$id}`" class="flex items-center">
                           
                            <img :src="post.authorAvatar" alt="Author" class="w-12 h-12 rounded-full mr-3 border border-gray-200" />
                            <div class="flex flex-col">
                                <span class="font-semibold text-gray-900">{{ post.authorName }}</span>
                                <div class="flex items-center text-gray-500 text-sm">
                                    <span>{{ post.authorUsername }}</span>
                                    <span class="mx-1">·</span>
                                    <span>{{ formatDate(post.createdAt) }}</span>
                                    
                                    <span v-if="post.isHidden" class="ml-2 bg-red-100 text-red-600 rounded-full px-2 py-0.5 text-xs">
                                        Private
                                    </span>
                                </div>
                            </div>
                        </NuxtLink>
                    </div>
                    
                    <!-- Social sharing -->
                    <div class="flex items-center space-x-3">
                        <button @click="copyLink" class="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
                            <Icon name="solar:link-bold" class="text-lg" />
                        </button>
                        
                        <!-- Author actions -->
                        <div v-if="post.authorId === currentUser?.$id" class="flex">
                            <NuxtLink :to="`/posts?edit=${post.id}`" class="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
                                <Icon name="solar:pen-bold" />
                            </NuxtLink>
                            
                            <button @click="toggleHidePost" class="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
                                <Icon :name="post.isHidden ? 'solar:eye-closed-bold' : 'solar:eye-bold'" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Main content area -->
            <div class="bg-white rounded-lg overflow-hidden mb-6">
                <!-- Post title section with type badge -->
                <div class="px-6 pt-6 pb-4">
                    <!-- Post Type Badge -->
                    <span 
                        :class="[
                            'text-xs px-2 py-1 rounded-full font-medium mb-3 inline-block',
                            post.type === 'article' 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-blue-100 text-blue-800'
                        ]"
                    >
                        {{ post.type || 'Post' }}
                    </span>
                    
                    <!-- Post title -->
                    <h1 class="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                        {{ post.title }}
                    </h1>
                </div>
                
                <!-- Post cover image - full width like Medium -->
                <img v-if="post.banner" :src="post.banner" alt="Post banner" class="w-full max-h-[500px] object-cover rounded-2xl" />
                
                <!-- Post content - with improved typography -->
                <div class="p-6 md:p-8">
                    <MDC 
                        :value="processedContent" 
                        tag="article" 
                        class="prose prose-lg md:prose-xl max-w-none prose-headings:font-semibold prose-a:text-blue-600" 
                    />
                </div>
                
                <!-- Post stats and actions - Medium style bottom bar -->
                <div class="flex items-center justify-between px-6 py-4 border-t border-gray-300 bg-gray-50">
                    <div class="flex items-center space-x-6">
                        <button @click="toggleLikePost" class="flex items-center space-x-1 group">
                            <Icon :name="post.userLiked ? 'solar:heart-bold' : 'solar:heart-outline'"
                                  :class="post.userLiked ? 'text-red-500' : 'text-gray-500 group-hover:text-red-500'" 
                                  class="text-xl transition-colors" />
                            <span class="text-gray-700">{{ post.likes }}</span>
                        </button>
                        
                        <div class="flex items-center space-x-1">
                            <Icon name="solar:eye-bold" class="text-gray-500 text-xl" />
                            <span class="text-gray-700">{{ post.views }}</span>
                        </div>
                    </div>
                    
                    <div class="flex items-center space-x-2">
                        <button @click="toggleBookmark" class="p-2 rounded-full hover:bg-gray-200">
                            <Icon :name="isBookmarked ? 'solar:bookmark-bold' : 'solar:bookmark-outline'" 
                                  :class="isBookmarked ? 'text-blue-500' : 'text-gray-500'"
                                  class="text-xl" />
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Author bio section - Medium style -->
            <div class="bg-white rounded-lg  p-6 mb-6">
                <div class="flex items-start sm:flex-row flex-col">
                    <NuxtLink :to="`/user/${post.authorId.$id}`">
                        <img :src="post.authorAvatar" alt="Author" class="w-14 h-14 rounded-full mr-4 border border-gray-200" />
                    </NuxtLink>
                    <div>
                        <h3 class="font-bold text-lg mb-1">Written by {{ post.authorName }}</h3>
                        <p class="text-gray-600 mb-3">Author bio would go here. This is a placeholder for the author's biography.</p>
                        <NuxtLink :to="`/user/${post.authorId.$id}`" class="text-green-600 font-medium hover:text-green-700">
                            More from {{ post.authorName }}
                        </NuxtLink>
                    </div>
                </div>
            </div>
            
            <!-- Comments section could go here -->
        </div>
    </div>
</template>

<script setup>
// Define middleware
definePageMeta({
  middleware: ['auth']
});
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { databases, client, DATABASE_ID, POSTS_COLLECTION_ID } from '~/utils/appwrite'



const isBookmarked = ref(false)
const isReposted = ref(false)


// Comment input state
const newComment = ref('')
const showCommentInput = ref(false)
const commentInput = ref(null) // Reference to comment textarea for focus


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
    toggleLikePost();
}

const toggleBookmark = () => {
    isBookmarked.value = !isBookmarked.value
}

const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    // You could add a toast notification here
    alert('Link copied to clipboard!');
}

const toggleRepost = () => {
    isReposted.value = !isReposted.value
}

// Process markdown content
const processedContent = computed(() => {
  return post.value?.content || ''
})

// Define middleware
definePageMeta({
    middleware: ['auth']
})

const route = useRoute()
const post = ref(null)
const isLoading = ref(true)
const error = ref(null)
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

// Increment view count
const incrementViews = async (postId) => {
    try {
        if (!post.value || post.value.viewIncremented) return
        
        // Mark as incremented to prevent multiple increments
        post.value.viewIncremented = true
        
        // Get current post data
        const postDoc = await databases.getDocument(
            DATABASE_ID,
            POSTS_COLLECTION_ID,
            postId
        )
        
        // Increment views
        const updatedViews = (postDoc.views || 0) + 1
        
        // Update in Appwrite
        await databases.updateDocument(
            DATABASE_ID,
            POSTS_COLLECTION_ID,
            postId,
            { views: updatedViews }
        )
        
        // Update local state
        post.value.views = updatedViews
    } catch (err) {
        console.error('Error incrementing views:', err)
    }
}

// Toggle like for a post
const toggleLikePost = async () => {
    if (!currentUser.value) {
        alert('Please log in to like posts')
        return
    }
    
    try {
        const userId = currentUser.value.$id
        const postId = post.value.id
        
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
            post.value.userLiked = true
        } else {
            // User already liked the post, so remove like
            updatedLikes = Math.max(0, updatedLikes - 1)
            updatedLikedBy.splice(userIndex, 1)
            post.value.userLiked = false
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
        
        // Update local state
        post.value.likes = updatedLikes
    } catch (err) {
        console.error('Error toggling like:', err)
    }
}

// Toggle hide post
const toggleHidePost = async () => {
    if (!currentUser.value || post.value.authorId !== currentUser.value.$id) {
        return
    }
    
    try {
        // Update in Appwrite
        await databases.updateDocument(
            DATABASE_ID,
            POSTS_COLLECTION_ID,
            post.value.id,
            { isHidden: !post.value.isHidden }
        )
        
        // Update local state
        post.value.isHidden = !post.value.isHidden
        
    } catch (err) {
        console.error('Error toggling post visibility:', err)
        alert('Failed to update post visibility. Please try again.')
    }
}

// Subscribe to realtime updates for this post
const subscribeToRealtimeUpdates = (postId) => {
    unsubscribe = client.subscribe(`databases.${DATABASE_ID}.collections.${POSTS_COLLECTION_ID}.documents.${postId}`, response => {
        // Handle realtime updates
        if (response.events.includes('databases.*.collections.*.documents.*.update')) {
            const updatedDoc = response.payload
            
            // Update post properties
            post.value.likes = updatedDoc.likes || 0
            post.value.views = updatedDoc.views || 0
            post.value.isHidden = updatedDoc.isHidden || false
            
            // Update liked status if current user is available
            if (currentUser.value) {
                const userId = currentUser.value.$id
                const likedBy = updatedDoc.likedBy || []
                post.value.userLiked = likedBy.includes(userId)
            }
        }
    })
}

// Fetch post by ID
const fetchPost = async (postId) => {
    try {
        isLoading.value = true
        error.value = null
        
        const postDoc = await databases.getDocument(
            DATABASE_ID,
            POSTS_COLLECTION_ID,
            postId
        )
        
        // Check if post is deleted
        if (postDoc.isDeletedAt) {
            error.value = "This post has been deleted"
            isLoading.value = false
            return
        }
        
        // Check if current user has liked this post
        const userLiked = currentUser.value && 
                          postDoc.likedBy && 
                          postDoc.likedBy.includes(currentUser.value.$id)
        
        post.value = {
            id: postDoc.$id,
            authorId: postDoc.authorId,
            authorName: postDoc.authorId?.name || 'Anonymous',
            authorUsername: postDoc.authorId?.username || 'Anonymous',
            authorAvatar: postDoc.authorId?.profileImage || 'https://via.placeholder.com/150',
            title: postDoc.title,
            content: postDoc.Markdown || '',
            banner: postDoc.coverImage || null,
            createdAt: postDoc.createdAt,
            views: postDoc.views || 0,
            likes: postDoc.likes || 0,
            isHidden: postDoc.isHidden || false,
            type: postDoc.type || 'post',
            userLiked: userLiked,
            viewIncremented: false
        }
        
        // Increment view count
        await incrementViews(postId)
        
        // Subscribe to realtime updates
        subscribeToRealtimeUpdates(postId)
        
    } catch (err) {
        console.error('Error fetching post:', err)
        error.value = 'Failed to load post. It may have been deleted or you don\'t have permission to view it.'
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    const postId = route.params.id
    if (postId) {
        fetchPost(postId)
    } else {
        error.value = 'Post ID is required'
        isLoading.value = false
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
/* Medium-like typography enhancements */
:deep(.prose) {
  font-family: 'Charter', 'Georgia', serif;
  line-height: 1.8;
  color: #292929;
}

:deep(.prose h1),
:deep(.prose h2),
:deep(.prose h3) {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  margin-top: 2em;
  margin-bottom: 0.8em;
  font-weight: 700;
}

:deep(.prose h1) {
  font-size: 2em;
}

:deep(.prose h2) {
  font-size: 1.5em;
}

:deep(.prose h3) {
  font-size: 1.25em;
}

:deep(.prose strong) {
  font-weight: 700;
}

:deep(.prose em) {
  font-style: italic;
}

:deep(.prose ul) {
  list-style-type: disc;
  padding-left: 1.5em;
  margin: 1em 0;
}

:deep(.prose ol) {
  list-style-type: decimal;
  padding-left: 1.5em;
  margin: 1em 0;
}

:deep(.prose blockquote) {
  border-left: 4px solid #e5e7eb;
  padding-left: 1em;
  margin: 1em 0;
  font-style: italic;
  color: #4b5563;
}

:deep(.prose code) {
  font-family: monospace;
  background-color: #f3f4f6;
  padding: 0.2em 0.4em;
  border-radius: 0.25em;
  font-size: 0.9em;
}

:deep(.prose pre) {
  background-color: #1f2937;
  color: #e5e7eb;
  padding: 1em;
  border-radius: 0.5em;
  overflow-x: auto;
  margin: 1em 0;
}

:deep(.prose p) {
  margin-bottom: 1.5em;
}

:deep(.prose img) {
  border-radius: 4px;
  max-width: 100%;
  height: auto;
}



/* Hide scrollbar but allow scrolling */
.hide-scrollbar {
  scrollbar-width: none; /* Firefox */
}
.hide-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Edge */
}
</style>