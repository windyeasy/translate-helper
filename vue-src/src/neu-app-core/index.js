import AppCoreByNeu from "./app-core-by-neu";
import useNeuApp from "./hooks/useNeuApp";
function createNeuApp(config = {}) {
  return (app) => {
    // Neutralino is global Object
    const neuApp = new AppCoreByNeu(Neutralino)
    neuApp.init(config)

    // 初始化，任务

    // 1. 设置tray
    // 2. 监听事件，设置点击关闭窗口时不关闭程序
    // 3. 实现监听键盘事件，切换到app中
    // 4. 实现开机自启功能, 后面实现
    app.config.globalProperties.$neuApp = neuApp
  };
}



export {
  AppCoreByNeu,
  createNeuApp,
  useNeuApp
}
