import EasyEventBus from "./ease-event-bus";

import TranslatorByNeuApp from "./translator";
import ShortcutManager from "./shortcut-manager";

class AppCoreByNeu extends EasyEventBus {
  /**
   * @param {Object} Neu Neutralino  
   */
  constructor(Neu) {
    super()
    this.native = Neu;
 
    this._extension = "js.neutralino.nodeext"; // handle hotkey by the extension of node 
    this.windowState = "show"; // hide or show
    this.isSetting = false
    this.translator = new TranslatorByNeuApp(this)
    this.shortcutManager = new ShortcutManager(this)
  }
  /**
   * @param {Object} config 
   * @param {Object} config.trayIcon 
   * @param {Array<string>} config.toggleHotkey  toggle hide or show  window.
   * @param {Array<string>} config.translateHotkey click the hotkey to automatically translate the text from the clipboard.
   *   
   */
  async init(config) {
    this._config = config;
    this.globalHotkeys = {}
    this.globalHotkeys.toggleHotkey = config.toggleHotkey || ["Alt", "K"];
    this.globalHotkeys.translateHotkey = config.translateHotkey || ["Alt", "D"];
    this.native.init();
    this.translator.init()
    this.shortcutManager.init()
    this.settingPath = `${NL_PATH}/setting.json`
  
    // init task
    // 1. set App tray
    this.setAppTray();
    // 2.The window close button dose not exit the app
    this.handleWindowClose();

    // 3. handle hotkey
    const setting = await this.loadSettingJson();
 
    if (!setting.globalHotkeys){
      setting.globalHotkeys = this.globalHotkeys
    }else {
      this.globalHotkeys = setting.globalHotkeys
    }

    // save default setting
    this.saveSettingJson(setting)
    // todo: 执行下一个处理的时候，这个处理没有移除监听，和发出事件
    this._cancelHandleHotkey = this.handleHotkey()

    this._globalHotkeys = this.globalHotkeys
    Object.defineProperty(this, 'globalHotkeys', {
      get(){
        return this._globalHotkeys
      },
      set(value){
        this._globalHotkeys = value
        this._cancelHandleHotkey && this._cancelHandleHotkey()
        this._cancelHandleHotkey = this.handleHotkey()
      }
    })
  }
  /**
   * todo: Internationalization
   */
  setAppTray() {
    const tray = {
      icon: this._config.trayIcon || "/resources/icons/appIcon.png",
      menuItems: [
        { id: "SHOW", text: "Open" },
        { text: "-" },
        { id: "QUIT", text: "Quit" },
      ],
    };

    this.setTray(tray);
    this.neuEventOn("trayMenuItemClicked", (event) => {
      switch (event.detail.id) {
        case "QUIT":
          this.exit();
          break;
        case "SHOW":
          this.activeWindow();
          break;
      }
    });
  }

  /**
   * Listen for close window button click
   */
  handleWindowClose() {
    this.neuEventOn("windowClose", () => {
      this.hide();
    });
  }

  
  /**
   * Neutralino doesn't support globalKeyboard, so we use extension to implement it.
   */
   handleHotkey() {
    // 1. toggle by hotkey
    const toggleHotkey = this.globalHotkeys.toggleHotkey.join("+");
    this.shortcutManager.register(toggleHotkey, () => {
      console.log("进入了")
      if (this.isSetting) return
      this.changeWindowState();
    });
  

    // 2. translate by hotkey
    const translateHotkey = this.globalHotkeys.translateHotkey.join("+");
    this.shortcutManager.register(translateHotkey, async() => {
      if (this.isSetting) return
      this.activeWindow()
      // emit translate event
      const value = await this.clipboardReadText()
      this.emit("neuTranslateByHotkey", value)
    });
    
    return () => {
      this.shortcutManager.unregister(toggleHotkey)
      this.shortcutManager.unregister(translateHotkey)
    }
  }
  listenerGlobalKeyword(cb) {
    if (typeof cb !== "function") new TypeError("cb must be a function");

    return this.neuEventOn("globalKeyboard", (event) => {
      const { e, down } = JSON.parse(event.detail);
      cb(e, down);
    });
  }

  changeWindowState() {
    if (this.windowState === "hide") {
      this.activeWindow();
    } else {
      this.hide();
    }
  }

  // Dispatch event to extension
  async disExtension(eventName, data) {
    return await this.native.extensions.dispatch(
      this._extension,
      eventName,
      data
    );
  }
  /**
   * exit app
   */
  exit() {
    this.native.app.exit();
  }
  setTray(tray) {
    // Conditional initialization: Set up system tray if not running on macOS
    if (NL_OS != "Darwin") {
      // TODO: Fix https://github.com/neutralinojs/neutralinojs/issues/615
      this.native.os.setTray(tray);
    }
  }
  /**
   * show the window of the app
   */
   show() {
    this.windowState = "show";
    return this.native.window.show();
  }
  /**
   * hide the window of the app
   */
  hide() {
    this.windowState = "hide";
    this.native.window.hide();
  }
  /**
   * Listen to events from Neutralino
   *
   * @param {String} eventName
   * @param {Function} callback
   */
  neuEventOn(eventName, callback) {
    const cancel = () => {
      this.native.events.off(eventName, callback);
    };
    this.native.events.on(eventName, callback);
    return cancel
  }


  async activeWindow() {
    if (!(await this.native.window.isVisible())) {
      await this.show()
    }

  
    if (await this.native.window.isMinimized()) {
      await this.native.window.unminimize();
    }

  
    await this.native.window.focus();

    await this.native.window.setAlwaysOnTop(true);
    setTimeout(() => {
      this.native.window.setAlwaysOnTop(false);
    }, 300);
  }
  /* 
   * handle setting
   */ 
  async loadSettingJson(){
    try {
      const json = await this.native.filesystem.readFile(this.settingPath)
      return JSON.parse(json)
    }catch (error){
      console.error(error)
      await this.native.filesystem.writeFile(this.settingPath, "{}")
    }
    return  {}
  }
  async saveSettingJson(setting){
    const defaultSetting = await this.loadSettingJson()
    const newSetting = Object.assign(defaultSetting, setting)
    await this.native.filesystem.writeFile(this.settingPath, JSON.stringify(newSetting))
  }

  /**
   *  clipboard
   */ 
  async clipboardReadText() {
    return await this.native.clipboard.readText()
  }
  async clipboardWriteText(text) {
    return await this.native.clipboard.writeText(text)
  }

  /**
   * translate
   */
  translateAll(text, from = 'auto', languages) {
    return this.translator.translateAll(text, from, languages);
  }
  translate(text, from = 'auto', to) {
    return this.translator.translate(text, from, to);
  }
  // open url by default browser
  async openInBrowser(url) {
    await this.native.os.open(url)
  }
}

export default AppCoreByNeu;
