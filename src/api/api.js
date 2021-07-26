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
export const UpdateMenus = (params) => postAction('/api/Menus/Update', params) // 修改菜单
export const delMenus = (params) => getAction('/api/Menus/Delete', params) // 删除菜单
export const getUserMenus = (params) => getAction('/api/Menus/GetUserMenus', params) // 获取用户菜单菜单

// 仪器管理
export const getQueryZKPage = (params) => postAction('/api/Device/QueryZKPage', params) // 查询在库的设备（可借用）(分页列表)
export const getDevicesubcategory = (params) => getAction('/api/Device/GetDevicesubcategory', params) // 仪器子分类
export const setLYDevice = (params) => postAction('/api/Device/LYDevice', params) // 领用仪器
export const setJYDevice = (params) => postAction('/api/Device/JYDevice', params) // 借用仪器
export const setYYDevice = (params) => postAction('/api/Device/YYDevice', params) // 预约仪器
export const setBFDevice = (params) => postAction('/api/Device/BFDevice', params) // 报废仪器
export const setGHDevice = (params) => postAction('/api/Device/GHDevice', params) // 归还仪器

// 用户角色
export const getRolesList = (params) => postAction('/api/Roles/Query', params) // 查询角色定义列表
export const getRolesInfo = (params) => getAction('/api/Roles/Get', params) // 查询角色定义
export const getRolesCreatee = (params) => postAction('/api/Roles/Create', params) // 添加角色定义
export const getRolesUpdate = (params) => postAction('/api/Roles/Update', params) // 更新角色定义
export const getRolesDelet = (params) => getAction('/api/Roles/Delete', params) // 删除角色定义
