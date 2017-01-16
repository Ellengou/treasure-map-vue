/**
 * Created by qian on 2016/12/22.
 */
import * as types from '../mutation-types'
import jwt from '../../utils/jwt'
import {user as userApi} from '../../api/user'

const state = {
  // 当前登录信息
  currentUser: {}
}

// const getters = {
//   currentUser: state => state.currentUser
// }

const mutations = {
  [types.USER_LOGIN](state, user){
    state.currentUser = user
  },
  [types.USER_LOGOUT] (state) {
    state.currentUser = {}
  }
}

const actions = {
  // 账户登录
  login ({commit}, param) {
    return new Promise((resolve, reject) => {
      userApi.login(param).then((response) => {
        if (response.data.code == 0) {
          jwt.setToken(JSON.stringify(response.data.result.model))
          //commit(types.USER_LOGIN, response.data.result.model)
        } else {
          this.$message.error({
            showClose: true,
            message: response.data.desc
          });
        }
        resolve()
      })
    })
  },
  // 账户退出
  logout ({commit}) {
    return new Promise((resolve) => {
      jwt.removeToken()
      commit(types.USER_LOGOUT)
      resolve()
    })
  }
}

export default {
  state,
  actions,
  mutations
}
