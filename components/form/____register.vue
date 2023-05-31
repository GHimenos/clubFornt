<template>
  <div>
    <div class="bg-white rounded-3xl pt-8 sm:pr-16 pb-8 sm:pl-16 pr-8 pl-8">
      <img class="mb-8" src="logo.svg" />
      <form>
        <div class="text-red-500">{{ error }}</div>
        <inputLarge
          :placeholder="'Email*'"
          :title="'Адрес электронной почты*'"
          type="email"
          v-model="formData.email"
          @change="v$.email.$touch"
        />
        <div v-if="v$.email.$error" class="text-red-500">Неверный формат</div>
        <p></p>
        <inputLarge
          :placeholder="'Username*'"
          :title="'Username*'"
          type="text"
          v-model="formData.username"
          @change="v$.username.$touch"
        />
        <div v-if="v$.username.$error" class="text-red-500">
          Минимум 4 символов
        </div>
        <p></p>
        <inputLarge
          class="mt-8"
          :placeholder="'Пароль*'"
          :title="'Пароль*'"
          type="password"
          v-model="formData.password"
          @change="v$.password.$touch"
        />
        <div v-if="v$.password.$error" class="text-red-500">
          Минимум 6 символов
        </div>
      </form>
      <buttonPrimaryBase
        class="mt-8 mb-5"
        name="Зарегистрироваться"
        color="backColorActive"
        click="onSubmit"
        @onSubmit="onSubmit"
      />
      <nuxt-link to="/login">Войти в админ панель</nuxt-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from "~/types";
import { required, email, minLength } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";

const { register } = useStrapiAuth();

const error = ref("");

const formData = reactive({
  email: "",
  username: "",
  password: "",
});

//const token = useStrapiToken();
const router = useRouter();
//const user = useStrapiUser();
const client = useStrapiClient();

const rules = computed(() => {
  return {
    email: { required, email },
    username: { required, minLength: minLength(4) },
    password: { required, minLength: minLength(6) },
  };
});

const v$ = useVuelidate(rules, formData);

const onSubmit = async () => {
  try {
    await register({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      editor: false,
    });
    router.push("/login");
  } catch (e) {
    error.value = e.error.name;
  }
};
</script>
