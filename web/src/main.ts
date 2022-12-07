import { createApp, h } from 'vue'
import { createPinia } from 'pinia'

import { router } from './router'

import App from './App.vue'

import 'normalize.css/normalize.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

import './assets/style.css'

const app = createApp({
  render: () => h(App),
})

app.directive('select-all', (el) => {
  el.onfocus = () => el.select()
})

app.use(router)

app.use(createPinia())

app.mount('#app')
