<script setup></script>

<template>
  <div class="word-result flex flex-col h-full">
    <main class="word-result-main p-3 flex-1">
      bear
    </main>
    <div class="middle">
      
    </div>
    <footer class="word-result-footer p-3 h-[40%]">
      <div class="footer-item pb-3 flex justify-between">
        <div class="item-left">From</div>
        <div class="footer-item-right">French</div>
      </div>
      <div class="footer-item pb-3 flex justify-between">
        <div class="item-left">To</div>
        <div class="item-right">English</div>
      </div>
      <div class="footer-item pt-3  flex justify-between check-translate">
        <div class="item-left">Translate Back</div>
        <div class="item-right">Different</div>
      </div>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
.word-result-footer,  .check-translate{
  border-top: 1px solid var(--c-border-color);
}
.item-left {
  color: var(--c-sub-text-color);
}


</style>
