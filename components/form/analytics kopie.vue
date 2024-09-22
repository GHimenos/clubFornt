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
      :name="
        'Вы действительно уверены что хотите удалить аналитику: ' + person + '?'
      "
    />
    <div class="container mx-auto pl-5 pr-5">
      <div class="bg-white rounded-xl p-4 mb-4">
        <div class="">
          <buttonPrimaryBase
            color="backColorPrimary"
            name="Добавить аналитику"
            click="onShow"
            @onShow="onShow"
          />
          <div
            v-if="user.editor == true"
            class="lg:flex items-center justify-between"
          >
            <div class="xl:flex justify-center mr-5 mt-5">
              <div
                @click="onAllFilter"
                class="mr-3 cursor-pointer"
                :class="{ 'font-bold text-red-500': filterAll == true }"
              >
                Все
              </div>
              <div
                @click="onPublishFilter"
                class="mr-3 cursor-pointer"
                :class="{ 'font-bold text-red-500': filterPublish == true }"
              >
                Опубликованные
              </div>
              <div
                @click="onDraftFilter"
                class="mr-3 cursor-pointer"
                :class="{ 'font-bold text-red-500': filterDraft == true }"
              >
                Черновики
              </div>
            </div>
            <FormKit
              type="select"
              label="Пользователи"
              name="users"
              v-model="valueUser"
              id="onUserFilter"
              @change="onUserFilter(valueUser)"
            >
              <optgroup label="Пользователи">
                <option v-for="item in users" :value="item.id">
                  {{ item.username }}
                </option>
              </optgroup>
            </FormKit>
            <FormKit
              type="date"
              v-model="valueDateBegin"
              label="Начало"
              validation-visibility="live"
            />
            <FormKit
              type="date"
              v-model="valueDateEnd"
              label="Kонец"
              validation-visibility="live"
            />
            <buttonPrimaryBase
              color="backColorActive"
              name="Применить"
              class="mt-6"
              click="onDateFilter"
              @onDateFilter="onDateFilter"
            />
          </div>
        </div>
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
          click="onSubmit"
          @onSubmit="onSubmit"
        />
      </div>
      <div class="lg:pl-40 lg:pr-40 pl-0 pr-0">
        <div class="flex flex-col">
          <div v-if="user.editor == false">
            <div v-for="item in paginatedOne" class="mb-4">
              <cardEventAdminNoImg
                :link="'/analytics-admin/' + item.id"
                :title="item.attributes.name"
                :date="item.attributes.createdAt.slice(0, -14)"
                :status="item.attributes.publish"
                :delete="false"
              />
            </div>
            <uiPagination
              class="mb-20"
              @change="refetch"
              :totalPages="pageCount"
              :currentPage="page"
            />
          </div>
          <div v-if="user.editor == true" class="flex flex-col">
            <div v-for="item in analytics" class="mb-2">
              <cardEventAdminNoImg
                :link="'/analytics-admin/' + item.id"
                :title="item.attributes.name"
                :name="item.attributes.username"
                :date="item.attributes.createdAt.slice(0, -14)"
                :status="item.attributes.publish"
                click="deleteItem"
                @deleteItem="deleteItem(item)"
                :delete="true"
              />
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
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  form: Boolean,
});

import type { Analyticadmin } from "~/types";
import type { User } from "~/types";
const alert = ref(false);
const message = ref("");
const currentPage = ref(1);
const meta = ref([]);
const title = ref("");
const person = ref("");
const id = ref("");
const analytics = ref([]);
const add = ref(false);
const showDelete = ref(null);
const pageSize = ref(25);
const pageCount = ref(null);
const page = ref(1);
const one = ref([]);
const paginatedOne = ref([]);
const analyticsAuthor = ref([]);
const filterAll = ref(true);
const filterPublish = ref(false);
const filterDraft = ref(false);
const filterUser = ref(false);
const filterDate = ref(false);
const users = ref([]);
const valueUser = ref("");
const valueDateBegin = ref("");
const valueDateEnd = ref("");

const user = useStrapiUser();
const client = useStrapiClient();
const { create } = useStrapi();
const { find } = useStrapi();
const { delete: _delete } = useStrapi4();

