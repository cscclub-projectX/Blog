import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  vite: {
    plugins: [tailwindcss()],
  },

<<<<<<< HEAD
  css: [
    '~/assets/css/main.css',"@milkdown/theme-nord/style.css",
  ],


 modules: [
    '@nuxt/image',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/content',
  ],
=======
  css: ["~/assets/css/main.css"],

  modules: ["@nuxt/image"],
>>>>>>> 062a115cd3926c433bcfa5ccd9b524d4363e8b91
  app: {
    head: {
      link: [
        {
<<<<<<< HEAD
          rel: 'stylesheet',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
        }
      ],
    }
  }

})
=======
          rel: "stylesheet",
          href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css",
        },
      ],
    },
  },
});
>>>>>>> 062a115cd3926c433bcfa5ccd9b524d4363e8b91
