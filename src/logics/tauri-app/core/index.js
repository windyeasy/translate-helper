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
  async init() {
    await this.service.init();
    this.setTray()
    this.changeWindowCloseDefaultBehavior();
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
