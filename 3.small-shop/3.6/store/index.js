import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import db from '@/library/Database'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    products: {},
    items: []
  },
  getters: {
    getProduct: state => id => {
      return state.products[id]
    },
    totalItems: state => {
      return state.items.reduce((acc, curr) => acc + curr.quantity * curr.price, 0)
    }
  },
  mutations: {
    SET_PRODUCTS(state, products) {
      state.products = products
    },
    ADD_ITEM(state, { id, size, price, quantity }) {
      let itemIndex = state.items.findIndex(i => i.id === id && i.size === size)

      if (itemIndex !== -1) {
        state.items[itemIndex].quantity += quantity
      } else {
        state.items.push({ id, size, price, quantity })
      }
    },
    SET_ITEM_QUANTITY(state, { id, size, quantity }) {
      let itemIndex = state.items.findIndex(i => i.id === id && i.size === size)

      if (itemIndex !== -1) {
        state.items[itemIndex].quantity = quantity
      }
    },
    REMOVE_ITEM(state, { id, size }) {
      let itemIndex = state.items.findIndex(i => i.id === id && i.size === size)

      if (itemIndex !== -1) {
        state.items.splice(itemIndex, 1)
      }
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
