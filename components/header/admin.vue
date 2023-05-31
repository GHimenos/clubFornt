<template>
  <div>
    <div class="w-full bg-white">
      <div class="container mx-auto flex items-center justify-between p-5">
        <img class="sm:block hidden" :src="logo" />
        <img class="block sm:hidden" :src="logoIcon" />
        <div class="flex items-center">
          <div class="hidden sm:block">
            <nuxt-link :to="'/users/' + user.id" class="flex">
              <nuxt-icon name="iconUser" class="text-2xl pr-2" />
              {{ user.username }}
            </nuxt-link>
          </div>
          <div class="hidden sm:block" v-if="user.editor == false">
            &nbsp(Автор)
          </div>
          <div class="hidden sm:block" v-if="user.editor == true">
            &nbsp(Редактор)
          </div>
          <formLogout class="ml-5" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const logo = ref("/logo.svg");
const logoIcon = ref("/logoIcon.svg");
const user = useStrapiUser();
</script>
