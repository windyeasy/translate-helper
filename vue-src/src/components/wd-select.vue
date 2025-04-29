<script setup>

defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  options: {
    type: Array,
    default: () => []
  },
  disabled: {
    type: Boolean,
    default: false
  },
})

const langs = [
  { name: 'English', value: 'en' },
  { name: 'Chinese', value: 'zh' },
  { name: 'Japannese', value: 'ja' },
  { name: 'Chinese', value: 'zh' },
  { name: 'Japannese', value: 'ja' },
  { name: 'Chinese', value: 'zh' },
  { name: 'Japannese', value: 'ja' },
  { name: 'Chinese', value: 'zh' },
  { name: 'Japannese', value: 'ja' },
  { name: 'Chinese', value: 'zh' },
  { name: 'Japannese', value: 'ja' },
  { name: 'Chinese', value: 'zh' },
  { name: 'Japannese', value: 'ja' },
  { name: 'Chinese', value: 'zh' },
  { name: 'Japannese', value: 'ja' },
  { name: 'Chinese', value: 'zh' },
  { name: 'Japannese', value: 'ja' },
]

const isExpand = ref(false)

function changeIsExpand(){
  isExpand.value = !isExpand.value
}
</script>

<template>
  <div class="wd-select my-2">
    <div class="select-title py-3">{{ label }}</div>
    <div class="select-content">
      <div class="select-inp px-3 py-2 flex" @click="changeIsExpand">
        <div class="select-inp-left flex-1">English</div>
        <template v-if="isExpand">
          <div class="select-inp-right-icon i-carbon-chevron-up"></div>
        </template>
        <template v-else>
          <div class="select-inp-right-icon i-carbon-chevron-down"></div>
        </template>
      </div>
      <div class="select-list py-2" v-show="isExpand">
        <div class="select-item px-3 py-2" v-for="(item, index) in langs" :key="index">
          <div class="select-item-name">{{ item.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.select-title {
  color: var(--c-sub-text-color);
  font-size: 12px;
}

.select-content {
  position: relative;

  .select-inp {
    border: 1px solid var(--c-sub-text-color);
    border-radius: 4px;
    background-color: var(--c-bg);
  }

  .select-list {
    position: absolute;
    max-height: 200px;
    overflow-y: auto;
    top: 100%;
    margin-top: 15px;
    border: 1px solid var(--c-sub-text-color);
    border-radius: 4px;
    width: 100%;
    background-color: var(--c-bg);
    
    .select-item {
      cursor: pointer;
      &:hover {
        background-color: var(--c-select-hover);
      }
    }
  }
}
</style>
