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
            <cardEventAdmin
              v-if="item.cover == null"
              :cover="basicUser"
              :name="item.username"
              :date="item.createdAt.slice(0, -14)"
              :link="'/users/' + item.id"
              :status="item.publish"
              click="deleteUser"
              @deleteUser="deleteUser(item)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from "~/types";
import type { Infopublic } from "~/types";

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
    await client<User>("/users", {
      method: "POST",
      body: {
        email: email.value,
        username: username.value,
        password: password.value,
        confirmed: true,
        editor: false,
        role: "",
        publish: false,
      },
    });
  } catch (e) {
    console.log(e);
  }
  apiClient();
};
const deleteUser = (item) => {
  person.value = item.username;
  id.value = item.id;
  showDelete.value = true;
  //
  status.value = item.publish;
  console.log(id.value);
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
      const responsePublic = await client<Infopublic>(
        "infopublics/?filters[user][$eq]=" + id.value,
        {
          method: "GET",
        }
      );
      publics.value = responsePublic.data[0].id;
      console.log(responsePublic);
      await _delete<Infopublic>("infopublics", publics.value);
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
