<script setup>
import useTranslateStore from '@/stores/translate';
import { storeToRefs } from 'pinia';


const translateStore = useTranslateStore()
const {list, currentIndex} = storeToRefs(translateStore)

function changeCurrentIndex(index) {
  currentIndex.value = index
}

</script>

<template>
  <div class="translate-list">
    <template v-for="(item, index) in list" :key="index">
      <div class="list-item flex px-2 p-3" 
      :class="{active: index === currentIndex}" @click="changeCurrentIndex(index)" >
        <div class="list-item-left flex-1">{{ item.translated }} </div>
        <div class="list-item-right">
           {{ item.to }}
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.translate-list {
  box-sizing: border-box;
 
  height: 100%;
  .list-item {
    border-radius: 6px;
    overflow: hidden;
    cursor: pointer;
  }

  .active {
    background-color: var(--c-item-bg);
  }

  .list-item-right {
    color: var(--c-sub-text-color);
    display: flex;
    align-items: center;
    vertical-align: middle;
  }
}
</style>
