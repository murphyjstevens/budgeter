import { createRouter, createWebHashHistory } from 'vue-router'

import AccountView from '@/views/AccountView.vue'
import BudgetView from '@/views/BudgetView.vue'
import RecipientsView from '@/views/RecipientsView.vue'

const routes = [
  { path: '/', name: 'Budget', component: BudgetView },
  { path: '/accounts/:url?', name: 'Account', component: AccountView },
  {
    path: '/recipients',
    name: 'Recipients',
    component: RecipientsView,
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
