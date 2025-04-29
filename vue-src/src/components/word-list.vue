<script setup>

const emit = defineEmits(['toggle'])
defineProps({
  list: {
    type: Array,
    default: () => []
  },
  currentIndex: {
    type: Number,
    default: 0
  }
})


function changeCurrentIndex(index) {
  emit('toggle', index)
}

</script>

<template>
  <div class="word-list">
    <template v-for="(item, index) in list" :key="index">
      <div class="word-item flex px-2 p-3" 
      :class="{active: index === currentIndex}" @click="changeCurrentIndex(index)" >
        <div class="word-item-left flex-1">{{ item.translated }} </div>
        <div class="word-item-right">
           {{ item.to }}
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
