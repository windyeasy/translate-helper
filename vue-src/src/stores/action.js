import { defineStore } from "pinia";

const useActionStore = defineStore("action", {
  state: () => ({
   currentIndex: 0,
   sectionTitles: [],
   show: false
  }),
  actions: {
   changeCurrent(current) {
    this.current = current;
   },
   addSectionTitles(title) {
    if (this.sectionTitles.includes(title)) return
    this.sectionTitles.push(title);
   },
   openShow(){
    this.show = true
   },
   hideShow(){
    this.show = false
   },
   toggleShow(){
    this.show = !this.show
   },
   // todo: search, titles search, section.title === titles.findTitle

   // todo: toggle and click, hide and show
  },
});

export default useActionStore;
