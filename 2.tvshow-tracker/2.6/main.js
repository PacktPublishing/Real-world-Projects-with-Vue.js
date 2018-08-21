// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import 'bulma/css/bulma.css'

import FontAwesome from '@fortawesome/fontawesome'
import VueFontAwesome from '@fortawesome/vue-fontawesome'
import FontAwesomeSolid from '@fortawesome/fontawesome-free-solid'

FontAwesome.library.add(FontAwesomeSolid)
Vue.component('fa-icon', VueFontAwesome)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
