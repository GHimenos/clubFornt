<template>
  <div>
    {{ user }}
    <formLogout />
    <div class="container mx-auto">
      <p class="mt-3"></p>
      <buttonPrimaryIcon
        :name="'Наш Youtube'"
        :icon="'iconYoutube'"
        :color="'backColorActive'"
      />
      <p class="mt-3"></p>
      <buttonPrimaryIcon
        :name="'Telegram канал'"
        :icon="'iconTelegram'"
        :color="'backColorPrimary'"
      />
      <p class="mt-3"></p>
      <buttonPrimaryIcon
        :name="'Facebook'"
        :icon="'iconFacebook'"
        :color="'backColorFacebook'"
      />
      <p class="mt-3"></p>
      <buttonPrimaryIcon
        :name="'Linkedin'"
        :icon="'iconLinkedin'"
        :color="'backColorLinkedin'"
      />
      <p class="mt-3"></p>
      <buttonPrimaryBase :name="'Подробнее'" :color="'backColorPrimary'" />
      <p class="mt-3"></p>
      <buttonPrimarySmall :name="'Подробнее'" :color="'backColorPrimary'" />
      <p class="mt-3"></p>
      <buttonPrimaryMedium
        :name="'Перейти на сайт'"
        :color="'backColorPrimary'"
      />
      <p class="mt-3"></p>
      <buttonPrimarySemi
        :name="'Перейти на сайт'"
        :color="'backColorPrimary'"
      />
      <div class="columns-2 mt-8">
        <cardEventBasic
          :title="'Заголовок новости'"
          :body="'Более подробное описание статьи более подробное описание статьи и что более подробное описание статьи более подробное описание'"
          :linkText="'Подробнее'"
          :link="'/'"
          :img="'img1.png'"
        />
      </div>
      <div class="columns-2 mt-8">
        <cardEventBasic
          :body="'Более подробное описание статьи более подробное описание статьи и что более подробное описание статьи более подробное описание статьи более подробное описание'"
          :linkText="'Подробнее'"
          :link="'/'"
          :img="'img1.png'"
        />
      </div>
      <div class="grid grid-cols-3 mt-8">
        <cardPersonal
          :img="'img1.png'"
          :firstName="'Эксперт'"
          :secondName="'Эксперткин'"
          :body="'Эксперт в области экспертных экспертиз Кандидат экспертных наук Комсомолец спортсмен хороший человек'"
          :moreText="'Подробнее'"
          :publicText="'Публикации в клубе'"
          :moreLink="'/'"
          :publicLink="'/'"
        />
      </div>
      <div class="grid grid-cols-6 mt-8">
        <cardPersonalCite
          :open="'iconMarkOpen'"
          :close="'iconMarkClose'"
          :img="'img1.png'"
          :firstName="'Имя эксперта'"
          :body="'Я просто выражаю свое мнение и имею на это полное право'"
        />
      </div>
      <div class="grid grid-cols-4 mt-8">
        <cardEventBasicSmall
          :title="'Заголовок новости'"
          :body="'Начало статьи в несколько слов и шириной в 240 пх...'"
          :linkText="'Подробнее'"
          :link="'/'"
          :img="'img1.png'"
        />
      </div>
      <div class="grid grid-cols-1 mt-8">
        <bannerMain :img="'img2.png'" />
      </div>
      <div class="grid grid-cols-4 mt-8">
        <cardEventSide
          :title="'Последний обзор'"
          :link="'/'"
          :img="'img3.png'"
          :body="'Краткое описание обзора Краткое описание обзора Краткое описание обзора Краткое описание обзора Краткое описание обзора Краткое описание обзора '"
        />
      </div>
      <div class="grid grid-cols-4 mt-8">
        <cardEventSideSmall
          :title="'Поддержать проект'"
          :link="'/'"
          :img="'img4.png'"
          :body="'Клуб экспертов – независимая площадка, чтобы развиваться дальше, нам нужна ваша поддержка'"
        />
      </div>
      <div class="grid grid-cols-4 mt-8">
        <cardEventSideAbout
          :title="'О проекте'"
          :link="'/'"
          :linkText="'Подробнее'"
          :body="'Краткое описание обзора Краткое описание обзора Краткое описание обзора Краткое описание обзора Краткое описание обзора Краткое описание обзора '"
        />
      </div>
      <div class="grid grid-cols-4 mt-8">
        <inputPrimary :placeholder="'Email'" :title="'Имя пользователя'" />
      </div>
      <div class="grid grid-cols-4 mt-8">
        <inputLarge :placeholder="'Email'" />
      </div>
      <div class="grid grid-cols-3 mt-8">
        <formLogin />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const user = useStrapiUser();
const router = useRouter();
const { logout } = useStrapiAuth();
const onClick = () => {
  logout();
  router.push("/");
};
</script>
