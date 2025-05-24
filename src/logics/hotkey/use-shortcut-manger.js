import { shortcutManager } from "./shortcut-manager";
export default function useShortcutManger(){
  onMounted(()=>{
    shortcutManager.start()
  })
  onUnmounted(()=>{
    shortcutManager.stop()
  })
  return shortcutManager
}
