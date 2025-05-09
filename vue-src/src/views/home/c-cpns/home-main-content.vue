<script setup>
import useTranslateStore from '@/stores/translate';
import { storeToRefs } from 'pinia';

const {list} = storeToRefs(useTranslateStore())
</script>

<template>
  <div class="home-main-content flex-1 flex justify-center items-center ">
    <div class="main-content-inner w-full flex" v-if="list.length">
      <div class="inner-left p-3">
        <translate-list />
      </div>
      <div class="inner-right">
        <translate-detail  />
      </div>
    </div>
    <no-results v-else />
  </div>
</template>

<style lang="scss" scoped>
.home-main-content {
  overflow-x: hidden;
  overflow-y: auto;
}

.main-content-inner {
  height: 100%;

  .inner-left {
    width: 35%;
    height: 100%;
    border-right: 1px solid var(--c-border-color);
    overflow-y: auto;
  }

  .inner-right {
    flex: 1;
    height: 100%;
    overflow-y: auto;
  }
}
</style>
