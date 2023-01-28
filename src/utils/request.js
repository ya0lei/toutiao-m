// TODO:封装的axios
// 导入axios
import axios from 'axios'
// 请求拦截器
// 前提：配置请求头，需要访问 Vuex 容器，又因为是在js文件中访问 store，因此需要引入以下代码
import store from '@/store'
// import Vue from 'vue'
// 导入这个,解决大数字问题
import jsonBig from 'json-bigint'
const request = axios.create({
  // 配置根路径
  baseURL: 'http://toutiao.itheima.net/',
  // 解决大数字问题
  transformResponse: [
    function (data) {
      try {
        return jsonBig.parse(data)
        // 转空字符串的时候会报错,报错直接返回原值,不进行大数字的处理
      } catch (err) {
        return data
      }
    }
  ]
})
// 利用请求拦截器（请求发送之前做某些事情），配置请求头（主要处理token问题），配置完后，在向服务器发送请求时，可以携带一些参数（token）
request.interceptors.request.use(
  function (config) {
    const { user } = store.state
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
  },
  function (error) {
    // 当请求拦截器发生处理错误，终止执行，该请求的后续操作同时也会终止
    return Promise.reject(error)
  }
)
// 默认导出
export default request

// // 老方法,把axios挂到vue原型上
// Vue.prototype.$axios = axios
// // 老方法,配置根路径
// axios.defaults.baseURL = 'http://toutiao.itheima.net'
