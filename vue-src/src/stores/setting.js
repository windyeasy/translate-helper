import { defineStore } from "pinia";

const useSettingStore = defineStore("setting", {
  state: () => ({
    targetLanguages: []
  }),
  actions: {
    addTargetLanguage(language) {
      this.targetLanguages.push(language);
    },
   changeTargetLanguages(languages) {
    this.targetLanguages = languages;
   },
   // todo: save setting to file
  },
});

export default useSettingStore
