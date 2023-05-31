<template>
  <div>
    <headerAdmin />
    <menuAdmin
      users="users"
      news="news-admin"
      opinions="opinions-admin"
      analytics="analytics-admin"
      partners="partners-admin"
      rss="rss-admin"
      :show="show"
    />
    <formAnalytics />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
  layout: "custom",
});
const show = ref(null);
const user = useStrapiUser();
onMounted(async () => {
  if (user.value.editor == true) {
    show.value = true;
  }
  if (user.value.editor == false) {
    show.value = false;
  }
});
</script>
