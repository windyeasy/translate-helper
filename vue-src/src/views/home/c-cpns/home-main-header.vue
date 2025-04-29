<script setup>
import debounce from '@/logics/debounce'

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['search'])
const keyword = ref('')

function resetKeyword() {
  keyword.value = ''
  debounceSearch()
}
  
const debounceSearch =  debounce(() => {
  emit('search', keyword.value.trim())
}, 500)

function handleChangeKeyword(e) {
  keyword.value = e.target.value
  debounceSearch() 
}

</script>

<template>
    <div class="main-header">
      <div class="search-inp-wrap px-3 py-4 flex" v-network-loading="isLoading">
        <icon-item @click="resetKeyword">
          <svg-icon name="prev" :class="{'icon-disabled': !keyword}" />
        </icon-item>
        <input type="text" 
          :value="keyword"
          @input="handleChangeKeyword"
          class="ml-2 flex-1" 
          placeholder="Enter text to translate..." 
          autofocus
           />
      </div>
    </div>
</template>

<style lang="scss" scoped>
.search-inp-wrap {
  border-bottom: 1px solid var(--c-border-color);
  input {
    border: none;
    outline: none;
    background-color: var(--c-bg);
    color: var(--c-text-color);

    &:hover {
      border: none;
      outline: none;
    }
  }
}

.icon-disabled {
  opacity: 0.4;
}


</style>
