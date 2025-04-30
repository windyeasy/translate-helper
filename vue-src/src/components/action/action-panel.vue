<script setup>
const show = ref(false)
</script>

<template>
  <div class="action-panel">
    <div class="title">Action</div>
    <div class="action-list"> 
      <slot></slot>
    </div>
    <div class="panel-footer">
      <input type="text" plasholder="Search for action...">
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
