const fs = require("fs");
const process = require("process");
const WS = require("websocket").w3cwebsocket;
const { v4: uuidv4 } = require("uuid");
const chalk = require("chalk");

// Obtain required params to start a WS connection from stdIn.
const processInput = JSON.parse(fs.readFileSync(process.stdin.fd, "utf-8"));
const NL_PORT = processInput.nlPort;
const NL_TOKEN = processInput.nlToken;
const NL_CTOKEN = processInput.nlConnectToken;
const NL_EXTID = processInput.nlExtensionId;



class NeuExt {
  constructor(port, extId, cToken, token) {
    this.extId = extId;
    this.cToken = cToken;
    this.token = token;
    this.port = port;
    console.log(WS)
    this.client = new WS(
      `ws://localhost:${port}?extensionId=${extId}&connectToken=${cToken}`
    );
  }

  log(message, type = "INFO") {
    const logLine = `[${this.extId}]: ${chalk[
      type === "INFO" ? "green" : "red"
    ](type)} ${message}`;
    console[type === "INFO" ? "log" : "error"](logLine);
  }

  onopen(cb) {
    if (cb && typeof cb !== "function") {
      throw new TypeError("cb must be a function");
    }

    this.client.onopen = (...args) => {
      this.log("Connected");
      cb && cb(...args);
    };
  }
  onmessage(cb) {
    if (cb && typeof cb !== "function") {
      throw new TypeError("cb must be a function");
    }
    this.client.onmessage = (...args) => {
      cb && cb(...args);
    };
  }
  onerror(cb) {
    if (cb && typeof cb !== "function") {
      throw new TypeError("cb must be a function");
    }
    this.client.onerror = (...args) => {
      this.log("Connection error!", "ERROR");
      cb && cb(...args);
    };
  }

  onclose(cb) {
    if (cb && typeof cb !== "function") {
      throw new TypeError("cb must be a function");
    }
    this.client.onclose = (...args) => {
      this.log("Disconnected");

      cb && cb(...args);
      process.exit();
    };
  }

  dispatch(event, data) {
    this.client.send(
      JSON.stringify({
        id: uuidv4(),
        method: "app.broadcast",
        accessToken: this.token,
        data: { event, data },
      })
    );
  }
}

module.exports =  new NeuExt(NL_PORT, NL_EXTID, NL_CTOKEN, NL_TOKEN);

