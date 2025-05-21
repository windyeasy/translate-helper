
import debounce from '@/logics/debounce';

export function useKeydown(callback) {
  function handleKeyDown(e) {
    callback(e);
  }
  const handleKeyDownDouble = debounce(handleKeyDown, 200)
  
  onMounted(() => {
    document.addEventListener('keydown', handleKeyDownDouble)
  })
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDownDouble)
  })
}
