<template>
  <div>
    <div v-for="expert in experts">
      <div v-if="route.params.id == expert.id">
        <uiCrumbs
          first="Главная"
          second="Наши эксперты"
          :third="expert.attributes.name"
          secondLink="/experts"
          :show="true"
          :thirdLink="'/experts/' + expert.id"
        />
        <div class="container mx-auto mt-2 p-5">
          <div class="lg:flex w-full">
            <div class="lg:w-8/12">
              <div class="md:flex">
                <div class="md:w-2/4">
                  <img
                    class="rounded-2xl"
                    :src="api + expert.attributes.cover"
                  />
                </div>
                <div class="md:w-2/4 lg:pl-12 md:pl-8">
                  <div class="lg:text-3xl text-2xl font-bold md:mt-0 mt-8">
                    {{ expert.attributes.name }}
                  </div>
                  <p class="text-xl colorGray mt-5">
                    {{ expert.attributes.description }}
                  </p>
                  <p></p>
                </div>
              </div>
              <div class="mt-8">
                <div v-html="expert.attributes.body"></div>
              </div>
            </div>
            <div class="lg:w-4/12 lg:pl-20 p-0 lg:mt-0 mt-8">
              <div class="font-base text-center mb-5">СВЯЗАННЫЕ ОБЗОРЫ</div>
              <div v-for="list in opinions">
                <div
                  v-if="
                    list.attributes.user == expert.attributes.user &&
                    list.id != route.params.id
                  "
                >
                  <cardEventBasic
                    class="mt-4"
                    :title="list.attributes.name.slice(0, 50) + '...'"
                    :body="list.attributes.description"
                    :linkText="'Подробнее'"
                    :link="'/opinions/' + list.id"
                    :img="api + list.attributes.cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Infopublic } from "~/types";
import type { Opinionpublic } from "~/types";

const opinions = ref([]);
const experts = ref([]);
const api = ref("");

const route = useRoute();
const url = useStrapiUrl();
api.value = url.replace(/api/, "").slice(0, -1);

const { find } = useStrapi();

onMounted(async () => {
  const responseOpinion = await find<Opinionpublic>(
    "opinionpublics?pagination[pageSize]=1000000"
  );
  opinions.value = responseOpinion.data;
  const response = await find<Infopublic>("infopublics");
  experts.value = response.data;
});
</script>
