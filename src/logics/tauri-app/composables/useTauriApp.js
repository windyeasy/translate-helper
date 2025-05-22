import { getCurrentInstance } from 'vue'

export default function useTauriApp() {
  const instance = getCurrentInstance()
  return instance.appContext.config.globalProperties.$tauriApp
}
