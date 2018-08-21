import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import db from '@/library/Database'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    products: {},
    items: [],
    customer: {},
    shipping: {},
    payment: {}
  },
  getters: {
    getProduct: state => id => {
      return state.products[id]
    },
    totalItems: state => {
      return state.items.reduce((acc, curr) => acc + curr.quantity * curr.price, 0)
    },
    shippingPrice: (state) => {
      if (state.shipping.price !== undefined) {
        return state.shipping.price
      }

      return 0
    },
    paymentPrice: (state) => {
      if (state.payment.price !== undefined) {
        return state.payment.price
      }

      return 0
    },
    total: (_state, getters) => {
      return getters.totalItems + getters.shippingPrice + getters.paymentPrice
    }
  },
  mutations: {
    SET_PRODUCTS (state, products) {
      state.products = products
    },
    ADD_ITEM (state, { id, size, price, quantity }) {
      let itemIndex = state.items.findIndex(i => i.id === id && i.size === size)

      if (itemIndex !== -1) {
        state.items[itemIndex].quantity += quantity
      } else {
        state.items.push({ id, size, price, quantity })
      }
    },
    SET_ITEM_QUANTITY (state, { id, size, quantity }) {
      let itemIndex = state.items.findIndex(i => i.id === id && i.size === size)

      if (itemIndex !== -1) {
        state.items[itemIndex].quantity = quantity
      }
    },
    REMOVE_ITEM (state, { id, size }) {
      let itemIndex = state.items.findIndex(i => i.id === id && i.size === size)

      if (itemIndex !== -1) {
        state.items.splice(itemIndex, 1)
      }
    },
    SET_CUSTOMER (state, customer) {
      state.customer = customer
    },
    SET_SHIPPING (state, shipping) {
      state.shipping = shipping
    },
    SET_PAYMENT (state, payment) {
      state.payment = payment
    },
    CLEAR_CART (state) {
      state.items = []
      state.shipping = {}
      state.payment = {}
    }
  },
  actions: {
    getProducts ({ commit }) {
      db.get_products().then(products => {
        let tempProducts = {}

        products.forEach(product => {
          tempProducts[product.id] = product.data()
        })

        commit('SET_PRODUCTS', tempProducts)
      })
    },
    addOrder ({ commit, state }) {
      db.add_order({
        cart: state.items,
        customer: state.customer,
        shipping: state.shipping,
        payment: state.payment
      }).then(() => {
        commit('CLEAR_CART')
      })
    }
  }
})
