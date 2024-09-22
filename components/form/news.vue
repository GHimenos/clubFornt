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
      :name="'Ви дійсно впевнені, що хочете видалити новину: ' + person + '?'"
    />
    <div class="container mx-auto pl-5 pr-5">
      <div class="bg-white rounded-xl p-4 mb-4">
        <div class="">
          <buttonPrimaryBase
            color="backColorPrimary"
            name="Додати новину"
            click="onShow"
            @onShow="onShow"
          />
          <div
            v-if="user.editor == true"
            class="lg:flex items-center justify-between mt-5"
          >
            <FormKit
              type="select"
              label="Користувачі"
              name="users"
              v-model="valueUser"
              id="onUserFilter"
              @change="onUserFilter(valueUser)"
            >
              <optgroup label="Користувачі">
                <option v-for="item in usersFilter" :value="item.id">
                  {{ item.username }}
                </option>
              </optgroup>
            </FormKit>
            <FormKit
              type="date"
              v-model="valueDateBegin"
              label="Початок"
              validation-visibility="live"
            />
            <FormKit
              type="date"
              v-model="valueDateEnd"
              label="Конець"
              validation-visibility="live"
            />
            <buttonPrimaryBase
              color="backColorPrimary"
              name="Застосувати"
              class="mt-6"
              click="onDateFilter"
              @onDateFilter="onDateFilter"
            />
            <buttonPrimaryBase
              color="backColorActive"
              name="Скинути"
              class="mt-6"
              click="onAllFilter"
              @onAllFilter="onAllFilter"
            />
          </div>
          <div
            class="xl:flex justify-center mr-5 mt-8"
            v-if="user.editor == true"
          >
            <div
              @click="onPublishFilter"
              class="mr-3 cursor-pointer"
              :class="{
                'font-bold text-red-500':
                  filterPublish == true ||
                  filterPublishUser == true ||
                  filterDateUserPublish == true ||
                  filterPublishDate == true,
              }"
            >
              Опубліковані
            </div>
            <div
              @click="onDraftFilter"
              class="mr-3 cursor-pointer"
              :class="{
                'font-bold text-red-500':
                  filterDraft == true ||
                  filterDraftUser == true ||
                  filterDateUserDraft == true ||
                  filterDraftDate == true,
              }"
            >
              Чернетки
            </div>
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
          name="Створити новину"
          click="onSubmit"
          @onSubmit="onSubmit"
        />
      </div>
      <div class="lg:pl-40 lg:pr-40 pl-0 pr-0">
        <div class="flex flex-col">
          <div v-if="user.editor == false">
            <div v-for="item in paginatedOne" class="mb-4">
              <div>
                <cardEventAdminNoImg
                  :link="'/news-admin/' + item.id"
                  :title="item.attributes.name"
                  :date="item.attributes.createdAt.slice(0, -14)"
                  :status="item.attributes.publish"
                  :delete="false"
                />
              </div>
            </div>
            <uiPagination
              class="mb-20"
              @change="refetch"
              :totalPages="pageCount"
              :currentPage="page"
            />
          </div>
          <div v-if="user.editor == true" class="flex flex-col">
            <div v-for="item in news" class="mb-2">
              <cardEventAdminNoImg
                :link="'/news-admin/' + item.id"
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
import type { Newsadmin } from "~/types";
import type { Newspublic } from "~/types";
import type { User } from "~/types";

const alert = ref(false);
const message = ref("");
const currentPage = ref(1);
const meta = ref([]);
const title = ref("");
const person = ref("");
const id = ref("");
//
const news = ref([]);
//
const add = ref(false);
const showDelete = ref(null);
const pageSize = ref(25);
const pageCount = ref(null);
const page = ref(1);
const one = ref([]);
const paginatedOne = ref([]);
const newsAuthor = ref([]);
//
const filterAll = ref(true);
const filterPublish = ref(false);
const filterDraft = ref(false);
const filterPublishUser = ref(false);
const filterPublishDate = ref(false);
const filterDraftUser = ref(false);
const filterDraftDate = ref(false);
const filterUser = ref(false);
const filterDate = ref(false);
const filterDateUser = ref(false);
const filterDateUserPublish = ref(false);
const filterDateUserDraft = ref(false);
const usersFilter = ref([]);
const valueUser = ref("");
const valueDateBegin = ref("");
const valueDateEnd = ref("");
const publics = ref([]);
const status = ref("");
const filterUserOn = ref(false);
const filterDateOn = ref(false);
const statusUser = ref("");

