<script setup>
  import useSettingStore from "./stores/setting";
  import { useNeuApp } from "./neu-app-core";
  import { useI18n } from "vue-i18n";

  const neuApp = useNeuApp();
  const settingStore = useSettingStore();
  const {locale} =  useI18n()

  onMounted(async () => {
    // load setting from the setting file
    await settingStore.loadSetting(neuApp);

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
