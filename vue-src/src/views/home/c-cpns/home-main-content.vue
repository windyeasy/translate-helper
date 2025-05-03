<script setup>
import WordList from '@/components/word-list.vue'
import WordResult from '@/components/word-result.vue'
import { useNeuApp } from '@/neu-app-core'

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

const currentTranslated = computed(() => {
  return props.wordList[currentIndex.value]
})

// action
const neuApp = useNeuApp()
function handleOpenInGoogleTranslate(){
  const item = currentTranslated.value

  // const url = `https://translate.google.com/?sl=${item.from}&tl=${item.to}&text=${encodeURIComponent(item.original)}&op=translate`
  // console.log()
  neuApp.native.os.open("https://www.baidu.com");
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
    <ActionPanel>
        <ActionSection title="Open in Google Translate" @click="handleOpenInGoogleTranslate">
          <template #right>
            <div 
              class="right-icon ml-1" 
            >
              <icon-item>
                <svg-icon name="enter" />
              </icon-item>
            </div>
          </template>
        </ActionSection>
        <ActionSection title="Open in Google Translate" @click="handleSectionClick(1)">
          <template #right>
            <div 
              class="right-icon ml-1" 
            >
              <icon-item>
                <svg-icon name="enter" />
              </icon-item>
            </div>
          </template>
        </ActionSection>
    </ActionPanel>
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
