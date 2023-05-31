<template>
  <div>
    <uiCrumbs
      first="Главная"
      second="Контакты"
      secondLink="/contacts"
      :show="false"
    />
    <div class="container mx-auto mt-2 p-5">
      <div class="lg:flex w-full justify-between">
        <div class="lg:w-4/12">
          <img class="w-80" :src="logo" />
          <div class="mt-10">
            Аналитические исследования в сфере макроэкономики, политологии,
            футурологии с использованием передовых научно-технических достижений
            и методов. Создание видеоконтента, в будущем – документального
            контента. Проведение конференций, консалтинг, развитие дискуссионных
            площадок.
          </div>
          <div class="mt-14 text-lg font-bold">Контактная информация</div>
          <div class="flex mt-5">
            <div class="w-1/5 colorGray">Адрес:</div>
            <div class="w-4/5">
              Киев, ул Василия Тютюнника (бывшая Анри Барбюса) 51/1А, офис 112
            </div>
          </div>
          <div class="flex mt-2">
            <div class="w-1/5 colorGray">Телефон:</div>
            <div class="w-4/5">+380 67 232 00 42</div>
          </div>
          <div class="flex mt-2">
            <div class="w-1/5 colorGray">Почта:</div>
            <div class="w-4/5">club@experts.news</div>
          </div>
        </div>
        <div class="lg:w-4/12 lg:pl-20 p-0 lg:mt-0 mt-8">
          <div class="text-lg font-bold">Есть вопросы? Свяжитесь с нами!</div>
          <inputPrimary placeholder="Ваше имя" class="mt-10" />
          <inputPrimary placeholder="Email:" class="mt-5" />
          <textarea
            placeholder="Ваше сообщение:"
            class="
              text-lg
              pt-2.5
              pr-5
              pb-2.5
              pl-5
              mt-5
              leading-5
              border
              rounded-lg
              backColorBg
              border-gray-400
              w-full
              h-32
            "
          />
          <label class="text-xs">
            <input type="checkbox" required />
            Соглашаюсь на <a>обработку персональных данных</a>
          </label>
          <buttonPrimaryBase
            class="mt-5"
            color="backColorPrimary"
            name="Отправить форму"
          />
        </div>
      </div>
      <iframe
        class="mt-10"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2542.2472958362646!2d30.52610581611107!3d50.41786397947079!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d4cf37a5af615d%3A0xc72cbbe2d6ad10bb!2z0JrQu9GD0LEg0Y3QutGB0L_QtdGA0YLQvtCy!5e0!3m2!1sru!2sua!4v1643674362949!5m2!1sru!2sua"
        width="100%"
        height="400"
        style="border: 0"
        allowfullscreen=""
        loading="lazy"
      ></iframe>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Infopublic } from "~/types";

const experts = ref([]);
const api = ref("");
const logo = ref("/logo.svg");

const route = useRoute();
const url = useStrapiUrl();
api.value = url.replace(/api/, "").slice(0, -1);

const { find } = useStrapi();

onMounted(async () => {
  const response = await find<Infopublic>("infopublics");
  experts.value = response.data;
});
</script>
