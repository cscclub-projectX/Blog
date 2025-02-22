<template>
  <div class="flex flex-col min-h-screen relative overflow-hidden">
    <!-- Top Header for Mobile -->
    <div class="flex items-center justify-between p-2  shadow md:hidden">
      <button 
        @click="toggleLeftSidebar" 
        class=" p-2 rounded-md"
      >
        <span class="sr-only">Toggle Left Sidebar</span>
        {{ isLeftSidebarOpen ? '❌' : '☰' }}
      </button>

      <div class="flex -space-x-5 items-center">
        <NuxtImg src="/images/cscc_usdb_logo.jpg" alt="Logo" class="w-12 h-12 rounded-2xl bg-gradient-to-r border-2 border-white from-purple-200 to-blue-200" />
        <NuxtImg src="/images/image.webp" alt="Profile Picture" class="w-12 h-12 rounded-full border-2 border-white" />
      </div>

      <button 
        @click="toggleRightSidebar" 
        class=" p-2 rounded-md"
      >
        <span class="sr-only">Toggle Right Sidebar</span>
        {{ isRightSidebarOpen ? '❌' : '⋮' }}
      </button>
    </div>

    <div class="flex flex-grow">
      <!-- Left Sidebar -->
      <Sidebar 
        :class="`fixed left-0 top-0 h-screen transition-all duration-300 z-50
          ${isLeftSidebarOpen ? 'w-12/12 translate-x-0' : '-translate-x-full'} 
          md:relative md:translate-x-0 md:w-72`" 
        :closeSidebar="toggleLeftSidebar"
      />

      <!-- Main Content -->
      <main 
        :class="`flex-1 min-h-screen transition-all duration-300 
          ${isLeftSidebarOpen ? 'ml-0' : ''}`"
      >
        <NuxtPage class="p-2 md:p-6 lg:p-8"/>
      </main>

      <!-- Right Sidebar -->
      <RightSidebar 
        :class="`fixed right-0 top-0 h-screen transition-all duration-300 z-50
          ${isRightSidebarOpen ? 'w-10/12 translate-x-0' : 'translate-x-full'} 
          md:relative md:translate-x-0 md:w-2/6 `" 
        :closeSidebar="toggleRightSidebar"
      />
    </div>
  </div>
</template>

<script setup>
const isLeftSidebarOpen = ref(false)
const isRightSidebarOpen = ref(false)

const toggleLeftSidebar = () => {
  isLeftSidebarOpen.value = !isLeftSidebarOpen.value
}

const toggleRightSidebar = () => {
  isRightSidebarOpen.value = !isRightSidebarOpen.value
}

// Set default state for larger screens
onMounted(() => {
  const handleResize = () => {
    if (window.innerWidth >= 768) { // md breakpoint
      isLeftSidebarOpen.value = true
      isRightSidebarOpen.value = true
    } else {
      isLeftSidebarOpen.value = false
      isRightSidebarOpen.value = false
    }
  }

  handleResize()
  window.addEventListener('resize', handleResize)
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })
})
</script>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.overflow-y-auto::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.overflow-y-auto {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>