<template>
    <aside class=" p-4 space-y-6 h-screen overflow-y-auto bg-white rounded-l-2xl shadow">
        <!-- Close Button -->
        <button @click="closeSidebar" class="mb-4 text-gray-600 hover:text-gray-800  md:hidden lg:hidden">
            ❌ <!-- Close icon -->
        </button>

        <!-- Featured Posts -->
        <div class="bg-white rounded-l-2xl p-4 ">
            <h2 class="text-lg font-bold mb-4">🌟 Featured Posts</h2>
            <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div v-for="post in displayedPosts" :key="post.id"
                    class="rounded-xl hover:bg-blue-50 transition-all duration-200 cursor-pointer border border-gray-200">
                    <div class="relative p-2">
                        <div class="flex items-center space-x-2 mb-2">
                            <img :src="post.authorAvatar" alt="Author" class="w-6 h-6 rounded-full">
                            <span class="text-sm font-medium text-gray-800">{{ post.author }}</span>
                        </div>
                        <img :src="post.banner" alt="Banner" class="w-full h-24 object-cover rounded-lg">
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
            <div class="flex flex-wrap gap-2">
                <span v-for="topic in trendingTopics" :key="topic.name"
                    class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-all duration-200 cursor-pointer">
                    #{{ topic.name }}
                </span>
            </div>
        </div>

        <!-- Suggested Authors -->
        <div class="bg-white rounded-2xl p-4 ">
            <h2 class="text-lg font-bold mb-4">✨ Suggested Authors</h2>
            <div class="space-y-3">
                <div v-for="author in suggestedAuthors" :key="author.id"
                    class="flex items-center justify-between p-2 rounded-xl hover:bg-blue-50 transition-all duration-200 cursor-pointer border border-gray-200">
                    <div class="flex items-center space-x-3">
                        <img :src="author.avatar" :alt="author.name" class="w-10 h-10 rounded-full">
                        <div>
                            <h3 class="font-medium">{{ author.name }}</h3>
                            <p class="text-sm text-gray-500">{{ author.bio }}</p>
                        </div>
                    </div>
                    <button
                        class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-all duration-200">
                        Follow
                    </button>
                </div>
            </div>
        </div>
    </aside>
</template>

