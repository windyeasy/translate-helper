<script setup>
  import HomeFooter from "./c-cpns/home-footer.vue";
  import HomeMainHeader from "./c-cpns/home-main-header.vue";
  import HomeMainContent from "./c-cpns/home-main-content.vue";
  import SettingModal from "./c-cpns/setting-modal.vue";
  import { useNeuApp } from "@/neu-app-core";
  import useSettingStore from "@/stores/setting";
  import { languagesByCode } from "@/data/languages";

  const settingModalRef = ref(null);

  function openSetting() {
    settingModalRef.value.openShow();
  }

  const neuApp = useNeuApp();
  const isLoading = ref(false);
  const wordList = ref([]);

  const settingStore = useSettingStore();
  const targetLangs = computed(() => {
    return settingStore.targetLanguages.map((item) => item.code);
  });
  const langReg = new RegExp(`[>:/](${Object.keys(languagesByCode).join("|")})$`,"i");

  const fromLang = ref("auto");
  function handleTranslate(value) {
    if (!value) {
      wordList.value = [];
      return;
    }
    isLoading.value = true;

    const sourceText = value.replace(langReg, (_, lang) => {
      const _lang = lang.toLowerCase()
      if (_lang !== fromLang.value)
       fromLang.value = _lang
      return ''
    }).trim()

    if (value === sourceText && fromLang.value !== "auto"){
      fromLang.value = "auto"
    }
    neuApp
      .translateAll(sourceText, fromLang.value, targetLangs.value)
      .then((res) => {
        isLoading.value = false;
        wordList.value = res;
      })
      .catch((error) => {
        isLoading.value = false;
        // todo: showToast
      });
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
