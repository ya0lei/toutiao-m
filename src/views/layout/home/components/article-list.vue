<template>
  <div class="article-list">
    <!-- 下拉刷新 -->
    <van-pull-refresh
      v-model="isreFreshLoading"
      :success-text="refreshSuccessText"
      :success-duration="1500"
      @refresh="onRefresh"
    >
      <!-- 上拉加载功能 -->
      <!-- 子组件修改error值语法: 点击事件  fn() {this.$emit('update:error', true)} -->
      <van-list
        ref="list"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <ArticleItem
          v-for="item in list"
          :key="item.art_id"
          :article="item"
        ></ArticleItem>
        <!-- <van-cell v-for="item in list" :key="item.art_id" :title="item.title" /> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
// 根据channel.id发ajax获取数据
import { getArticles } from '@/api/article' // <====== 导入方法
// 导入公共组件ArticleList
import ArticleItem from '@/components/article-item'
export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  props: {
    // 设置一个props用来接收属于自己的频道信息数据
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      timestamp: Date.now(), // 第一次发请求的时候,传递的时间戳
      error: false,
      isreFreshLoading: false, // 控制下拉刷新的 loading 状态
      refreshSuccessText: '刷新成功' // 下拉刷新成功提示文本
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    // 上拉加载
    async onLoad () {
      // ①onload事件, 页面触底会触发一次, loading会由初始的false自动变为true(展示正在加载)
      // ②此时我们要发送ajax，请求数据渲染页面，渲染成功之后要loading重置为false
      // ③如果发送ajax之后发现数据没有了， 那么要让finished变为true(展示没有更多了)
      try {
        // 1. 请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道 id
          timestamp: this.timestamp, // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
          with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
        })
        // 把数据更新到list数组里
        this.list.push(...data.data.results)
        // 更新时间戳
        this.timestamp = data.data.pre_timestamp
        // 把loading重置一下, onload才能继续触发
        this.loading = false
        // 如果data.data.pre_timestamp值为null, 说明没有更多数据了
        if (data.data.pre_timestamp == null) {
          this.finished = true // onload事件就不会触发了, 同时出现没有更多数据了
        }
        // asdasdasdas  测试error提示
      } catch (err) {
        this.error = true
      }
    },
    // 下拉刷新
    // 当触发下拉刷新的时候调用该函数
    async onRefresh () {
      try {
        this.timestamp = Date.now()
        // 1. 请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道 id
          timestamp: this.timestamp, // 下拉刷新每次都应该获取最新数据
          with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
        })
        // 测试刷新失败
        // asdasdasdasd
        // 2. 将数据追加到列表的顶部
        const { results } = data.data // 下拉拿到的数据只有10条， 不会触发onload事件
        this.list = results
        // 更新时间戳
        this.timestamp = data.data.pre_timestamp
        // 手动触发onload()
        // 检查当前的滚动位置，若已滚动至底部，则会触发 load 事件
        this.$refs.list.check()
        // 3. 关闭下拉刷新的 loading 状态
        this.isreFreshLoading = false

        // 提示成功
        this.refreshSuccessText = `刷新成功，更新了${results.length}条数据`
      } catch (err) {
        this.isreFreshLoading = false // 关闭下拉刷新的 loading 状态
        // 提示失败
        this.refreshSuccessText = '刷新失败'
      }
    }
  }
}
</script>

<style scoped lang="less">
.article-list {
  // list组件内容过多,溢出body, 让Body产生上下滚动条
  // 需求: 切换list组件的(tab栏切换), 保留上一个tab栏内容滚动条位置
  // 产生了一个BUG: list组件库再切换的时候采用懒加载, 会造成切换时候数据更新, 让body滚动条滚动到初始位置, 这样就不能记录上一个tab栏滚动位置了
  // 解决方案: 让每一个tab栏盒子写死高度(自适应), 加一行溢出隐藏的代码, 让list组件在tab栏盒子内溢出. 这样切换tab栏的时候, 每一个tab栏对应的都是对的组件
  //           切换到新的组件, 之前的组件滚动条位置就不受干扰了. 这样就可以记录每一个tab内组件的滚动条位置
  height: calc(100vh - 274px);
  overflow-y: auto;
}
</style>
