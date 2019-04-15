import Vue from 'vue'
import Router from 'vue-router'
import Hexmap from './views/Hexmap.vue'
import Network from './views/Network.vue'
import Calendar from './views/Calendar.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'map',
      component: Hexmap
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: Calendar
    },
    {
      path: '/network',
      name: 'network',
      component: Network
    },
    {
      path: '/notes',
      name: 'notes',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/Notes.vue')
    }
  ]
})
