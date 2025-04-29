const {GlobalKeyboardListener} = require("node-global-key-listener");
function globalKeyboard(neuExt){
  const v = new GlobalKeyboardListener();
  function handleKeyboard(e, down){
    const value = JSON.stringify({e, down})
    neuExt.dispatch('globalKeyboard', value)
  }

  neuExt.onopen(() => {
    v.addListener(handleKeyboard)
  })

  neuExt.onclose(() => {
    v.removeListener(handleKeyboard)
  })
}

module.exports = globalKeyboard

