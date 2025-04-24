class AppCoreByNeu {

  _middlewareTasks = []
  constructor(Neu){
    this.native = Neu
  }
  /**
   * 
   * @param {Object} config 
   * todo:  config description
   */
  init(){
    this.native.init()
    this.execTasks()
  }

  /**
   * Use the given middleware `fn`.
   * 
   * @param {(context: Context) =>  Promise<any | void> | undefined} fn 
   * @return {AppCoreByNeu} self
   * @api public 
   */
  use(fn){
    if (typeof fn !== 'function') throw new TypeError('middleware must be a function')
    this._middlewareTasks.push(fn)

    return this
  }
  
  /**
   * Exec middleware tasks
   * 
   * @api public
   */
  execTasks(index = 0){
    if (!this._middlewareTasks.length || !this._middlewareTasks[index]) return

    const task = this._middlewareTasks[index]
    const nextTask = () => {
      this.execTasks(index + 1)
    }

    task(this, nextTask)
  }
  /**
   * exit app
   */
  exit(){
    this.native.app.exit()
  }
  /**
   * 
   * @param {Object} tray 
   * @returns
   */
  setTray(tray){
    // Conditional initialization: Set up system tray if not running on macOS
    if(NL_OS != "Darwin") { // TODO: Fix https://github.com/Neujs/Neujs/issues/615
      this.native.os.setTray(tray)
    }
  }
  /**
   * show the window of the app
   */
  show(){
    this.native.window.show()
  }
  /**
   * hide the window of the app
   */
  hide(){
    this.native.window.hide()
  }

  /**
   * Listen to events from Neu
   * 
   * @param {String} eventName 
   * @param {Function} callback 
   */
  events(eventName, callback){
    this.native.events.on(eventName, callback)
  }

  async activeWindow(){
    await this.native.window.activate()
  }
}

export default AppCoreByNeu
