// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ["~/assets/scss/style.css"],
  modules: [
    "@nuxtjs/tailwindcss",
    "nuxt-icons",
    "@nuxtjs/i18n",
    "@nuxtjs/strapi",
    "@formkit/nuxt",
    "nuxt-time",
  ],
  app: {
    head: {
      title: "Клуб експертів",
    },
  },
  strapi: {
    url: process.env.STRAPI_URL || "http://127.0.0.1:1337",
    prefix: "/api",
    version: "v4",
    cookie: {},
    cookieName: "strapi_jwt", // Options
  },
  i18n: {
    locales: [
      {
        name: "Russian",
        code: "ru",
        iso: "ru-RU",
        file: "ru-RU.json",
        icon: "icon-ru",
      },
      {
        name: "English",
        code: "en",
        iso: "en-US",
        file: "en-US.json",
        icon: "icon-en",
      },
    ],
    lazy: true,
    langDir: "lang/",
    defaultLocale: "ru",
  },
});
