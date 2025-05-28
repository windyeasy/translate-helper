/**
 * TrayIcon 增强
 * @module  TrayIconEnhanced
 * @description 解决每次刷新或者热模块替换时，会多出系统托盘
 */ 
import { invoke } from '@tauri-apps/api/core';
import { TrayIcon } from '@tauri-apps/api/tray';

/**
 * 缓存标识
 */ 
export const CACHE_TRAY = "CACHE_TRAY";

/**
 * 添加rid的缓存
 * @param {string} id - tray的rid  
 */
export function addTrayRid(id) {
  const cacheTray = getCacheTrayIds();
  if (!cacheTray.includes(id)) {
    cacheTray.push(id);
    localStorage.setItem(CACHE_TRAY, JSON.stringify(cacheTray));
  }
}

/**
 * 缓存的tray的rids
 * @returns {Array<string>}  缓存的tray的rids
 */
export function getCacheTrayIds() {
  const cacheTray = localStorage.getItem(CACHE_TRAY);
  if (cacheTray) {
    return JSON.parse(cacheTray);
  }
  return [];
}

/**
 * 删除缓存的tray的rid，当关闭后，或者rid不存在的时候调用
 * @param {string} id - 缓存的tray的rid
 */
export function removeTrayRid(id) {
  const cacheTray = getCacheTrayIds();
  const index = cacheTray.indexOf(id);
  if (index > -1) {
    cacheTray.splice(index, 1);
    localStorage.setItem(CACHE_TRAY, JSON.stringify(cacheTray));
  }
}

/**
 * 通过rid关闭tray
 * tauri已经提供关闭的接口，这里只是调用，看源代码时候看见的 
 * see {@link https://github.com/tauri-apps/tauri/blob/dev/packages/api/src/core.ts#L321}
 * @param {string} rid
 * @returns {Promise<void>} 调用接口
 */
export function   closeTrayByRid(rid){
  return invoke('plugin:resources|close', {
    rid: rid
  })
}

/**
 * 在创建新tray的之前，关闭缓存rids
 * @returns {Promise<void>}
 */
export async function destrayCacheTrayRids() {
  const cacheTray = getCacheTrayIds();
  for (let id of cacheTray) {
    // 尝试关闭, 忽略错误，有可能缓存的是上一次打开应用存储的tray
    try {
      await closeTrayByRid(id);
    } catch (error) {
      console.log('Close Tray Error:', error);
    }
    removeTrayRid(id);
  }
}

/**
 * 创建TrayIcon，在创建新Tray之前，会先关闭以前创建的
 * @param {Object} trayIconOptions - 配置项，详细配置 see {@link  https://github.com/tauri-apps/tauri/blob/dev/packages/api/src/tray.ts#L74C18-L74C34}
 * @returns {Promise<TrayIcon>} see {@link https://github.com/tauri-apps/tauri/blob/dev/packages/api/src/tray.ts#L158}
 */
export async function createTrayIcon(trayIconOptions) {
  await destrayCacheTrayRids();
  const tray = await TrayIcon.new(trayIconOptions);
  addTrayRid(tray.rid);

  // 通过重写close方法，在关闭的时候，会删除缓存的tray的rid, 猴补丁实现（monkey patch）
  const close = function () {
    removeTrayRid(tray.rid)
    return tray.close();
  }
  tray.close = close
  if (document) {
    document.addEventListener('beforeunload',() => {
      tray.close()
    })
  }
  return tray;
}
