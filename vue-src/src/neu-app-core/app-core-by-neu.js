import EasyEventBus from "./ease-event-bus";

import TranslatorByNeuApp from "./translator";

class AppCoreByNeu extends EasyEventBus {
  /**
   * @param {Object} Neu Neutralino  
   */
  constructor(Neu) {
    super()
    this.native = Neu;
    this.translator = new TranslatorByNeuApp(this)
    this._extension = "js.neutralino.nodeext"; // handle hotkey by the extension of node 
    this.windowState = "show"; // hide or show
  }
  /**
   * @param {Object} config 
   * @param {Object} config.trayIcon 
   * @param {Array<string>} config.toggleHotkey  toggle hide or show  window.
   * @param {Array<string>} config.tranlateHotkey click the hotkey to automatically translate the text from the clipboard.
   *   
   */
  async init(config) {
    this._config = config;
   
    this.toggleHotkey = config.toggleHotkey || ["alt", "k"];
    this.tranlateHotkey = config.tranlateHotkey || ["alt", "d"];
    this.native.init();
    this.translator.init()
    this.settingPath = `${NL_PATH}/setting.json`
    // save default setting
    this.saveSettingJson({
      toggleHotkey: this.toggleHotkey,
      tranlateHotkey: this.tranlateHotkey,
    })
    // init task
    // 1. set App tray
    this.setAppTray();
    // 2.The window close button dose not exit the app
    this.handleWindowClose();
    // 3. handle hotkey
    this.handleHotkey();
    // 4. 实现开机自启功能, 后面实现
    this.loadSettingJson();

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
  checkKeyboard(key, value){
    key = key.toUpperCase()
    const valueArray = value.split(" ")
    if (valueArray.length){
      return key.toUpperCase() === valueArray.pop().toUpperCase()
    }
    return false
  }
  /**
   * Handle global keyboard 
   * @param {Array<String>} hotkey
   * @param {Function} cb
   * @return {Function}
   */
  handleGlobalKeyboard(hotkey, cb) {
    const hotkeyDownNames = [];
    let currentKeyInfo = {};

    return (...args) => {
      const e = args[0];
      // 阻止执行多次
      if (
        currentKeyInfo.scanCode === e.scanCode &&
        currentKeyInfo.state === e.state
      ) {
        return;
      }

      currentKeyInfo = {
        state: e.state,
        scanCode: e.scanCode,
      };

      if (e.state === "DOWN") {
        hotkeyDownNames.push(e.name);
      } else {
        hotkeyDownNames.includes(e.name) &&
          hotkeyDownNames.splice(hotkeyDownNames.indexOf(e.name), 1);
      }

      if (hotkeyDownNames.length === hotkey.length) {
        for (let i = 0; i < hotkey.length; i++) {
          const key = hotkey[i];
          // 有不匹配的就移除, 不执行后后面的结果代码
          const checkValue = this.checkKeyboard(key, hotkeyDownNames[i]);
          if (!checkValue) {
            return;
          }
        }

        cb && cb(...args);
      }
    };
  }
  /**
   * Neutralino doesn't support globalKeyboard, so we use extension to implement it.
   */
  async handleHotkey() {
    // 1. toggle by hotkey
    this.listenerGlobalKeyword(
      this.handleGlobalKeyboard(this.toggleHotkey, () => {
        this.changeWindowState();
      })
    );

    // 2. translate by hotkey
    this.listenerGlobalKeyword(this.handleGlobalKeyboard(this.tranlateHotkey, async() => {
      console.log("translate test")
      if (this.windowState === 'hide')
        this.windowState = 'show' 
      this.activeWindow()
      // emit translate event
      const value = await this.clipboardReadText()
      this.emit("neuTranslateByHotkey", value)
    }))
  }
  listenerGlobalKeyword(cb) {
    if (typeof cb !== "function") new TypeError("cb must be a function");

    this.neuEventOn("globalKeyboard", (event) => {
      const { e, down } = JSON.parse(event.detail);
      cb(e, down);
    });
  }

  changeWindowState() {
    this.windowState = this.windowState === "show" ? "hide" : "show";
    if (this.windowState === "show") {
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
    this.native.window.show();
  }
  /**
   * hide the window of the app
   */
  hide() {
    this.native.window.hide();
  }
  /**
   * Listen to events from Neutralino
   *
   * @param {String} eventName
   * @param {Function} callback
   */
  neuEventOn(eventName, callback) {
    this.native.events.on(eventName, callback);
  }


  async activeWindow() {
    if (!(await this.native.window.isVisible())) {
      await this.native.window.show();
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
