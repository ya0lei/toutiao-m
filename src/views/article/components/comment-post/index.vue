// TAG:发表文章评论组件
<template>
  <div class="comment-post">
    <van-field
      class="post-field"
      v-model.trim="message"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="请输入留言"
      show-word-limit
    />
    <van-button class="post-btn" @click="onPost" :disabled="!message.length"
      >发布</van-button
    >
  </div>
</template>

<script>
import { addComment } from '@/api/comment' // 发布文章评论或回复评论
export default {
  name: 'CommentPost',
  data () {
    return {
      message: ''
    }
  },
  // 依赖注入:接收父组件给所有后代传递的值
  // inject:['articleId']
  inject: {
    articleId: {
      type: [Number, String, Object],
      default: null
    }
  },
  props: {
    // 目标id，接收文章id或者评论id
    target: {
      type: [Number, String, Object],
      required: true
    },
    // 增加一个type，进行判断，如果是a则说明是文章回复，不需要使用inject注入的数据， 不是a则使用。
    type: {
      type: String,
      // 自定义 Prop 数据验证
      validator (value) {
        return ['a', 'c'].includes(value)
      },
      default: 'a'
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onPost () {
      this.$toast.loading({
        message: '发布中...',
        forbidClick: true, // 禁用背景点击
        duration: 0 // 持续时间,默认2000,0:不关闭
      })
      try {
        await addComment({
          target: this.target.toString(), // 评论目标id（评论文章即文章id，对评论进行回复则为评论id） 防止有大数字最好也执行一下toString方法！
          content: this.message, // 评论内容
          // art_id: null // 文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
          // 文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
          // art_id: this.articleId ? this.articleId.toString() : this.articleId
          art_id: this.type === 'a' ? null : this.articleId.toString()
        })

        this.$toast.success('发布成功')
        // 触发父组件的方法
        // todo==>
        // 关闭弹出层
        // 将发布内容显示到列表顶部
        // 清空文本框
        this.message = ''
      } catch (err) {
        this.$toast.fail('发布失败')
      }
      this.$emit('onPostSuccess')
    }
  }
}
</script>

<style scoped lang="less">
.comment-post {
  display: flex;
  align-items: center;
  padding: 32px 0 32px 32px;
  .post-field {
    background-color: #f5f7f9;
  }
  .post-btn {
    width: 150px;
    border: none;
    padding: 0;
    color: #6ba3d8;
    &::before {
      display: none;
    }
  }
}
</style>
