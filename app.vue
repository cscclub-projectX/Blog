<template>
  <div>
    <NuxtLayout>
      <Post :isPostOwner="true" />
    </NuxtLayout>
  </div>
</template>

<script setup>
// For now, we'll just pass isPostOwner as true
// Later you can add proper user authentication and post ownership logic
</script>
