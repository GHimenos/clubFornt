<template>
  <div>
    <div class="bg-white rounded-3xl pt-8 sm:pr-16 pb-8 sm:pl-16 pr-8 pl-8">
      <nuxt-link to="/">
        <img class="mb-8" :src="logo" />
      </nuxt-link>
      <form>
        <div class="text-red-500">{{ error }}</div>
        <inputLarge
          :placeholder="'Email*'"
          :title="'Адреса електронної пошти*'"
          type="email"
          v-model="formData.email"
          @change="v$.email.$touch"
        />
        <div v-if="v$.email.$error" class="text-red-500">
          Неправильний формат
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
          Мінімум 6 символів
        </div>
      </form>
      <buttonPrimaryBase
        class="mt-8 mb-5"
        name="Увійти"
        color="backColorActive"
        click="onSubmit"
        @onSubmit="onSubmit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { required, email, minLength } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";

const error = ref("");
const logo = ref("/logo.svg");

const formData = reactive({
  email: "",
  password: "",
});

const { login } = useStrapiAuth();
const token = useStrapiToken();
const router = useRouter();
const user = useStrapiUser();

const rules = computed(() => {
  return {
    email: { required, email },
    password: { required, minLength: minLength(6) },
  };
});

const v$ = useVuelidate(rules, formData);

const onSubmit = async () => {
  try {
    await login({
      identifier: formData.email,
      password: formData.password,
    });
    router.push("/news-admin");
  } catch (e) {
    error.value = e.error.message;
  }
};
</script>
