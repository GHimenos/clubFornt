<template>
  <div>
    <div
      class="flex flex-col bg-white rounded-3xl pt-2.5 pr-5 pb-2.5 pl-5 h-full"
    >
      <div class="">
        <img class="xl:w-20 w-full rounded-full mb-2 md:mb-0" :src="img" />
        <div class="">
          <div class="lg:text-lg xl:text-2xl text-lg">{{ firstName }}</div>
          <div class="lg:text-lg xl:text-2xl text-lg">{{ secondName }}</div>
        </div>
      </div>
      <div class="flex flex-col justify-between flex-auto">
        <div class="text-base mt-5">{{ body }}</div>
        <div class="md:flex justify-between mt-4">
          <nuxt-link :to="moreLink" class="text-sm block mb-2 md:mb-0">{{
            moreText
          }}</nuxt-link>
          <nuxt-link :to="publicLink" class="text-sm publicLink">{{
            publicText
          }}</nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  firstName: String,
  secondName: String,
  moreLink: String,
  moreText: String,
  publicLink: String,
  publicText: String,
  img: String,
  body: String,
});
</script>
