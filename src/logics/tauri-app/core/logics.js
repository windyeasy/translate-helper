export const CACHE_TRAY = 'CACHE_TRAY'
export function addTrayRid(id){
  const cacheTray = getCacheTrayIds()
  if (!cacheTray.includes(id)){
    cacheTray.push(id)
    localStorage.setItem(CACHE_TRAY, JSON.stringify(cacheTray))
  }
}

export function getCacheTrayIds(){
  const cacheTray =  localStorage.getItem(CACHE_TRAY)
  if (cacheTray){
    return JSON.parse(cacheTray)
  }
  return []
}

export function removeTrayRid(id){
  const cacheTray = getCacheTrayIds()
  const index = cacheTray.indexOf(id)
  if (index > -1){
    cacheTray.splice(index, 1)
    localStorage.setItem(CACHE_TRAY, JSON.stringify(cacheTray))
  }
}

