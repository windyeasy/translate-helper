import { defineStore } from "pinia";

const useTranslateStore = defineStore("translate", {
  state: () => ({
   currentIndex: 0,
   list: [],
  }),
  getters: {
    activeTranslate(state){
      if (state.list && state.list.length){
        return state.list[state.currentIndex]
      }
    }
  },
  actions: {
    changeList(list) {
        this.list = list;
    },
    changeCurrentIndex(index) {
      this.currentIndex = index;
    },
    addCurrentIndex(){
      const index = this.currentIndex + 1
      this.currentIndex = index === this.list.length ? 0 : index
    },
    subCurrentIndex(){
      const index = this.currentIndex - 1
      this.currentIndex = index === -1 ? this.list.length -1 : index
    }
  },
});

export default useTranslateStore;

