class ShortcutManager {
  constructor(neuApp) {
    this.neuApp = neuApp;
    this.shortcuts = new Map();
    this.blockedKeys = new Set();
  }
  init() {
    const run = this.handleGlobalKeyboard(e => this.handleKeyDown(e))
    this.neuApp.neuEventOn("globalKeyboard", (event) => {
      const { e, down } = JSON.parse(event.detail);
      run(e, down)
    });
  }

  register(combination, callback) {
    const normalized = this.normalizeCombination(combination);
    this.shortcuts.set(normalized, {
      callback,
      original: combination,
    });
  }
  unregister(combination) {
    const normalized = this.normalizeCombination(combination);
    this.shortcuts.delete(normalized);
  }

  blockedDefaultBehavior(...keys) {
    keys.forEach((key) => this.blockedKeys.add(key));
  }

  normalizeCombination(combination) {
    return combination
      .toLowerCase()
      .split("+")
      .map((key) => key.trim())
      .join("+");
  }
    /**
   * Handle global keyboard
   * @param {Function} callback
   * @return {Function}
   */
  handleGlobalKeyboard(callback) {
    let currentKeyInfo = {};
    const downMap = { ctrl: false, alt: false, shift: false, meta: false, super: false, cmd: false};
    const originalMapKeys = Object.keys(downMap);
    /**
     * Map keybard
     * @param {any} e
     * @return {Object} keydown info
     */
    function _keyboardHandler(e) {
      function _downMapHandler(e, value) {
        const name = e.name.toUpperCase();
        for (const key of Object.keys(downMap)) {
          if (originalMapKeys.includes(key) && name.includes(key.toUpperCase())) {
            downMap[key] = value;
          }
        }
      }

  
      if (e.state === "DOWN") {
        _downMapHandler(e, true);
      } else {
        _downMapHandler(e, false);
      }
      downMap.state = e.state;
      if (e.state  === "DOWN"){
        const keyName = e.name.toUpperCase()
        const values =keyName.split(" ")
        const directionKeys = ["LEFT", "RIGHT", "UP", "DOWN"];
     
        if (directionKeys.includes( values[0]))
          downMap.key = values.pop();
        else
          downMap.key = keyName
      }
   
   
      return downMap;
    }
   
    return (...args) => {

      const e = args[0];
      // 阻止执行多次
      if (
        currentKeyInfo.scanCode === e.scanCode &&
        currentKeyInfo.state === e.state
      ) {
        return
      }
 
      currentKeyInfo = { state: e.state, scanCode: e.scanCode };

      callback(_keyboardHandler(e));
    };
  }
  handleKeyDown(e) {
    const keys = [];
    if (e.state !== 'DOWN') return

    if (e.ctrl) keys.push("ctrl");
    if (e.alt) keys.push("alt");
    if (e.shift) keys.push("shift");
    if (e.meta) keys.push("meta");

    const key = e.key.toLowerCase();
    if (!["alt", "ctrl", "meta", "shift"].includes(key)) {
      keys.push(key);
    }

    const combination = keys.join("+");
    if (this.shortcuts.has(combination)) {
      this.shortcuts.get(combination).callback(e);
    }
  }

  getRegistedShortcuts() {
    return Array.from(this.shortcuts.values()).map((shortcut) => ({
      ...shortcut,
    }));
  }
}

export default ShortcutManager;
