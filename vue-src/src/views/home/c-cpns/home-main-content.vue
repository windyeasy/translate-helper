<script setup>
const emit = defineEmits(['translateListChange'])
const props = defineProps({
  list: {
    type: Array,
    default: () => []
  }
})

const currentIndex = ref(0)
function handleToggle(index) {
  currentIndex.value = index
  emit('translateListChange', index)
}

</script>

<template>
  <div class="home-main-content flex-1 flex justify-center items-center ">
    <div class="main-content-inner w-full flex" v-if="list.length">
      <div class="inner-left p-3">
        <translate-list 
          :list="list" 
          :currentIndex="currentIndex" 
          @toggle="handleToggle" 
        />
      </div>
      <div class="inner-right">
        <translate-detail :translateResult="list[currentIndex]" />
      </div>
    </div>
    <no-results v-else />
    <!-- <ActionPanel>
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
    </ActionPanel> -->
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
