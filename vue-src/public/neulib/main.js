

/*
  Function to set up a system tray menu with options specific to the window mode.
  This function checks if the application is running in window mode, and if so,
  it defines the tray menu items and sets up the tray accordingly.
*/
function setTray() {
  // Tray menu is only available in window mode
  if(NL_MODE != "window") {
      console.log("INFO: Tray menu is only available in the window mode.");
      return;
  }

  // Define tray menu items
  let tray = {
      icon: "/resources/icons/trayIcon.png",
      menuItems: [
        {id: "QUIT", text: "退出"},
        {text: "-"},
      ]
  };

  // Set the tray menu
  Neutralino.os.setTray(tray);
}

/*
  Function to handle click events on the tray menu items.
  This function performs different actions based on the clicked item's ID,
  such as displaying version information or exiting the application.
*/
function onTrayMenuItemClicked(event) {
  switch(event.detail.id) {
      case "QUIT":
          // Exit the application
          Neutralino.app.exit();
          break;
  }
}

/*
  Function to handle the window close event by gracefully exiting the Neutralino application.
*/
function onWindowClose() {
  // Neutralino.app.exit();
  Neutralino.window.hide()
  // hide window 更改键盘监听事件的状态
  ws && changeWindowState(false)
}

// Initialize Neutralino
Neutralino.init();

// Register event listeners
Neutralino.events.on("trayMenuItemClicked", onTrayMenuItemClicked);
Neutralino.events.on("windowClose", onWindowClose);

// Conditional initialization: Set up system tray if not running on macOS
if(NL_OS != "Darwin") { // TODO: Fix https://github.com/neutralinojs/neutralinojs/issues/615
  setTray();
}


/**
 * 通过node监听键盘事件，通websocket发送消息，执行打开关闭窗口
 * 通过websocket
 *  
 */
let ws = null

function sendMessage(info) {
  const message = JSON.stringify(info)

  console.log(ws)
  ws && ws.send(message)
}

function changeWindowState(value) {
  sendMessage({
    type: 'changeWindowState',
    value
  })
}

window.addEventListener('DOMContentLoaded', () => {
  const LINK = 'ws://localhost:8080'
  ws = new WebSocket(LINK)
  
  ws.addEventListener("open", () => {
    changeWindowState(true)
  })

 
  ws.onmessage = e => {
    const data = JSON.parse(e.data)
    if (data.type === 'open'){
      if (data.value){
        activateWindow()
      }else {
        Neutralino.window.hide()
      }
      
    }
  }
});

async function activateWindow() {
  // 确保窗口可见
  if(!await Neutralino.window.isVisible()) {
    await Neutralino.window.show();
  }
  
  // 确保窗口不是最小化状态
  if(await Neutralino.window.isMinimized()) {
    await Neutralino.window.unminimize();
  }
  
  // 将窗口聚焦
  await Neutralino.window.focus();
  
  // 可选：将窗口置顶
  await Neutralino.window.setAlwaysOnTop(true);
  setTimeout(() => {
    Neutralino.window.setAlwaysOnTop(false);
  }, 300);
}