const apiClient = async () => {
  const response = await client<Analyticadmin>(
    "/analyticadmins/?populate=cover&sort=id:desc&pagination[pageSize]=25&pagination[page]=" +
      currentPage.value,
    {
      method: "GET",
    }
  );
  const responseAuthor = await client<Analyticadmin>(
    "/analyticadmins/?populate=cover&sort=id:desc&pagination[pageSize]=1000000",
    {
      method: "GET",
    }
  );
  analytics.value = response.data;
  analyticsAuthor.value = responseAuthor.data;
  meta.value = response.meta.pagination;
  one.value = analyticsAuthor.value.filter(
    (item) => item.attributes.user == user.value.id
  );
  pageCount.value = Math.ceil(one.value.length / pageSize.value);
  let start = pageSize.value * (page.value - 1);
  let end = start + pageSize.value;
  paginatedOne.value = one.value.slice(start, end);
};
const apiPublish = async () => {
  const response = await client<Analyticadmin>(
    "/analyticadmins/?filters[publish][$eq]=true&sort=id:desc&pagination[pageSize]=25&pagination[page]=" +
      currentPage.value,
    {
      method: "GET",
    }
  );
  analytics.value = response.data;
  meta.value = response.meta.pagination;
};
const apiDraft = async () => {
  const response = await client<Analyticadmin>(
    "/analyticadmins/?filters[publish][$eq]=false&sort=id:desc&pagination[pageSize]=25&pagination[page]=" +
      currentPage.value,
    {
      method: "GET",
    }
  );
  analytics.value = response.data;
  meta.value = response.meta.pagination;
};
const apiUser = async (valueUser) => {
  const response = await client<Analyticadmin>(
    "/analyticadmins/?filters[user][$eq]=" +
      valueUser +
      "&sort=id:desc&pagination[pageSize]=25&pagination[page]=" +
      currentPage.value,
    {
      method: "GET",
    }
  );
  analytics.value = response.data;
  meta.value = response.meta.pagination;
};
const apiDate = async () => {
  const response = await client<Analyticadmin>(
    "/analyticadmins/?filters[createdAt][$gte][0]=" +
      valueDateBegin.value +
      "T00:00:00.000Z" +
      "&filters[createdAt][$lte][1]=" +
      valueDateEnd.value +
      "T23:59:59.999Z" +
      "&sort=id:desc&pagination[pageSize]=25&pagination[page]=" +
      currentPage.value,
    {
      method: "GET",
    }
  );
  analytics.value = response.data;
  meta.value = response.meta.pagination;
};
onMounted(async () => {
  apiClient();
  const responseUser = await find<User>("users");
  users.value = responseUser;
});
const onPublishFilter = async () => {
  currentPage.value = 1;
  filterAll.value = false;
  filterPublish.value = true;
  filterDraft.value = false;
  filterUser.value = false;
  filterDate.value = false;
  valueUser.value = "";
  apiPublish();
};
const onDraftFilter = async () => {
  currentPage.value = 1;
  filterAll.value = false;
  filterPublish.value = false;
  filterDraft.value = true;
  filterUser.value = false;
  filterDate.value = false;
  valueUser.value = "";
  apiDraft();
};
const onAllFilter = async () => {
  currentPage.value = 1;
  filterAll.value = true;
  filterPublish.value = false;
  filterDraft.value = false;
  filterUser.value = false;
  filterDate.value = false;
  valueUser.value = "";
  apiClient();
};
const onUserFilter = async (valueUser) => {
  currentPage.value = 1;
  filterAll.value = false;
  filterPublish.value = false;
  filterDraft.value = false;
  filterUser.value = true;
  filterDate.value = false;
  apiUser(valueUser);
};
const onDateFilter = async () => {
  currentPage.value = 1;
  filterAll.value = false;
  filterPublish.value = false;
  filterDraft.value = false;
  filterUser.value = false;
  filterDate.value = true;
  valueUser.value = "";
  apiDate();
};
const refetch = async (pageNumber) => {
  if (user.value.editor == true) {
    if (filterAll.value == true) {
      currentPage.value = pageNumber;
      apiClient();
    }
    if (filterPublish.value == true) {
      currentPage.value = pageNumber;
      apiPublish();
    }
    if (filterDraft.value == true) {
      currentPage.value = pageNumber;
      apiDraft();
    }
    if (filterUser.value == true) {
      currentPage.value = pageNumber;
      apiUser(valueUser.value);
    }
    if (filterDate.value == true) {
      currentPage.value = pageNumber;
      apiDate();
    }
  }
  if (user.value.editor == false) {
    page.value = pageNumber;
    apiClient();
  }
};
const onShow = () => {
  add.value = !add.value;
};
const onSubmit = async () => {
  alert.value = true;
  timer();
  try {
    await create<Analyticadmin>("analyticadmins", {
      user: user.value.id,
      username: user.value.username,
      editor: user.value.editor,
      name: title.value,
      publish: false,
    });
    message.value = "Успешно";
  } catch (e) {
    message.value = e;
  }
  timeOut();
};
const deleteItem = (item) => {
  person.value = item.attributes.name;
  id.value = item.id;
  showDelete.value = true;
};
const clickDelete = async () => {
  alert.value = true;
  timer();
  try {
    await _delete<Analyticadmin>("analyticadmins", id.value);
    showDelete.value = false;
    message.value = "Успешно";
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
    apiClient();
  }, 500);
};
const timer = () => {
  setTimeout(() => {
    alert.value = false;
  }, 3000);
};
</script>
