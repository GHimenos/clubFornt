<template>
  <div>
    <uiCrumbs first="Главная" second="Наши эксперты" secondLink="/experts" />
    <div class="container mx-auto mt-2 p-5">
      <div class="grid lg:grid-cols-3 grid-cols-1 gap-4">
        <div v-for="expert in experts">
          <cardPersonal
            class="h-full"
            :img="api + expert.attributes.cover"
            :firstName="expert.attributes.name"
            :body="expert.attributes.description"
            :moreText="'Подробнее'"
            :publicText="'Публикации в клубе'"
            :moreLink="'/experts/' + expert.id"
            :publicLink="'/publications/' + expert.attributes.user"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Infopublic } from "~/types";

const experts = ref([]);
const api = ref("");

const url = useStrapiUrl();
api.value = url.replace(/api/, "").slice(0, -1);

const { find } = useStrapi();

onMounted(async () => {
  const response = await find<Infopublic>("infopublics");
  experts.value = response.data;
});
</script>
