<script setup>
defineProps({
  name: {
    type: String,
    required: true,
  },
  width: {
    type: [String, Number],
    default: '1.2em',
  },
  height: {
    type: [String, Number],
    default: '1.2em',
  },
});
</script>

<template>
  <svg :width="width" :height="height">
    <use :href="`#icon-${name}`"></use>
  </svg>
</template>

<style lang="scss" scoped></style>
