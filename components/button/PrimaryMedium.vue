<template>
  <div>
    <button
      class="
        rounded-xl
        text-base
        pt-2
        pb-2
        pl-3
        pr-3
        max-w-fit
        text-white
        font-sans
      "
      :class="color"
    >
      {{ name }}
    </button>
  </div>
</template>
<script setup>
const props = defineProps({
  name: String,
  color: String,
});
</script>
<style>
.nuxt-icon svg {
  margin-bottom: 0 !important;
}
</style>
