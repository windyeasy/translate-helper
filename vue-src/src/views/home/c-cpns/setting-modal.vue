<script setup>
const show = ref(false)

defineExpose({
  openShow(){
    show.value = true
  }
})
</script>

<template>
  <div class="setting-modal" v-if="show">
    <div class="mask"></div>
    <div class="setting-modal-wrapper">
      <div class="modal-header ">
        setting
        <div class="close-icon" @click="show = false">
          <svg-icon name="close" class="icon-btn"></svg-icon>
        </div>
      </div>
      <div class="modal-content p-3">
        <div class="modal-item">
          <div class="item-title font-bold font-[18px]">Languages</div>
          <div class="item-content w-[300px] pl-3">
            <wd-select label="Language1"></wd-select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mask {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
}

.modal-header {
  font-size: 18px;
  font-weight: bold;
  padding: 15px 20px;
  border-bottom: 1px solid var(--c-border-color);
  position: relative;

  .close-icon {
    position: absolute;
    right: 15px;
    font-size: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 12px;
    height: 12px;
    color: var(--c-sub-text-color);
    line-height: 1;
  }
}

.setting-modal-wrapper {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 500px;
  background-color: var(--c-modal-bg);
  z-index: 10;
  border: 1px solid var(--c-border-color);
  border-radius: 6px;

}
</style>
