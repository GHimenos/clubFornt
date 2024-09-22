<template>
  <div>
    <div @click="onClick" class="cursor-pointer flex">
      <nuxt-icon name="iconExit" class="text-2xl pr-1" />Вийти
    </div>
  </div>
</template>
<script setup lang="ts">
const router = useRouter();
const user = useStrapiUser();
const { logout } = useStrapiAuth();
const onClick = () => {
  router.push("/");
  setTimeout(() => {
    logout();
  }, 500);
};
</script>
