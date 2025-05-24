<script setup>
  import useSettingStore from "./stores/setting";
  import { useI18n } from "vue-i18n";
  import { useTauriApp } from "./logics/tauri-app";

  const tauriApp = useTauriApp()
  const settingStore = useSettingStore();
  const {locale} =  useI18n()

  onMounted(async () => {
    // load setting from the setting file
    await settingStore.loadSetting(tauriApp);
  });
  // set lang
  watch(() => settingStore.lang, async () => {
    locale.value = settingStore.lang;
  });
</script>

<template>
  <main>
    <ActionModal />
    <!-- SVG Sprite -->
    <define-icons />
    <router-view />
  </main>
</template>

<style scoped></style>
