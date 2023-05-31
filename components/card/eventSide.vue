<template>
  <div>
    <div>
      <div class="bg-white rounded-2xl pt-5 pb-5 pl-2.5 pr-2.5">
        <nuxt-link :to="link" class="text-xl mb-1 titleLink">{{
          title
        }}</nuxt-link>
        <img class="w-full h-44 object-cover rounded-2xl mt-5" :src="img" />
        <div class="text-sm mt-5">
          {{ body }}
        </div>
        <div class="mt-5 text-center">
          <buttonPrimarySemi :name="'Подробнее'" :color="'backColorActive'" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  img: String,
  title: String,
  link: String,
  body: String,
});
</script>
