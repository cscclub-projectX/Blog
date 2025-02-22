<template>
  <div class="flex flex-col min-h-screen  relative">
    <!-- Top Header for Mobile -->
  <div class="flex items-center justify-between p-2  shadow md:hidden">
      <button 
        @click="toggleLeftSidebar" 
        class=" p-2 rounded-md"
      >
        <span class="sr-only">Toggle Left Sidebar</span>
        {{ isLeftSidebarOpen ? '❌' : '☰' }}
      </button>

      <div class="flex -space-x-5 justify-center">
        <NuxtImg src="/images/cscc_usdb_logo.jpg" alt="Logo" class="w-12 h-12 rounded-2xl bg-gradient-to-r border-2 border-white from-purple-200 to-blue-200" />
        <NuxtImg src="/images/image.png" alt="Profile Picture" class="w-12 h-12 rounded-full border-2 border-white" />
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
        :class="`fixed left-0 top-0  h-screen transition-all duration-300 
          ${isLeftSidebarOpen ? 'w-11/12 translate-x-0 md:w-1/6 lg:w-1/6' : 'w-full -translate-x-full'} 
          md:translate-x-0`" 
        :closeSidebar="toggleLeftSidebar"
      />

      <!-- Main Content -->
      <main 
        :class="`overflow-y-auto mx-auto min-h-screen transition-all duration-300
          ${isLeftSidebarOpen && isRightSidebarOpen ? 'w-4/6 ml-1/6' : 
          isLeftSidebarOpen ? 'w-5/6 ml-1/6' :
          isRightSidebarOpen ? 'w-5/6' : 'w-full'} 
          md:w-4/6 md:ml-1/6`"
      >
        <NuxtPage class="p-4"/>
      </main>

      <!-- Right Sidebar -->
      <RightSidebar 
        :class="`fixed right-0 top-0 h-screen transition-all duration-300
          ${isRightSidebarOpen ? 'w-11/12 translate-x-0 md:w-2/6 lg:w-2/6' : 'w-full translate-x-full'} 
          md:translate-x-0`" 
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