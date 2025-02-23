<template>
    <div class="p-4">
        <!-- New Post Component -->
        <NewPost />

        <!-- Feed Section -->
        <div class="space-y-4">
            <div class="bg-white p-4 rounded-lg shadow-md">
                <h3 class="font-semibold">Post Title</h3>
                <p>This is an example of a post in the feed.</p>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-md">
                <h3 class="font-semibold">Another Post Title</h3>
                <p>This is another example of a post in the feed.</p>
            </div>
            <!-- Add more posts as needed -->
        </div>
    </div>
</template>

<script setup>
import NewPost from '@/components/NewPost.vue';
</script>

<style scoped>
/* Additional styles can be added here */
</style>