// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },
  ssr: false,
  css: ["~/assets/css/main.css"],
  modules: ["@nuxt/eslint", "@nuxt/icon", "@nuxt/image", "@nuxt/ui"],
  ui: {
    colorMode: false,
  },
  routeRules: {
    "/": { redirect: "/dashboard" },
  },
  app: {
    head: {
      htmlAttrs: {
        lang: "en",
      },
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },
  runtimeConfig: {
    public: {
      baseUrl: process.env.BASE_URL,
    },
  },
});
