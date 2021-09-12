import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权
import {
  setTitle
} from '@/utils/utils' // 设置浏览器头部标题
import { getUserMenus } from '@/api/api'
import { filterAsyncRouter } from '@/store/modules/permission'

// permission judge function
function hasPermission(roles, permissionRoles) {
  if (roles.indexOf('admin') >= 0) return true // admin permission passed directly
  if (!permissionRoles) return true
  return roles.some(role => permissionRoles.indexOf(role) >= 0)
}
const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    // 设置浏览器头部标题
    // const browserHeaderTitle = (to.name)
    // store.commit('SET_BROWSERHEADERTITLE', {
    //   browserHeaderTitle: browserHeaderTitle
    // })
    /* has token*/
    if (store.getters.isLock && to.path !== '/lock') {
      next({
        path: '/lock'
      })
      NProgress.done()
    } else if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (store.getters.roles.length === 0) {
        store.dispatch('GetUserInfo').then(res => { // 拉取用户信息
          const { data } = res
          const roles = data.userPower // note: roles must be a array! such as: ['editor','develop']
          store.dispatch('GenerateRoutes', { roles }).then(() => { // 根据roles权限生成可访问的路由表
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          })
          // 动态路由，拉取菜单
          // loadMenus(next, to, roles)
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || 'Verification failed, please login again')
            next({ path: '/' })
          })
        })
      } else {
        // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
        if (hasPermission(store.getters.roles, to.meta.roles)) {
          next()//
        } else {
          next({ path: '/401', replace: true, query: { noGoBack: true }})
        }
      }
    }
  } else {
    // 设置浏览器头部标题
    // const browserHeaderTitle = to.name
    // store.commit('SET_BROWSERHEADERTITLE', {
    //   browserHeaderTitle: browserHeaderTitle
    // })
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

export const loadMenus = (next, to, roles) => {
  getUserMenus().then(res => {
    const asyncRouter = filterAsyncRouter(res.data, roles)

    asyncRouter.push({ path: '*', redirect: '/404', hidden: true })
    store.dispatch('GenerateRoutes', { asyncRouter, roles }).then(() => { // 存储路由
      router.addRoutes(asyncRouter) // 动态添加可访问路由表
      next({ ...to, replace: true })
    })
  })
}

router.afterEach(() => {
  NProgress.done() // 结束Progress
  setTimeout(() => {
    // const browserHeaderTitle = store.getters.browserHeaderTitle
    // setTitle(browserHeaderTitle)
  }, 0)
})
