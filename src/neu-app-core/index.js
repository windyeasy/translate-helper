import AppCoreByNeu from "./app-core-by-neu";
import useNeuApp from "./hooks/useNeuApp";
// import Neutralino from "@neutralinojs/lib"
function createNeuApp(config = {}) {
  return (app) => {
    const neuApp = new AppCoreByNeu({})
    neuApp.init(config)

    app.config.globalProperties.$neuApp = neuApp
  };
}



export {
  AppCoreByNeu,
  createNeuApp,
  useNeuApp
}
