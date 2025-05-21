<script setup>
  import { toggleDark } from "@/logics/theme";
  import useActionStore from "@/stores/action";
  
  const { openShow} = useActionStore()
  const emit = defineEmits(["settingClick"])

  function settingClick() {
    emit('settingClick')
  }
</script>

<template>
  <footer class="footer flex items-center justify-between p-3">
    <div class="footer-left flex">
      <img src="@/assets/logo.svg" class="app-icon w-[20px] h-[20px]"></img>
      <div class="app-name ml-2">TranslateHelper</div>
    </div>
    <div class="footer-right flex">
      <div class="left">
        <div class="footer-right-item flex items-center">
          <div class="item-title mr-2 copy">{{ $t("label.copy") }}</div>
          <icon-item>
            <svg-icon name="enter" />
          </icon-item>
        </div>
      </div>
      <div class="right flex">
        <div class="action-area flex items-center cursor-pointer" @click="openShow">
          <div class="action-title mr-3">{{  $t("label.actions") }}</div>
          <icon-item class="w-[30px] h-[28px]">
            <span>Ctrl</span>
          </icon-item>
          <icon-item class="ml-1 w-[30px] h-[28px]">
            <span>K</span>
          </icon-item>
        </div>
        <icon-item @click="settingClick" >
          <div class="i-carbon-settings cursor-pointer"></div>
        </icon-item>
        <icon-item class="ml-1">
          <div
            class="i-carbon-sun dark:i-carbon-moon icon-btn"
            @click="toggleDark"
          ></div>
        </icon-item>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.footer {
  color: var(--c-sub-text-color);
  border-top: 2px solid var(--c-border-color);
  box-sizing: border-box;
  .copy {
    color: var(--c-text-color);
  }
  
}

.footer-right {

  .left, .action-area { 
    position: relative;
    padding-right: 30px;

    &::after {
      position: absolute;
      content: "";
      height: 16px;
      width: 2px;
      background-color: #666;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  .action-area {
    span {
      line-height: 1;
      font-size: 14px;
    }
  }
}
</style>
