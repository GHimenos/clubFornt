<template>
  <div>
    <div class="bg-white rounded-3xl p-4 mb-4">
      <div class="flex">
        <img class="w-14 h-14 rounded-full" :src="cover" />
        <div class="ml-4 w-full">
          <div class="text-lg">{{ name }}</div>
          <div class="text-sm">{{ date }}</div>
        </div>
        <div class="flex">
          <nuxt-link :to="link" class="mr-2.5">
            <nuxt-icon name="iconEdit" class="text-2xl titleLink" />
          </nuxt-link>
          <nuxt-icon
            name="iconTrash"
            class="text-2xl titleLink mr-2.5 cursor-pointer"
            @click="$emit(click)"
          />
          <nuxt-icon
            v-if="false"
            name="iconImportant"
            class="text-2xl colorActive mr-2.5"
          />
          <div class="status draft" v-if="status == false">Draft</div>
          <div class="status publish" v-if="status == true">Publish</div>
        </div>
      </div>
      <div class="mt-2 text-xl">
        <nuxt-link class="titleLink" :to="link">{{ title }}</nuxt-link>
      </div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  name: String,
  date: String,
  title: String,
  link: String,
  click: String,
  cover: String,
  status: null,
});
</script>
