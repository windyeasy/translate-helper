export function writeText(text){
  return navigator.clipboard.writeText(text)
}

export function readText(){
  return navigator.clipboard.readText()
}
