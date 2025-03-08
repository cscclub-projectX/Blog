export default defineNuxtRouteMiddleware(async (to, from) => {
    try {
        const isAuthenticated = useState('isAuthenticated', () => false)
        const { account } = await import('~/utils/appwrite')
        // This will throw an error if no valid session exists
        const session = await account.getSession('current')
        console.log(session)
        // If we get here, there is a valid session
        console.log('Valid session found')
        // Set authenticated state
        isAuthenticated.value = true
        // Try to get user info
        try {
            const user = await account.get()
            useState('currentUser', () => user)
            try {
                const response = await databases.listDocuments(
                  DATABASE_ID,
                  USERS_COLLECTION_ID,
                  [Query.equal('$id',  user.$id )]
                );
                useState('Profile', () => response.documents[0])
            } catch (userError) {
                console.warn('Could not get user details, but session is valid')
            }
        } catch (userError) {
            console.warn('Could not get user details, but session is valid')
        }
        console.log('Middleware auth check:', isAuthenticated.value)
        // Check if we're on a page that requires authentication
        const requiresAuth = !['auth-login', 'auth-signup'].includes(to.name)
    } catch (error) {
        // Only show login dialog if not authenticated and on a page requiring auth
        console.log('Not authenticated, showing login dialog')

        // Create or update the showLoginDialog state
        const showLoginDialog = useState('showLoginDialog', () => false)
        showLoginDialog.value = true
    }
})
