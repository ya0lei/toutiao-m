// TAG:评论列表组件
<template>
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
  >
    <!-- 渲染评论列表 -->
    <!-- <van-cell
      v-for="(item, index) in list"
      :key="index"
      :title="item.content"
    ></van-cell> -->
    <CommentItem
      v-for="(item, index) in list"
      :key="index"
      :comment="item"
      :likeCount.sync="item.like_count"
      :isLiking.sync="item.is_liking"
      v-on="$listeners"
    ></CommentItem>
  </van-list>
</template>
<script>
import { getComments } from '@/api/comment' // 引入获取文章评论
import CommentItem from '@/views/article/components/comment-item' // 导入评论内容
export default {
  name: 'CommentList',
  components: { CommentItem },
  props: {
    // 文章id
    source: {
      type: [Number, String, Object],
      required: true
    },
    // 评论数
    totalCount: {
      type: Number
      // required: true
    },
    // 根据调用组件方传递过来的参数来决定接口传递的参数是什么
    // a:获取评论
    // c:获取回复评论
    type: {
      type: String,
      // 不传参数默认是a
      default: 'a',
      // 数据验证,只会找到a,c,其他的会返回false
      validator (value) {
        return ['a', 'c'].indexOf(value) !== -1
      }
    }
  },
  data () {
    return {
      list: [], // 评论列表
      loading: false, // 上拉加载更多的 loading
      finished: false, // 是否加载结束
      offset: null, // 获取下一页数据的标记
      limit: 10,
      error: false
    }
  },
  created () {
    this.loading = true // 阻止onload事件再组件刷新的时候自动触发一次
    this.onLoad()
  },

  methods: {
    async onLoad () {
      try {
        // 1. 请求获取数据
        const { data } = await getComments({
          type: this.type, //  评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          source: this.source.toString(), // 源id，文章id或评论id,【可能有大数字，所以执行一下toString 方法】
          offset: this.offset, // 评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          limit: this.limit // 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
        })

        // 2. 将数据添加到列表中(一定要注意是追加数据，否则列表高度不增加，形成死循环)
        const { results } = data.data
        this.list.push(...results)
        // 评论总数
        const totalCount = data.data.total_count
        // 修改父组件的评论总数
        this.$emit('update:totalCount', totalCount)

        // 3. 将 loading 设置为 false
        this.loading = false

        // 4. 判断是否还有数据
        if (results.length) {
          // 有就更新获取下一页的数据页码
          this.offset = data.data.last_id
        } else {
          // 没有就将 finished 设置结束
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
      }
    }
  }
}
</script>
