import Vue from 'vue'
import Router from 'vue-router'



import HelloWorld from '@/components/HelloWorld'
import first from '@/components/first'
import vuexDemo from '@/view/vuexDemo'
import vuexA from '@/components/vuexA'
import vuexB from '@/components/vuexB'
import echartsDemo from '@/view/echartsDemo'


Vue.use(Router)



var router = new Router({
  routes: [
    {
      path: '/',
      name: 'vuexDemo',
      component: vuexDemo
    },
    {
      path: '/first',
      name: 'first',
      component: first
    },
    {
      path: '/vuexDemo',
      name: 'vuexDemo',
      component: vuexDemo
    },
    {
      path: '/vuexA',
      name: 'vuexA',
      component: vuexA
    },
    {
      path: '/vuexB',
      name: 'vuexB',
      component: vuexB
    },
    {
      path: '/echartsDemo',
      name: 'echartsDemo',
      component: echartsDemo
    }
  ],
  mode: 'history',
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
});

export default router
 
