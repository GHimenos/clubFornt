<template>
  <div>
    <uiCrumbs first="Головна" second="Думки" secondLink="/opinions" />
    <div class="container mx-auto mt-2 p-5">
      <div class="lg:flex w-full">
        <div class="lg:w-8/12">
          <div class="text-2xl font-bold">Думки наших експертів</div>
          <div class="flex flex-col">
            <div v-for="item in opinions">
              <cardEventBasic
                class="mt-4"
                :title="item.attributes.name"
                :body="item.attributes.description"
                :linkText="'Докладніше'"
                :link="'/opinions/' + item.id"
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
          <cardEventSide
            :title="'Останній огляд'"
            :link="'/'"
            :img="'img3.png'"
            :body="'Короткий опис огляду Короткий опис огляду Короткий опис огляду Короткий опис огляду Короткий опис огляду Короткий опис огляду '"
          />
        </div>
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

const url = useStrapiUrl();
api.value = url.replace(/api/, "").slice(0, -1);

const { find } = useStrapi();

onMounted(async () => {
  const response = await find<Opinionpublic>(
    "opinionpublics?sort=id:desc&pagination[pageSize]=10&pagination[page]=" +
      currentPage.value
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
