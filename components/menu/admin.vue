<template>
  <div>
    <div class="container mx-auto p-5">
      <div class="bg-white rounded-xl p-4 md:flex">
        <nuxt-link :to="news" class="pr-3">Новости</nuxt-link>
        <nuxt-link :to="rss" class="pr-3" v-show="show">Новости RSS</nuxt-link>
        <nuxt-link :to="opinions" class="pr-3">Мнения</nuxt-link>
        <nuxt-link :to="analytics" class="pr-3">Аналитика</nuxt-link>
        <nuxt-link :to="partners" class="pr-3" v-show="show"
          >Партнеры</nuxt-link
        >
        <nuxt-link :to="users" class="pr-3" v-show="show"
          >Пользователи</nuxt-link
        >
      </div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  news: String,
  opinions: String,
  users: String,
  analytics: String,
  partners: String,
  rss: String,
  show: null,
});
</script>
