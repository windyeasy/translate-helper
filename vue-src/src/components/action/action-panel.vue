<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <Teleport to="#action-list">
    <div class="action-panel py-3">
      <div class="panel-title px-3 pt-2 pb-3" v-show="title">{{ title  }}</div>
      <div class="panel-content">
        <slot></slot>
      </div>
    </div>    
  </Teleport>
</template>

<style lang="scss" scoped>
.action-panel {
  border-bottom: 1px solid var(--c-border-color);
  &:last-child {
    border-bottom: none;
  }
  
  .panel-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--c-sub-text-color);
  }
}
</style>
