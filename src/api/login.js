import request from '@/utils/request'
var gateway = ''
if (process.env.NODE_ENV === 'development') {
  // gateway = ''
} else {
  gateway = '/hustapi'
}

export function login(data) {
  return request({
    url: gateway + '/api/Auth/Login',
    method: 'post',
    data
  })
}
export function getCodes(username, password) {
  return request({
    url: gateway + '/api/Auth/Code',
    method: 'get'
  })
}
export function GetUserInfo() {
  return request({
    url: gateway + '/api/Auth/GetUserInfo'
  })
}

export function logout() {
  return request({
    url: gateway + '/api/Auth/LogOut',
    method: 'get'
  })
}
