<template>
  <div>
    <div v-for="item in analytics">
      <div v-if="route.params.id == item.id">
        <uiCrumbs
          first="Главная"
          second="Аналитика"
          :third="item.attributes.name"
          secondLink="/analytics"
          :show="true"
          :thirdLink="'/analytics/' + item.id"
        />
        <div>
          <div class="container mx-auto mt-2 p-5">
            <div class="lg:flex w-full">
              <div class="lg:w-4/12">
                <img
                  class="rounded-2xl h-full object-cover"
                  :src="api + item.attributes.cover"
                />
              </div>
              <div
                class="lg:w-8/12 lg:pl-10 p-0 lg:mt-0 mt-8 flex flex-col justify-between"
              >
                <div class="text-5xl font-bold">
                  {{ item.attributes.name }}
                </div>
                <div class="text-xl colorGray">
                  {{ item.attributes.description }}
                </div>
                <div class="rounded-2xl overflow-hidden relative">
                  <img class="w-full h-44 object-cover" :src="img" />
                  <buttonPrimaryMedium
                    class="absolute z-10 bottom-2.5 right-2.5"
                    :name="'Перейти на сайт'"
                    :color="'backColorPrimary'"
                  />
                  <div
                    class="absolute z-10 top-2.5 left-2.5 bg-white rounded-md p-2"
                  >
                    Реклама от партнеров
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="container mx-auto mt-2 p-5">
            <div class="lg:flex w-full">
              <div class="lg:w-8/12">
                <div v-html="item.attributes.body"></div>
              </div>
              <div class="lg:w-4/12 lg:ml-20 ml-0 flex flex-col-reverse">
                <div
                  v-for="list in analytics.slice(
                    analytics.length - 5,
                    analytics.length
                  )"
                >
                  <div v-if="list.id != route.params.id">
                    <cardEventBasic
                      class="mt-4"
                      :title="list.attributes.name.slice(0, 50) + '...'"
                      :body="list.attributes.description"
                      :linkText="'Подробнее'"
                      :link="'/analytics/' + list.id"
                      :img="api + list.attributes.cover"
                    />
                  </div>
                </div>
                <div class="font-base text-center mt-8">ПОСЛЕДНИЕ ОБЗОРЫ</div>
                <cardEventSideSmall
                  class="mt-4"
                  :title="'Поддержать проект'"
                  :link="'/'"
                  :img="img2"
                  :body="'Клуб экспертов – независимая площадка, чтобы развиваться дальше, нам нужна ваша поддержка'"
                />
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
import type { Analyticpublic } from "~/types";

const analytics = ref([]);
const api = ref("");
const img = ref("/img2.png");
const img2 = ref("/img4.png");

const route = useRoute();
const url = useStrapiUrl();
api.value = url.replace(/api/, "").slice(0, -1);

const { find } = useStrapi();

const userID = ref(null);

function sendID(item) {
  userID.value = item.attributes.user;
}

onMounted(async () => {
  const response = await find<Analyticpublic>(
    "analyticpublics?pagination[pageSize]=1000000"
  );
  analytics.value = response.data;
});
</script>
