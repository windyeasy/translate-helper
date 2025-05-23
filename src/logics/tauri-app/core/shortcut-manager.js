import { register, unregister, isRegistered } from '@tauri-apps/plugin-global-shortcut';

class ShortcutManager {
  /**
   * 这个方法作了一成包装，当热更新或者刷新时会从新调用但是快捷键已经注册过来错误，导致逻辑不能走下去，
   * 所以已经注册快捷键先取消注册
   * @param {String} combination - 快捷键
   * @param {Function} callback - 回调函数
   * @returns {Promise<void>}
   */
  async register(combination, callback) {
    if (await this.isRegistered(combination)){
      await this.unregister(combination)
    }
   return register(combination, callback);
  }
  unregister(combination) {
    return unregister(combination);
  }
  isRegistered(combination) {
    return isRegistered(combination);
  }
}

export default ShortcutManager;
