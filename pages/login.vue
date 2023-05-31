<template>
  <div>
    <div class="container mx-auto mt-8 pl-4 pr-4 grid 2xl:grid-cols-1">
      <formLogin class="m-auto" />
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ["guest"],
  layout: "custom",
});
</script>
