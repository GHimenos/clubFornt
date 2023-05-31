<template>
  <div>
    <button
      class="rounded-xl text-sm pt-2 pb-2 pl-4 pr-4 max-w-fit text-white flex items-center font-sans"
      :class="color"
      @click="$emit(click)"
    >
      <nuxt-icon :name="icon" class="text-2xl mr-2.5" />{{ name }}
    </button>
  </div>
</template>
<script setup>
const props = defineProps({
  icon: String,
  name: String,
  color: String,
  click: String,
});
</script>
<style>
.nuxt-icon svg {
  margin-bottom: 0 !important;
}
</style>
