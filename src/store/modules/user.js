import { login, logout, GetUserInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import {
  setStore,
  getStore,
  removeStore
} from '@/utils/store'
const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    rolesTeacher: false,
    isLock: getStore({
      name: 'isLock'
    }) || false,
    lockPasswd: getStore({
      name: 'lockPasswd'
    }) || '',
    browserHeaderTitle: getStore({
      name: 'browserHeaderTitle'
    }) || 'NxAdmin'
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      if (roles.indexOf('admin') >= 0 || roles.indexOf('teacher') >= 0) {
        state.rolesTeacher = true
      }
      state.roles = roles
    },
    SET_LOCK_PASSWD: (state, lockPasswd) => {
      state.lockPasswd = lockPasswd
      setStore({
        name: 'lockPasswd',
        content: state.lockPasswd,
        type: 'session'
      })
    },
    SET_LOCK: (state, action) => {
      state.isLock = true
      setStore({
        name: 'isLock',
        content: state.isLock,
        type: 'session'
      })
    },
    CLEAR_LOCK: (state, action) => {
      state.isLock = false
      state.lockPasswd = ''
      removeStore({
        name: 'lockPasswd'
      })
      removeStore({
        name: 'isLock'
      })
    },
    SET_BROWSERHEADERTITLE: (state, action) => {
      console.log(action.browserHeaderTitle)
      state.browserHeaderTitle = action.browserHeaderTitle
    }

  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const params = {
        userName: userInfo.userName.trim(),
        passWord: userInfo.passWord,
        code: userInfo.code,
        uuid: userInfo.uuid
      }
      return new Promise((resolve, reject) => {
        login(params).then(response => {
          const { data } = response
          setToken(data)
          commit('SET_TOKEN', data)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
      // const username = userInfo.username.trim()
      // return new Promise((resolve, reject) => {
      //   console.log(userInfo)
      //   login(username, userInfo.password).then(response => {
      //     console.log(response)
      //     const data = response
      //     setToken(data.token)
      //     commit('SET_TOKEN', data.token)
      //     resolve()
      //   }).catch(error => {
      //     reject(error)
      //   })
      // })
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        GetUserInfo(state.token).then(response => {
          const { data } = response
          if (data.userPower && data.userPower.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.userPower)
          } else {
            reject('GetUserInfo: userPower must be a non-null array !')
          }
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        console.log('登出')
        logout(state.token).then((res) => {
          console.log(res)
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('CLEAR_LOCK')
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },
    // 动态修改权限
    ChangeRoles({ commit }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        GetUserInfo(role).then(response => {
          const data = response
          commit('SET_ROLES', data.userPower)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          resolve()
        })
      })
    }
  }
}

export default user