const user = useStrapiUser();
const client = useStrapiClient();
const { create } = useStrapi();
const { find } = useStrapi();
const { delete: _delete } = useStrapi4();

const apiClient = async () => {
  const response = await client<Newsadmin>(
    "/newsadmins/?populate=cover&sort=id:desc&pagination[pageSize]=25&pagination[page]=" +
      currentPage.value,
    {
      method: "GET",
    }
  );
  const responseAuthor = await client<Newsadmin>(
    "/newsadmins/?populate=cover&sort=id:desc&pagination[pageSize]=1000000",
    {
      method: "GET",
    }
  );
  news.value = response.data;
  newsAuthor.value = responseAuthor.data;
  meta.value = response.meta.pagination;
  one.value = newsAuthor.value.filter(
    (item) => item.attributes.user == user.value.id
  );
  pageCount.value = Math.ceil(one.value.length / pageSize.value);
  let start = pageSize.value * (page.value - 1);
  let end = start + pageSize.value;
  paginatedOne.value = one.value.slice(start, end);
};
const apiPublish = async () => {
  const response = await client<Newsadmin>(
    "/newsadmins/?filters[publish][$eq]=true&sort=id:desc&pagination[pageSize]=25&pagination[page]=" +
      currentPage.value,
    {
      method: "GET",
    }
  );
  news.value = response.data;
  meta.value = response.meta.pagination;
};
const apiPublishUser = async () => {
  const response = await client<Newsadmin>(
    "/newsadmins/?filters[user][$eq]=" +
      statusUser.value +
      "&filters[publish][$eq]=true&sort=id:desc&pagination[pageSize]=25&pagination[page]=" +
      currentPage.value,
    {
      method: "GET",
    }
  );
  news.value = response.data;
  meta.value = response.meta.pagination;
};
const apiPublishDate = async () => {
  const response = await client<Newsadmin>(
    "/newsadmins/?filters[publish][$eq]=true&filters[createdAt][$gte][0]=" +
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
  news.value = response.data;
  meta.value = response.meta.pagination;
};
const apiDraftDate = async () => {
  const response = await client<Newsadmin>(
    "/newsadmins/?filters[publish][$eq]=false&filters[createdAt][$gte][0]=" +
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
  news.value = response.data;
  meta.value = response.meta.pagination;
};
const apiDraft = async () => {
  const response = await client<Newsadmin>(
    "/newsadmins/?filters[publish][$eq]=false&sort=id:desc&pagination[pageSize]=25&pagination[page]=" +
      currentPage.value,
    {
      method: "GET",
    }
  );
  news.value = response.data;
  meta.value = response.meta.pagination;
};
const apiDraftUser = async () => {
  const response = await client<Newsadmin>(
    "/newsadmins/?filters[user][$eq]=" +
      statusUser.value +
      "&filters[publish][$eq]=false&sort=id:desc&pagination[pageSize]=25&pagination[page]=" +
      currentPage.value,
    {
      method: "GET",
    }
  );
  news.value = response.data;
  meta.value = response.meta.pagination;
};
const apiUser = async (valueUser) => {
  const response = await client<Newsadmin>(
    "/newsadmins/?filters[user][$eq]=" +
      valueUser +
      "&sort=id:desc&pagination[pageSize]=25&pagination[page]=" +
      currentPage.value,
    {
      method: "GET",
    }
  );
  news.value = response.data;
  meta.value = response.meta.pagination;
};
const apiDate = async () => {
  const response = await client<Newsadmin>(
    "/newsadmins/?filters[createdAt][$gte][0]=" +
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
  news.value = response.data;
  meta.value = response.meta.pagination;
};
const apiDateUser = async (valueUser) => {
  const response = await client<Newsadmin>(
    "/newsadmins/?filters[user][$eq]=" +
      statusUser.value +
      "&filters[createdAt][$gte][0]=" +
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
  news.value = response.data;
  meta.value = response.meta.pagination;
};
const apiDateUserPublish = async () => {
  const response = await client<Newsadmin>(
    "/newsadmins/?filters[publish][$eq]=true&filters[user][$eq]=" +
      statusUser.value +
      "&filters[createdAt][$gte][0]=" +
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
  news.value = response.data;
  meta.value = response.meta.pagination;
};
const apiDateUserDraft = async () => {
  const response = await client<Newsadmin>(
    "/newsadmins/?filters[publish][$eq]=false&filters[user][$eq]=" +
      statusUser.value +
      "&filters[createdAt][$gte][0]=" +
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
  news.value = response.data;
  meta.value = response.meta.pagination;
};
onMounted(async () => {
  apiClient();
  const responseUser = await find<User>("users");
  usersFilter.value = responseUser;
});
const onPublishFilter = async () => {
  currentPage.value = 1;
  filterAll.value = false;
  filterPublish.value = true;
  filterDraft.value = false;
  filterDraftUser.value = false;
  filterDraftDate.value = false;
  filterUser.value = false;
  filterDate.value = false;
  filterDateUser.value = false;
  filterDateUserDraft.value = false;
  //valueUser.value = "";
  //filterUserOn.value = false;
  //valueDateBegin.value = "";
  //valueDateEnd.value = "";
  if (filterUserOn.value == true && filterDateOn.value == false) {
    apiPublishUser();
    filterPublishUser.value = true;
    filterPublish.value = false;
    filterDateUserPublish.value = false;
    filterPublishDate.value = false;
  }
  if (filterUserOn.value == true && filterDateOn.value == true) {
    apiDateUserPublish();
    filterPublishUser.value = false;
    filterPublish.value = false;
    filterDateUserPublish.value = true;
    filterPublishDate.value = false;
  }
  if (filterUserOn.value == false) {
    apiPublish();
    filterPublishUser.value = false;
    filterPublish.value = true;
    filterDateUserPublish.value = false;
    filterPublishDate.value = false;
  }
  if (filterUserOn.value == false && filterDateOn.value == true) {
    apiPublishDate();
    filterPublishUser.value = false;
    filterPublish.value = false;
    filterDateUserPublish.value = false;
    filterPublishDate.value = true;
  }
};
const onDraftFilter = async () => {
  currentPage.value = 1;
  filterAll.value = false;
  filterPublish.value = false;
  filterPublishUser.value = false;
  filterPublishDate.value = false;
  filterDraft.value = true;
  filterUser.value = false;
  filterDate.value = false;
  filterDateUser.value = false;
  filterDateUserPublish.value = false;
  //valueUser.value = "";
  //filterUserOn.value = false;
  //valueDateBegin.value = "";
  //valueDateEnd.value = "";
  if (filterUserOn.value == true && filterDateOn.value == false) {
    apiDraftUser();
    filterDraftUser.value = true;
    filterDraft.value = false;
    filterDateUserDraft.value = false;
    filterDraftDate.value = false;
  }
  if (filterUserOn.value == true && filterDateOn.value == true) {
    apiDateUserDraft();
    filterDraftUser.value = false;
    filterDraft.value = false;
    filterDateUserDraft.value = true;
    filterDraftDate.value = false;
  }
  if (filterUserOn.value == false) {
    apiDraft();
    filterDraftUser.value = false;
    filterDraft.value = true;
    filterDateUserDraft.value = false;
    filterDraftDate.value = false;
  }
  if (filterUserOn.value == false && filterDateOn.value == true) {
    apiDraftDate();
    filterDraftUser.value = false;
    filterDraft.value = false;
    filterDateUserDraft.value = false;
    filterDraftDate.value = true;
  }
};
const onAllFilter = async () => {
  currentPage.value = 1;
  filterAll.value = true;
  filterPublish.value = false;
  filterDraft.value = false;
  filterPublishUser.value = false;
  filterDraftUser.value = false;
  filterPublishDate.value = false;
  filterDraftDate.value = false;
  filterUser.value = false;
  filterDate.value = false;
  filterDateUser.value = false;
  filterDateUserPublish.value = false;
  filterDateUserDraft.value = false;
  valueUser.value = "";
  filterUserOn.value = false;
  filterDateOn.value = false;
  valueDateBegin.value = "";
  valueDateEnd.value = "";
  apiClient();
};
const onUserFilter = async (valueUser) => {
  currentPage.value = 1;
  filterAll.value = false;
  filterPublish.value = false;
  filterDraft.value = false;
  filterPublishUser.value = false;
  filterPublishDate.value = false;
  filterDraftDate.value = false;
  filterDraftUser.value = false;
  filterUser.value = true;
  filterDate.value = false;
  filterDateUser.value = false;
  filterUserOn.value = true;
  filterDateOn.value = false;
  statusUser.value = valueUser;
  valueDateBegin.value = "";
  valueDateEnd.value = "";
  filterDateUserPublish.value = false;
  filterDateUserDraft.value = false;
  apiUser(valueUser);
};
const onDateFilter = async () => {
  currentPage.value = 1;
  filterAll.value = false;
  filterPublish.value = false;
  filterDraft.value = false;
  filterPublishUser.value = false;
  filterDraftUser.value = false;
  filterPublishDate.value = false;
  filterDraftDate.value = false;
  filterUser.value = false;
  filterDateOn.value = true;
  filterDateUserPublish.value = false;
  filterDateUserDraft.value = false;
  if (filterUserOn.value == true) {
    apiDateUser();
    filterDateUser.value = true;
    filterDate.value = false;
  }
  if (filterUserOn.value == false) {
    apiDate();
    filterDateUser.value = false;
    filterDate.value = true;
  }
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
    if (filterPublishUser.value == true) {
      currentPage.value = pageNumber;
      apiPublishUser();
    }
    if (filterDraft.value == true) {
      currentPage.value = pageNumber;
      apiDraft();
    }
    if (filterDraftUser.value == true) {
      currentPage.value = pageNumber;
      apiDraftUser();
    }
    if (filterUser.value == true) {
      currentPage.value = pageNumber;
      apiUser(valueUser.value);
    }
    if (filterDate.value == true) {
      currentPage.value = pageNumber;
      apiDate();
    }
    if (filterDateUser.value == true) {
      currentPage.value = pageNumber;
      apiDateUser();
    }
    if (filterDateUserPublish.value == true) {
      currentPage.value = pageNumber;
      apiDateUserPublish();
    }
    if (filterDateUserDraft.value == true) {
      currentPage.value = pageNumber;
      apiDateUserDraft();
    }
    if (filterPublishDate.value == true) {
      currentPage.value = pageNumber;
      apiPublishDate();
    }
    if (filterDraftDate.value == true) {
      currentPage.value = pageNumber;
      apiDraftDate();
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
    await create<Newsadmin>("newsadmins", {
      user: user.value.id,
      username: user.value.username,
      editor: user.value.editor,
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
  status.value = item.attributes.publish;
  showDelete.value = true;
};
const clickDelete = async () => {
  alert.value = true;
  timer();
  try {
    if (status.value == true) {
      const responsePublic = await client<Newspublic>(
        "newspublics/?filters[origin][$eq]=" + id.value,
        {
          method: "GET",
        }
      );
      publics.value = responsePublic.data[0].id;
      await _delete<Newspublic>("newspublics", publics.value);
    }
    await _delete<Newsadmin>("newsadmins", id.value);
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
    apiClient();
  }, 500);
};
const timer = () => {
  setTimeout(() => {
    alert.value = false;
  }, 3000);
};
</script>
