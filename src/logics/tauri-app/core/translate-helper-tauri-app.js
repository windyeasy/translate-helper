import TranslateHelperTauriService from "./service";
import { readTextFile, BaseDirectory, exists, writeTextFile, mkdir } from '@tauri-apps/plugin-fs';
import Event from "./event";
/**
 * tauri app
 * @class
 */
class TranslateHelperTauriApp {
  /**
   * @property {TranslateHelperTauriService} service - tauri service
   *
   */
  constructor(config = {}) {
    this.service = new TranslateHelperTauriService();
    this.isSetting = false;
    this.event = new Event();
    this.init(config)
  }
  /**
   * init app
   * @async
   */
  async init(config = {}) {
    await this.service.init();
    this.setTray()
    this.changeWindowCloseDefaultBehavior();
    // global hotkey
    this.toggleHotkey = config.toggleHotkey || 'Alt+K';
    this.translateHotkey = config.translateHotkey || 'Alt+D';

    this.createAppConfigDir()
    const setting = this.loadSettingJson()
    if (setting.toggleHotkey){
      this.toggleHotkey = setting.toggleHotkey
    }
    if (setting.translateHotkey){
      this.translateHotkey = setting.translateHotkey
    }

    this.saveSettingJson({
      toggleHotkey: this.toggleHotkey,
      translateHotkey: this.translateHotkey
    })
    

    this.handlerShortcut()
  }
  /**
   * 设置快捷键打开 
   */
  handlerShortcut(){
    this.service.shortcutManger.register(this.toggleHotkey, async (e) => {
      if (e.state === 'Pressed' && !this.isSetting){
        this.service.toggle()
      }
    })
    this.service.shortcutManger.register(this.translateHotkey, async (e) => {
      if (e.state === 'Pressed' && !this.isSetting){
        await this.service.activeWindow()
        this.event.emit('translatedByHotkey')
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
  /**
   * 在在浏览器中打开
   * @param {string} url - 网址
   * @returns {Promise<void>}
   */
  openInBrowser(url) {
    return this.service.openUrl(url);
  }

  async loadSettingJson() {
    const isExist = await exists('setting.json', {
      baseDir: BaseDirectory.AppConfig
    })

    if (!isExist){
      await this.writeSettingJson({})
      return {}
    }
  
    const json = await readTextFile('setting.json', {
      baseDir: BaseDirectory.AppConfig
    })
 
    return JSON.parse(json)
  }
  async saveSettingJson(setting) {
    const defaultSetting = await this.loadSettingJson()
    const newSetting = Object.assign(defaultSetting, setting)
    return this.writeSettingJson(newSetting)
  }
  writeSettingJson(setting) {
   return writeTextFile('setting.json', JSON.stringify(setting), {
      baseDir: BaseDirectory.AppConfig
   })
  }
  existAppConfigDirOrFile(path=''){
    return exists(path, {
      baseDir: BaseDirectory.AppConfig
    })
  }
  async createAppConfigDir(){
    if (await this.existAppConfigDirOrFile())
      return
    return mkdir('', {
      baseDir: BaseDirectory.AppConfig
    })
  }
  async setToggleHotkey(combination){
    // unregister old hotkey
    if (combination === this.toggleHotkey)
      return
    await this.service.shortcutManger.unregister(this.toggleHotkey)
    await this.saveSettingJson({toggleHotkey: combination})
    this.toggleHotkey = combination
    this.handlerShortcut()
  }
  async setTranslateHotkey(combination){
    // unregister old hotkey
    if (combination === this.translateHotkey)
      return
    await this.service.shortcutManger.unregister(this.translateHotkey)
    await this.saveSettingJson({translateHotkey: combination})
    this.translateHotkey = combination
    this.handlerShortcut()
  }
  async  setGlobalHotkey(toggleHotkey, translateHotkey){
    if (this.toggleHotkey === translateHotkey && this.translateHotkey === translateHotkey) 
      return
    if (toggleHotkey !== this.toggleHotkey) {
      await this.service.shortcutManger.unregister(this.toggleHotkey)
      this.toggleHotkey = toggleHotkey
    }
    if (translateHotkey !== this.translateHotkey) {
      await this.service.shortcutManger.unregister(this.translateHotkey)
      this.translateHotkey = translateHotkey
    }
  
    this.handlerShortcut()
    await this.saveSettingJson({toggleHotkey, translateHotkey})
  }
}

export default TranslateHelperTauriApp;
