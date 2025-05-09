<script setup>
  import HomeFooter from "./c-cpns/home-footer.vue";
  import HomeMainHeader from "./c-cpns/home-main-header.vue";
  import HomeMainContent from "./c-cpns/home-main-content.vue";
  import SettingModal from "./c-cpns/setting-modal.vue";
  import VsToast from "@vuesimple/vs-toast";
  import { useKeydown } from "@/hooks/useKeydown";
  import { useNeuApp } from "@/neu-app-core";
  import useSettingStore from "@/stores/setting";
  import { languagesByCode } from "@/data/languages";

  import useActionStore from "@/stores/action";
  import { storeToRefs } from "pinia";
  import useTranslateStore from "@/stores/translate";


  /** setting **/ 
  const settingModalRef = ref(null);
  function openSetting() {
    settingModalRef.value.openShow();
  }

  const settingStore = useSettingStore();
  const targetLangs = computed(() => {
    return settingStore.targetLanguages.map((item) => item.code);
  });

  /** translate **/ 
  const neuApp = useNeuApp();
  const isLoading = ref(false);

  const translateStore = useTranslateStore()
  const {list, currentIndex, activeTranslate} = storeToRefs(translateStore)

  const langReg = new RegExp(
    `[>:/](${Object.keys(languagesByCode).join("|")})$`,
    "i"
  );

  const fromLang = ref("auto");
  const searchKeyword = ref("");

  let lastRequestId = 0;

  function handleTranslate(value) {
    isLoading.value = false;
    searchKeyword.value = value;

    // reset currentIndex
    currentIndex.value = 0;
    if (!value) {
      list.value = [];
      return;
    }
    if (targetLangs.value.length === 0) {
      VsToast.show({
        title: "Please set the target language first",
        message: "click the setting button",
        variant: "warning",
      });
      return;
    }
    isLoading.value = true;

    const sourceText = value
      .replace(langReg, (_, lang) => {
        const _lang = lang.toLowerCase();
        if (_lang !== fromLang.value) fromLang.value = _lang;
        return "";
      })
      .trim();

    if (value === sourceText && fromLang.value !== "auto") {
      fromLang.value = "auto";
    }
    const requestId = ++lastRequestId;
    neuApp
      .translateAll(sourceText, fromLang.value, targetLangs.value)
      .then((res) => {
        if (requestId === lastRequestId) {
          list.value = res;
          isLoading.value = false;
        }
        if (!searchKeyword.value) {
          list.value = [];
        }
      })
      .catch((error) => {
        if (requestId === lastRequestId) {
          isLoading.value = false;
        }
        VsToast.show({
          title: "Could not translate",
          message: String(error),
          variant: "error",
          showClose: false,
        });
      });
  }

  async function handleCopy(value) {

    if (value) {
      await neuApp.clipboardWriteText(value);
      VsToast.show({
        title: "copied",
        variant: "success",
        showClose: false,
      });
    }
  }
  // handler keydown
  const actionStore = useActionStore();

  const { show } = storeToRefs(actionStore);
  useKeydown((e) => {
    //
    if (e.ctrlKey && e.key.toUpperCase() === "k".toUpperCase()) {
      e.preventDefault();
      actionStore.toggleShow();
      return;
    }
    if (show.value) {
      if (e.key === "Enter") {
        e.preventDefault();
        neuApp.emit("enterAction");
        return;
      }
      // changeCurrentAction(e.key)
      if (e.key === "ArrowUp") {
        e.preventDefault();
        actionStore.subCurrentIndex();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        actionStore.addCurrentIndex();
        return;
      }
    } else if (list.value.length) {
      if (e.key === "Enter") {
        e.preventDefault();
        handleCopy(activeTranslate.value?.translated)
        return;
      }

      // toggle left nav
      if (e.key === "ArrowUp") {
        e.preventDefault();
        translateStore.addCurrentIndex()
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        translateStore.subCurrentIndex()
        return;
      }
    }
  });
</script>

<template>
  <div class="home-container flex flex-col h-full">
    <main class="flex-1 flex flex-col hidden">
      <HomeMainHeader @search="handleTranslate" :isLoading="isLoading" />
      <HomeMainContent />
    </main>
    <HomeFooter @setting-click="openSetting" />
    <SettingModal ref="settingModalRef" />

    <action-panel title="About">
      <action-section
        title="Open GitHub"
        :action="{
          type: 'openInBrowser',
          value: 'https://github.com/windyeasy/translate-helper',
        }"
      >
        <template #icon>
          <div class="i-carbon:logo-github w-[20px] h-[20px]" />
        </template>
      </action-section>
    </action-panel>
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
