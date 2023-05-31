<template>
  <div>
    <div v-for="item in opinions">
      <div v-if="route.params.id == item.id">
        <uiCrumbs
          first="Главная"
          second="Мнения"
          :third="item.attributes.name"
          secondLink="/opinions"
          :show="true"
          :thirdLink="'/opinions/' + item.id"
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
                {{ sendID(item) }}
                <div v-if="item.attributes.user == one[0].attributes.user">
                  <div class="flex items-center mt-5 mb-5">
                    <img
                      class="rounded-full w-20 h-20"
                      :src="api + one[0].attributes.cover"
                    />
                    <div class="ml-5">
                      <div class="text-xl">
                        {{ one[0].attributes.name }}
                      </div>
                      <div>
                        <div v-if="one[0].attributes.description == null"></div>
                        <div v-if="one[0].attributes.description != null">
                          {{ one[0].attributes.description.slice(0, 50) }}...
                        </div>
                        <nuxt-link :to="'../experts/' + one[0].id"
                          >Подробнее</nuxt-link
                        >
                      </div>
                    </div>
                  </div>
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
              <div class="lg:w-4/12 lg:ml-20 ml-0">
                <div class="font-base text-center mb-5 mt-5">
                  СВЯЗАННЫЕ ОБЗОРЫ
                </div>
                <div v-for="list in opinions">
                  <div
                    v-if="
                      list.attributes.user == one[0].attributes.user &&
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
import type { Opinionpublic } from "~/types";

const opinions = ref([]);
const experts = ref([]);
const one = ref([]);
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
  const response = await find<Opinionpublic>(
    "opinionpublics?pagination[pageSize]=1000000"
  );
  opinions.value = response.data;
  const responseExpert = await find<Infopublic>("infopublics");
  experts.value = responseExpert.data;
  one.value = experts.value.filter(
    (user) => user.attributes.user == userID.value
  );
});
</script>
