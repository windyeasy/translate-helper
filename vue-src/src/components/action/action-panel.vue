<script setup>
const show = ref(false)
</script>

<template>
  <div class="action-panel flex flex-col">
    <div class="title px-3 py-4">TH-Action</div>
    <div class="action-list px-3 flex-1"> 
      <slot></slot>
    </div>
    <div class="panel-footer px-3 py-4">
      <input autofocus type="text" placeholder="Search for action..." class="search-action-inp" plasholder="Search for action...">
    </div>
  </div>
</template>

<style lang="scss" scoped>
.action-panel {
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

  .title {
    font-size: 18px;
    font-weight: 600;
    color: var(--c-sub-text-color);
  }

  .action-list {
    overflow-y: auto;
  }
  .panel-footer {
    border-top: 1px solid var(--c-border-color);
    position: absolute;
    left: 0;
    width: 100%;
    bottom: 0;
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
