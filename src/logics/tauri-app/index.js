import TranslateHelperTauriApp from "./core";
import useTauriApp from "./composables/useTauriApp";

/**
 * @param {Object} config - 预留配置信息后面可能用到 
 * @returns 
 */
function createTuriApp(config = {}) {
  return async (app) => {
     const tauriApp = new TranslateHelperTauriApp();
      await tauriApp.init();
      app.config.globalProperties.$tauriApp = tauriApp;
  };
}

export {
  createTuriApp,
  useTauriApp
}
