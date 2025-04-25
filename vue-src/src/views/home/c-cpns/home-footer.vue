<script setup>
  import { toggleDark } from "@/logics/index";
</script>

<template>
  <footer class="footer flex items-center justify-between p-3">
    <div class="footer-left flex">
      <div class="app-icon w-20px h-20px bg-pink"></div>
      <div class="app-name ml-2">TranslateHelper</div>
    </div>
    <div class="footer-right flex">
      <div class="left">
        <div class="footer-right-item flex items-center">
          <div class="item-title mr-2 copy">Copy</div>
          <div class="icon-item flex items-center">
            <div class="w-1.2em h-1.2em">
              <svg t="1745584250693" viewBox="0 0 1024 1024"  version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2749" ><path d="M804.248575 157.915589l0 431.250908L393.361461 589.166497 393.361461 407.414013l-265.620613 227.143277 265.620613 227.01741L393.361461 679.95013l456.278931 0c25.086351 0 45.391816-20.36277 45.391816-45.39284L895.032208 157.915589 804.248575 157.915589 804.248575 157.915589zM804.248575 157.915589"  p-id="2750" fill="currentColor"></path></svg>
            </div>
          </div>
        </div>
      </div>

      <div class="right flex">
        <div class="icon-item">
          <div class="i-carbon-settings cursor-pointer"></div>
        </div>
        <div class="icon-item ml-1">
          <div
            class="i-carbon-sun dark:i-carbon-moon icon-btn"
            @click="toggleDark"
          ></div>
        </div>
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
  .icon-item {
    background: var(--c-item-bg);
    border-radius: 4px;
    padding: 5px;
    cursor: pointer;
    color: var(--c-text-color);
  }

  .left {
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
}
</style>
