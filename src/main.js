import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/global.css'
import axios from 'axios'

//debug 192.168.5.4
//release 49.234.221.164
axios.defaults.baseURL = 'http://49.234.221.164:1234/'

Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
