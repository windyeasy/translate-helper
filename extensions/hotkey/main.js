const fs = require('fs');
const process = require('process');
const WS = require('websocket').w3cwebsocket;
const { v4: uuidv4 } = require('uuid');
const chalk = require('chalk');
const { GlobalKeyboardListener} = require('node-global-key-listener');

// Obtain required params to start a WS connection from stdIn.
const processInput = JSON.parse(fs.readFileSync(process.stdin.fd, 'utf-8'));
const NL_PORT = processInput.nlPort;
const NL_TOKEN = processInput.nlToken;
const NL_CTOKEN = processInput.nlConnectToken;
const NL_EXTID = processInput.nlExtensionId;


function log(message, type = "INFO") {
  const logLine = `[${NL_EXTID}]: ${chalk[
    type === "INFO" ? "green" : "red"
  ](type)} ${message}`;
  console[type === "INFO" ? "log" : "error"](logLine);
}


const client = new WS(
  `ws://localhost:${NL_PORT}?extensionId=${NL_EXTID}&connectToken=${NL_CTOKEN}`
);

const v = new GlobalKeyboardListener();

function sendGlobalKeyboardInfo(value){
   client.send(
        JSON.stringify({
          id: uuidv4(),
          method: "app.broadcast",
          accessToken: NL_TOKEN,
          data: { event: "globalKeyboard", data: value },
        })
      );
}

function handleKeyboard(e, down){
  const value = JSON.stringify({e, down})
  sendGlobalKeyboardInfo(value)
}

client.onerror = () => log("Connection error!", "ERROR");

client.onopen = () => {
  log("Connected")
  v.addListener(handleKeyboard)
};

client.onclose = () => {
  v.removeListener(handleKeyboard)
  process.exit()
};


