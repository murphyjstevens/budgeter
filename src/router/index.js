import { createRouter, createWebHashHistory } from 'vue-router'
import Budget from '../components/Budget'

const routes = [
  {
    path: '/',
    name: 'Budget',
    component: Budget
  },
  {
    path: '/accounts/:account',
    name: 'Account',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../components/Account.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
