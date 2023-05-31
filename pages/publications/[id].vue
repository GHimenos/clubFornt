<template>
  <div>
    <uiCrumbs first="Главная" second="Мнения" secondLink="/opinions" />
    <div class="container mx-auto mt-2 p-5">
      <div class="lg:flex w-full">
        <div class="lg:w-8/12">
          <div class="text-2xl font-bold">Мнения эксперта</div>
          <div class="flex flex-col">
            <div v-for="item in opinions">
              <div v-if="route.params.id == item.attributes.user">
                <cardEventBasic
                  class="mt-4"
                  :title="item.attributes.name"
                  :body="item.attributes.description"
                  :linkText="'Подробнее'"
                  :link="'/opinions/' + item.id"
                  :img="api + item.attributes.cover"
                />
              </div>
            </div>
          </div>
          <uiPagination
            @change="refetch"
            :totalPages="meta.pageCount"
            :currentPage="currentPage"
          />
        </div>
        <div class="lg:w-4/12 lg:pl-14 p-0 lg:mt-0 mt-8"></div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Opinionpublic } from "~/types";

const opinions = ref([]);
const meta = ref([]);
const currentPage = ref(1);
const api = ref("");

const route = useRoute();
const url = useStrapiUrl();
api.value = url.replace(/api/, "").slice(0, -1);
const { find } = useStrapi();

onMounted(async () => {
  const response = await find<Opinionpublic>(
    "opinionpublics?sort=id:desc&pagination[pageSize]=10&pagination[page]="
  );
  opinions.value = response.data;
  meta.value = response.meta.pagination;
});
const refetch = async (pageNumber) => {
  currentPage.value = pageNumber;
  const response = await find<Opinionpublic>(
    "opinionpublics?sort=id:desc&pagination[pageSize]=10&pagination[page]=" +
      currentPage.value
  );
  opinions.value = response.data;
  meta.value = response.meta.pagination;
};
</script>

<style scoped></style>
