import { getAction, deleteAction, putAction, postAction } from '@/api/manage'

//* ******************************************************************************用户管理

// 查询用户列表
export const getUsersQuery = (params) => postAction('/api/Users/Query', params) // 获取用户列表
export const getUsersCreate = (params) => postAction('/api/Users/Create', params) // 添加用户
export const getUsersInfo = (params) => getAction('/api/Users/Get', params) // 添加用户
export const getUsersUpdate = (params) => postAction('/api/Users/Update', params) // 修改用户
export const getUsersDelete = (params) => postAction('/api/Users/Delete', params) // 刪除用户

