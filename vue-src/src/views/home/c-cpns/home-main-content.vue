<script setup>
import WordList from '@/components/word-list.vue'
import WordResult from '@/components/word-result.vue'

const props = defineProps({
  wordList: {
    type: Array,
    default: () => []
  }
})

const currentIndex = ref(0)
function handleToggle(index) {
  currentIndex.value = index
}

</script>

<template>
  <div class="home-main-content flex-1 flex justify-center items-center ">
    <div class="main-content-inner w-full flex" v-if="wordList.length">
      <div class="inner-left p-3">
        <word-list :list="wordList" 
          :currentIndex="currentIndex" 
          @toggle="handleToggle" />
      </div>
      <div class="inner-right">
        <word-result :translateResult="wordList[currentIndex]" />
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
