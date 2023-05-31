<template>
  <div>
    <div>
      <div class="backColorPrimary rounded-2xl pt-5 pb-5 pl-2.5 pr-2.5">
        <div class="text-xl mb-1 text-white">{{ title }}</div>
        <div class="rounded-lg bg-white p-2.5 mt-2.5">
          <div class="text-sm">
            {{ body }}
          </div>
          <div class="text-right mt-2.5">
            <nuxt-link :to="link" class="text-sm">{{ linkText }}</nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  title: String,
  link: String,
  linkText: String,
  body: String,
});
</script>
