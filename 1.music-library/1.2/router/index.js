import Vue from 'vue'
import Router from 'vue-router'
import MusicIndex from '@/components/MusicIndex'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: MusicIndex
    }
  ]
})
