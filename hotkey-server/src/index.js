import {GlobalKeyboardListener} from "node-global-key-listener";
import {WebSocketServer} from "ws"


const v = new GlobalKeyboardListener();
function checkKeyboard(key, value){
  key = key.toUpperCase()
  const valueArray = value.split(" ")

  if (valueArray.length){
    const testValue = valueArray.pop().toUpperCase()
    return key.toUpperCase() === testValue
  }
  return false
}

function handleKeyboard(hotkey, cb){
  const hotkeyDownNames = []
  let currentKeyInfo = {}

  return (...args) => {
    const e = args[0]
    // 阻止执行多次
    if (currentKeyInfo.scanCode === e.scanCode && currentKeyInfo.state === e.state){
      return
    
    }
    currentKeyInfo = {
      state: e.state,
      scanCode: e.scanCode,
    }
    
    if (e.state === 'DOWN'){
      hotkeyDownNames.push(e.name)
    }else {
      hotkeyDownNames.includes(e.name) && hotkeyDownNames.splice(hotkeyDownNames.indexOf(e.name), 1)
    }

  if (hotkeyDownNames.length === hotkey.length){
    for (let i = 0; i < hotkey.length; i++){
      const key = hotkey[i]
      // 有不匹配的就移除, 不执行后后面的结果代码
     
      const checkValue = checkKeyboard(key, hotkeyDownNames[i])
  
      if (!checkValue){
        return
      }
    }

    cb && cb(...args)
  }
  }
}


const appOperate = {
  type: 'open', // show | hide  选中文本翻译: transform， 打开open
  value: false
}

let windowState = 'show'

const wss = new WebSocketServer({
  port: 8080,
});
// 当有新的客户端连接时触发
wss.on('connection', (ws) => {
  console.log('New client connected');
  
  ws.on('message', (message) => {
  
    // 从用户端更改状态
    const msg = JSON.parse(message)
    if (msg.type === 'changeWindowState'){
      windowState = msg.value
    }

  });
  const openWindow = handleKeyboard(['ctrl', 'alt', 'f'], () => {
    if (windowState === 'hide'){
      windowState = 'show'
      appOperate.value = true
      ws.send(JSON.stringify(appOperate))
    }else {
      windowState = 'hide'
      appOperate.value = false
      ws.send(JSON.stringify(appOperate))
    }
  })
  
  v.addListener(openWindow);


  // todo: 翻译快捷键操作
  
  // 当客户端断开连接时触发
  ws.on('close', () => {
      console.log('Client disconnected');
      // v.removeListener(openWindow);
      // todo: 关闭任务和服务监听
  });
});


