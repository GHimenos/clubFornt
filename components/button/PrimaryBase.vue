<template>
  <div>
    <button
      class="
        rounded-md
        text-lg
        pt-2
        pb-2
        pl-4
        pr-4
        max-w-fit
        text-white
        font-sans
      "
      :class="color"
      @click="$emit(click)"
    >
      {{ name }}
    </button>
  </div>
</template>
<script setup>
const props = defineProps({
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
