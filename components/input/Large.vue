<template>
  <div>
    <label class="colorGray text-sm">{{ title }}</label>
    <input
      class="
        mt-1.5
        text-lg
        pt-4
        pr-5
        pb-4
        pl-5
        leading-5
        border
        rounded-lg
        backColorBg
        border-gray-400
        w-full
      "
      :type="type"
      :name="name"
      :autocomplete="autocomplete"
      :id="id"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
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
  modelValue: String,
});
</script>
