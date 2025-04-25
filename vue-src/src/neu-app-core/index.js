import AppCoreByNeu from "./app-core-by-neu";
import useNeuApp from "./hooks/useNeuApp";
function createNeuApp(config = {}) {
  return (app) => {
    // Neutralino is global Object
    const neuApp = new AppCoreByNeu(Neutralino)
    neuApp.init(config)

    app.config.globalProperties.$neuApp = neuApp
  };
}



export {
  AppCoreByNeu,
  createNeuApp,
  useNeuApp
}
