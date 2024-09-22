<template>
  <div>
    <alertMessage :show="alert" :name="message" />
    <alertDelete
      v-if="user.editor == true"
      :showDelete="showDelete"
      clickCancel="clickCancel"
      @clickCancel="clickCancel()"
      clickDelete="clickDelete"
      @clickDelete="clickDelete()"
      :name="'Ви дійсно впевнені, що хочете видалити партнера: ' + person + '?'"
    />
    <div class="container mx-auto pl-5 pr-5">
      <div class="bg-white rounded-xl p-4 mb-4">
        <buttonPrimaryBase
          color="backColorPrimary"
          name="Додати партнера"
          click="onShow"
          @onShow="onShow"
        />
      </div>
      <div class="bg-white rounded-3xl p-4 mb-4" v-if="add">
        <inputLarge
          placeholder=""
          title="Назва"
          type="text"
          v-model="title"
          class="mb-5"
        />
        <buttonPrimaryBase
          color="backColorActive"
          name="Створити партнера"
          click="onSubmit"
          @onSubmit="onSubmit"
        />
      </div>
      <div class="lg:pl-40 lg:pr-40 pl-0 pr-0">
        <div class="flex flex-col">
          <div v-if="user.editor == true" class="flex flex-col">
            <div v-for="item in partners" class="mb-2">
              <cardEventAdminNoImg
                :link="'/partners-admin/' + item.id"
                :title="item.attributes.name"
                :name="item.attributes.username"
                :date="item.attributes.createdAt.slice(0, -14)"
                :status="item.attributes.publish"
                click="deleteItem"
                @deleteItem="deleteItem(item)"
                :delete="true"
              />
            </div>
          </div>
        </div>
        <uiPagination
          class="mb-20"
          @change="refetch"
          :totalPages="meta.pageCount"
          :currentPage="currentPage"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  form: Boolean,
});

import type { Partneradmin } from "~/types";
import type { Partnerpublic } from "~/types";

const alert = ref(false);
const message = ref("");
const currentPage = ref(1);
const meta = ref([]);
const title = ref("");
const person = ref("");
const id = ref("");
const partners = ref([]);
const add = ref(false);
const showDelete = ref(null);
//
const status = ref("");
const publics = ref([]);
//
const user = useStrapiUser();
const client = useStrapiClient();
const { create } = useStrapi();
const { find } = useStrapi();
const { delete: _delete } = useStrapi4();

onMounted(async () => {
  const response = await client<Partneradmin>(
    "/partneradmins/?populate=cover&sort=id:desc&pagination[pageSize]=10&pagination[page]=" +
      currentPage.value,
    {
      method: "GET",
    }
  );
  partners.value = response.data;
  meta.value = response.meta.pagination;
});
const onShow = () => {
  add.value = !add.value;
};
const refetch = async (pageNumber) => {
  currentPage.value = pageNumber;
  const response = await client<Partneradmin>(
    "/partneradmins/?populate=cover&sort=id:desc&pagination[pageSize]=10&pagination[page]=" +
      currentPage.value,
    {
      method: "GET",
    }
  );
  partners.value = response.data;
  meta.value = response.meta.pagination;
};
const onSubmit = async () => {
  alert.value = true;
  timer();
  try {
    await create<Partneradmin>("partneradmins", {
      name: title.value,
      publish: false,
    });
    message.value = "Успішно";
  } catch (e) {
    message.value = e;
  }
  timeOut();
};
const deleteItem = (item) => {
  person.value = item.attributes.name;
  id.value = item.id;
  showDelete.value = true;
  //
  status.value = item.attributes.publish;
};
const clickDelete = async () => {
  alert.value = true;
  timer();
  try {
    if (status.value == true) {
      const responsePublic = await client<Partnerpublic>(
        "partnerpublics/?filters[origin][$eq]=" + id.value,
        {
          method: "GET",
        }
      );
      publics.value = responsePublic.data[0].id;
      await _delete<Analyticpublic>("partnerpublics", publics.value);
    }
    await _delete<Partneradmin>("partneradmins", id.value);
    showDelete.value = false;
    message.value = "Успішно";
  } catch (e) {
    message.value = e;
  }
  timeOut();
};
const clickCancel = () => {
  showDelete.value = false;
};
const timeOut = async () => {
  setTimeout(async () => {
    add.value = false;
    const response = await client<Partneradmin>(
      "/partneradmins/?populate=cover&sort=id:desc&pagination[pageSize]=10&pagination[page]=" +
        currentPage.value,
      {
        method: "GET",
      }
    );
    partners.value = response.data;
  }, 500);
};
const timer = () => {
  setTimeout(() => {
    alert.value = false;
  }, 3000);
};
</script>
