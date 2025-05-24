import { emit, listen, emitTo, once } from '@tauri-apps/api/event';
class Event {
  emit(evenName, callback){
    return emit(evenName, callback)
  }
  listen(evenName, callback){
    return listen(evenName, callback)
  }
  once(evenName, callback){
    return once(evenName, callback)
  }
  emitTo(evenName, callback){
    return emitTo(evenName, callback)
  }
}
export default Event
