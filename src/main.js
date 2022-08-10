import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
Vue.config.productionTip = false

const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = token
}
axios.defaults.baseURL = 'http://localhost:3000/api/v1'
new Vue({
  router,
  store,
  axios,
  render: h => h(App)
}).$mount('#app')
