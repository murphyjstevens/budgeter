import { createRouter, createWebHashHistory } from 'vue-router'

import Account from './components/account/Account.vue'
import Budget from './components/budget/Budget.vue'
import ManageRecipients from './components/settings/ManageRecipients.vue'

const routes = [
  { path: '/', name: 'Budget', component: Budget },
  { path: '/accounts/:url?', name: 'Account', component: Account },
  { path: '/recipients', name: 'Manage Recipients', component: ManageRecipients}
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})