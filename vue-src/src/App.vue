<script setup>
import useSettingStore from './stores/setting';
import { useNeuApp } from './neu-app-core';
const neuApp = useNeuApp();
onMounted(() => {
  // load setting from the setting file
  useSettingStore().loadSetting(neuApp)

});


</script>

<template>
  <main>
    <!-- SVG Sprite -->
   <define-icons />
   <router-view />
  </main>
</template>

<style scoped>

</style>
