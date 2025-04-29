const globalKeyboard = require("./core/global-keyboard.js")
const {handleExtTranslate} = require("./core/translator.js")

const neuExt = require("./logics/neu-extension.js")

globalKeyboard(neuExt);
handleExtTranslate(neuExt)
