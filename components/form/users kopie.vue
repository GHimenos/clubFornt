<template>
  <div>
    <alertMessage :show="alert" :name="message" />
    <alertDelete
      :showDelete="showDelete"
      clickCancel="clickCancel"
      @clickCancel="clickCancel()"
      clickDelete="clickDelete"
      @clickDelete="clickDelete()"
      :name="
        'Ви дійсно впевнені, що хочете видалити користувача: ' + person + '?'
      "
    />
    <div class="container mx-auto pl-5 pr-5" v-if="show">
      <div class="bg-white rounded-xl p-4 mb-4">
        <buttonPrimaryBase
          color="backColorPrimary"
          name="Додати користувача"
          click="onShow"
          @onShow="onShow"
        />
      </div>
      <div class="bg-white rounded-3xl p-4 mb-4" v-if="add">
        <inputLarge
          placeholder=""
          title="Username"
          type="text"
          v-model="username"
        />
        <inputLarge
          placeholder=""
          title="Email"
          type="email"
          v-model="email"
          class="mt-4"
        />
        <inputLarge
          placeholder=""
          title="Пароль"
          type="password"
          v-model="password"
          class="mt-4 mb-4"
        />
        <buttonPrimaryBase
          color="backColorActive"
          name="Створити користувача"
          click="addUser"
          @addUser="addUser"
        />
      </div>
      <div class="lg:pl-40 lg:pr-40 pl-0 pr-0">
        <div class="flex flex-col">
          <div v-for="item in users">
            <div v-if="user.id != item.id">
              <div v-for="info in paginatedOne">
                <div v-if="info.attributes.user == item.id">
                  <cardEventAdmin
                    v-if="info.attributes.cover.data != null"
                    :cover="api + info.attributes.cover.data.attributes.url"
                    :name="item.username"
                    :date="item.createdAt.slice(0, -14)"
                    :link="'/users/' + item.id"
                    :status="info.attributes.publish"
                    click="deleteUser"
                    @deleteUser="deleteUser(item)"
                  />
                </div>
                <div v-if="info.attributes.user == item.id">
                  <cardEventAdmin
                    v-if="info.attributes.cover.data == null"
                    :cover="basicUser"
                    :name="item.username"
                    :date="item.createdAt.slice(0, -14)"
                    :link="'/users/' + item.id"
                    :status="info.attributes.publish"
                    click="deleteUser"
                    @deleteUser="deleteUser(item)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <uiPagination
          class="mb-20"
          @change="refetch"
          :totalPages="pageCount"
          :currentPage="page"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from "~/types";
import type { Info } from "~/types";

const alert = ref(false);
const message = ref("");
const add = ref(false);
const show = ref(null);
const showDelete = ref(null);
//
const status = ref("");
const publics = ref([]);
const meta = ref([]);
//
const username = ref("");
const email = ref("");
const password = ref("");
const person = ref("");
const id = ref("");
const api = ref("");
const basicUser = ref("/basicUser.png");
const users = ref([]);
const userInfo = ref([]);
const item = ref([]);
const infos = ref([]);
const pageSize = ref(15);
const pageCount = ref(null);
const page = ref(1);
const paginatedOne = ref([]);
const newsAuthor = ref([]);
const user = useStrapiUser();
const url = useStrapiUrl();
api.value = url.replace(/api/, "").slice(0, -1);

const client = useStrapiClient();
const router = useRouter();
const { find } = useStrapi();
const { create } = useStrapi();
const { register } = useStrapiAuth();
const { delete: _delete } = useStrapi4();

const apiClient = async () => {
  show.value = true;
  const response = await client<User>(
    "/users/?populate=cover&sort=id:desc&pagination[pageSize]=1000000",
    {
      method: "GET",
    }
  );
  users.value = response;

  const responseInfo = await client<Info>(
    "/infos/?populate=cover&sort=id:desc&pagination[pageSize]=1000000",
    {
      method: "GET",
    }
  );

  users.value = response;
  userInfo.value = users.value.slice(-1);
  infos.value = responseInfo.data;

  pageCount.value = Math.ceil(infos.value.length / pageSize.value);
  let start = pageSize.value * (page.value - 1);
  let end = start + pageSize.value;
  paginatedOne.value = infos.value.slice(start, end);

  if (user.value.editor == false) {
    show.value = false;
  }
};

onMounted(async () => {
  apiClient();
});
const refetch = async (pageNumber) => {
  page.value = pageNumber;
  apiClient();
};
const addUser = async () => {
  try {
    /*
    await register({
      username: username.value,
      email: email.value,
      password: password.value,
      editor: false,
    });
    router.push("/users");
    */
    await client<User>("/users", {
      method: "POST",
      body: {
        email: email.value,
        username: username.value,
        password: password.value,
        confirmed: true,
        editor: false,
        role: "",
      },
    });
  } catch (e) {
    console.log(e);
  }
  setTimeout(async () => {
    add.value = false;
    const response = await find<User>("users");
    users.value = response;
    userInfo.value = users.value.slice(-1);
    await create<Info>("infos", { user: userInfo.value[0].id, publish: false });
    apiClient();
  }, 500);
};
const deleteUser = (item) => {
  person.value = item.username;
  id.value = item.id;
  showDelete.value = true;
  //
  status.value = item.publish;
};
const clickCancel = () => {
  showDelete.value = false;
};
const onShow = () => {
  add.value = !add.value;
};
const clickDelete = async () => {
  alert.value = true;
  timer();
  try {
    if (status.value == true) {
      const responsePublic = await client<Info>(
        "infos/?filters[origin][$eq]=" + id.value,
        {
          method: "GET",
        }
      );
      publics.value = responsePublic.data[0].id;
      await _delete<Info>("infos", publics.value);
    }
    await _delete<User>("users", id.value);
    showDelete.value = false;
    message.value = "Успішно";
  } catch (e) {
    message.value = e;
  }
  setTimeout(async () => {
    const response = await find<User>("users");
    users.value = response;
  }, 500);
};
const timer = () => {
  setTimeout(() => {
    alert.value = false;
  }, 3000);
};
</script>
