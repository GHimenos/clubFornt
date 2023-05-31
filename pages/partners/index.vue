<template>
  <div>
    <uiCrumbs first="Главная" second="Партнеры" secondLink="/partners" />
    <div class="container mx-auto mt-2 p-5">
      <div class="grid lg:grid-cols-3 grid-cols-1 gap-4">
        <div v-for="partner in partners">
          <cardPartner
            class="h-full"
            :img="api + partner.attributes.cover"
            :firstName="partner.attributes.name"
            :body="partner.attributes.description"
            :moreText="'Подробнее'"
            :moreLink="partner.attributes.link"
            :publicLink="'/'"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Partnerpublic } from "~/types";

const partners = ref([]);
const api = ref("");

const url = useStrapiUrl();
api.value = url.replace(/api/, "").slice(0, -1);

const { find } = useStrapi();

onMounted(async () => {
  const response = await find<Partnerpublic>("partnerpublics");
  partners.value = response.data;
});
</script>
