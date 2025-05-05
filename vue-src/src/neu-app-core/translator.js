class TranslatorByNeuApp {
  constructor(neuPpp){
    this.neuApp = neuPpp;
    this.pendingRequests  = new Map()
  }
  init(){
    this.onTranslateAll()
    this.onTranslate()
  }
  handleOn(eventName){
    this.neuApp.neuEventOn(eventName, async (event) => {
      const { requestId } = event.detail
      const pendingTask = this.pendingRequests.get(requestId)
      if (pendingTask) {
        pendingTask(event.detail)
        this.pendingRequests.delete(requestId)
      }
    })
  }
  onTranslateAll(){
    this.handleOn("translateAllFromExt")
  }
  onTranslate(){
    this.handleOn("translateFromExt")
  }
  createPendingTask(resolve, reject){
    return(data) => {
      if (data.type === 'success') {
        resolve(data.result)                                  
      } else {
        reject(data.error)
      }
    }
  }
  generateUniqueId() {
    return Date.now().toString() + Math.random().toString(36).substring(2);
  }
  handlePendingTaskReturn(requestId){
    return new Promise((resolve, reject) => {
      const pendingTask = this.createPendingTask(resolve, reject)
      this.pendingRequests.set(requestId, pendingTask)
    })
  }
  translateAll(text, from = 'auto', languages) {
    const requestId = this.generateUniqueId()

    this.neuApp.disExtension('translateAllToExt', {
      text,
      from,
      languages,
      requestId
    })
  
    return this.handlePendingTaskReturn(requestId)
  }
  translate(text,from,to){
    const requestId = this.generateUniqueId()
  
    this.neuApp.disExtension('translateToExt', {
      text,
      from,
      to,
      requestId
    })
  
    return this.handlePendingTaskReturn(requestId)
  }
}
export default TranslatorByNeuApp;
