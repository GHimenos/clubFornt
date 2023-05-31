<template>
  <div class="mx-auto flex divide-x divide-gray-100 mt-5">
    <button
      class="bg-gray-500 text-gray-50 p-3 rounded-lg"
      :class="{ 'bg-black text-gray-50': currentPage == pageNumber }"
      @click="$emit('change', pageNumber)"
      v-for="pageNumber in totalPages"
      :key="pageNumber"
    >
      {{ pageNumber }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  totalPages: Number,
  currentPage: Number,
});
defineEmits(["change"]);
</script>
