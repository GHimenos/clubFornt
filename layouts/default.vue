<template>
  <div>
    <div class="w-full bg-white">
      <div class="container mx-auto menuIndex items-center justify-between p-5">
        <nuxt-link to="/"><img src="/logo.svg" /></nuxt-link>
        <inputPrimary
          :placeholder="'Поиск...'"
          class="xl:w-96 w-80 menuButton"
        />
        <div class="flex menuButton">
          <buttonPrimaryIcon
            class="mr-6"
            :name="'Наш Youtube'"
            :icon="'iconYoutube'"
            :color="'backColorActive'"
            click="onYoutube"
            @onYoutube="
              onLink('https://www.youtube.com/channel/UC4plQ0XBaoLOKPIXrb1aMGQ')
            "
          />
          <buttonPrimaryIcon
            :name="'Telegram канал'"
            :icon="'iconTelegram'"
            :color="'backColorPrimary'"
            click="onTelegram"
            @onTelegram="onLink('https://t.me/ExpertsNews')"
          />
        </div>
      </div>
      <div
        class="container mx-auto menuIndex pl-5 pr-5 pb-5 justify-between mt-3"
      >
        <ul class="ulMenu" v-for="item in menus">
          <li>
            <nuxt-link class="headLink text-lg" :to="item.link">{{
              item.name
            }}</nuxt-link>
          </li>
        </ul>
      </div>
      <div
        class="menuIndex xl:w-6/12 w-8/12 justify-between mx-auto pb-4 colorSecondary"
      >
        <div class="menuWheather">
          <img :src="cloud" class="mr-2" />{{ weather.current.temp_c }} °C Киев
        </div>
        <div>{{ date }} {{ time }}</div>
        <div v-for="item in currency">
          {{ item.ccy }}
          {{ item.buy.slice(0, 5) }}/<span class="colorActive">{{
            item.sale.slice(0, 5)
          }}</span>
        </div>
      </div>
    </div>
    <slot />
    <div class="w-full bg-white mt-20">
      <div class="container mx-auto p-5">
        <div class="menuFooter justify-between grid-cols-2">
          <div>
            <img class="sm:block hidden" src="/logo.svg" />
            <img class="block sm:hidden" src="/logoIcon.svg" />
            <p class="text-lg mt-8">Подписывайтесь на наши соцсети:</p>
            <div class="flex mt-4">
              <buttonPrimaryIcon
                class="mr-4"
                :name="'Наш Youtube'"
                :icon="'iconYoutube'"
                :color="'backColorActive'"
                click="onYoutube"
                @onYoutube="
                  onLink(
                    'https://www.youtube.com/channel/UC4plQ0XBaoLOKPIXrb1aMGQ'
                  )
                "
              />
              <buttonPrimaryIcon
                :name="'Telegram канал'"
                :icon="'iconTelegram'"
                :color="'backColorPrimary'"
                click="onTelegram"
                @onTelegram="onLink('https://t.me/ExpertsNews')"
              />
            </div>
            <div class="flex mt-4 mb-4">
              <buttonPrimaryIcon
                class="mr-4"
                :name="'Facebook'"
                :icon="'iconFacebook'"
                :color="'backColorFacebook'"
                click="onFacebook"
                @onFacebook="
                  onLink('https://www.facebook.com/expertsclubukraine')
                "
              />
              <buttonPrimaryIcon
                :name="'Linkedin'"
                :icon="'iconLinkedin'"
                :color="'backColorLinkedin'"
                click="onLinkedin"
                @onLinkedin="
                  onLink(
                    'https://www.linkedin.com/in/experts-club-experts-club-01263521b?fromQR=1'
                  )
                "
              />
            </div>
          </div>
          <div
            class="flex flex-col justify-center text-base font-bold colorGray"
          >
            <div>Все права защищены, ООО “Клуб Экспертов”</div>
            <div>Всі права захищені, ТОВ "Клуб Експертів"</div>
            <div>All rights reserved, LLC "Experts Club"</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const menus = ref([
  { name: "Главная", link: "/" },
  { name: "Новости", link: "/news" },
  { name: "Аналитика", link: "/analytics" },
  { name: "Мнения", link: "/opinions" },
  { name: "Наши эксперты", link: "/experts" },
  { name: "Партнёры", link: "/partners" },
  { name: "Контакты", link: "/contacts" },
]);
const cloud = ref("/weather.svg");
const time = ref("");
const date = ref("");
const week = ref(["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"]);
const month = ref([
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
]);

const zeroPadding = (num, digit) => {
  var zero = "";
  for (var i = 0; i < digit; i++) {
    zero += "0";
  }
  return (zero + num).slice(-digit);
};

const updateTime = () => {
  var cd = new Date();
  time.value =
    zeroPadding(cd.getHours(), 2) +
    ":" +
    zeroPadding(cd.getMinutes(), 2) +
    ":" +
    zeroPadding(cd.getSeconds(), 2);
  date.value =
    zeroPadding(cd.getDate(), 2) +
    " " +
    month.value[cd.getMonth()] +
    " " +
    zeroPadding(cd.getFullYear(), 4) +
    " " +
    week.value[cd.getDay()];
};

const timer = () => {
  setInterval(updateTime, 1000);
};

timer();

const { data: currency } = await useFetch(
  "https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5"
);

const { data: weather } = await useFetch(
  "https://weatherapi-com.p.rapidapi.com/current.json?q=Kiev",
  {
    headers: {
      "x-rapidapi-key": "7750ee1456msh90bc99376ebec2cp1ed6e2jsn753eebf4d40e",
      "x-rapidapi-host": "weatherapi-com.p.rapidapi.com",
    },
  }
);
const onLink = (url) => {
  window.open(url, "_blank", "noreferrer");
};
</script>
