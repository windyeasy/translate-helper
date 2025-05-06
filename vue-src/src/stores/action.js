import { defineStore } from "pinia";

const useActionStore = defineStore("action", {
  state: () => ({
   currentIndex: 0,
   sectionTitles: []
  }),
  actions: {
   changeCurrent(current) {
    this.current = current;
   },
   addSectionTitles(title) {
    if (this.sectionTitles.includes(title)) return
    this.sectionTitles.push(title);
   },
   // todo: search, titles search, section.title === titles.findTitle

   // todo: toggle and click, hide and show
  },
});

export default useActionStore;
