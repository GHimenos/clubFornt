<template>
  <div>
    <div
      v-if="show"
      class="alert bg-white shadow-2xl p-4 rounded-xl w-80 text-center border border-slate-200"
    >
      <div class="mt-4 mb-4">
        {{ name }}
      </div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  name: String,
  show: false,
});
</script>
