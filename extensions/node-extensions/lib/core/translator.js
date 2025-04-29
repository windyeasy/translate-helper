const googleTranslate = require('@iamtraction/google-translate')
const { LRUCache } = require('lru-cache')


const cache = new LRUCache({
  max: 1000,
})

 class TranslateError extends Error {
  constructor(message, name) {
    if (message instanceof Error) {
      super(message.message)
      this.name = name || message.name
    }
    else {
      super(message)
      this.name = name || this.name
    }
  }
}

 async function translate(text, from, to) {
  if (!text) {
    return {
      original: text,
      translated: '',
      from,
      to,
    }
  }

  const key = `${from}:${to}:${text}`
  const cached = cache.get(key)
  if (cached)
    return cached

  try {
    const translated = await googleTranslate(text, {
      from,
      to,
    })

    const result = {
      original: text,
      translated: translated.text,
      from: translated?.from?.language?.didYouMean
        ? from
        : translated?.from?.language?.iso,
      to,
    }
    cache.set(key, result)
    return result
  }
  catch (err) {
    if (err instanceof Error) {
      switch (err.name) {
        case 'TooManyRequestsError':
          throw new TranslateError('please try again later', 'Too many requests')
        default:
          throw new TranslateError(err)
      }
    }

    throw err
  }
}

 async function translateAll(text, from = 'auto', languages) {
  if (!text)
    return []

  const result = (await Promise.all(languages.map(async to => translate(text, from, to)))).filter(i => i.translated)

  const fromLangs = new Set(result?.map(i => i.from))
  const singleSource = fromLangs.size === 1
  if (singleSource)
    return result.filter(i => i.from !== i.to && i.translated.trim().toLowerCase() !== i.original.trim().toLowerCase())
  return result
}


async function handleExtTranslate(neuExt){
  neuExt.onmessage(async (e) => {
    const {event, data} = JSON.parse(e.data)
    if (!data) return
    if (event === 'translateAllToExt'){
      try {
        const {text, from, languages} = data
     
        const result = await translateAll(text, from, languages)
        neuExt.dispatch('translateAllFromExt', {
            type: 'success',
            result
          })
      } catch (error) {
        console.error('translateAllToExt error:', error)

        neuExt.dispatch('translateAllFromExt', {
          type: 'error',
          error
        })
      }
    }

    // handle translate from ext
    if (event === 'translateToExt'){
       try {
    
        const {text, from, to} = data
        const result = await translate(text, from, to)
      
        neuExt.dispatch('translateFromExt', {
          type: 'success',
          result
        })
      } catch (error) {
        console.error('translateToExt error:', error)
        neuExt.dispatch('translateFromExt', 
          {
            type: 'error',
            error: String(error)
          }
        )
      }
    }
  })
}

module.exports = {
  handleExtTranslate,
  translateAll
}
