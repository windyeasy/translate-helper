import { getCurrentInstance } from 'vue'
import {TranslateHelperTauriApp} from '../core'
/**
 * 使用封装的tauri app
 * @returns {TranslateHelperTauriApp}
 */
export default function useTauriApp() {
  const instance = getCurrentInstance()
  if (!instance) {
    throw new Error('Hook must be called within setup()');
  }
  return instance.appContext.config.globalProperties.$tauriApp
}
