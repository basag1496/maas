import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)
const base_url = 'http://localhost:3000';
export default new Vuex.Store({
  state: {
    token:'',
    status: localStorage.getItem('token')
  },
  getters: {
    isLoggedIn: state => state.status,
  },
  mutations: {
    setToken(state, t) {
      state.token = t;
      state.status = true;
    },
    logout(state) {
      state.status = false;
    }
  },
  actions: {
    async login(context, credentials) {
      return axios.post(base_url+'/users/sign_in', {
        user:{
          email: credentials.email,
          password: credentials.password
        },
        headers: {
          'Content-Type': 'application/json'
          }
      })
      .then(res => {
        let token = res.headers['authorization']
        localStorage.setItem('token', token)
        localStorage.setItem('isLoggedIn', true)
        context.commit('setToken', token);
        window.location = '/DashboardUser'
        return true
      })
      .catch(() => {
        localStorage.removeItem('token')
        return false
      });  
      
    },
    logout({ commit }) {
      return new Promise((resolve) => {
        commit('logout')
        localStorage.removeItem('token')
        localStorage.setItem('isLoggedIn', false)
        resolve()
      })
    }
  },
  modules: {
  }
})
