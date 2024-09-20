<template>
  <div>
    <div class="container mx-auto pl-5 pr-5">
      <div
        class="bg-white rounded-xl p-4 mb-4 flex justify-between items-center"
      >
        <buttonPrimaryBase
          color="backColorPrimary"
          name="Загрузить RSS новости"
          click="onSubmit"
          @onSubmit="onSubmit"
        />
        <div class="flex items-center">
          <div class="mr-4">Авто. режим</div>
          <label class="switch">
            <input type="checkbox" v-model="auto" @change="onCheck()" />
            <span class="slider round"></span>
          </label>
        </div>
      </div>
      <div class="lg:pl-40 lg:pr-40 pl-0 pr-0">
        <div class="flex flex-col">
          <div v-for="(item, index) in rss" class="mb-4">
            <cardEventDesc
              :title="item.title"
              :button="button"
              :body="item.description"
              click="onPublish"
              @onPublish="onPublish(index)"
              :color="save"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Newsadmin } from "~/types";
import type { Rsssadmin } from "~/types";
const save = ref("success");
const button = ref("Сохранить новость");
const auto = ref([]);
//rss
const info = ref([]);
const titleFirst = ref([]);
const descriptionFirst = ref([]);
const description = ref([]);
const parser = ref(null);
const responseHtml = ref("");
const itemTitle = ref(null);
const itemDesc = ref(null);
const rss = ref([]);
const { data: count } = await useFetch("http://rss:8888/");
//

const { update } = useStrapi();
const { find } = useStrapi();
const { create } = useStrapi();
const { delete: _delete } = useStrapi4();

onMounted(async () => {
  const responseRss = await find<Rsssadmin>("rssadmins");
  auto.value = responseRss.data[0].attributes.status;
});

const onCheck = async () => {
  await update<Rsssadmin>("rssadmins", 1, { status: auto.value });
  console.log(auto.value);
};

const onSubmit = async () => {
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
};
const onPublish = async (index) => {
  await create<Newsadmin>("newsadmins", {
    name: rss.value[index].title,
    body: rss.value[index].description,
    publish: false,
    username: "rss",
    user: "82",
  });
  setTimeout(async (index) => {
    rss.value.splice(index, 1);
  }, 200);
};
</script>
