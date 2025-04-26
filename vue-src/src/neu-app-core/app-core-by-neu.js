import EasyEventBus from "./ease-event-bus";

class AppCoreByNeu extends EasyEventBus {
  /**
   * @param {Object} Neu Neutralino  
   */
  constructor(Neu) {
    super()
    this.native = Neu;
    this._extension = "js.neutralino.hotkeybynode"; // handle hotkey by the extension of node 
    this._middlewareTasks = [];
    this.windowState = "show"; // hide or show
    this.isTranslate = false
  }
  /**
   * @param {Object} config 
   * @param {Object} config.trayIcon 
   * @param {Array<string>} config.toggleHotkey  toggle hide or show  window.
   * @param {Array<string>} config.tranlateHotkey click the hotkey to automatically translate the text from the clipboard.
   * @param {Object} config.neuConfig 
   *   
   */
  init(config) {
    this._config = config;
  
    this.toggleHotkey = config.toggleHotkey || ["ctrl", "alt", "h"];
    this.tranlateHotkey = config.tranlateHotkey || ["ctrl", "alt", "f"];
    this.native.init(config.neuConfig || {});

    // init task
    // 1. set App tray
    this.setAppTray();
    // 2.The window close button dose not exit the app
    this.handleWindowClose();
    // 3. handle hotkey
    this.handleHotkey();
    // 4. 实现开机自启功能, 后面实现
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
    this.events("trayMenuItemClicked", (event) => {
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
    this.events("windowClose", () => {
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
    this.listenerGlobalKeyword(this.handleGlobalKeyboard(this.tranlateHotkey, () => {
      this.windowState === 'hide' && this.changeWindowState()
      // emit translate event
      this.emit("neuTranslate")
    }))
  }
  listenerGlobalKeyword(cb) {
    if (typeof cb !== "function") new TypeError("cb must be a function");

    this.events("globalKeyboard", (event) => {
      const { e, down } = JSON.parse(event.detail);
      cb(e, down);
    });
  }

  changeWindowState() {
    this.windowState = this.windowState === "show" ? "hide" : "show";
    console.log("")
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
   * Use the given middleware `fn`.
   *
   * @param {(context: Context) =>  Promise<any | void> | undefined} fn
   * @return {AppCoreByNeu} self
   * @api public
   */
  use(fn) {
    if (typeof fn !== "function")
      throw new TypeError("middleware must be a function");
    this._middlewareTasks.push(fn);

    return this;
  }

  /**
   * Execute the tasks of middleware
   *
   * @api public
   */
  execTasks(index = 0) {
    if (!this._middlewareTasks.length || !this._middlewareTasks[index]) return;

    const task = this._middlewareTasks[index];
    const nextTask = () => {
      this.execTasks(index + 1);
    };

    task(this, nextTask);
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
  events(eventName, callback) {
    this.native.events.on(eventName, callback);
  }

  async activeWindow() {
    // 确保窗口可见
    if (!(await this.native.window.isVisible())) {
      await this.native.window.show();
    }

    // 确保窗口不是最小化状态
    if (await this.native.window.isMinimized()) {
      await this.native.window.unminimize();
    }

    // 将窗口聚焦
    await this.native.window.focus();

    // 可选：将窗口置顶
    await this.native.window.setAlwaysOnTop(true);
    setTimeout(() => {
      this.native.window.setAlwaysOnTop(false);
    }, 300);
  }
}

export default AppCoreByNeu;
