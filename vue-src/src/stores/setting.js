import { defineStore } from "pinia";


const useSettingStore = defineStore("setting", {
  state: () => ({
    targetLanguages: [],
    // todo: hotkey
    // todo: self-starting
  }),
  actions: {
    saveSetting(neuApp, targetLanguages) {
      this.targetLanguages = [...targetLanguages]
      const setting = {
        targetLanguages,
      }
      neuApp.saveSettingJson(setting)
    },
    // load setting from file
    async loadSetting(neuApp) {
      const setting = await neuApp.loadSettingJson()
      if (setting) {
        this.targetLanguages = setting.targetLanguages || []
      }
    },
  },
});

export default useSettingStore;
