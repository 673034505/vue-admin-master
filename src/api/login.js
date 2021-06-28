import request from '@/utils/request'

// export function login(data) {
//   return request({
//     url: '/api/Auth/Login',
//     method: 'post',
//     data
//   })
// }
export function getCodes(username, password) {
  return request({
    url: '/api/Auth/Code',
    method: 'get'
  })
}

export function login(username, password) {
  return request({
    url: '/user/login',
    method: 'post',
    data: {
      username,
      password
    }
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
    url: '/user/logout',
    method: 'post'
  })
}
