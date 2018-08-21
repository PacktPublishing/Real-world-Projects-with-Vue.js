import Vue from 'vue'
import Router from 'vue-router'
import Subscriptions from '@/components/Subscriptions'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', component: Subscriptions }
  ]
})
