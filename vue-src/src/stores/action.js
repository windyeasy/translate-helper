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
   addCurrentIndex(){
    const index = this.currentIndex + 1
    this.currentIndex = index === this.sectionTitles.length ? 0 : index
   },
   subCurrentIndex(){
    const index = this.currentIndex - 1
    this.currentIndex = index === -1 ? this.sectionTitles.length -1 : index
   }
   // todo: search, titles search, section.title === titles.findTitle

  },
});

export default useActionStore;
