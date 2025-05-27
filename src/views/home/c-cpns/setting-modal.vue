<script setup>
import useSettingStore from "@/stores/setting";
import { useTauriApp } from "@/logics/tauri-app";
import VsToast from "@vuesimple/vs-toast";
import { useShortcutManger } from "@/logics/hotkey";
import { useI18n } from "vue-i18n";

const show = defineModel({ type: Boolean, default: false })
const tauriApp = useTauriApp();

const settingStore = useSettingStore();
const targetLanguages = ref([]);

watch(() => show.value, () => {
  if (show.value) {
    targetLanguages.value = [...settingStore.targetLanguages];
    if (!targetLanguages.value.length)
      addLangItem()
    tauriApp.isSetting = show.value;
  }
});

function addLangItem() {
  targetLanguages.value.push({
    code: "",
    name: "",
  });
}

function handleRemove(index) {
  if (targetLanguages.value[index]) {
    targetLanguages.value.splice(index, 1);
  }

}

function handleChangeModelValue(v, i) {
  if (!targetLanguages.value[i]) return;
  if (v) {
    targetLanguages.value[i].name = v.name;
    targetLanguages.value[i].code = v.code;
  } else {
    targetLanguages.value[i].name = "";
    targetLanguages.value[i].code = "";
  }
}

function closeModal() {
  show.value = false;
  tauriApp.isSetting = false;
}

const activeTab = ref("languages");

function changeActiveTab(value) {
  activeTab.value = value;
}

// hotkey
const hotkeyActiveIndex = ref(null)
const globalHotkeys = reactive({
  toggleHotkey: tauriApp.toggleHotkey,
  translateHotkey:  tauriApp.translateHotkey,
})
function changeHotkeyActiveIndex(index) {
  hotkeyActiveIndex.value = index;
}


// setting hotkey
const shortcutManager = useShortcutManger()
shortcutManager.captureHotkey((hotkey) => {
  if (hotkeyActiveIndex.value == null || !show.value) return

  if (hotkeyActiveIndex.value == 'toggleHotkey')
    return globalHotkeys.toggleHotkey = hotkey
  if (hotkeyActiveIndex.value == 'translateHotkey')
    return globalHotkeys.translateHotkey = hotkey
})

const changeLanguageRef = ref(null)
const { t } = useI18n();
function validateSetting() {
  if (targetLanguages.value) {
    for (const language of targetLanguages.value) {
      if (!language.code) {
        VsToast.show({
          title: t("toast.selectTargetLanguage"),
          variant: "danger",
          showClose: false,
        });
        return false
      }
    }
  }
  return true
}
function handleSaveSetting() {
  if (!validateSetting()) return
  changeLanguageRef.value && changeLanguageRef.value.changeStoreLang()
  tauriApp.setGlobalHotkey(globalHotkeys.toggleHotkey, globalHotkeys.translateHotkey)
  settingStore.saveSetting(tauriApp, {
    targetLanguages: [...targetLanguages.value],
  });

  closeModal();
}
</script>

<template>
  <div class="setting-modal" v-if="show" @click="changeHotkeyActiveIndex(null)">
    <div class="mask"></div>
    <div class="setting-modal-wrapper flex flex-col">
      <div class="modal-header">
        {{ $t("label.setting") }}
        <div class="i-carbon-close-large cursor-pointer close-icon" @click="closeModal"></div>
      </div>
      <div class="modal-content p-3 flex-1 overflow-y-auto">
        <div class="content-tabs flex">
          <div class="tab font-bold font-[18px]" :class="{ active: activeTab === 'languages' }"
            @click="changeActiveTab('languages')">
            {{ $t("tab.targetLanguages") }}
          </div>
          <div class="tab font-bold font-[18px]" :class="{ active: activeTab === 'control' }"
            @click="changeActiveTab('control')">
            {{ $t("tab.control") }}
          </div>
        </div>

        <template v-if="activeTab === 'languages'">
          <div class="languages-content w-[300px]">
            <div class="select-list-wrap pl-3">
              <div class="select-item flex items-center" v-for="(item, index) in targetLanguages" :key="index">
                <select-lang :label="`${$t('label.language')}${index + 1}`" :code="item.code"
                  @change="handleChangeModelValue($event, index)" class="flex-1"
                  @remove="handleRemove(index)"></select-lang>
              </div>
            </div>
            <button class="mt-3 w-full cursor-pointer add-lang-btn" @click="addLangItem">
              {{ $t("buttons.add") }}
            </button>
          </div>
        </template>

        <template v-else>
          <div class="global-hotkeys w-[460px]">
            <set-autostart />
            <change-language ref="changeLanguageRef" />
            <div class="hotkey-item flex pt-6 justify-between items-center">
              <div class="item-title">{{ $t("label.appHotkey") }}:</div>
              <div class="hotkey-input" :class="{ active: hotkeyActiveIndex === 'toggleHotkey' }"
                @click.stop="changeHotkeyActiveIndex('toggleHotkey')">
                {{ globalHotkeys.toggleHotkey }}
              </div>
            </div>
            <div class="hotkey-item flex pt-6 justify-between items-center">
              <div class="item-title">{{ $t("label.translateHotkey") }}：</div>
              <div 
                class="hotkey-input" 
                :class="{active: hotkeyActiveIndex === 'translateHotkey'}"
                @click.stop="changeHotkeyActiveIndex('translateHotkey')"
              >
                {{ globalHotkeys.translateHotkey }}
              </div>
            </div>
          </div>
        </template>
      </div>
      <div class="modal-footer h-[80px]">
        <div class="modal-footer-fixed flex justify-center items-center h-[80px]">
          <button class="cancel-btn btn-secondary mr-3" @click="closeModal">
            {{ $t("buttons.cancel") }}
          </button>
          <button class="save-btn btn-primary" @click="handleSaveSetting">
            {{ $t("buttons.save") }}
          </button>
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
    font-size: 24px;
    top: 50%;
    transform: translateY(-50%);
    width: 24px;
    height: 24px;
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

.content-tabs {
  .tab {
    padding: 6px 10px;
    border: 1px solid var(--c-border-color);
    cursor: pointer;
    border-right: none;

    &:last-child {
      border-right: 1px solid var(--c-border-color);
    }

    color: var(--c-sub-text-color);

    &.active {
      color: var(--c-text-color);
    }
  }


}

.global-hotkeys {
  .hotkey-item {
    .hotkey-input {
      border: 1px solid var(--c-border-color);
      border-bottom: 2px solid var(--c-border-color);
      text-align: center;
      width: 200px;
      padding: 4px 0 6px;

      &.active {
        border-bottom: 2px solid var(--c-primary);
      }
    }
  }
}

.add-lang-btn {
  height: 35px;
  color: var(--c-text-color);
  border-radius: 4px;
  background-color: var(--c-primary);
  color: #fff;
  border: none;
  outline: none;

  &:hover {
    background-color: #79bbff;
  }
}

.modal-footer {
  background-color: var(--c-modal-bg);
}

.modal-footer-fixed {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;

  button {
    height: 35px;
    width: 100px;
    border: none;
    outline: none;
    border-radius: 6px;
    cursor: pointer;
  }

  .cancel-btn {
    background-color: var(--c-modal-bg);
    border: 1px solid var(--c-border-color);
    color: var(--c-text-color);

    &:hover {
      color: #5c8fc3;
    }
  }

  .save-btn {
    background-color: var(--c-primary);
    color: #fff;

    &:hover {
      background-color: #79bbff;
    }
  }
}
</style>
