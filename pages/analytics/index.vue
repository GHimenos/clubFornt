<template>
  <div>
    <uiCrumbs first="Головна" second="Аналітика" secondLink="/analytics" />
    <div class="container mx-auto mt-2 p-5">
      <div class="lg:flex w-full">
        <div class="lg:w-8/12">
          <div class="text-2xl font-bold">Аналітичні огляди</div>
          <div class="flex flex-col">
            <div v-for="item in analytics">
              <cardEventBasic
                class="mt-4"
                :title="item.attributes.name"
                :body="item.attributes.description"
                :linkText="'Докладніше'"
                :link="'/analytics/' + item.id"
                :img="api + item.attributes.cover"
              />
            </div>
          </div>
          <uiPagination
            @change="refetch"
            :totalPages="meta.pageCount"
            :currentPage="currentPage"
          />
        </div>
        <div class="lg:w-4/12 lg:pl-14 p-0 lg:mt-0 mt-8">
          <div class="rounded-2xl overflow-hidden relative mb-8">
            <img class="w-full h-80 object-cover" :src="img3" />
            <buttonPrimaryMedium
              class="absolute z-10 bottom-2.5 right-2.5"
              :name="'Перейти на сайт'"
              :color="'backColorPrimary'"
            />
            <div class="absolute z-10 top-2.5 left-2.5 bg-white rounded-md p-2">
              Реклама від партнерів
            </div>
          </div>
          <cardEventSide
            :title="'Останній огляд'"
            :link="'/'"
            :img="img4"
            :body="'Короткий опис огляду Короткий опис огляду Короткий опис огляду Короткий опис огляду Короткий опис огляду Короткий опис огляду '"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Analyticpublic } from "~/types";

const analytics = ref([]);
const api = ref("");
const meta = ref([]);
const currentPage = ref(1);

const img3 = ref("/img2.png");
const img4 = ref("/img3.png");

const url = useStrapiUrl();
api.value = url.replace(/api/, "").slice(0, -1);

const { find } = useStrapi();

onMounted(async () => {
  const response = await find<Analyticpublic>(
    "analyticpublics?sort=id:desc&pagination[pageSize]=10&pagination[page]=" +
      currentPage.value
  );
  analytics.value = response.data;
  meta.value = response.meta.pagination;
});

const refetch = async (pageNumber) => {
  currentPage.value = pageNumber;
  const response = await find<Analyticpublic>(
    "analyticpublics?sort=id:desc&pagination[pageSize]=10&pagination[page]=" +
      currentPage.value
  );
  analytics.value = response.data;
  meta.value = response.meta.pagination;
};
</script>
<style scoped></style>
