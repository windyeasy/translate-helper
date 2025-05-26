import { fetch } from '@tauri-apps/plugin-http';
export function request(url, options = {method: 'GET'}){
  const {  type = 'json', ...option} = options
  return new Promise((reslove, reject)=>{
     return fetch(url, option).then((res) => {
      if (type === 'json'){
        reslove(res.json())
      }else {
        reslove(res.text())
      }
      }).catch(reject)
  })
}
