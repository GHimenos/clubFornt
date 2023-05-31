<template>
  <div>
    <uiCrumbs first="Главная" second="Новости" secondLink="/news" />
    <div class="container mx-auto mt-2 p-5">
      <div class="lg:flex w-full">
        <div class="lg:w-8/12">
          <div class="text-2xl font-bold">Новости</div>
          <formRssPublic v-if="auto" />
          <div class="flex flex-col">
            <div v-for="item in news">
              <cardEventBasic
                class="mt-4"
                :title="item.attributes.name"
                :body="item.attributes.description"
                :linkText="'Подробнее'"
                :link="'/news/' + item.id"
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
              Реклама от партнеров
            </div>
          </div>
          <cardEventSide
            :title="'Последний обзор'"
            :link="'/'"
            :img="img4"
            :body="'Краткое описание обзора Краткое описание обзора Краткое описание обзора Краткое описание обзора Краткое описание обзора Краткое описание обзора '"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Newspublic } from "~/types";

const news = ref([]);
const meta = ref([]);
const currentPage = ref(1);
const api = ref("");
const auto = ref([]);

const img3 = ref("/img2.png");
const img4 = ref("/img3.png");

const url = useStrapiUrl();
api.value = url.replace(/api/, "").slice(0, -1);

const { find } = useStrapi();

const refetch = async (pageNumber) => {
  currentPage.value = pageNumber;
  const response = await find<Newspublic>(
    "newspublics?sort=id:desc&pagination[pageSize]=10&pagination[page]=" +
      currentPage.value
  );
  news.value = response.data;
  meta.value = response.meta.pagination;
};

onMounted(async () => {
  const responseRss = await find<Rsssadmin>("rssadmins");
  auto.value = responseRss.data[0].attributes.status;
  console.log(auto.value);
  const response = await find<Newspublic>(
    "newspublics?sort=id:desc&pagination[pageSize]=10&pagination[page]=" +
      currentPage.value
  );
  news.value = response.data;
  meta.value = response.meta.pagination;
});
</script>
<style scoped></style>
