import { getAction, deleteAction, putAction, postAction } from '@/api/manage'

//* ******************************************************************************用户管理

// 查询用户列表
export const getUsersQuery = (params) => postAction('/api/Users/Query', params) // 获取用户列表
export const getUsersCreate = (params) => postAction('/api/Users/Create', params) // 添加用户
export const getUsersInfo = (params) => getAction('/api/Users/Get', params) // 添加用户
export const getUsersUpdate = (params) => postAction('/api/Users/Update', params) // 修改用户
export const getUsersDelete = (params) => postAction('/api/Users/Delete', params) // 刪除用户

// 获取菜单
export const getQueryPower = (params) => postAction('/api/Menus/Query', params) // 获取菜单列表
export const getQueryMenus = (params) => getAction('/api/Menus/Get', params) // 获取菜单
export const getCreateMenus = (params) => postAction('/api/Menus/Create', params) // 添加菜单
// export const getQueryPower = (params) => postAction('/api/Menus/Query', params) // 获取用户
// export const getQueryPower = (params) => postAction('/api/Menus/Query', params) // 获取用户
