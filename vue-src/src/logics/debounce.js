export default function debounce(fn, delay, immediate = false, resultCallback) {
  // 1.用于记录上一次事件触发的timer
  let timer = null
  let isInvoke = false
  const _debounce = function(...args) {
    return new Promise((resolve, reject) => {
      try {
        // 2.1.如果有再次触发(更多次触发)事件, 那么取消上一次的事件
        if (timer) clearTimeout(timer)

        let res = undefined
        if (immediate && !isInvoke) {
          res = fn.apply(this, args)
          if (resultCallback) resultCallback(res)
          resolve(res)
          isInvoke = true
          return
        }


        timer = setTimeout(() => {
          res = fn.apply(this, args)
          if (resultCallback) resultCallback(res)
          resolve(res)
          timer = null 
          isInvoke = false
        }, delay);
      } catch (error) {
        reject(error)
      }
    })
  }

 
  _debounce.cancel = function() {
    if (timer) clearTimeout(timer)
    timer = null
    isInvoke = false
  }

  return _debounce
}

