<script setup>
const currentIndex = ref(0)
</script>

<template>
  <div class="word-list">
    <template v-for="(item, index) in 10" :key="index">
      <div class="word-item flex px-2 p-3" :class="{active: index === currentIndex}" @click="currentIndex = index" >
        <div class="word-item-left flex-1">{{ item }} </div>
        <div class="word-item-right">
          fr → en
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.word-list {
  box-sizing: border-box;
 
  height: 100%;
  .word-item {
    border-radius: 6px;
    overflow: hidden;
    cursor: pointer;
  }

  .active {
    background-color: var(--c-item-bg);
  }

  .word-item-right {
    color: var(--c-sub-text-color);
    display: flex;
    align-items: center;
    vertical-align: middle;
  }
}
</style>
