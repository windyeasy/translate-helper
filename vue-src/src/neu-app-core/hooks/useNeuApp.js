import { getCurrentInstance } from 'vue'

export default function useNeuApp() {
  const instance = getCurrentInstance()
  const { $neuApp } = instance.appContext.config.globalProperties
  
  return $neuApp
}
