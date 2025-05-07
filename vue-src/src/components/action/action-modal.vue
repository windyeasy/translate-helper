<script setup>
import useActionStore from '@/stores/action';
import { storeToRefs } from 'pinia';
import debounce from '@/logics/debounce';
const actionStore = useActionStore()

const {show} = storeToRefs(actionStore)

function handleKeyDown(e) {
  if (e.altKey && e.key.toUpperCase() === 'k'.toUpperCase()) {
    e.preventDefault(); // 阻止浏览器默认保存行为
    actionStore.toggleShow()
  }
}

const handleKeyDownDouble = debounce(handleKeyDown, 200)

onMounted(() => {
  document.addEventListener('keydown', handleKeyDownDouble)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDownDouble)
})
</script>

<template>
  <div class="action-modal-wrapper" v-show="show">
    <div class="mask" @click="actionStore.hideShow"></div>
    <div class="action-modal flex flex-col" >
      <div class="panel-header px-3 py-4">
        <input autofocus type="text" placeholder="Search for action..." class="search-action-inp" plasholder="Search for action...">
      </div>
      <div class="action-list px-3 flex-1" id="action-list"> 
        <slot></slot>
      </div>
    </div>
  </div>

</template>

<style lang="scss" scoped>
.mask {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: 99;
}
.action-modal {
  position: fixed;
  width: 500px;
  height: 360px;
  overflow-y: auto;
  border: 1px solid var(--c-border-color);
  background-color: var(--c-modal-bg);
  border-radius: 8px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;


  .action-list {
    overflow-y: auto;
  }
  .panel-header {
    border-bottom: 1px solid var(--c-border-color);
  

    background-color: var(--c-modal-bg);
    .search-action-inp {
      border: none;
      outline: none;
      background-color: var(--c-modal-bg);
      width: 100%;
      color: var(--c-text-color);
      font-size: 16px;
      &:hover {
        border: none;
        outline: none;
      }
    }
  }
}
</style>
