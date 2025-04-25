<script setup>
import HomeFooter from "./c-cpns/home-footer.vue"
import HomeMainHeader from "./c-cpns/home-main-header.vue";
import HomeMainContent from "./c-cpns/home-main-content.vue";

</script>

<template>
  <div class="home-container flex flex-col h-full">
    <main class="flex-1">
      <HomeMainHeader />
      <HomeMainContent />
    </main>
    <HomeFooter />
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
