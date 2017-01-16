/**
 * Created by qian on 2016/12/22.
 */
import storage from './storage'

const TOKEN_KEY = 'token'

export default {
  setToken (token) {
    storage.write(TOKEN_KEY, token)
  },
  getToken () {
    return storage.get(TOKEN_KEY)
  },
  removeToken () {
    storage.delete(TOKEN_KEY)
  },
  clearToken () {
    storage.clear()
  },
  checkUser () {
    return storage.check(TOKEN_KEY)
  }
}
