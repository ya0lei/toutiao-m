//TAG:回复评论的内容
<template>
  <div class="comment-reply">
    <van-nav-bar
      :title="
        comment.reply_count > 0 ? `${comment.reply_count}条回复` : '暂无回复'
      "
    >
      <van-icon slot="left" name="cross" @click="$emit('close')" />
    </van-nav-bar>
    <!-- 当前评论项 -->
    <comment-item :comment="comment" :show="false" />
    <!-- /当前评论项 -->
    <!-- 全部回复文字 -->
    <van-cell title="全部回复"></van-cell>
    <!-- 评论列表组件显示 -->
    <CommentList
      :source="comment.com_id"
      type="c"
      :list="commentList"
      :key="data"
    ></CommentList>
    <!-- 底部区域 -->
    <div class="reply-bottom">
      <van-button
        class="write-btn"
        size="small"
        round
        @click="isPostShow = true"
        >写评论</van-button
      >
    </div>
    <!-- /底部区域 -->

    <!-- 发布评论 -->
    <van-popup v-model="isPostShow" position="bottom">
      <comment-post
        :target="comment.com_id"
        type="c"
        @onPostSuccess="onPostSuccess"
      />
    </van-popup>
    <!-- /发布评论 -->
    <div class="scroll-wrap">
      <!-- 当前评论项 -->
      <!-- /当前评论项 -->

      <!-- 评论的回复列表 -->
      <!-- /评论的回复列表 -->
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex' // 引入vueX
import CommentItem from '../comment-item' // 引入评论内容
import CommentList from '@/views/article/components/comment-list' // 导入评论列表组件
import CommentPost from '../comment-post' // 导入发表文章评论组件
export default {
  name: 'CommentReply',
  components: { CommentItem, CommentList, CommentPost },
  props: {},
  data () {
    return {
      isPostShow: false, // 弹框是否显示
      commentList: [], // 评论的回复列表
      data: +new Date() // 为了更新key
    }
  },
  computed: {
    // 映射vuex内comment保存的数据
    ...mapState(['comment'])
  },
  watch: {},
  created () {},
  mounted () {},
  methods: {
    ...mapMutations(['setComment', 'addCommentReplyCount']),
    onPostSuccess () {
      // 关闭弹层
      this.isPostShow = false
      // 让list更新
      this.data = +new Date()
      // 让回复数量+1
      this.addCommentReplyCount()
      // 将最新回复的内容展示到列表的顶部
      // this.commentList.unshift(data.new_obj)
    }
  }
}
</script>
<style scoped lang="less">
.scroll-wrap {
  position: fixed;
  top: 92px;
  left: 0;
  right: 0;
  bottom: 88px;
  overflow-y: auto;
}

.reply-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-top: 1px solid #d8d8d8;
  .write-btn {
    width: 60%;
  }
}
</style>
