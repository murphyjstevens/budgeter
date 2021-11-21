import { createApp, h } from 'vue'

import { filters } from './filters'
import { router } from './router'
import store from './store'

import App from './App'

import 'normalize.css/normalize.css'
import 'bootstrap/scss/bootstrap.scss'
import 'bootstrap-icons/font/bootstrap-icons.scss'
import './assets/global.scss'
import './assets/bootstrap-override.css'

const app = createApp({
  render: () => h(App)
})

app.config.globalProperties.$filters = filters

app.use(router)

app.use(store)

app.mount('#app')