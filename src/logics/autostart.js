import { enable, isEnabled, disable } from '@tauri-apps/plugin-autostart';

export default function useAutostart(){
  const isStart = ref(false)
  onMounted(async() => {
    isStart.value = await isEnabled();
  })
  async function changeAutoStart(){
    if (isStart.value){
      await disable();
    }else {
      await enable();
    }
    isStart.value = !isStart.value;
  }

  return {
    isStart,
    changeAutoStart
  }
}
