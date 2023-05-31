<template>
  <div>
    <div class="bg-white rounded-3xl p-4 mb-4">
      <div class="flex">
        <div class="w-full">
          <div class="text-lg">{{ name }}</div>
        </div>
      </div>
      <div class="mt-2 text-xl">
        <div class="text-2xl">{{ title }}</div>
        <div v-html="body" class="text-base"></div>
        <buttonPrimaryBase
          class="mt-4"
          color="backColorPrimary"
          name="Сохранить новости"
          @click="$emit(click)"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  name: String,
  title: String,
  click: String,
  body: String,
});
</script>
