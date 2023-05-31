<template>
  <div>
    <div class="rounded-2xl overflow-hidden relative">
      <img class="w-full h-44 object-cover" :src="img" />
      <buttonPrimaryMedium
        class="absolute z-10 bottom-2.5 right-2.5"
        :name="'Перейти на сайт'"
        :color="'backColorPrimary'"
      />
      <div class="absolute z-10 top-2.5 left-2.5 bg-white rounded-md p-2">
        Реклама от партнеров
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  img: String,
});
</script>
