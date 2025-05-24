export class ShortcutManager {
  constructor() {
    this.shortcuts = new Map();
    this.blockedKeys = new Set();
    this.captureFns = [];
    this.platform = this.getPlatform();
  }

  getPlatform() {
    if (navigator.userAgentData && navigator.userAgentData.platform) {
      return /mac/i.test(navigator.userAgentData.platform) ? "mac" : "win";
    }

    // Fallback for older browsers
    if (navigator.userAgent) {
      return /mac/i.test(navigator.userAgent) ? "mac" : "win";
    }

    return "win"; // default fallback
  }
  register(combination, callback) {
    const normalized = this.normalizeCombination(combination);
    if (this.shortcuts.has(normalized)) {
      throw new Error(`Shortcut ${combination} is already registered`);
    }
    this.shortcuts.set(normalized, {
      callback,
      original: combination,
    });
  }

  isRegistered(combination) {
    const normalized = this.normalizeCombination(combination);
    return this.shortcuts.has(normalized);
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
  keydownToCombination(e) {
    const isMac = this.platform === 'mac';
    const keys = [];

    if ((isMac && e.metaKey) || (!isMac && e.ctrlKey)) keys.push("Primary");
    if (e.altKey) keys.push("Alt");
    if (e.shiftKey) keys.push("Shift");

    const key = e.key.toLowerCase();
    if (!["alt", "control", "meta", "shift"].includes(key)) {
      keys.push(key.toUpperCase());
    }

    return keys.join("+");
  }
  handleHotkeyDown(e) {
    const combination = this.keydownToCombination(e);
    const hotkey = this.normalizeCombination(combination);
    if (this.shortcuts.has(hotkey)) {
      this.shortcuts.get(hotkey).callback(e);
    }
  }
  handleCaptureHotkey(e) {
    const combination = this.keydownToCombination(e);

    this.captureFns.forEach((fn) => fn(combination, e));
  }
  /**
   * 捕获快捷键输入
   * @param {Function} callback - 回调函数
   */
  captureHotkey(callback) {
    this.captureFns.push(callback);
  }
  /**
   * 通过回调函数停止捕获的快捷键盘
   * @param {Function} callback - 回调函数
   */
  stopCaptureHotkey(callback) {
    this.captureFns = this.captureFns.filter((fn) => fn !== callback);
  }
  /**
   * 停止捕获所有快捷键
   */
  stopCaptureHotkeyAll() {
    this.captureFns = [];
  }
  /**
   * 开启使用监听键盘按下，为了节省开销将捕获和注册使用同一个监听
   */
  start() {
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  }
  stop() {
    document.removeEventListener("keydown", this.handleKeyDown.bind(this));
  }
  handleKeyDown(e) {
    this.handleHotkeyDown(e);
    this.handleCaptureHotkey(e);
  }
  getRegistedShortcuts() {
    return Array.from(this.shortcuts.values()).map((shortcut) => ({
      ...shortcut,
    }));
  }
}

export const shortcutManager = new ShortcutManager();
