/**
 * Created by qian on 2016/12/24.
 */
import Vue from 'vue'

// User
const user = {
  // 登录账户
  login(user){
    return Vue.axios.post('/api/login', user)
  },
  // 退出账户
  logout () {
    return Vue.axios.get('/api/logout')
  }
}

export {
  user
}

