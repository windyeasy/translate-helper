<script setup>
import HomeFooter from "./c-cpns/home-footer.vue";
import HomeMainHeader from "./c-cpns/home-main-header.vue";
import HomeMainContent from "./c-cpns/home-main-content.vue";
import SettingModal from "./c-cpns/setting-modal.vue";
import VsToast from "@vuesimple/vs-toast";
import { useI18n } from "vue-i18n";

import { useKeydown } from "@/hooks/useKeydown";
import { useNeuApp } from "@/neu-app-core";
import useSettingStore from "@/stores/setting";
import { languagesByCode } from "@/data/languages";

import useActionStore from "@/stores/action";
import { storeToRefs } from "pinia";
import useTranslateStore from "@/stores/translate";
import { useShortcutManger } from "@/logics/hotkey";
import { useTauriApp } from "@/logics/tauri-app";

/** setting **/
const showSettingModal = ref(false);
function openSetting() {
  showSettingModal.value = true;
}

const settingStore = useSettingStore();
const targetLangs = computed(() => {
  return settingStore.targetLanguages.map((item) => item.code);
});
const { t } = useI18n();
/** translate **/
const neuApp = useNeuApp();
const isLoading = ref(false);

const translateStore = useTranslateStore();
const { list, currentIndex, activeTranslate } = storeToRefs(translateStore);

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
      title: t("toast.setWarring"),
      message: t("toast.clickMessage"),
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
      title: t("toast.copied"),
      variant: "success",
      showClose: false,
    });
  }
}
// handler keydown
const actionStore = useActionStore();

const { show } = storeToRefs(actionStore);

const shortcutManager = useShortcutManger();
// 快捷键打开action
shortcutManager.register("Ctrl+K", (e) => {
  console.log("进入了")
  e.preventDefault();
  if (showSettingModal.value) return;
  actionStore.toggleShow();
});

const tauriApp = useTauriApp();
shortcutManager.register("Enter", (e) => {
  if (showSettingModal.value) return;
  e.preventDefault();
  // action 打开通过回车在浏览器打开一些网页
  if (show.value) {
    tauriApp.event.emit("enterAction");
  } else {
    handleCopy(activeTranslate.value?.translated);
  }
});

useKeydown((e) => {
  if (show.value) {
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
    return;
  }
  if (list.value.length) {
    // toggle left nav
    if (e.key === "ArrowUp") {
      e.preventDefault();
      translateStore.subCurrentIndex();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      translateStore.addCurrentIndex();
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
    <SettingModal v-model="showSettingModal" />

    <action-panel title="About">
      <action-section title="Open GitHub" :action="{
        type: 'openInBrowser',
        value: 'https://github.com/windyeasy/translate-helper',
      }">
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
