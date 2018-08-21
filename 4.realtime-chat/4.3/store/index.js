import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    loggedin: false,
    uid: '',
    email: '',
    username: ''
  },
  mutations: {
    SET_LOGGEDIN (state, { uid, email }) {
      state.loggedin = true
      state.uid = uid
      state.email = email
    },
    SET_USERNAME (state, username) {
      state.username = username
    }
  }
})
