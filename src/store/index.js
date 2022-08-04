import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)
const base_url = 'http://localhost:3000';
export default new Vuex.Store({
  state: {
    token:''
  },
  getters: {
  },
  mutations: {
    setToken(state, t) {
      state.token = t;
    }
  },
  actions: {
    async login(context, credentials) {
      return axios.post(base_url+'/users/sign_in', {
        user:{
          email: credentials.email,
          password: credentials.password
        }
      })
      .then(res => {
        context.commit('setToken', res.data.token);
        return true;
      })
      .catch(error => {
        console.error(error);
      });  
    }
  },
  modules: {
  }
})
