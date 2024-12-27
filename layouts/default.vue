<template>
  <div>
    <div class="w-full bg-white">
      <div class="container mx-auto menuIndex items-center justify-between p-5">
        <nuxt-link class="mb-4" to="/"><img src="/logo.svg" /></nuxt-link>
        <input
          class="text-lg pt-2.5 pr-5 pb-2.5 pl-5 leading-5 border rounded-lg backColorBg border-gray-400 w-72"
          v-model="query"
          @keyup.enter="performSearch"
          placeholder="Пошук..."
        />
        <button v-if="!isLargeScreen" @click="toggleMenu" class="mt-4">
          ☰ Меню
        </button>
        <div class="flex menuButton" v-if="menuVisible">
          <buttonPrimaryIcon
            class="mr-6"
            :name="'Youtube'"
            :icon="'iconYoutube'"
            :color="'backColorActive'"
            click="onYoutube"
            @onYoutube="
              onLink('https://www.youtube.com/channel/UC4plQ0XBaoLOKPIXrb1aMGQ')
            "
          />
          <buttonPrimaryIcon
            :name="'Telegram'"
            :icon="'iconTelegram'"
            :color="'backColorPrimary'"
            click="onTelegram"
            @onTelegram="onLink('https://t.me/ExpertsNews')"
          />
          <nuxt-link class="text-2xl pt-2 pl-4" to="/news-admin/">
            <nuxt-icon name="iconUser" class="text-2xl" />
          </nuxt-link>
        </div>
      </div>
      <div v-if="menuVisible" class="burger-menu">
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
            <img :src="cloud" class="mr-2" />{{ weather.current.temp_c }} °C
            Киев
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
    </div>
    <slot />
    <div class="w-full bg-white mt-20">
      <div class="container mx-auto p-5">
        <div class="menuFooter justify-between grid-cols-2">
          <div>
            <img class="sm:block hidden" src="/logo.svg" />
            <img class="block sm:hidden" src="/logoIcon.svg" />
            <p class="text-lg mt-8">Підписуйтесь на наші соцмережі:</p>
            <div class="flex mt-4">
              <buttonPrimaryIcon
                class="mr-4"
                :name="'Youtube'"
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
                :name="'Telegram'"
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
  { name: "Головна", link: "/" },
  { name: "Новини", link: "/news" },
  { name: "Аналітика", link: "/analytics" },
  { name: "Думки", link: "/opinions" },
  { name: "Наші експерти", link: "/experts" },
  { name: "Про проект", link: "/about" },
  { name: "Партнери", link: "/partners" },
  { name: "Контакти", link: "/contacts" },
]);

import { ref } from "vue";

const query = ref("");

function performSearch() {
  if (query.value.trim()) {
    // Перенаправление на страницу с результатами
    navigateTo(`/search?q=${encodeURIComponent(query.value)}`);
  }
}

const menuVisible = ref(true);
const isLargeScreen = ref(false);

onMounted(() => {
  const checkScreenWidth = () => {
    isLargeScreen.value = window.innerWidth > 1024;

    if (!isLargeScreen.value) {
      menuVisible.value = false;
    } else {
      menuVisible.value = true;
    }
  };

  checkScreenWidth();

  window.addEventListener("resize", checkScreenWidth);

  onUnmounted(() => {
    window.removeEventListener("resize", checkScreenWidth);
  });
});

const toggleMenu = () => {
  menuVisible.value = !menuVisible.value;
};

const cloud = ref("/weather.svg");
const time = ref("");
const date = ref("");
const week = ref(["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"]);
const month = ref([
  "січня",
  "лютого",
  "березня",
  "квітня",
  "травня",
  "червня",
  "липня",
  "серпня",
  "вересня",
  "жовтня",
  "листопада",
  "грудня",
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
