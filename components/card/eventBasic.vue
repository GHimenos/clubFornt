<template>
  <div>
    <div class="bg-white rounded-xl overflow-hidden">
      <div class="md:flex">
        <div class="shrink-0 md:w-40">
          <img class="object-cover w-full h-40 md:h-full" :src="img" />
        </div>
        <div class="pt-2.5 pr-2.5 pb-2.5 pl-5 w-full">
          <nuxt-link :to="link" class="text-xl mb-1 titleLink">{{
            title
          }}</nuxt-link>
          <div class="text-base mb-2">{{ body }}</div>
          <div class="text-right">
            <nuxt-link :to="link" class="text-sm">{{ linkText }}</nuxt-link>
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
