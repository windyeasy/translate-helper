<script setup>
import useSettingStore from '@/stores/setting';
import { useNeuApp } from "@/neu-app-core";
import { storeToRefs } from 'pinia';

defineExpose({
  openShow(){
    show.value = true
  }
})
const show = ref(false)

const settingStore = useSettingStore()

const {targetLanguages} = storeToRefs(settingStore) 

function addLangItem(){
 settingStore.addTargetLanguage({
  code: '',
  name: ''
 })
}


function handleRemove(index){
  settingStore.removeTargetLanguage(index)
}

function handleChangeModelValue(value, index){
  settingStore.changeTargetLanguage(index, value)
}

const neuApp = useNeuApp()
function closeModal(){
  settingStore.saveSetting(neuApp)
  show.value = false
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
  border: 1px solid var(--c-sub-text-color);
  border-radius: 4px;
  background-color: var(--c-modal-bg);
}
</style>
