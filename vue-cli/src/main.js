import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './plugins/element.js';
import * as api from './api';
import './assets/style/common.scss';
import BreadCrumb from './../src/components/common/BreadCrumb';
Vue.config.productionTip = false;
Vue.component(BreadCrumb.name, BreadCrumb);
new Vue({
  router,
  store,
  api,
  render: h => h(App),
}).$mount('#app');
