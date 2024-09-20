<template>
  <div>
    <div class="container mx-auto p-5">
      <div class="bg-white rounded-xl p-4 md:flex">
        <nuxt-link :to="news" class="pr-3">Новини</nuxt-link>
        <nuxt-link :to="rss" class="pr-3" v-show="show">Новини RSS</nuxt-link>
        <nuxt-link :to="opinions" class="pr-3">Думки</nuxt-link>
        <nuxt-link :to="analytics" class="pr-3">Аналітика</nuxt-link>
        <nuxt-link :to="partners" class="pr-3" v-show="show"
          >Партнери</nuxt-link
        >
        <nuxt-link :to="users" class="pr-3" v-show="show"
          >Користувачі</nuxt-link
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
