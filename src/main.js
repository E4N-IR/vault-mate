import { createApp } from 'vue'
import { registerPlugins } from '@/plugins'

import App from './App.vue'

import 'unfonts.css'

import { registerSW } from 'virtual:pwa-register'

registerSW({
  immediate: true
})

const app = createApp(App)

registerPlugins(app)

app.mount('#app')
