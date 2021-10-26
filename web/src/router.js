import { createRouter, createWebHashHistory } from 'vue-router'

import Budget from './components/budget/Budget'
import Account from './components/account/Account'

const routes = [
  { path: '/', name: 'Budget', component: Budget },
  { path: '/accounts/:id', name: 'Account', component: Account },
  { path: '/accounts', name: 'Account', component: Account }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})