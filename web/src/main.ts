import { createApp, h } from 'vue'

import { filters } from './filters'
import { router } from './router'
import store from './store'

import App from './App.vue'

import 'normalize.css/normalize.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

import './assets/global.css'
import './assets/bootstrap-override.css'

const app = createApp({
  render: () => h(App)
})

app.config.globalProperties.$filters = filters

app.directive('select-all', el => {
  el.onfocus = () => el.select()
})

app.use(router)

app.use(store)

app.mount('#app')