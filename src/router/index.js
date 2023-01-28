import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 路由映射数组
const routes = [
  {
    path: '/',
    redirect: '/home', // 重定向
    component: () => import('@/views/layout'),
    children: [
      {
        path: 'home', // 默认子路由
        name: 'HomeIndex',
        component: () => import('@/views/layout/home')
      },
      {
        path: 'qa',
        name: 'QaPage',
        component: () => import('@/views/layout/qa'),
        children: [
          // 配置测试路由
          {
            // path后面写东西可以传参
            path: '/ceshi/:ceshiId',
            name: 'ceshi',
            component: () => import('@/views/ceshi'),
            // 可以将路由传参传到props里面
            props: true,
            children: [
              {
                path: '/onePage',
                name: 'OnePage',
                component: () => import('@/views/ceshi/components/onePage')
              }
            ]
          }
        ]
      },
      {
        path: 'video',
        name: 'VideoPage',
        component: () => import('@/views/layout/video')
      },
      {
        path: 'my',
        name: 'MyPage',
        component: () => import('@/views/layout/my')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login')
  },
  // 配置搜索路由
  {
    path: '/search',
    name: 'search',
    // 路由懒加载把文件打包成一个单独的js文件,只有跳转的时候才会加载
    component: () => import('@/views/search')
  },
  // 配置文章详情路由
  {
    path: '/article/:articleId',
    name: 'article',
    component: () => import('@/views/article'),
    // 将路由动态参数映射到组件的 props 中，更推荐这种做法
    props: true
  },
  // 用户信息编进
  {
    path: '/user/profile',
    name: 'user-profile',
    component: () => import('@/views/user-profile')
  }
]
// 实例化路由对象
const router = new VueRouter({
  routes
})

export default router
