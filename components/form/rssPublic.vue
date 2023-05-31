<template>
  <div>
    <div class="flex flex-col">
      <div v-for="(item, index) in rss" class="mb-4">
        <cardEventBasic
          class="mt-4"
          :title="item.title"
          :linkText="'Подробнее'"
          :img="logo"
          :link="'/news/' + 'rss' + index"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const logo = ref("/no_img.png");
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
const { data: count } = await useFetch("http://host-club:8888/rss.php");
//

onMounted(async () => {
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
});
</script>
