<template>
  <div>
    <div class="container mx-auto mt-16 p-5">
      <div class="lg:flex w-full">
        <div class="lg:w-7/12">
          <div class="lg:flex w-full">
            <div class="lg:w-9/12 lg:mr-5">
              <div v-for="(item, index) in count.items">
                <div
                  v-if="index == 0"
                  class="bg-white rounded-3xl overflow-hidden"
                >
                  <div>
                    <div v-if="cover" class="relative">
                      <img
                        @click="onVideo(item)"
                        class="absolute cursor-pointer left-2/4 top-2/4 -mt-9 -ml-9"
                        src="play.svg"
                      />
                      <img
                        class="w-full"
                        :src="item.snippet.thumbnails.high.url"
                      />
                    </div>
                    <iframe
                      v-if="frame"
                      id="activePlayer"
                      type="text/html"
                      width="100%"
                      height="400"
                      :src="
                        'https://www.youtube.com/embed/' +
                        videoId +
                        '?autoplay=1&?controls=0'
                      "
                      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    >
                    </iframe>
                  </div>
                  <div class="text-2xl font-medium mt-5 ml-5 mr-5">
                    {{ title }}
                    <span v-if="index == 0">{{ item.snippet.title }}</span>
                  </div>
                  <img class="mt-5 ml-5 mb-5" :src="logo" />
                </div>
              </div>
              <buttonPrimaryBase
                class="mt-10 mb-10"
                color="backColorActive"
                name="Перейти на канал"
                click="onYoutube"
                @onYoutube="
                  onLink(
                    'https://www.youtube.com/channel/UC4plQ0XBaoLOKPIXrb1aMGQ'
                  )
                "
              />
            </div>
            <div
              class="lg:w-3/12 overflow-y-scroll overflow-x-hidden videoSide"
            >
              <div
                v-for="item in count.items"
                class="bg-white rounded-2xl overflow-hidden mb-3"
              >
                <div class="relative">
                  <img
                    @click="onVideo(item)"
                    class="absolute cursor-pointer left-2/4 top-2/4 -mt-9 -ml-9"
                    src="play.svg"
                  />
                  <img class="w-full" :src="item.snippet.thumbnails.high.url" />
                </div>
                <div class="lg:text-sm text-xl lg:p-2 p-5">
                  {{ item.snippet.title }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="lg:w-5/12 lg:pl-14 p-0 lg:mt-0 mt-8">
          <div class="text-base uppercase text-center">Экспертные мнения</div>
          <div class="grid xl:grid-cols-2 grid-cols-1 gap-4 mt-5">
            <div v-for="item in reversed.slice(0, 4)">
              <div v-for="user in experts">
                <div v-if="item.attributes.user == user.attributes.user">
                  <cardPersonalCite
                    class="h-full"
                    :open="'iconMarkOpen'"
                    :close="'iconMarkClose'"
                    :link="'/opinions/' + item.id"
                    :img="api + user.attributes.cover"
                    :firstName="user.attributes.name"
                    :body="item.attributes.name.slice(0, 100) + '...'"
                  />
                </div>
              </div>
            </div>
          </div>
          <nuxt-link to="/opinions">
            <buttonPrimaryBase
              class="mt-10 text-center"
              color="backColorPrimary"
              name="Больше мнений"
            />
          </nuxt-link>
        </div>
      </div>
    </div>
    <div class="container mx-auto mt-16 p-5">
      <div class="lg:flex w-full">
        <div class="lg:w-7/12">
          <div class="rounded-2xl overflow-hidden relative">
            <img class="w-full h-44 object-cover" :src="img" />
            <buttonPrimaryMedium
              class="absolute z-10 bottom-2.5 right-2.5"
              :name="'Перейти на сайт'"
              :color="'backColorPrimary'"
            />
            <div class="absolute z-10 top-2.5 left-2.5 bg-white rounded-md p-2">
              Реклама от партнеров
            </div>
          </div>
          <div class="text-2xl uppercase mt-20">Новости</div>
          <div class="flex flex-col mt-10">
            <formRssPublic v-if="auto" />
            <div v-for="item in news.slice(0, 5)">
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
          <nuxt-link to="/news">
            <buttonPrimaryBase
              class="mt-10 text-right"
              color="backColorPrimary"
              name="Больше новостей"
            />
          </nuxt-link>
        </div>
        <div class="lg:w-5/12 lg:pl-14 p-0 lg:mt-0 mt-8">
          <cardEventSideAbout
            :title="'О проекте'"
            :link="'/'"
            :linkText="'Подробнее'"
            :body="'Краткое описание обзора Краткое описание обзора Краткое описание обзора Краткое описание обзора Краткое описание обзора Краткое описание обзора '"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Opinionpublic } from "~/types";
import type { Infopublic } from "~/types";
import type { Newspublic } from "~/types";

const news = ref([]);
const opinions = ref([]);
const reversed = ref([]);
const api = ref("");
const videoId = ref("");
const title = ref("");
const frame = ref(false);
const cover = ref(true);
const experts = ref([]);
const img = ref("/img2.png");
const logo = ref("/logo.svg");
const auto = ref([]);

const url = useStrapiUrl();
api.value = url.replace(/api/, "").slice(0, -1);

const { find } = useStrapi();
/*
const { data: count } = await useFetch(
  "https://youtube.googleapis.com/youtube/v3/search?part=snippet,id&order=date&maxResults=10&channelId=UC4plQ0XBaoLOKPIXrb1aMGQ&key=AIzaSyCNXurlpKL18ylUgJ3op9o8guQ1TmSlpMg"
);
*/
const { data: count } = await useFetch("http://localhost:3000/youtube.json");
const onVideo = (item) => {
  videoId.value = item.id.videoId;
  title.value = item.snippet.title;
  frame.value = true;
  cover.value = false;
};
onMounted(async () => {
  const responseRss = await find<Rsssadmin>("rssadmins");
  auto.value = responseRss.data[0].attributes.status;
  const response = await find<Opinionpublic>("opinionpublics");
  opinions.value = response.data;
  reversed.value = opinions.value.reverse();
  const responseExpert = await find<Infopublic>("infopublics");
  experts.value = responseExpert.data;
  const responseNews = await find<Newspublic>("newspublics?sort=id:desc");
  news.value = responseNews.data;
});
const onLink = (url) => {
  window.open(url, "_blank", "noreferrer");
};
</script>
