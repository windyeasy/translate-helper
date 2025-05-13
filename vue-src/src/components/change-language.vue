<script setup>
import VueSelect from "vue-select";
import useSettingStore from "@/stores/setting";

const options  = [
  {
    label: "English",
    value: "en"
  },
  {
    label: "中文",
    value: 'zh'
  }
]

const settingStore = useSettingStore()
const {lang} = settingStore
const currentLang = ref(lang)

const showValue = computed(() => {
  return options.find(item => item.value === currentLang.value)
})

function changeModelValue(event){

  if(event){
    currentLang.value = event.value
  }else{
    currentLang.value = ''
  }
}

function changeStoreLang(){
  settingStore.lang = currentLang.value
}

defineExpose({
  changeStoreLang
})
</script>

<template>
  <div class="change-language flex items-center justify-between pt-4">
    <div class="select-title py-3 mr-3">{{ $t("label.language") }}</div>
    <div class="select-content w-[200px]">
        <VueSelect 
         :modelValue="showValue" 
         :placeholder="$t('placeholder.selectLanguage')" 
         :options="options"
         @update:modelValue="changeModelValue"
        ></VueSelect>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.select-title {
  color: var(--c-sub-text-color);
  font-size: 14px;
  color: var(--c-text-color);
}
</style>
