<script setup>
import { storeToRefs } from 'pinia';
import useActionStore from '@/stores/action';

const actionStore = useActionStore()

const {show} = storeToRefs(actionStore)



// const searchKeyworld = ref('')

// //
// function changeSearchKeyworld(e) {
//   searchKeyworld.value = e.target.value
// }

</script>

<template>
  <div class="action-modal-wrapper" v-show="show">
    <div class="mask" @click="actionStore.hideShow"></div>
    <div class="action-modal flex flex-col" >
      <!-- <div class="panel-header px-3 py-4">
        <input 
          autofocus 
          type="text" 
          placeholder="Search for action..." 
          class="search-action-inp" 
          plasholder="Search for action..."
          :value="searchKeyworld"
          @input="changeSearchKeyworld"
        >
      </div> -->
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
