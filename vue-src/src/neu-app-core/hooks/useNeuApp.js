import { getCurrentInstance } from 'vue'

export default function useNeuApp() {
  const instance = getCurrentInstance()
  return instance.appContext.config.globalProperties.$neuApp
}
