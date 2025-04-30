<script setup>
import { getLanguageName } from "@/data/languages.js"
import {useNeuApp} from "@/neu-app-core";
import VsToast from '@vuesimple/vs-toast';

const props = defineProps({
  translateResult: {
    type: Object,
    default: () => ({})
  },

})

const neuApp = useNeuApp()
const translateBackResult = ref({})
const isLoading = ref(false)

const isSame = computed(() => {
  const {original} = props.translateResult
  return original?.trim().toLowerCase() === translateBackResult.value?.translated?.trim().toLowerCase()
})

function handleTranslateBack(){
  const {translated, from, to } = props.translateResult
  isLoading.value = true
  neuApp.translate(translated, to, from).then(res => {
    isLoading.value = false
    translateBackResult.value = res

  }).catch(err => {
    isLoading.value = false
    VsToast.show({
      title: 'Could not translate',
      message: String(err),
      variant: 'error',
      showClose: false,
    });
  })
}

watchEffect(()  => {
  if (props.translateResult && props.translateResult.translated){
    handleTranslateBack()
  }
})

async function copyText(text) {
  await neuApp.clipboardWriteText(text)
 
  VsToast.show({
    title: 'copied',
    variant: 'success',
    showClose: false,
  });
}
</script>

<template>
  <div class="word-result flex flex-col h-full">
    <main class="word-result-main p-3 font-size-[18px] flex-1">
      <div class="translated relative pt-2 pb-4 pr-[40px]">
        {{ translateResult.translated }}
        <icon-item class="copy-button w-[30px] absolute right-0 top-0" @click="copyText(translateResult.translated)">
          <div class="i-carbon-copy"></div>
        </icon-item>
      </div>
      <div class="translate-back pt-3" v-if="translateBackResult.translated && !isSame">{{ translateBackResult.translated }}</div>
    </main>

    <footer class="word-result-footer p-3 h-[40%]">
      <div class="footer-item pb-3 flex justify-between">
        <div class="item-left">From</div>
        <div class="footer-item-right">{{ getLanguageName(translateResult.from) }}</div>
      </div>
      <div class="footer-item pb-3 flex justify-between">
        <div class="item-left">To</div>
        <div class="item-right">{{ getLanguageName(translateResult.to) }}</div>
      </div>
      <div class="footer-item pt-3  flex justify-between check-translate">
        <div class="item-left">Translate Back</div>
        <div class="item-right" v-if="translateBackResult.translated">
          <div class="right-text flex items-center" >
            <template v-if="isSame">
              <div class="i-carbon-checkmark-outline mr-1" />Same
            </template>
            <template v-else>
              <div class="i-carbon-information mr-1" />Different
            </template>
          </div>
          <div class="check-loading" v-if="isLoading"></div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style lang="scss" scoped>

.translate-back {
  border-top: 1px solid var(--c-border-color);
}

.word-result-footer,  .check-translate{
  border-top: 1px solid var(--c-border-color);
}
.item-left {
  color: var(--c-sub-text-color);
}

.check-loading {
  position: relative;
  width: 30px;
  height: 30px;
  border: 2px solid #000;
  border-top-color: transparent;
  border-bottom-color: transparent;
  border-radius: 100%;

  animation: arrow-circle infinite 0.75s linear;
}

.check-loading:before,
.check-loading:after {
  position: absolute;
  top: 24px;
  left: -2px;
  border-top: 5px solid #000;
  border-right: 5px solid transparent;
  border-left: 5px solid transparent;
  content: "";
  transform: rotate(-30deg);
}
.check-loading:after {
  top: 0;
  left: 20.5px;

  transform: rotate(150deg);
}

@keyframes arrow-circle {
  0% {
    transform: rotate(360deg);
  }
  100% {
    transform: rotate(0);
  }
}

</style>
