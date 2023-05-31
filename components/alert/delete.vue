<template>
  <div>
    <div
      v-if="showDelete"
      class="bg-white shadow-2xl top-8 p-4 rounded-xl w-80 text-center left-2/4 border border-slate-200 alertDelete"
    >
      <div class="mt-4 mb-4">
        {{ name }}
      </div>
      <button
        class="rounded-md text-lg pt-2 pb-2 pl-4 pr-4 mr-4 max-w-fit text-white font-sans backColorPrimary"
        @click="$emit(clickCancel)"
      >
        Отмена
      </button>
      <button
        class="rounded-md text-lg pt-2 pb-2 pl-4 pr-4 mb-4 max-w-fit text-white font-sans backColorActive"
        @click="$emit(clickDelete)"
      >
        Удалить
      </button>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  name: String,
  showDelete: false,
  clickCancel: String,
  clickDelete: String,
});
</script>
