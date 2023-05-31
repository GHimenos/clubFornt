<template>
  <div>
    <div class="container mx-auto pl-5 pr-5">
      <div class="bg-white rounded-xl p-4 mb-4">
        <buttonPrimaryBase
          color="backColorPrimary"
          name="Добавить мнение"
          click="onShow"
          @onShow="onShow"
        />
      </div>
      <div class="bg-white rounded-3xl p-4 mb-4" v-if="add">
        <inputLarge
          placeholder=""
          title="Заголовок"
          type="text"
          v-model="title"
          class="mb-5"
        />
        <buttonPrimaryBase
          color="backColorActive"
          name="Создать"
          onSubmit="onShow"
          @onSubmit="onSubmit"
        />
      </div>
      <!--
      <div class="lg:pl-40 lg:pr-40 pl-0 pr-0">
        <div class="flex flex-col-reverse">
          <div v-for="item in all" class="mb-4">
            <cardEventAdmin
              :link="'/news-admin/' + item.id"
              :title="item.attributes.title"
              :name="item.attributes.username"
              :date="item.attributes.createdAt"
            />
          </div>
          <div v-for="item in news" class="mb-4">
            <cardEventAdmin
              :link="'/news-admin/' + item.id"
              :title="item.attributes.title"
              :name="item.attributes.username"
              :date="item.attributes.createdAt"
            />
          </div>
        </div>
      </div>
    --></div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  form: Boolean,
});
const title = ref("");
const add = ref(false);

const user = useStrapiUser();
import type { Opinionsadmin } from "~/types";

const { create } = useStrapi();
const { find } = useStrapi();

onMounted(async () => {
  if (user.value.editor == true) {
  }
  if (user.value.editor == false) {
  }
});
const onShow = () => {
  add.value = !add.value;
};
const onSubmit = async () => {
  if (user.value.editor == true) {
  }
  if (user.value.editor == false) {
  }
};
</script>
