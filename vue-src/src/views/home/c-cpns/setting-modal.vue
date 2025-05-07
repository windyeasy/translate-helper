<script setup>
import useSettingStore from '@/stores/setting';
import { useNeuApp } from "@/neu-app-core";

defineExpose({
  openShow(){
    show.value = true
  }
})
const show = ref(false)

const settingStore = useSettingStore()

const targetLanguages = ref([])

watchEffect(() => {
  if (show.value){
    targetLanguages.value = [...settingStore.targetLanguages]
  }
})

function addLangItem(){
 targetLanguages.value.push({
  code: '',
  name: ''
 })
}


function handleRemove(index){
  if (targetLanguages.value[index]) {
    targetLanguages.value.splice(index, 1);
  }
}

function handleChangeModelValue(v, i){
  if (!targetLanguages.value[i]) return;
  targetLanguages.value[i].name = v.name;
  targetLanguages.value[i].code = v.code;
}

const neuApp = useNeuApp()
function closeModal(){
  show.value = false
}

function handleSaveSetting(){
  settingStore.saveSetting(neuApp, targetLanguages.value)
  closeModal()
}
</script>

<template>
  <div class="setting-modal" v-if="show">
    <div class="mask"></div>
    <div class="setting-modal-wrapper">
      <div class="modal-header ">
        setting
        <div class="i-carbon-close-large cursor-pointer close-icon" @click="closeModal">
        </div>
      </div>
      <div class="modal-content p-3">
        <div class="modal-item">
          <div class="item-title font-bold font-[18px]">Languages</div>
          <div class="item-content w-[300px] pl-3">
            <div class="select-list-wrap">
              <div 
                class="select-item flex items-center" 
                v-for="(item, index) in targetLanguages" :key="index"
              >
                <select-lang 
                  :label="`language${index + 1}`"
                  :code="item.code" 
                  @change="handleChangeModelValue($event, index)"
                  class="flex-1"
                  @remove="handleRemove(index)"
                ></select-lang>
              </div>
            </div>
            <button class="mt-3 w-full cursor-pointer add-lang-btn" @click="addLangItem">Add</button>
          </div>
        </div>
      </div>
      <div class="modal-footer py-3 flex justify-center">
        <button class="cancel-btn btn-secondary mr-3" @click="closeModal">Cancel</button>
        <button class="save-btn btn-primary" @click="handleSaveSetting">Save</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mask {
  position: fixed;
  
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
}

.modal-header {
  font-size: 18px;
  font-weight: bold;
  padding: 15px 20px;
  border-bottom: 1px solid var(--c-border-color);
  position: relative;

  .close-icon {
    position: absolute;
    right: 15px;
    font-size: 24px;
    top: 50%;
    transform: translateY(-50%);
    width: 24px;
    height: 24px;
    color: var(--c-sub-text-color);
    line-height: 1;
  }
}

.setting-modal-wrapper {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 500px;
  background-color: var(--c-modal-bg);
  z-index: 10;
  border: 1px solid var(--c-border-color);
  border-radius: 6px;
}



.add-lang-btn {
  height: 35px;
  color: var(--c-text-color);
  border-radius: 4px;
  background-color: var(--c-primary);
  color: #fff;
  border: none;
  outline: none;
  &:hover {
    background-color: #79bbff;
  }
}

.modal-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;


  button {
    height: 35px;
    width: 100px;
    border: none;
    outline: none;
    border-radius: 6px;
    cursor: pointer;

  }
  .cancel-btn {
    background-color: var(--c-modal-bg);
    border: 1px solid var(--c-border-color);
    color: var(--c-text-color);
    &:hover {
      color: #5c8fc3;
    }
  }

  .save-btn {
    background-color: var(--c-primary);
    color: #fff;
    &:hover {
      background-color: #79bbff;
    }
  }
}
</style>
