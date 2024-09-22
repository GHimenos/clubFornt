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
        <div v-for="info in infos">
          <div
            v-if="route.params.id == info.id"
            class="grid md:grid-cols-4 grid-cols-1 gap-4"
          >
            <div>
              <div class="mb-2 colorGray text-sm">Фотографія</div>
              <div v-if="info.cover != null">
                <img class="rounded-xl" :src="api + info.cover.url" />
              </div>
              <div v-if="info.cover == null">
                <img class="rounded-xl" :src="api + basicUser" />
              </div>
              <form
                name="form"
                @submit.prevent="addCover(info)"
                v-if="info.publish != true"
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
                    value="Завантажити"
                  />
                  <div
                    v-if="info.cover != null"
                    class="ml-2 cursor-pointer"
                    @click="deleteCover(info)"
                  >
                    Видалити
                  </div>
                </div>
              </form>
            </div>
            <div class="col-span-3">
              <inputLarge
                class="mt-4"
                placeholder=""
                title="ПІБ"
                type="text"
                v-model="info.name"
              />
              <inputLarge
                class="mt-4 mb-4"
                placeholder=""
                title="Короткий опис"
                type="text"
                v-model="info.description"
              />
              <div class="mb-2 colorGray text-sm">Детальний опис</div>
              <light-editor v-model="info.body" />
              <div v-if="info.publish != true">
                <div Class="mt-10 text-xl" v-if="user.editor == true">
                  Не забудь зберегти перед публікацією
                </div>
              </div>
              <div class="flex mt-8">
                <div v-if="show">
                  <buttonPrimaryBase
                    v-if="info.publish == false"
                    class="mr-4"
                    color="backColorSecondary"
                    name="Опублікувати"
                    click="onPublic"
                    @onPublic="onPublic(info)"
                  />
                  <buttonPrimaryBase
                    v-if="info.publish == true"
                    class="mr-4"
                    color="backColorSecondary"
                    name="Прибрати з публікації"
                    click="offPublic"
                    @offPublic="offPublic(info)"
                  />
                </div>
                <buttonPrimaryBase
                  v-if="info.publish != true"
                  color="backColorActive"
                  name="Зберегти"
                  click="onSubmit"
                  @onSubmit="onSubmit(info)"
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
import type { Info } from "~/types";
import type { Infopublic } from "~/types";

const token = useStrapiToken();

const show = ref(null);
const alert = ref(false);
const message = ref("");
const users = ref([]);
const infos = ref([]);
const publics = ref([]);
const publicid = ref([]);
const api = ref("");
const userPic = ref("");
const basicUser = ref("/uploads/basic_User_736c630f3f.png");
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
  const responseInfo = await client<User>("/users/?populate=cover", {
    method: "GET",
  });
  infos.value = responseInfo;
  if (user.value.editor == true) {
    show.value = true;
  }
  if (user.value.editor == false) {
    show.value = false;
  }
});
const onSubmit = async (info) => {
  alert.value = true;
  timer();
  try {
    await client<User>(`/users/` + info.id, {
      method: "PUT",
      body: {
        name: info.name,
        description: info.description,
        body: info.body,
      },
    });
    message.value = "Успішно";
  } catch (e) {
    message.value = e;
  }
};
const onPublic = async (info) => {
  alert.value = true;
  timer();
  try {
    if (info.cover == null) {
      userPic.value = "/uploads/basic_User_736c630f3f.png";
    }
    if (info.cover != null) {
      userPic.value = info.cover.url;
    }
    message.value = "Успішно";
    await client<User>(`/users/` + info.id, {
      method: "PUT",
      body: {
        publish: true,
      },
    });
    await create<Infopublic>("infopublics", {
      user: route.params.id,
      name: info.name,
      description: info.description,
      body: info.body,
      cover: userPic.value,
    });
  } catch (e) {
    message.value = e;
  }
  timeOut();
};
const offPublic = async (info) => {
  alert.value = true;
  timer();
  try {
    const responsePublic = await find<Infopublic>("infopublics");
    publics.value = responsePublic.data;
    publicid.value = publics.value.filter(
      (item) => item.attributes.user == route.params.id
    );
    await _delete<Infopublic>("infopublics", publicid.value[0].id);
    await client<User>(`/users/` + info.id, {
      method: "PUT",
      body: {
        publish: false,
      },
    });
    message.value = "Успішно";
  } catch (e) {
    message.value = e;
  }
  timeOut();
};
const selectedFile = (event) => {
  avatar.value = event.target.files[0];
  console.log(avatar.value);
};

async function addCover(info) {
  try {
    const formData = new FormData();
    formData.append("files", avatar.value);

    const response = await client<Upload>(`/upload`, {
      method: "POST",
      body: formData,
    });

    const imageId = response[0].id;

    const dataCover = await client<User>(`/users/` + info.id, {
      method: "PUT",
      body: JSON.stringify({
        cover: imageId,
      }),
    });
  } catch (e) {
    console.log(e);
  }
  timeOut();
}
const deleteCover = async (info) => {
  await _delete<Upload>("/upload/files", info.cover.id);
  timeOut();
};
const timeOut = async () => {
  setTimeout(async () => {
    const responseInfo = await client<User>("/users/?populate=cover", {
      method: "GET",
    });
    infos.value = responseInfo;
  }, 500);
};
const timer = () => {
  setTimeout(() => {
    alert.value = false;
  }, 3000);
};
</script>
