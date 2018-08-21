import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import db from '@/library/Database'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    products: {}
  },
  getters: {
    getProduct: state => id => {
      return state.products[id]
    }
  },
  mutations: {
    SET_PRODUCTS(state, products) {
      state.products = products
    }
  },
  actions: {
    getProducts({ commit }) {
      db.get_products().then(products => {
        let tempProducts = {}

        products.forEach(product => {
          tempProducts[product.id] = product.data()
        })

        commit('SET_PRODUCTS', tempProducts)
      })
    }
  }
})
