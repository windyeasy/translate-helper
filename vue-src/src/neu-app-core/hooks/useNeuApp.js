import { getCurrentInstance } from 'vue'

export default useNeuApp = () => {
  const instance = getCurrentInstance()
  const { $neuApp } = instance.appContext.config.globalProperties
  
  return $neuApp
}
