<template>
  <div>
    <div>
      <div class="bg-white rounded-2xl pt-5 pb-5 pl-2.5 pr-2.5">
        <nuxt-link :to="link" class="text-xl mb-1 titleLinkActive">{{
          title
        }}</nuxt-link>
        <div class="flex">
          <div class="text-sm mt-5">
            {{ body }}
          </div>
          <img class="h-auto" :src="img" />
        </div>
        <div class="mt-5">
          <buttonPrimarySemi
            :name="'Підтримати проект'"
            :color="'backColorPrimary'"
          />
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