<script>
export default {
    name: 'RightSidebar',
    props: {
        closeSidebar: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            displayLimit: 4,
            featuredPosts: [
                {
                    id: 1,
                    author: 'David Brown',
                    authorAvatar: 'https://media.daily.dev/image/upload/s--8RgfhdLj--/f_auto/v1737993116/avatars/avatar_EaAOUEuOiOYZscNNJuGot',
                    title: "10 Git Commands You'll Wish You Knew Earlier",
                    excerpt: 'click the image',
                    banner: 'https://media.daily.dev/image/upload/s--Enaw3KNK--/f_auto/v1740051604/ugc/content_4b998fde-0fc4-4dbe-8d2a-408200dba31c'
                },
                {
                    id: 2,
                    author: 'Jane Smith',
                    authorAvatar: 'https://media.daily.dev/image/upload/s--tgEVJvQC--/f_auto/v1729363472/logos/networkchuck',
                    title: 'ChatGPT Operator is expensive....use this instead (FREE + Open Source)',
                    excerpt: "An alternative to the expensive OpenAI ChatGPT operator is introduced. This new open-source project allows an AI to execute tasks via browser automation, and it is demonstrated to set up and use. The performance of this alternative is compared to ChatGPT operator, with particular advantages noted such as using the user's own browser environment and locally installed AI resources. Various AI models, including llama, are tested, showing potential for significant automation but also some limitations. The hands-on approach highlights how open-source solutions can effectively meet user needs without high costs.",
                    banner: 'https://media.daily.dev/image/upload/f_auto,q_auto/v1/posts/0cd31a69304915d156f5105305d4322c?_a=AQAEuiZ'
                },
                {
                    id: 3,
                    author: 'Mike Johnson',
                    authorAvatar: 'https://media.daily.dev/image/upload/s--YjSbtG5v--/f_auto/v1733026503/avatars/avatar_aCxSPB6hJYagKGCV84RvG',
                    title: "Godot 4.4 has reached the Release Candidate stage! All features are in, critical regressions fixed, and it's ready for production use. It still needs your help testing, so give it a try (remember to make backups!) 🚀",
                    excerpt: "Godot 4.4 Release Candidate 1 marks the final stage of development for version 4.4. All features are in place, and the release is ready for testing in production projects. This release focuses on regression fixes and improving existing features. Users are encouraged to test and report any new issues. Financial support for the project is appreciated to help continue its development. ",
                    banner: 'https://media.daily.dev/image/upload/f_auto,q_auto/v1/posts/70e75a045cd1f2c1a1f240c350822554?_a=AQAEuj9'
                },
                {
                    id: 4,
                    author: 'Sarah Williams',
                    authorAvatar: 'https://media.daily.dev/image/upload/s--jZT9A67D--/f_auto/v1729165440/avatars/avatar_O2vqkbcQQ55qXK2hihh7u',
                    title: "💡 𝟭𝟮-𝗙𝗮𝗰𝘁𝗼𝗿 𝗔𝗽𝗽 𝗘𝘅𝗽𝗹𝗮𝗶𝗻𝗲𝗱: 𝗕𝘂𝗶𝗹𝗱 𝗦𝗰𝗮𝗹𝗮𝗯𝗹𝗲, 𝗥𝗲𝘀��𝗹𝗶𝗲𝗻𝘁, 𝗮𝗻𝗱 𝗖𝗹𝗼𝘂𝗱-𝗥𝗲𝗮𝗱𝘆 𝗔𝗽𝗽𝗹𝗶𝗰𝗮𝘁𝗶𝗼𝗻𝘀 𝑰𝒏 𝒕𝒐𝒅𝒂𝒚'𝒔 𝒄𝒍𝒐𝒖𝒅-𝒇𝒊𝒓𝒔𝒕 𝒘𝒐𝒓𝒍𝒅, 𝒃𝒖𝒊𝒍𝒅𝒊𝒏𝒈 𝒔𝒄𝒂𝒍𝒂𝒃𝒍𝒆 𝒂𝒏𝒅 𝒎𝒂𝒊𝒏𝒕𝒂𝒊𝒏𝒂𝒃𝒍𝒆 𝒂𝒑𝒑𝒍𝒊𝒄𝒂𝒕𝒊𝒐𝒏𝒔 𝒊𝒔 𝒆𝒔𝒔𝒆𝒏𝒕𝒊𝒂𝒍. 𝑻𝒉𝒆 12-𝑭𝒂𝒄𝒕𝒐𝒓 𝑨𝒑𝒑 𝒑𝒓𝒊𝒏𝒄𝒊𝒑𝒍𝒆𝒔 𝒐𝒇𝒇𝒆𝒓 𝒂 𝒑𝒓𝒐𝒗𝒆𝒏 𝒇𝒓𝒂𝒎𝒆𝒘𝒐𝒓𝒌 𝒕𝒐 𝒆𝒏𝒔𝒖𝒓𝒆 𝒚𝒐𝒖𝒓 𝒂𝒑𝒑𝒔 𝒂𝒓𝒆: ✅ Scalable ✅ Resilient ✅ Portable 𝙄'𝙫𝙚 𝙨𝙪𝙢𝙢𝙖𝙧𝙞𝙯𝙚𝙙 ��𝙖𝙘𝙝 𝙥𝙧𝙞𝙣𝙘𝙞𝙡𝙚 𝙞𝙣 𝙩𝙝𝙚 𝙖𝙩𝙩𝙖𝙘𝙝𝙚𝙙 𝙨𝙡𝙞𝙙𝙚𝙨. 𝙁𝙤𝙧 𝙖 𝙙𝙚𝙚𝙥 𝙙𝙞𝙫𝙚, 𝙘𝙝𝙚𝙘𝙠 𝙤𝙪𝙩 𝙢𝙮 𝙙𝙚𝙩𝙖𝙞𝙡𝙚𝙙 𝙈𝙚𝙙𝙞𝙪𝙢 𝙗𝙡𝙤𝙜 👇",
                    excerpt: 'The 12-Factor App methodology offers a set of best practices for developing scalable, resilient, and easy-to-manage cloud-native applications. This guide breaks down each principle with real-world examples and practical implementations for .NET developers and cloud architects. Key practices include using environment variables for configurations, managing dependencies with package managers, ensuring stateless processes, and maintaining minimal differences across development, staging, and production environments.',
                    banner: 'https://media.daily.dev/image/upload/f_auto,q_auto/v1/posts/e40af8b48b9261ef3d48c8c2d8f5b791?_a=AQAEuj9'
                },
                {
                    id: 5,
                    author: 'David Brown',
                    authorAvatar: 'https://media.daily.dev/image/upload/s--8RgfhdLj--/f_auto/v1737993116/avatars/avatar_EaAOUEuOiOYZscNNJuGot',
                    title: "10 Git Commands You'll Wish You Knew Earlier",
                    excerpt: 'click the image',
                    banner: 'https://media.daily.dev/image/upload/s--Enaw3KNK--/f_auto/v1740051604/ugc/content_4b998fde-0fc4-4dbe-8d2a-408200dba31c'
                }
            ],
            trendingTopics: [
                { name: 'Design' },
                { name: 'Technology' },
                { name: 'Programming' },
                { name: 'UI/UX' },
                { name: 'Productivity' }
            ],
            suggestedAuthors: [
                {
                    id: 1,
                    name: 'Alice Johnson',
                    avatar: 'https://media.daily.dev/image/upload/s--YvwQMX-3--/f_auto/v1735373719/avatars/avatar_uLAYlzyDjTI35qcLSY5yc',
                    bio: 'UI/UX Designer'
                },
                {
                    id: 2,
                    name: 'Bob Wilson',
                    avatar: 'https://media.daily.dev/image/upload/s--us7Mqjk6--/f_auto/v1714798819/logos/danielhaxxse',
                    bio: 'Frontend Developer'
                }
            ]
        }
    },
    computed: {
        displayedPosts() {
            return this.featuredPosts.slice(0, this.displayLimit);
        },
        hasMorePosts() {
            return this.featuredPosts.length > this.displayLimit;
        }
    },
    methods: {
        showMorePosts() {
            this.$router.push('/posts');
        }
    }
}
</script>

<style scoped>
/* Additional styles can be added here */
</style>