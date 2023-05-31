<template>
  <div>
    <div class="mb-2 colorGray text-sm">{{ title }}</div>
    <input
      class="
        text-lg
        pt-2.5
        pr-5
        pb-2.5
        pl-5
        leading-5
        border
        rounded-lg
        backColorBg
        border-gray-400
        w-full
      "
      :type="type"
      :v-model="model"
      :name="name"
      :autocomplete="autocomplete"
      :id="id"
      :placeholder="placeholder"
    />
  </div>
</template>
<script setup>
const props = defineProps({
  model: String,
  type: String,
  name: String,
  autocomplete: String,
  id: String,
  placeholder: String,
  title: String,
});
</script>
