import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/Auth/Login',
    method: 'post',
    data
  })
}
export function getCodes(username, password) {
  return request({
    url: '/api/Auth/Code',
    method: 'get'
  })
}
export function GetUserInfo() {
  return request({
    url: '/api/Auth/GetUserInfo'
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/api/Auth/LogOut',
    method: 'get'
  })
}
