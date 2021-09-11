import { getAction, deleteAction, putAction, postAction1, postAction } from '@/api/manage'

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

export const AddPurchase = (params) => postAction('/api/Device/AddPurchase', params) // 新增采购单
export const getQueryList = (params) => postAction('/api/Company/QueryList', params) // 查询供应商公司列表，供应商下拉列表用
export const QueryPurchasPage = (params) => postAction('/api/Device/QueryPurchasPage', params) // 查询采购单列表(分页列表)
export const GetPurchaseDetail = (params) => getAction('/api/Device/GetPurchaseDetail', params) // 详情id
export const ModifyPurchase = (params) => postAction('/api/Device/ModifyPurchase', params) // 修改信息
export const DeletePurchase = (params) => postAction1('/api/Device/DeletePurchase', params) // 退货
export const DeletePurchaseData = (params) => postAction1('/api/Device/DeletePurchaseData', params) // 删除采购单
export const ApprovePurchase = (params) => postAction1('/api/Device/ApprovePurchase', params) // 审批

// 入库
export const AddDevice = (params) => postAction('/api/Device/AddDevice', params) // 入库
export const QueryRukuPage = (params) => postAction('/api/Device/QueryRukuPage', params) // 入库

export const getQueryZKPage = (params) => postAction('/api/Device/QueryZKPage', params) // 查询在库的设备（可借用）(分页列表)
export const getAddDevice = (params) => postAction('/api/Device/AddDevice', params) // 查询在库的设备（可借用）(分页列表)
export const getDevicesubcategory = (params) => getAction('/api/Device/GetDevicesubcategory', params) // 仪器子分类
export const getModefiyDevice = (params) => postAction('/api/Device/ModefiyDevice', params) // 仪器子分类
export const getDetail = (params) => getAction('/api/Device/GetDetail', params) // 仪器子分类
// 出库
export const setLYDevice = (params) => postAction1('/api/Device/LYDevice', params) // 领用仪器
export const setJYDevice = (params) => postAction1('/api/Device/JYDevice', params) // 借用仪器
export const setYYDevice = (params) => postAction1('/api/Device/YYDevice', params) // 预约仪器
export const setBFDevice = (params) => postAction1('/api/Device/BFDevice', params) // 报废仪器
// 归还

export const QueryGHPage = (params) => postAction('/api/Device/QueryGHPage', params) // 归还仪器
export const setGHDevice = (params) => postAction1('/api/Device/GHDevice', params) // 归还仪器

// 公司
export const getCompanList = (params) => postAction('/api/Company/Query', params) // 查询角色定义
export const getCompanInfo = (params) => getAction('/api/Company/Get', params) // 查询角色定义
export const createCompan = (params) => postAction('/api/Company/Create', params) // 查询角色定义
export const UpdateCompan = (params) => postAction('/api/Company/Update', params) // 查询角色定义
export const DeleteCompan = (params) => postAction('/api/Company/Delete', params) // 查询角色定义

// 用户角色
export const getRolesList = (params) => postAction('/api/Roles/Query', params) // 查询角色定义列表
export const getRolesInfo = (params) => getAction('/api/Roles/Get', params) // 查询角色定义
export const getRolesCreatee = (params) => postAction('/api/Roles/Create', params) // 添加角色定义
export const getRolesUpdate = (params) => postAction('/api/Roles/Update', params) // 更新角色定义
export const getRolesDelet = (params) => getAction('/api/Roles/Delete', params) // 删除角色定义

// 用户角色定义
export const getRolesUser = (params) => getAction('/api/RoleUsers/Get', params) // 查询角色定义
export const getRolesUserCreate = (params) => postAction('/api/RoleUsers/Create', params) // 查询角色定义列表
export const getRolesUserDelete = (params) => postAction('/api/RoleUsers/Delete', params) // 查询角色定义列表
export const getRolesUserList = (params) => getAction('/api/RoleUsers/GetExcludeUsers', params) // 查询角色定义列表

export const QueryTeacher = (params) => postAction('/api/users/QueryTeacher', params) // 查询角色定义列表

// 日志
export const QueryLog = (params) => postAction('/api/Logs/Query', params) // 查询角色定义列表
