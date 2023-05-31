<template>
  <div>
    <button
      class="
        rounded-md
        text-sm
        pt-1
        pb-1
        pl-2
        pr-2
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
