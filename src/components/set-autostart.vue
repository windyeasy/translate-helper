<script setup>
import useAutostart from "@/logics/autostart"

const { isStart, changeAutoStart } = useAutostart()
</script>

<template>
  <div class="set-autosart flex items-center justify-between pt-4">
    <div class="title py-3 mr-3">{{ $t("label.autoStart") }}</div>
    <div class="content flex w-[200px]" @click="changeAutoStart">
       <div class="i-carbon-checkbox" v-if="!isStart"></div>
       <div class="i-carbon-checkbox-checked" v-else></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.set-autosart { 
  .title {
    color: var(--c-sub-text-color);
    font-size: 14px;
    color: var(--c-text-color);
  }

  .content {
    font-size: 18px;
  }
}

</style>
