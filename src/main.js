import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import plugins from './plugins'
import directives from './directives'
import { createTauriApp } from './logics/tauri-app'
import "./logics/translator/index"

import "normalize.css"
import 'virtual:uno.css'
import "vue-select/dist/vue-select.css";
import "./styles/main.css"

const app = createApp(App)
app.use(createPinia())
app.use(router)

app.use(directives)
app.use(plugins)
app.use(createTauriApp())

app.mount('#app')

