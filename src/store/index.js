// TODO:vueX状态管理
// import { from } from 'core-js/core/array'
import Vue from 'vue'
import Vuex from 'vuex'
// 导入二次封装的本地存储操作
import { getItem, setItem } from '@/utils/storage'
Vue.use(Vuex)
// 声明一个常量(全大写字母),来保存token的key值
const TOKEN_KEY = 'TOUTIAO_USER'
export default new Vuex.Store({
  // 公共数据存储的位置
  state: {
    list: ['我是1', '我是2'],
    // 页面刷新时从本地存储获取token
    user: getItem(TOKEN_KEY),
    // 评论对象
    comment: null
  },
  getters: {},
  // 写同步代码的地方,可以修改state中的数据
  mutations: {
    setUser (state, payload) {
      // 把其他组件中调用这个函数传递的参数存到state.user中
      state.user = payload
      // 把第一次登录的token存到本地存储,数据必须是JSON格式
      setItem(TOKEN_KEY, state.user)
    },
    // 保存评论对象的方法
    setComment (state, data) {
      state.comment = data
    },
    // 修改comment里面评论数量的方法
    addCommentReplyCount (state) {
      state.comment.reply_count++
    }
  },
  actions: {},
  modules: {}
})
