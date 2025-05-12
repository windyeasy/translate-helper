import { defineStore } from "pinia";


const useSettingStore = defineStore("setting", {
  state: () => ({
    targetLanguages: [],
    // todo: self-starting
  }),
  actions: {

    saveSetting(neuApp, setting) {
      this.targetLanguages = setting.targetLanguages
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
