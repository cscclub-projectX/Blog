<template>
    <aside class="p-5 h-screen overflow-y-auto bg-white border-l border-gray-100">
        <!-- Close Button (Mobile Only) -->
        <div class="flex justify-end mb-4 md:hidden">
            <button @click="closeSidebar" class="text-gray-500 hover:text-gray-700 p-1 rounded-full">
                <Icon name="solar:close-circle-bold" class="text-xl" />
            </button>
        </div>

        <!-- Search Bar -->
        <div class="relative mb-6">
            <input 
                type="text" 
                placeholder="Search" 
                class="w-full py-2 pl-10 pr-4 bg-gray-100 border-none rounded-full focus:bg-white focus:ring-1 focus:ring-gray-200"
            />
            <Icon name="solar:magnifer-linear" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        <!-- Featured Posts -->
        <div class="mb-8">
            <h2 class="text-base font-bold mb-4 text-gray-900">Featured Posts</h2>
            <div v-if="isLoadingPosts" class="flex justify-center items-center h-32">
                <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-300"></div>
            </div>
            <div v-else-if="featuredPosts.length === 0" class="text-center py-4 text-gray-500">
                No featured posts available
            </div>
            <div v-else class="space-y-4">
                <div v-for="post in displayedPosts" :key="post.id"
                    class="group cursor-pointer"
                    @click="navigateToPost(post.id)">
                    <div class="flex items-start gap-3 border-black/10 border   rounded-lg p-2">
                        <!-- Author Avatar -->
                        <img :src="post.authorAvatar" alt="Author" class="w-6 h-6 rounded-full mt-1">
                        
                        <!-- Post Content -->
                        <div class="flex-1">
                            <!-- Author Name -->
                            <div class="flex items-center mb-1">
                                <span class="text-xs font-medium text-gray-800">{{ post.authorName }}</span>
                            </div>
                            
                            <!-- Post Title -->
                            <h3 class="font-bold text-sm group-hover:text-gray-900 text-gray-800 line-clamp-2 mb-1">
                                {{ post.title }}
                            </h3>
                            
                            <!-- Post Stats -->
                            <div class="flex items-center text-xs text-gray-500">
                                <span>{{ post.views }} views</span>
                                <span class="mx-1">·</span>
                                <span>{{ post.likes }} likes</span>
                            </div>
                        </div>
                        
                        <!-- Post Thumbnail -->
                        <div v-if="post.banner" class="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden">
                            <img :src="post.banner" alt="Banner" class="w-full h-full object-cover">
                        </div>
                    </div>
                </div>
            </div>
            <button v-if="hasMorePosts" @click="showMorePosts"
                class="w-full mt-4 py-2 text-sm text-gray-500 hover:text-gray-800 transition-colors">
                See more recommendations
            </button>
        </div>

        <!-- Trending Topics -->
        <!-- <div class="mb-8">
            <h2 class="text-base font-bold mb-4 text-gray-900">Trending Topics</h2>
            <div v-if="isLoadingTopics" class="flex justify-center items-center h-16">
                <div class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-300"></div>
            </div>
            <div v-else-if="trendingTopics.length === 0" class="text-center py-2 text-gray-500">
                No trending topics available
            </div>
            <div v-else class="flex flex-wrap gap-2">
                <span v-for="topic in trendingTopics" :key="topic.name"
                    class="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer">
                    {{ topic.name }}
                </span>
            </div>
        </div> -->

        <!-- Suggested Authors -->
        <div class="mb-8">
            <h2 class="text-base font-bold mb-4 text-gray-900">Who to follow</h2>
            <div v-if="isLoadingAuthors" class="flex justify-center items-center h-24">
                <div class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-300"></div>
            </div>
            <div v-else-if="suggestedAuthors.length === 0" class="text-center py-4 text-gray-500">
                No suggested authors available
            </div>
            <div v-else class="space-y-4">
                <div v-for="author in suggestedAuthors" :key="author.id"
                    class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <img :src="author.avatar" :alt="author.name" class="w-8 h-8 rounded-full">
                        <div>
                            <h3 class="font-medium text-sm">{{ author.name }}</h3>
                            <p class="text-xs text-gray-500 line-clamp-1">{{ author.bio }}</p>
                        </div>
                    </div>
                    <button @click="navigateToProfile(author.id)"
                        class="ml-2 px-3 py-1 border border-gray-300 text-gray-700 rounded-full text-xs hover:bg-gray-100 transition-colors">
                        Go to profile
                    </button>
                </div>
            </div>
        </div>

        <!-- Footer Links -->
        <div class="pt-4 border-t border-gray-100">
            <div class="flex flex-wrap gap-x-2 gap-y-1 text-xs text-gray-500 mb-4">
                <!-- <a href="#" class="hover:text-gray-800">Help</a>
                <a href="#" class="hover:text-gray-800">Status</a>
                <a href="#" class="hover:text-gray-800">Writers</a>
                <a href="#" class="hover:text-gray-800">Blog</a>
                <a href="#" class="hover:text-gray-800">Careers</a>
                <a href="#" class="hover:text-gray-800">Privacy</a>
                <a href="#" class="hover:text-gray-800">Terms</a>
                <a href="#" class="hover:text-gray-800">About</a> -->
            </div>
            <!-- <p class="text-xs text-gray-400">© 2023 CSCC, Inc.</p> -->
        </div>
    </aside>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { databases, DATABASE_ID, POSTS_COLLECTION_ID, USERS_COLLECTION_ID } from '~/utils/appwrite';
