// TAG:评论列表的每一项内容组件
<template>
  <van-cell class="comment-item">
    <van-image
      slot="icon"
      class="avatar"
      round
      fit="cover"
      :src="comment.aut_photo"
    />
    <div slot="title" class="title-wrap">
      <div class="user-name">{{ comment.aut_name }}</div>
      <van-button
        class="like-btn"
        :icon="comment.like_count > 0 ? 'good-job' : 'good-job-o'"
        :class="{ liked: comment.like_count }"
        @click="onCommentLike"
        :loading="commentLoading"
        >{{ comment.like_count || "赞" }}</van-button
      >
    </div>

    <div slot="label">
      <p class="comment-content">{{ comment.content }}</p>
      <div class="bottom-info">
        <span class="comment-pubdate">{{
          comment.pubdate | relativeTime
        }}</span>
        <!-- <van-button
          class="reply-btn"
          round
          @click="$emit('reply-click', comment)"
          >回复 {{ comment.reply_count }}</van-button
        > -->
        <!-- 用vueX来传数据 -->
        <van-button v-if="show" class="reply-btn" round @click="replyComment(comment)"
          >回复 {{ comment.reply_count }}</van-button
        >
      </div>
    </div>
  </van-cell>
</template>

<script>
import { addCommentLike, deleteCommentLike } from '@/api/comment'
import { mapMutations } from 'vuex'
export default {
  name: 'CommentItem',
  data () {
    return {
      commentLoading: false // 是否点赞中,loading状态
    }
  },
  props: {
    // 每行的评论信息
    comment: {
      type: Object
      //   required: true
    },
    // 点赞数量
    likeCount: {
      type: Number
      //   required: true
    },
    // 是否点赞
    isLiking: {
      type: Boolean
      //   required: true
    },
    // 回复按钮是否隐藏
    show: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    // 映射保存评论对象的方法
    ...mapMutations(['setComment']),
    // 点赞||取消点赞事件
    async onCommentLike () {
      // loading 开启
      this.commentLoading = true
      try {
        // 如果已经赞了则取消点赞
        if (this.comment.is_liking) {
          await deleteCommentLike(this.comment.com_id)
          this.$emit('update:likeCount', this.comment.like_count - 1)
        } else {
          // 如果没有赞，则点赞
          await addCommentLike(this.comment.com_id)
          this.$emit('update:likeCount', this.comment.like_count + 1)
        }
        // 更新视图状态
        this.$emit('update:isLiking', !this.comment.is_liking)
        this.$toast('操作成功')
      } catch (e) {
        this.$toast('操作失败，请重试')
      }
      // loading 关闭
      this.commentLoading = false
    },
    // 点击回复触发函数,数据存到vueX中
    replyComment (comment) {
      // 调用vueX的函数
      this.setComment(comment)
      // index.vue组件内的isReplyShow变量变为true
      this.$emit('open')
    }
  },
  created () {
    console.log(this.comment)
  }
}
</script>

<style scoped lang="less">
.comment-item {
  .avatar {
    width: 72px;
    height: 72px;
    margin-right: 25px;
  }
  .title-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .user-name {
      color: #406599;
      font-size: 26px;
    }
  }
  .comment-content {
    font-size: 32px;
    color: #222222;
    word-break: break-all;
    text-align: justify;
  }
  .comment-pubdate {
    font-size: 19px;
    color: #222;
    margin-right: 25px;
  }
  .bottom-info {
    display: flex;
    align-items: center;
  }
  .reply-btn {
    width: 135px;
    height: 48px;
    line-height: 48px;
    font-size: 21px;
    color: #222;
  }
  .like-btn {
    height: 30px;
    padding: 0;
    border: none;
    font-size: 19px;
    line-height: 30px;
    margin-right: 7px;
    .van-icon {
      font-size: 30px;
    }
  }
  .liked {
    color: orange;
  }
}
</style>
