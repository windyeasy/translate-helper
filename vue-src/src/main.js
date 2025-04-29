import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'

import { createNeuApp } from './neu-app-core/index.js'
import directives from './directives'

import "normalize.css"
import 'virtual:uno.css'
import "vue-select/dist/vue-select.css";
import "./styles/main.css"

const app = createApp(App)
app.use(createPinia())
app.use(router)

app.use(createNeuApp())
app.use(directives)

app.mount('#app')

