<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  active: {
    type: Boolean,
    default: false
  }
})


</script>

<template>
  <div 
    class="action-section flex justify-between items-center px-2 py-3"
    :class="{active: active}"
  >
    <div class="section-left flex items-center">
      <div class="icon">
        <slot name="icon"></slot>
      </div>
      <div class="title ml-2">{{ title }}</div>
    </div>
    <div class="section-right flex items-center">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.action-section {
  color: var(--c-text-color);
  --c-item-bg: #666;
  cursor: pointer;

  .title {
    font-size: 16px;
  }
  
  &.active {
    background-color: var(--c-as-active-bg);
    border-radius: 6px;
  }
}



</style>
