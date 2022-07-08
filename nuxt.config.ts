import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    css: ["~/assets/tailwind.css"],
    buildModules: ['@pinia/nuxt'],
    build: {
      postcss: {
          postcssOptions: {
              plugins: {
                  tailwindcss: {},
                  autoprefixer: {},
              }
          }
      }
    },
    nitro: {
        externals: {
            inline: ['uuid']
        }
    }
})
