<script setup>
const show = ref(true)
</script>

<template>
  <div class="action-modal flex flex-col">
    <div class="panel-header px-3 py-4">
      <input autofocus type="text" placeholder="Search for action..." class="search-action-inp" plasholder="Search for action...">
    </div>
    <div class="action-list px-3 flex-1" id="action-list"> 
      <slot></slot>
    </div>

  </div>
</template>

<style lang="scss" scoped>
.action-modal {
  position: fixed;
  width: 500px;
  height: 360px;
  overflow-y: auto;
  border: 1px solid var(--c-border-color);
  background-color: var(--c-modal-bg);
  border-radius: 8px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;


  .action-list {
    overflow-y: auto;
  }
  .panel-header {
    border-bottom: 1px solid var(--c-border-color);
  

    background-color: var(--c-modal-bg);
    .search-action-inp {
      border: none;
      outline: none;
      background-color: var(--c-modal-bg);
      width: 100%;
      color: var(--c-text-color);
      font-size: 16px;
      &:hover {
        border: none;
        outline: none;
      }
    }
  }
}
</style>
