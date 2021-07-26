import Vue from 'vue'

import VCharts from 'v-charts'

// 地图
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import '@/assets/css/iconfont/1.0.0/index.css' /* icofont*/

// css
import 'normalize.css/normalize.css'// A modern alternative to CSS resets
import '@/styles/index.scss' // global css

import 'tailwindcss/tailwind.css' // tailwindcss
import 'remixicon/fonts/remixicon.css' // remixicon
import './assets/css/tailwind.css'
// 右键菜单
import 'v-contextmenu/dist/index.css'
import './mock' // simulation data

import './errorLog'// error log
// font-awesome
import '@/assets/library/font-awesome-4.7.0/css/font-awesome.min.css'

import App from './App'

import router from './router'

import store from './store'

// Internationalization
import i18n from './lang'
import { global } from '@/global/global'
import { download } from '@/utils/request'
import {
  loadStyle,
  resetForm
} from './utils/utils'
import {
  iconfontUrl,
  iconfontVersion
} from '@/config/env'

import '@/icons' // icon

import '@/permission' // permission control

import * as filters from './filters' // global filters
// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
// 全局方法挂载
Vue.prototype.resetForm = resetForm
Vue.prototype.download = download

Vue.use(VCharts)
Vue.use(ElementUI, { size: 'small', locale })
iconfontVersion.forEach(ele => {
  loadStyle(iconfontUrl.replace('$key', ele))
})
Vue.use(ElementUI, {
  size: 'small', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})
// 加载用户主题
if (localStorage.getItem('themeValue')) {
  global.changeTheme(localStorage.getItem('themeValue'))
} else {
  global.changeTheme('default')
}
global.changeTheme('default')
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  // template: '<App/>',
  // components: { App }
  render: h => h(App)
})
