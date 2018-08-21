import Vue from 'vue'
import Router from 'vue-router'

import Products from '@/components/Products'
import Product from '@/components/Product'
import Cart from '@/components/Cart'
import AdminProduct from '@/components/admin/Product'
import AdminLogin from '@/components/admin/Login'

import 'firebase/auth'
import { FirebaseApp } from '@/library/Database'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', component: Products },
    { path: '/product/:id', component: Product },
    { path: '/cart', component: Cart },
    {
      path: '/admin',
      component: { render(c) { return c('router-view') } },
      beforeEnter(to, _from, next) {
        let auth = FirebaseApp.auth()

        if (auth.currentUser === null && to.path !== '/admin/login') {
          next({
            path: '/admin/login'
          })
        } else if (auth.currentUser !== null && to.path === '/admin/login') {
          next({
            path: '/admin/products'
          })
        } else {
          next()
        }
      },
      children: [
        { path: 'login', component: AdminLogin },
        { path: 'products', component: AdminProduct }
      ]
    }
  ]
})
