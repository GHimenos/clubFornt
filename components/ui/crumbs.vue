<template>
  <div>
    <div class="crumbLink container mx-auto p-5 mt-16">
      <nuxt-link to="/">{{ first }}</nuxt-link>
      <span> / </span>
      <nuxt-link :to="secondLink"> {{ second }}</nuxt-link>
      <span v-if="show"> / </span>
      <nuxt-link :to="thirdLink"> {{ third }}</nuxt-link>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  first: String,
  second: String,
  third: String,
  secondLink: String,
  thirdLink: String,
  show: null,
});
</script>
