import { defaultWindowIcon } from '@tauri-apps/api/app';
import { getCurrentWindow } from "@tauri-apps/api/window";
import {exit} from "@tauri-apps/plugin-process";
import { Menu } from '@tauri-apps/api/menu';
import { createTrayIcon } from './tray-icon-enhanced';
import ShortcutManager from './shortcut-manager';

/**
 * 封装 Tauri API核心服务，提供这个APP的通用功能 
 * @class
 */
class TranslateHelperTauriService {
  /**
   * @property {TauriWindow} window - 当前窗口实例
   */
  constructor() {
    this.window = null;
    this.shortcutManger = new ShortcutManager();
  }
  /**
   * 初始化，有些实例是异步的，通过这个方法可以实现异步初始化赋值
   * @async
   * @returns {Promise<void>}
   */
  async init(){
    this.window = await getCurrentWindow();
    this.onFocusChanged((event) => {
     if (!event.payload){
      this.hide()
     }
    })
  }
  /**
   * 退出应用
   * @returns {Promise<void>}
   */ 
  exit(){
    return exit(1)  
  }
  /**
   * 创建托盘图标
   * @param {Object} [trayIconOptions] - see {@link https://github.com/tauri-apps/tauri/blob/dev/packages/api/src/tray.ts#L74C18-L74C34} 
   * @param {Object} [trayIconOptions.menuOptions] 
   *  - **新增属性**：menu需要Menu.new生成，通过这个属性可以自动调用Menu.new方法，配置信息 
   *  see {@link TranslateHelperTauriService#createMenu} 
   * @returns {Promise<void>}
   */
  async setTray(trayIconOptions = {}){
    const {menuOptions, ...options} = trayIconOptions
    if (!trayIconOptions.icon){
      options.icon = await defaultWindowIcon();
    }
    if (!trayIconOptions.tooltip) {
      options.tooltip = 'TranslateHelper';
    }

    // 单击托盘图标时打开窗口
    if (options.menuOnLeftClick == null){
      options.menuOnLeftClick = false
    }
    if (!trayIconOptions.menu &&  trayIconOptions.menuOptions){
      options.menu = await this.createMenu(trayIconOptions.menuOptions)
    }

    if (!trayIconOptions.action){
      // todo: 不能实现点击左键打开窗口
      options.action = (event) => {
        if (e.type === 'Click' && e.button === 'Left' && event.buttonState === 'Down'){
          this.activeWindow()
        }
      }
    }

    return createTrayIcon(options)
  }

  /**
   * @param {Object} menuOptions - see {@link https://github.com/tauri-apps/tauri/blob/dev/packages/api/src/menu/menu.ts#L23} 
   * @returns Promise<Menu>
   */
  createMenu(menuOptions){
    return Menu.new(menuOptions)
  }
  /**
   * @param {MenuOptions} MenuOptions - see {@link https://github.com/tauri-apps/tauri/blob/dev/packages/api/src/menu/menu.ts#L23}
   * @returns {Promise<void>}
   */
  async setMenu(MenuOptions){
    if (this.tray){
      const menu = await Menu.new(items)
      return this.tray.setMenu(menu)
    }
  }
  /**
   * show window
   * @async
   * @returns {Promise<void | any>}
   */ 
  async show(){
    if (this.window) {
      return this.window.show();
    }
  }
  /**
   * hide window
   * @async
   * @returns {Promise<void | any>}
   */ 
  async hide(){
    if (this.window) {
      await this.window.hide();
    }
  }
  async toggle(){
    const isVisible = await this.getIsVisible()
    if (isVisible){
       return this.hide()
    }else {
       return this.activeWindow()
    }
  }
  /**
   * 监听窗口关闭事件
   * @param {Function} callback - 窗口关闭回调函数
   * @throws {Error} 传入的不是函数，抛出错误
   */
   onCloseWindow(callback){
    if (typeof callback !== 'function') throw  new Error('callback must be a function')
    if (this.window) {
      this.window.onCloseRequested(callback)
    }
  }
  onFocusChanged(callback){
    if(this.window){
      this.window.onFocusChanged(callback)
    }
  }
  /**
   * 窗口是否可见
   * @async
   * @returns {Promise<boolean | undefined>} - 窗口是否可见
   */ 
  async getIsVisible() {
    if (this.window) 
      return this.window.isVisible()
  }
  /**
   * 窗口是否最小化
   * @async
   * @returns {Promise<boolean | undefined>} - 窗口是否最小化
   */
  async getIsminized() {
    if (this.window) await this.window.isMinimized()
  }
  /**
   * 获取窗口是否获取焦点
   * @async
   * @returns {Promise<boolean | undefined>} - 窗口是否获取焦点
   */
  async setFocus(){
    if (this.window) return await this.window.setFocus()
  }

  /**
   * 激活窗口
   * @async
   * @returns {Promise<void>} - 无返回值
   */
  async activeWindow(){
    if (!(await this.getIsVisible())){
      await this.show()
    }
    if (await this.getIsminized())
      await this.window.unminimize()
    await this.setFocus()
    
  }
}

export default TranslateHelperTauriService

