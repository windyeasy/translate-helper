<script setup>
import useActionStore from '@/stores/action';
import { useTauriApp } from '@/logics/tauri-app';

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  action: {
    type: Object,
    default: () => ({
      type: "openInBrowser", // 'openInBrowser'
      value: '' // 
    })
  }
})

const actionStore = useActionStore();
actionStore.addSectionTitles(props.title)

const active = computed(() => {
  const index = actionStore.currentIndex
  return actionStore.sectionTitles[index] === props.title
})

const tauriApp = useTauriApp();
const actionClick = () => {
  const action = props.action
  if (action.type === 'openInBrowser'){
    tauriApp.openInBrowser(action.value);
  }
}
function handleEnterAction() {
  if (active.value){
    actionClick()
  }
}

// todo: change

// neuApp.on("enterAction", handleEnterAction)

// onUnmounted(() => {
//   neuApp.off("enterAction", handleEnterAction)
// })
</script>

<template>
  <div 
    class="action-section flex justify-between items-center px-2 py-3"
    :class="{active: active}"
    @click="actionClick"
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
          <div class="enter-item">
            <svg-icon name="enter" />
          </div>
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

  cursor: pointer;

  .title {
    font-size: 14px;
  }

  .enter-item {
    background: var(--c-as-enter-item-bg);
    border-radius: 3px;
    cursor: pointer;
    color: var(--c-text-color);
    padding: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &:hover, &.active {
    background-color: var(--c-as-active-bg);
    border-radius: 6px;
  }
}



</style>
