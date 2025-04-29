import { defineStore } from "pinia";


const useSettingStore = defineStore("setting", {
  state: () => ({
    targetLanguages: [],
    // todo: hotkey
    // todo: self-starting
  }),
  actions: {
    addTargetLanguage(language) {
      this.targetLanguages.push(language);
    },
    changeTargetLanguages(languages) {
      this.targetLanguages = languages;
    },

    removeTargetLanguage(index) {
      if (this.targetLanguages[index]) {
        this.targetLanguages.splice(index, 1);
      }
    },
    changeTargetLanguage(i, v) {
      if (!this.targetLanguages[i]) return;
      this.targetLanguages[i].name = v.name;
      this.targetLanguages[i].code = v.code;
    },
    // todo: save setting to file
    saveSetting(neuApp) {
      const setting = {
        targetLanguages: this.targetLanguages
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
