import { defineStore } from "pinia";

const useSettingStore = defineStore("setting", {
  state: () => ({
    targetLanguages: [],
    lang: 'en',
    // todo: self-starting
  }),
  actions: {
    saveSetting(app, setting) {
      this.targetLanguages = setting.targetLanguages
      setting.lang = this.lang
      app.saveSettingJson(setting)
    },
    // load setting from file
    async loadSetting(app) {
      const setting = await app.loadSettingJson()
      if (setting) {
        this.targetLanguages = setting.targetLanguages || []
        this.lang = setting.lang || 'en'
      }
    },
  },
});

export default useSettingStore;
