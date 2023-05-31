<template>
  <div>
    <div v-for="(item, index) in rss">
      <div v-if="route.params.id == 'rss' + index">
        <uiCrumbs
          first="Главная"
          second="Новости"
          :third="item.title"
          secondLink="/news"
          :show="true"
          :thirdLink="'/news/' + 'rss' + index"
        />
        <div class="container mx-auto mt-2 p-5">
          <div class="lg:flex w-full">
            <div class="lg:w-4/12">
              <img class="rounded-2xl h-full object-cover" :src="logo" />
            </div>
            <div
              class="lg:w-8/12 lg:pl-10 p-0 lg:mt-0 mt-8 flex flex-col justify-between"
            >
              <div class="text-5xl font-bold">
                {{ item.title }}
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
              <div v-html="item.description"></div>
            </div>
            <div class="lg:w-4/12 lg:ml-20 ml-0">
              <div class="font-base text-center mt-8">ПОСЛЕДНИЕ НОВОСТИ</div>
              <cardEventSideSmall
                class="mt-4"
                :title="'Поддержать проект'"
                :link="'/'"
                :img="img2"
                :body="'Клуб экспертов – независимая площадка, чтобы развиваться дальше, нам нужна ваша поддержка'"
              />
              <div class="flex flex-col-reverse">
                <div v-for="list in news.slice(news.length - 5, news.length)">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-for="item in news">
      <div v-if="route.params.id == item.id">
        <uiCrumbs
          first="Главная"
          second="Новости"
          :third="item.attributes.name"
          secondLink="/news"
          :show="true"
          :thirdLink="'/news/' + item.id"
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
              <div class="lg:w-4/12 lg:ml-20 ml-0">
                <div class="font-base text-center mt-8">ПОСЛЕДНИЕ НОВОСТИ</div>
                <cardEventSideSmall
                  class="mt-4"
                  :title="'Поддержать проект'"
                  :link="'/'"
                  :img="img2"
                  :body="'Клуб экспертов – независимая площадка, чтобы развиваться дальше, нам нужна ваша поддержка'"
                />
                <div class="flex flex-col-reverse">
                  <div v-for="list in news.slice(news.length - 5, news.length)">
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
import type { Newspublic } from "~/types";

//rss
const logo = ref("/no_img.png");
const info = ref([]);
const titleFirst = ref([]);
const descriptionFirst = ref([]);
const description = ref([]);
const parser = ref(null);
const responseHtml = ref("");
const itemTitle = ref(null);
const itemDesc = ref(null);
const rss = ref([]);
const { data: count } = await useFetch("http://host-club:8888/rss.php");
const auto = ref([]);

const news = ref([]);
const experts = ref([]);
const one = ref([]);
const api = ref("");
const img = ref("/img2.png");
const img2 = ref("/img4.png");

const route = useRoute();
const url = useStrapiUrl();
api.value = url.replace(/api/, "").slice(0, -1);

const { find } = useStrapi();

onMounted(async () => {
  const responseRss = await find<Rsssadmin>("rssadmins");
  auto.value = responseRss.data[0].attributes.status;
  const response = await find<Newspublic>(
    "newspublics?pagination[pageSize]=1000000"
  );
  news.value = response.data;
  //rss
  if (auto.value == true) {
    parser.value = new DOMParser();
    responseHtml.value = parser.value.parseFromString(count.value, "text/html");
    itemTitle.value = responseHtml.value.querySelectorAll("title");
    itemDesc.value = responseHtml.value.querySelectorAll("description");
    itemTitle.value.forEach((item, key) => {
      info.value[key] = item.innerText
        .replace("<![CDATA[", "")
        .replace("]]>", "");
    });
    titleFirst.value = info.value.slice(1).map((item) => {
      return {
        title: `${item}`,
      };
    });
    itemDesc.value.forEach((item, key) => {
      description.value[key] = item.innerHTML.replace("]]&gt;", "");
    });
    descriptionFirst.value = description.value.map((item) => {
      return {
        description: `${item}`,
      };
    });
    rss.value = titleFirst.value.map((item, index) => ({
      ...item,
      ...descriptionFirst.value[index],
    }));
  }
});
</script>
