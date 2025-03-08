<template>
    <aside class=" p-4 space-y-6 h-screen overflow-y-auto bg-white rounded-l-2xl shadow-2xl md:shadow lg:shadow ">
        <!-- Close Button -->
        <div class="flex justify-start mb-4">
            <button @click="closeSidebar" class="text-gray-600 bg-red-200 rounded-full  text-xs   p-2 hover:text-gray-800 md:hidden lg:hidden">
              ❌ <!-- Close icon -->
            </button>
          </div>

        <!-- Featured Posts -->
        <div class="bg-white rounded-l-2xl p-4 ">
            <h2 class="text-lg font-bold mb-4">🌟 Featured Posts</h2>
            <div v-if="isLoadingPosts" class="flex justify-center items-center h-32">
                <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
            <div v-else-if="featuredPosts.length === 0" class="text-center py-4 text-gray-500">
                No featured posts available
            </div>
            <div v-else class="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div v-for="post in displayedPosts" :key="post.id"
                    class="rounded-xl hover:bg-blue-50 transition-all duration-200 cursor-pointer border border-gray-200"
                    @click="navigateToPost(post.id)">
                    <div class="relative p-2">
                        <div class="flex items-center space-x-2 mb-2">
                            <img :src="post.authorAvatar" alt="Author" class="w-6 h-6 rounded-full">
                            <span class="text-sm font-medium text-gray-800">{{ post.authorName }}</span>
                        </div>
                        <div class="w-full h-24 rounded-lg overflow-hidden">
                            <img v-if="post.banner" :src="post.banner" alt="Banner" class="w-full h-24 object-cover">
                            <div v-else class="w-full h-24 bg-gray-100 flex items-center justify-center">
                                <Icon name="solar:gallery-wide-bold" class="text-3xl text-gray-300" />
                            </div>
                        </div>
                        <h3 class="font-medium mt-2 text-sm line-clamp-3">{{ post.title }}</h3>
                        <p class="text-xs text-gray-500 mt-1 line-clamp-2">{{ post.excerpt }}</p>
                    </div>
                </div>
            </div>
            <button v-if="hasMorePosts" @click="showMorePosts"
                class="w-full mt-4 p-2 text-sm text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 border border-blue-100">
                Show More
            </button>
        </div>

        <!-- Trending Topics -->
        <div class="bg-white rounded-2xl p-4 ">
            <h2 class="text-lg font-bold mb-4">🔥 Trending Topics</h2>
            <div v-if="isLoadingTopics" class="flex justify-center items-center h-16">
                <div class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
            </div>
            <div v-else-if="trendingTopics.length === 0" class="text-center py-2 text-gray-500">
                No trending topics available
            </div>
            <div v-else class="flex flex-wrap gap-2">
                <span v-for="topic in trendingTopics" :key="topic.name"
                    class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-all duration-200 cursor-pointer">
                    #{{ topic.name }} <span class="text-xs text-blue-500">({{ topic.count }})</span>
                </span>
            </div>
        </div>

        <!-- Suggested Authors -->
        <div class="bg-white rounded-2xl p-4 ">
            <h2 class="text-lg font-bold mb-4">✨ Suggested Authors</h2>
            <div v-if="isLoadingAuthors" class="flex justify-center items-center h-24">
                <div class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
            </div>
            <div v-else-if="suggestedAuthors.length === 0" class="text-center py-4 text-gray-500">
                No suggested authors available
            </div>
            <div v-else class="space-y-3">
                <div v-for="author in suggestedAuthors" :key="author.id"
                    class="flex items-center justify-between p-2 rounded-xl hover:bg-blue-50 transition-all duration-200 cursor-pointer border border-gray-200">
                    <div class="flex items-center space-x-3">
                        <img :src="author.avatar" :alt="author.name" class="w-10 h-10 rounded-full">
                        <div>
                            <h3 class="font-medium">{{ author.name }}</h3>
                            <p class="text-sm text-gray-500">{{ author.bio }}</p>
                        </div>
                    </div>
                    <button @click="navigateToProfile(author.id)"
                        class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-all duration-200">
                        Go to
                    </button>
                </div>
            </div>
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
/* Additional styles can be added here */
</style>