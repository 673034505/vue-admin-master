import request from '@/utils/request'
var gateway = ''
if (process.env.NODE_ENV === 'development') {
  // gateway = ''
} else {
  gateway = '/hustapi'
}

// post
export function postAction(url, parameter) {
  console.log(url, ' parameter', parameter)
  return request({
    url: gateway + url,
    method: 'post',
    // headers: {
    //   'Content-Type': 'application/json'
    // },
    data: parameter
  })
}

// post method= {post | put}
export function httpAction(url, parameter, method) {
  return request({
    url: gateway + url,
    method: method,
    data: parameter
  })
}

// put
export function putAction(url, parameter) {
  return request({
    url: gateway + url,
    method: 'put',
    data: parameter
  })
}

// get
export function getAction(url, parameter) {
  return request({
    url: gateway + url,
    method: 'get',
    params: parameter
  })
}

// deleteAction
export function deleteAction(url, parameter) {
  return request({
    url: gateway + url,
    method: 'delete',
    params: parameter
  })
}
