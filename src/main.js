import { createApp } from 'vue'
import './style.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import 'virtual:windi.css'
import { router } from './router'
import store from './store'

import './permission'
import 'nprogress/nprogress.css'
import './assets/style/variables.css'
/* 引入 Element Plus 的暗黑变量文件 */
import 'element-plus/theme-chalk/dark/css-vars.css';

// 如果您正在使用CDN引入，请删除下面一行。
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import permission from '~/directives/permission.js'

const app = createApp(App)

app.use(ElementPlus)

document.documentElement.classList.add('dark')

app.use(router)
app.use(store)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(permission);

app.mount('#app')
