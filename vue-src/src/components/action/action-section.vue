<script setup>
import useActionStore from '@/stores/action';

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
 
})

const actionStore = useActionStore();
actionStore.addSectionTitles(props.title)

const active = computed(() => {
  const index = actionStore.currentIndex
  return actionStore.sectionTitles[index] === props.title
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
      <slot name="right">
        <template v-if="active">
          <icon-item>
            <svg-icon name="enter" />
          </icon-item>
        </template>
        <template v-else>
          <div class="i-carbon-chevron-right p-[5px]"></div>
        </template>
      </slot>
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
  
  &:hover, &.active {
    background-color: var(--c-as-active-bg);
    border-radius: 6px;
  }
}



</style>
