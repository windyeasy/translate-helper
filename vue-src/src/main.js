import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'

import { createNeuApp } from './neu-app-core/index.js'

import "normalize.css"

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(createNeuApp())

app.mount('#app')
