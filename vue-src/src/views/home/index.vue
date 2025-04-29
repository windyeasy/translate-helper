<script setup>
import HomeFooter from "./c-cpns/home-footer.vue"
import HomeMainHeader from "./c-cpns/home-main-header.vue";
import HomeMainContent from "./c-cpns/home-main-content.vue";
import SettingModal from "./c-cpns/setting-modal.vue";
import {useNeuApp} from "@/neu-app-core";

const settingModalRef = ref(null)

function openSetting(){
  settingModalRef.value.openShow()
}

const neuApp = useNeuApp()
const isLoading = ref(false)
const wordList = ref([])

function handleTranslate(value){
 if (!value){ 
  wordList.value = []
  return
 } 
 isLoading.value = true
 setTimeout(() => {
  isLoading.value = false
  neuApp.translateAll(value, 'auto', ['zh-CN', 'fr']).then(res => {
    isLoading.value = false
    wordList.value = res
 }).catch(error => {
    isLoading.value = false
    // todo: showToast
 })
 }, 3000)

}

</script>

<template>
  <div class="home-container flex flex-col h-full">
    <main class="flex-1 flex flex-col hidden">
      <HomeMainHeader @search="handleTranslate" :isLoading="isLoading" />
      <HomeMainContent :word-list="wordList" />
    </main>
    <HomeFooter @setting-click="openSetting" />
    <SettingModal ref="settingModalRef" />
  </div>
</template>

<style lang="scss" scoped>
  .home-container {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>
