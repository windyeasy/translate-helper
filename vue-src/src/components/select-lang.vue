<script setup>
import VueSelect from "vue-select";
import {languages} from "@/data/languages"

const emit = defineEmits(['change', 'remove'])


const props = defineProps({
  code: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
})

const modelValue = computed(() => {
  return languages.find(item => item.code === props.code)
})
function changeModelValue(event){
  emit('change', event)
}

function handleRemove() {
  emit('remove')
}
</script>

<template>
  <div class="wd-select my-2">
    <div class="select-title py-3">{{ label }}</div>
    <div class="select-content flex items-center">
      <div class="content-left flex-1 mr-2">
        <VueSelect 
         :modelValue="modelValue" 
         placeholder="Please select language" 
         :options="languages"
         label="name"
         @update:modelValue="changeModelValue"
        ></VueSelect>
      </div>
      <div class="select-item-remove i-carbon-close-large cursor-pointer" @click="handleRemove"></div>
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

    .select-placeholder {
      color: var(--c-select-placeholder);
    }
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
      &:hover, &.active {
        background-color: var(--c-select-hover);
      }
    }

   
  }
  .select-item-remove {
    color: red;
    font-weight: bold;
    font-size: 18px;
  } 
}

.none-data {
  color: var(--c-sub-text-color);
}
</style>
