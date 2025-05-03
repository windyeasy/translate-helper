<script setup>
defineProps({
  list: {
    type: Array,
    default: () => []
  }
})

const currentIndex = ref(0)

function handleSectionClick(index) {
  currentIndex.value = index
}
</script>

<template>
  <div class="action-list">
    <ActionPanel>
        <ActionSection :title="item.title" @click="handleSectionClick(0)">

          <template #right>
            <div 
              class="right-icon ml-1" 
              v-for="icon in item.actionIcons" 
              :key="icon"
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

<style lang="scss" scoped></style>
