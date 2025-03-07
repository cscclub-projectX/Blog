export default defineNuxtPlugin(async (nuxtApp) => {
  // Create a reactive state for authentication
  const isAuthenticated = useState('isAuthenticated', () => false)
  
  // Function to check if user is authenticated

  
  // Login function
  const login = async (email, password) => {
    try {
      const { account } = await import('~/utils/appwrite')
      
      // Create email session
      await account.createEmailSession(email, password)
      
      // Update authentication state
      await checkAuth()
      
      // Hide login dialog
      const showLoginDialog = useState('showLoginDialog')
      showLoginDialog.value = false
      
      return true
    } catch (error) {
      console.error('Login error:', error.message)
      throw error
    }
  }
  
  // Logout function
  const logout = async () => {
    try {
      const { account } = await import('~/utils/appwrite')
      
      // Delete current session
      await account.deleteSession('current')
      
      // Update state
      isAuthenticated.value = false
      
      return true
    } catch (error) {
      console.error('Logout error:', error.message)
      throw error
    }
  }
  

  // Provide auth utilities to the app
  return {
    provide: {
      auth: {
        login,
        logout
      }
    }
  }
}) 