import { Query } from 'appwrite';

const props = defineProps({
    closeSidebar: {
        type: Function,
        required: true
    }
});

const router = useRouter();
const currentUser = useState('currentUser', () => null);

// State
const featuredPosts = ref([]);
const trendingTopics = ref([]);
const suggestedAuthors = ref([]);
const displayLimit = ref(4);
const isLoadingPosts = ref(true);
const isLoadingTopics = ref(true);
const isLoadingAuthors = ref(true);

// Computed
const displayedPosts = computed(() => {
    return featuredPosts.value.slice(0, displayLimit.value);
});

const hasMorePosts = computed(() => {
    return featuredPosts.value.length > displayLimit.value;
});

// Methods
const fetchFeaturedPosts = async () => {
    try {
        isLoadingPosts.value = true;
        
        const response = await databases.listDocuments(
            DATABASE_ID,
            POSTS_COLLECTION_ID,
            [
                Query.isNull("isDeletedAt"),
                Query.equal("isHidden", false),
                Query.orderDesc("views"),
                Query.limit(10)
            ]
        );
        
        featuredPosts.value = await Promise.all(response.documents.map(async doc => {
            return {
                id: doc.$id,
                authorId: doc.authorId,
                authorName: doc.authorId?.name || 'Anonymous',
                authorUsername: doc.authorId?.username || 'Anonymous',
                authorAvatar: doc.authorId?.profileImage || 'https://via.placeholder.com/150',
                title: doc.title,
                excerpt: doc.Markdown ? doc.Markdown.substring(0, 100) + '...' : '',
                banner: doc.coverImage || null,
                views: doc.views || 0,
                likes: doc.likes || 0
            };
        }));
    } catch (err) {
        console.error('Error fetching featured posts:', err);
    } finally {
        isLoadingPosts.value = false;
    }
};

const fetchTrendingTopics = async () => {
    try {
        isLoadingTopics.value = true;
        
        // Get all posts with tags
        const response = await databases.listDocuments(
            DATABASE_ID,
            POSTS_COLLECTION_ID,
            [
                Query.isNull("isDeletedAt"),
                Query.equal("isHidden", false),
                Query.limit(100)
            ]
        );
        
        // Count tag occurrences
        const tagCounts = {};
        response.documents.forEach(doc => {
            if (doc.tags && Array.isArray(doc.tags)) {
                doc.tags.forEach(tag => {
                    if (tag) {
                        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                    }
                });
            }
        });
        
        // Convert to array and sort by count
        const sortedTags = Object.entries(tagCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5); // Get top 5 tags
        
        trendingTopics.value = sortedTags;
    } catch (err) {
        console.error('Error fetching trending topics:', err);
    } finally {
        isLoadingTopics.value = false;
    }
};

const fetchSuggestedAuthors = async () => {
    try {
        isLoadingAuthors.value = true;
        
        // Skip current user from suggestions
        let queries = [
            Query.limit(5)
        ];
        
        if (currentUser.value) {
            queries.push(Query.notEqual('$id', currentUser.value.$id));
        }
        
        const response = await databases.listDocuments(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            queries
        );
        
        suggestedAuthors.value = response.documents.map(doc => ({
            id: doc.$id,
            name: doc.name || 'Anonymous',
            avatar: doc.profileImage || 'https://via.placeholder.com/150',
            bio: doc.bio || 'User'
        }));
    } catch (err) {
        console.error('Error fetching suggested authors:', err);
    } finally {
        isLoadingAuthors.value = false;
    }
};

const navigateToPost = (postId) => {
    router.push(`/post/${postId}`);
};

const navigateToProfile = (userId) => {
    router.push(`/user/${userId}`);
};

const showMorePosts = () => {
    router.push('/posts');
};

// Lifecycle
onMounted(() => {
    fetchFeaturedPosts();
    fetchTrendingTopics();
    fetchSuggestedAuthors();
});
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>