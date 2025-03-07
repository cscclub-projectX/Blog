import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  vite: {
    plugins: [tailwindcss()],
  },

  css: [
    '~/assets/css/main.css',"@milkdown/theme-nord/style.css",
  ],


 modules: [
    '@nuxt/image',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/content',
  ],
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
        }
      ],
    }
  },

  // Disable SSR for auth-related routes
  // routeRules: {
  //   // Disable SSR for specific routes
  //   '/': { ssr: false },
  //   '/auth/**': { ssr: false },
  //   // Add other routes that need client-side auth
  // },
  ssr: false,
  // Alternatively, you can disable SSR globally if your entire app relies on client-side auth
  // ssr: false,
})
