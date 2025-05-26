import TranslateHelperTauriApp from "./translate-helper-tauri-app";
/**
 * @param {Object} config - 预留配置信息后面可能用到 
 */
export function createTauriApp(config={}) {
  return (app) => {
    /**
     * 向所有组件实例添加 tauriApp 实例
     * @param {import('vue').ComponentPublicInstance} tauriApp
     */
    app.config.globalProperties.$tauriApp = new TranslateHelperTauriApp(config);
    /**
      * @typedef {import('vue').ComponentPublicInstance & {
      *   $myClass: TranslateHelperTauriApp
      * }} VueWithMyClass
      */
  };
}

export {
  TranslateHelperTauriApp
}

