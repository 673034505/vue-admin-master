import request from '@/utils/request'

// post
export function postAction(url, parameter) {
  return request({
    url: url,
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
    url: url,
    method: method,
    data: parameter
  })
}

// put
export function putAction(url, parameter) {
  return request({
    url: url,
    method: 'put',
    data: parameter
  })
}

// get
export function getAction(url, parameter) {
  return request({
    url: url,
    method: 'get',
    params: parameter
  })
}

// deleteAction
export function deleteAction(url, parameter) {
  return request({
    url: url,
    method: 'delete',
    params: parameter
  })
}
