import TranslateHelperTauriService from "./service";
/**
 * tauri app
 * @class
 */
class TranslateHelperTauriApp {
  /**
   * @property {TranslateHelperTauriService} service - tauri service
   *
   */
  constructor() {
    this.service = new TranslateHelperTauriService();
  }
  /**
   * init app
   * @async
   */
  async init(config = {}) {
    await this.service.init();
    this.setTray()
    this.changeWindowCloseDefaultBehavior();
    this.openHotkey = config.openHotkey || 'Alt+K';
   this.handlerShortcut()
  }
  /**
   * 设置快捷键打开 
   */
  handlerShortcut(){
    this.service.shortcutManger.register(this.openHotkey, async (e) => {
      if (e.state === 'Pressed'){
          this.service.toggle()
      }
    })
  }
  /**
   * 设置系统托盘
   */
  setTray() {
    this.service.setTray({
      menuOptions: {
        items: [
          {
            id: "SHOW",
            text: "Open",
            action: () => {
              this.service.activeWindow();
            },
          },
          {
            id: "QUIT",
            text: "Quit",
            action: () => {
              this.service.exit();
            },
          },
        ],
      },
    });
  }
  /**
   * 改变默认关闭行为
   * @returns {Function} unlisten
   */
  changeWindowCloseDefaultBehavior() {
    return this.service.onCloseWindow((e) => {
      e.preventDefault();
      this.service.hide();
    });
  }
}
export default TranslateHelperTauriApp;
