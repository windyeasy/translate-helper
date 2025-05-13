import { defineStore } from "pinia";


const useSettingStore = defineStore("setting", {
  state: () => ({
    targetLanguages: [],
    lang: 'en',
    // todo: self-starting
  }),
  actions: {
    saveSetting(neuApp, setting) {
      this.targetLanguages = setting.targetLanguages
      setting.lang = this.lang
      neuApp.saveSettingJson(setting)
    },
    // load setting from file
    async loadSetting(neuApp) {
      const setting = await neuApp.loadSettingJson()
      if (setting) {
        this.targetLanguages = setting.targetLanguages || []
        this.lang = setting.lang || 'en'
      }
    },
  },
});

export default useSettingStore;
