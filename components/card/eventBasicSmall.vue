<template>
  <div>
    <div class="bg-white rounded-xl overflow-hidden">
      <div class="flex">
        <div class="shrink-0">
          <img class="w-20 h-full object-cover" :src="img" />
        </div>
        <div class="p-2.5 w-full">
          <nuxt-link :to="link" class="text-lg mb-1 titleLink">{{
            title
          }}</nuxt-link>
          <div class="text-base">{{ body }}</div>
          <div class="text-right">
            <nuxt-link :to="link" class="text-xs">{{ linkText }}</nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  title: String,
  body: String,
  link: String,
  linkText: String,
  img: String,
});
</script>
