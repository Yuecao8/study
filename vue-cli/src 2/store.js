import Vue from 'vue';
import Vuex from 'vuex';
import * as api from './api';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentToken: null,
  },
  mutations: {
    tokenState (state, token) {
      state.currentToken = token;
      window.localStorage.setItem('sta_access_token', state.currentToken);
    },
  },
  actions: {
    async checkToken ({ commit }, data) {
      try {
        const res = await api.redirectToken(data);
        commit('tokenState', res.token);
      } catch (e) {
      }
    },
  },
});
