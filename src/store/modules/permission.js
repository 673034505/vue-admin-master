import { asyncRouterMap, constantRouterMap } from '@/router'
import Layout from '@/layout/Layout'
/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.indexOf(role) >= 0)
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
export function filterAsyncRouter(asyncRouterMap, roles) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(roles, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

// export const filterAsyncRouter = (routers, roles) => { // 遍历后台传来的路由字符串，转换为组件对象
//   // console.log(routers)
//   // return asyncRouterMap
//   return routers.filter(router => {
//     if (router.component) {
//       if (router.component === 'Layout') { // Layout组件特殊处理
//         router.component = Layout
//       } else if (router.component === '') {
//         router.component = Layout
//       } else {
//         const component = router.component
//         router.component = loadView(component)
//       }
//     }
//     // if (hasPermission(roles, routers)) {
//     //   if (routers.children && routers.children.length) {
//     //     routers.children = filterAsyncRouter(routers.children, roles)
//     //   }
//     //   return true
//     // }
//     if (router.children && router.children.length) {
//       router.children = filterAsyncRouter(router.children)
//     }
//     return true
//   })
// }

export const loadView = (view) => {
  return (resolve) => require([`@/views/${view}`], resolve)
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      console.log(routers)
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    // GenerateRoutes({ commit }, data) {
    //   return new Promise(resolve => {
    //     const { roles, asyncRouter } = data
    //     console.log(JSON.stringify(asyncRouter))
    //     let accessedRouters

    //     if (roles.indexOf('admin') >= 0) {
    //       accessedRouters = asyncRouter
    //     } else {
    //       accessedRouters = filterAsyncRouter(asyncRouter, roles)
    //       // accessedRouters = ''
    //       // accessedRouters = asyncRouter
    //     }
    //     console.log(accessedRouters)
    //     // accessedRouters = asyncRouterMap
    //     // console.log(accessedRouters, '=========accessedRouters')
    //     commit('SET_ROUTERS', accessedRouters)
    //     resolve()
    //   })
    // }
    // GenerateRoutes({ commit }, asyncRouter) {
    //   commit('SET_ROUTERS', asyncRouter)
    // }

    // nx-admin
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { roles } = data
        let accessedRouters
        if (roles.indexOf('admin') >= 0) {
          console.log('admin>=0')
          accessedRouters = asyncRouterMap
        } else {
          console.log('admin<0')
          accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
          // accessedRouters = ''
          // accessedRouters = asyncRouterMap
        }
        // accessedRouters = filterAsyncRouter(asyncRouterMap, ['student'])
        // console.log('accessedRouters', accessedRouters)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
