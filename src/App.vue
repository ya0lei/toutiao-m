// TODO:根组件
<template>
  <!-- 只能有一个div根标签 -->
  <div id="app">
    <!-- <span class="toutiao toutiao-sousuo"></span>
    <van-button type="primary">主要按钮</van-button>
    <van-button type="info">信息按钮</van-button> -->
    <!-- TAG:登录表单 -->
    <!-- 路由出口,可以写成单标签 -->
    <router-view></router-view>
    <!-- <span>头条万能验证码 246810</span> -->
    <!-- <h1>黑马头条http://localhost:8000</h1> -->
    <!-- XXX:登录方法请求 -->
  </div>
</template>

<script>
// 按需引入vuex辅助函数
// import { mapState } from 'vuex'
export default {
  name: 'App',
  data () {
    return {
      num: ''
    }
  },
  // 接收父组件属性名匹配的属性值(父组件传递的参数), props: ['父组件属性名1', '父组件属性名2', ...]
  // 单项数据流, 值都是只读的, 不允许修改
  props: [],

  // 普通的函数或者事件执行函数
  methods: {},
  // 注册子组件(属性:值), 组件名使用首字母大写:MyName或者My-name,目的是为了和正常标签区分; 使用时先使用import 组件名 from '组件路径' 语法导入组件
  components: {},
  // 过滤器(方法),传入值返回处理后的值
  filters: {},
  // 计算属性(方法/属性: {set(v){}, get(){return 值}}), 一个数据, 依赖另外一些数据计算而来的结果
  // 计算属性是基于它们的依赖项的值结果进行缓存的，只要依赖的变量不变, 都直接从缓存取结果
  computed: {
    // 相当于list() {return this.$store.state.list}
    // ...mapState(['list'])
  },
  // 侦听器(方法/属性: {deep: boolean, handler(newV, oldV){}, immediate: boolean}),可以侦听data/computed属性值改变而做一些事情
  watch: {},
  // 自定义指令(指令名: {inserted(el) {}} ) 当被绑定的元素插入到 DOM 中时inserted触发
  directives: {},
  // 生命周期(vue实例中一些属性生成与否) - new Vue()以后, vue内部给实例对象添加了一些属性和方法, data和methods还没形成
  beforeCreate () {},
  // 生命周期 - 创建完成（访问当前this实例, 可以访问data和methods内容）, 一般用于发送ajax获取数据,或者注册全局事件，eventBus...
  created () {
    if (this.num) {
      console.log('111')
    } else {
      console.log('成功')
    }
  },
  // 生命周期(真实DOM挂载与否) - 真实DOM挂载之前,预处理data, 不会触发updated钩子函数
  beforeMount () {},
  // 生命周期 - 真实DOM挂载完成（可以访问DOM元素）
  mounted () {},
  // 生命周期(视图更新与否) - 前提: data数据改变才执行, 视图更新之前
  beforeUpdate () {},
  // 生命周期 - 视图更新之后, 场景: 获取更新后的真实DOM
  updated () {},
  // 生命周期(组件销毁与否) - 前提: v-if='false' 销毁Vue实例, 场景: 移除全局事件, 移除当前组件, 计时器, 定时器, eventBus移除事件off方法
  beforeDestroy () {},
  destroyed () {}
}
</script>

<style scoped lang="less"></style>
