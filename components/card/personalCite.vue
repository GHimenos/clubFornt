<template>
  <div>
    <div
      class="
        bg-white
        rounded-3xl
        pt-6
        pr-2
        pb-6
        pl-2
        h-full
        flex flex-col
        justify-between
      "
    >
      <div class="flex items-center justify-center mb-5">
        <img class="w-12 rounded-full mb-2 md:mb-0" :src="img" />
        <div class="ml-2">
          <div class="text-sm w-min">{{ firstName }}</div>
        </div>
      </div>
      <div>
        <nuxt-icon :name="open" class="text-xs" />
        <div class="text-sm pl-3 pr-3 text-center colorGray">{{ body }}</div>
        <div class="flex justify-end">
          <nuxt-icon :name="close" class="text-xs" />
        </div>
      </div>
      <div class="text-center mt-5">
        <nuxt-link :to="link">
          <buttonPrimarySmall :name="'Подробнее'" :color="'backColorPrimary'" />
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  firstName: String,
  img: String,
  body: String,
  open: String,
  close: String,
  link: String,
});
</script>
