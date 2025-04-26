
<template>
  <div class="icon-item flex items-center">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.icon-item {
    background: var(--c-item-bg);
    border-radius: 4px;
    padding: 5px;
    cursor: pointer;
    color: var(--c-text-color);
  }
</style>
