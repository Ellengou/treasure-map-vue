// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
//import {sync} from 'vuex-router-sync'
//import store from './store'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import * as ElementUI  from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
Vue.use(ElementUI)
Vue.use(VueAxios, axios)
//sync(store, router)
/* eslint-disable no-new */
axios.defaults.headers['Content-Type'] = 'application/json';
axios.defaults.baseURL = 'http://120.26.38.180:80';
Vue.prototype.basePath = "http://120.26.38.180:80";
// 请求hook
axios.interceptors.request.use((config) => {
  // 请求中加入过滤'/api'字符串
  config.url = config.url.replace(/\/api/, '')
  return config
})

// 返回结果filter
axios.interceptors.response.use((response) => {
  if (response.data.code == 1) {
    ElementUI.Message.error({
      message: '账户登录已过期，请重新登录！',
      showClose: true,
      onClose: function () {
        router.replace({name: 'login'})
        window.localStorage.removeItem('token')
      }
    })
  } else {
    return response
  }
}, (error) => {
  return Promise.reject(error)
})

// 创建和挂载根实例。
new Vue({
  el: '#app',
  template: '<App/>',
  components: {App},
  router: router
})
