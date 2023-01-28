import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './utils/dayjs'
// 引入全局样式
import './styles/index.less'
// 导入vant组件库
import Vant from 'vant'
import 'vant/lib/index.css'
// 动态改变根字号大小
import 'amfe-flexible'
// 导入一个css样式包
import 'github-markdown-css/github-markdown.css'
// 注册
Vue.use(Vant)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
