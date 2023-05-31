<template>
  <div>
    <alertMessage :show="alert" :name="message" />
    <headerAdmin />
    <menuAdmin
      users="../users"
      news="../news-admin"
      opinions="../opinions-admin"
      analytics="../analytics-admin"
      partners="../partners-admin"
      rss="../rss-admin"
      :show="show"
    />
    <div class="container mx-auto pl-5 pr-5">
      <div class="bg-white rounded-3xl p-4 mb-4">
        <div v-for="item in analytics">
          <div
            v-if="route.params.id == item.id"
            class="grid md:grid-cols-4 grid-cols-1 gap-4"
          >
            <div>
              <div class="mb-2 colorGray text-sm">Обложка</div>
              <div v-if="item.attributes.cover.data != null">
                <img
                  class="rounded-xl"
                  :src="api + item.attributes.cover.data.attributes.url"
                />
              </div>
              <div v-if="item.attributes.cover.data == null">
                <img class="rounded-xl" :src="api + basicUser" />
              </div>
              <form
                name="form"
                @submit.prevent="addCover(item)"
                v-if="item.attributes.publish != true"
              >
                <input
                  class="mt-4"
                  type="file"
                  name="cover"
                  @change="selectedFile($event)"
                />
                <div class="flex mt-4">
                  <input
                    type="submit"
                    class="cursor-pointer"
                    value="Загрузить"
                  />
                  <div
                    v-if="item.attributes.cover.data != null"
                    class="ml-2 cursor-pointer"
                    @click="deleteCover(item)"
                  >
                    Удалить
                  </div>
                </div>
              </form>
            </div>
            <div class="col-span-3">
              <inputLarge
                class="mt-4"
                placeholder=""
                title="Заголовок"
                type="text"
                v-model="item.attributes.name"
              />
              <inputLarge
                class="mt-4"
                placeholder=""
                title="Краткое описание"
                type="text"
                v-model="item.attributes.description"
              />
              <div class="mb-2 colorGray text-sm mt-4">Аналитика</div>
              <light-editor v-model="item.attributes.body" />
              <div v-if="item.attributes.publish != true">
                <div Class="mt-10 text-xl" v-if="user.editor == true">
                  Не забудь сохранить, перед публикацией
                </div>
              </div>
              <div class="flex mt-8">
                <div v-if="user.editor == true">
                  <buttonPrimaryBase
                    v-if="item.attributes.publish == false"
                    class="mr-4"
                    color="backColorSecondary"
                    name="Опубликовать"
                    click="onPublic"
                    @onPublic="onPublic(item)"
                  />
                  <buttonPrimaryBase
                    v-if="item.attributes.publish == true"
                    class="mr-4"
                    color="backColorSecondary"
                    name="Убрать из публикации"
                    click="offPublic"
                    @offPublic="offPublic(item)"
                  />
                </div>
                <buttonPrimaryBase
                  v-if="item.attributes.publish != true"
                  color="backColorActive"
                  name="Сохранить"
                  click="onSubmit"
                  @onSubmit="onSubmit(item)"
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
definePageMeta({
  middleware: ["auth"],
  layout: "custom",
});

import type { User } from "~/types";
import type { Analyticadmin } from "~/types";
import type { Infopublic } from "~/types";

const show = ref(null);
const alert = ref(false);
const message = ref("");
const users = ref([]);
const analytics = ref([]);
const publics = ref([]);
const publicid = ref([]);
const api = ref("");
const userPic = ref("");
const basicUser = ref("/uploads/no_Img_342f66288a.png");
const avatar = ref(null);
const form = reactive({});

const url = useStrapiUrl();
api.value = url.replace(/api/, "").slice(0, -1);

const client = useStrapiClient();
const user = useStrapiUser();
const route = useRoute();

const { find } = useStrapi();
const { create } = useStrapi();
const { update } = useStrapi4();
const { delete: _delete } = useStrapi4();

onMounted(async () => {
  const response = await find<User>("users");
  users.value = response;
  const responseInfo = await client<Analyticadmin>(
    "/analyticadmins/?populate=cover&pagination[pageSize]=1000000",
    {
      method: "GET",
    }
  );
  analytics.value = responseInfo.data;
  if (user.value.editor == true) {
    show.value = true;
  }
  if (user.value.editor == false) {
    show.value = false;
  }
});
const onSubmit = async (item) => {
  alert.value = true;
  timer();
  try {
    await update<Analyticadmin>("analyticadmins", item.id, {
      name: item.attributes.name,
      body: item.attributes.body,
      description: item.attributes.description,
    });
    message.value = "Успешно";
  } catch (e) {
    message.value = e;
  }
};
const onPublic = async (item) => {
  alert.value = true;
  timer();
  try {
    if (item.attributes.cover.data == null) {
      userPic.value = "/uploads/no_Img_342f66288a.png";
    }
    if (item.attributes.cover.data != null) {
      userPic.value = item.attributes.cover.data.attributes.url;
    }
    message.value = "Успешно";
    await update<Analyticadmin>("analyticadmins", item.id, {
      publish: true,
    });
    await create<Analyticpublic>("analyticpublics", {
      user: item.attributes.user,
      username: item.attributes.username,
      origin: route.params.id,
      name: item.attributes.name,
      body: item.attributes.body,
      cover: userPic.value,
      description: item.attributes.description,
    });
  } catch (e) {
    message.value = e;
  }
  timeOut();
};
const offPublic = async (item) => {
  alert.value = true;
  timer();
  try {
    const responsePublic = await find<Analyticpublic>(
      "analyticpublics?pagination[pageSize]=1000000"
    );
    publics.value = responsePublic.data;
    publicid.value = publics.value.filter(
      (item) => item.attributes.origin == route.params.id
    );
    await _delete<Analyticpublic>("analyticpublics", publicid.value[0].id);
    await update<Analyticadmin>("analyticadmins", item.id, {
      publish: false,
    });
    message.value = "Успешно";
  } catch (e) {
    message.value = e;
  }
  timeOut();
};
const selectedFile = (event) => {
  avatar.value = event.target.files[0];
};
async function addCover(item) {
  try {
    const form = document.forms["form"];
    const formData = new FormData();
    formData.append("files.cover", avatar.value);
    formData.append("data", JSON.stringify(form));
    const { data } = await client<Analyticadmin>(`/analyticadmins/` + item.id, {
      method: "PUT",
      body: formData,
    });
  } catch (e) {
    console.log(e);
  }
  timeOut();
}
const deleteCover = async (item) => {
  await _delete<Upload>("/upload/files", item.attributes.cover.data.id);
  timeOut();
};
const timeOut = async () => {
  setTimeout(async () => {
    const responseInfo = await client<Analyticadmin>(
      "/analyticadmins/?populate=cover&pagination[pageSize]=1000000",
      {
        method: "GET",
      }
    );
    analytics.value = responseInfo.data;
  }, 500);
};
const timer = () => {
  setTimeout(() => {
    alert.value = false;
  }, 3000);
};
</script>
