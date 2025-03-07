<template>
    <div class="p-4">
        <!-- Login Dialog -->
        <LoginDialog />
        
        <!-- New Post Component -->
        <NewPost />
        
        <!-- Feed Section -->
        <div class="space-y-4">
            <div v-for="post in featuredPosts" :key="post.id" class="bg-white p-4 rounded-lg shadow-md">
                <div class="flex items-center mb-2">
                    <img :src="post.authorAvatar" alt="Author" class="w-8 h-8 rounded-full mr-2" />
                    <span class="font-medium">{{ post.author }}</span>
                </div>
                <h3 class="font-semibold">{{ post.title }}</h3>
                <p class="mt-2">{{ post.excerpt }}</p>
                <img v-if="post.banner" :src="post.banner" alt="Post banner" class="w-full h-40 object-cover mt-2 rounded-lg" />
            </div>
        </div>
    </div>
</template>

<script setup>
import NewPost from '@/components/NewPost.vue';
import LoginDialog from '@/components/LoginDialog.vue';
import { onMounted } from 'vue';
import { account } from '~/utils/appwrite';

// Define middleware
definePageMeta({
  middleware: ['auth']
});

// const isAuthenticated = useState('isAuthenticated', () => false);

// // Check authentication status on page load
// onMounted(async () => {
//   try {
//     const session = await account.getSession('current');
//     if (session) {
//       isAuthenticated.value = true;
//     }
//   } catch (error) {
//     console.log('No active session');
//     isAuthenticated.value = false;
//   }
// });

const featuredPosts = [
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
        title: "💡 𝟭𝟮-𝗙𝗮𝗰𝘁𝗼𝗿 ��𝗽𝗽 𝗘𝘅𝗽𝗹𝗮𝗶𝗻𝗲𝗱: 𝗕��𝗶𝗹𝗱 𝗦𝗰𝗮𝗹𝗮𝗯𝗹𝗲, 𝗥𝗲𝘀𝗶��𝗶��𝗻𝘁, 𝗮𝗻𝗱 𝗖𝗹𝗼𝘂𝗱-��𝗲𝗮𝗱𝘆 𝗔𝗽𝗽𝗹𝗶𝗰𝗮𝘁𝗶𝗼𝗻𝘀 𝑰𝒏 𝒕𝒐𝒅𝒂𝒚'𝒔 𝒄𝒍𝒐𝒖𝒅-𝒇𝒊𝒓𝒔𝒕 𝒘𝒐𝒓𝒍𝒅, 𝒃𝒖𝒊𝒍𝒅𝒊𝒏𝒈 𝒔𝒄𝒂𝒍𝒂𝒃𝒍𝒆 𝒂𝒏𝒅 𝒎𝒂𝒊𝒏𝒕𝒂𝒊𝒏𝒂𝒃𝒍𝒆 𝒂𝒑𝒑𝒍𝒊𝒄𝒂𝒕𝒊𝒐𝒏𝒔 𝒊𝒔 𝒆𝒔𝒔𝒆𝒏𝒕𝒊𝒂𝒍. 𝑻𝒉𝒆 12-𝑭𝒂𝒄𝒕𝒐𝒓 𝑨𝒑𝒑 𝒑𝒓𝒊𝒏𝒄𝒊𝒑𝒍𝒆𝒔 𝒐𝒇𝒇𝒆𝒓 𝒂 𝒑𝒓𝒐𝒗𝒆𝒏 𝒇𝒓𝒂𝒎𝒆𝒘𝒐𝒓𝒌 𝒕𝒐 𝒆𝒏𝒔𝒖𝒓𝒆 𝒚𝒐𝒖𝒓 𝒂𝒑𝒑𝒔 𝒂𝒓𝒆: ✅ Scalable ✅ Resilient ✅ Portable 𝙄'𝙫𝙚 ��𝙪��𝙢𝙖𝙧𝙞𝙯𝙚𝙙 𝙖𝙘𝙝 𝙥𝙧𝙞𝙣𝙘𝙞𝙡𝙚 𝙞𝙣 𝙩𝙝𝙚 ��𝙩𝙩𝙖𝙘𝙝𝙚�� 𝙨𝙡𝙞𝙙𝙚𝙨. ��𝙤𝙧 𝙖 𝙙𝙚𝙚�� 𝙙𝙞𝙫𝙚, 𝙘𝙝𝙚𝙘�� 𝙤𝙪𝙩 𝙢𝙮 𝙙𝙚𝙩𝙖𝙞𝙡𝙚𝙙 𝙈𝙚𝙙𝙞𝙪𝙢 𝙗𝙡𝙤𝙜 👇",
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
];
</script>

<style scoped>
/* Additional styles can be added here */
</style>