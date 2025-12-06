import { createPinia } from 'pinia'
import router from '@/router'
import vuetify from './vuetify'

export function registerPlugins (app) {
  const pinia = createPinia()
  app.use(vuetify).use(router).use(pinia)
}
