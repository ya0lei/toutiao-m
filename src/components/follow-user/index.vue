<template>
    <van-button
      v-if="isFollowed"
      @click="onFollow"
      :loading="loading"
      class="follow-btn"
      round
      size="small"
      >已关注</van-button
    >
    <van-button
      v-else
      @click="onFollow"
      :loading="loading"
      class="follow-btn"
      type="info"
      color="#3296fa"
      round
      size="small"
      icon="plus"
      >关注</van-button
    >
</template>

<script>
import { addFollow, deleteFollow } from '@/api/login' // 导入关注未关注的请求
export default {
  name: 'FollowUser',
  data () {
    return {
      loading: false // 是否显示加载
    }
  },
  props: {
    // 这是布尔值
    isFollowed: {
      type: Boolean,
      required: true
    },
    // 这是用户id
    autId: {
      type: [String, Number, Object],
      required: true
    }
  },
  methods: {
    // 点击按钮关注未关注
    async onFollow () {
      try {
        // // 如果没有登录，就不允许操作(不要这东西,没用,下面写了401判断)
        // if (!this.$store.state.user) return this.$toast('请登录！')
        // 开启按钮的 loading 状态
        this.loading = true
        // 如果已关注，则取消关注
        const authorId = this.autId
        if (this.isFollowed) {
          // 取消关注
          await deleteFollow(authorId)
        } else {
          // 否则添加关注
          await addFollow(authorId)
        }

        // 更新视图
        this.$emit('update:isFollowed', !this.isFollowed)
        // this.article.is_followed = !this.article.is_followed
      } catch (err) {
        if (err && err.response.status === 400) {
          this.$toast('你不能关注自己')
        } else if (err && err.response.status === 401) {
          this.$router.push('/login')
        } else {
          this.$toast.fail('操作失败')
        }
      }
      // 视图更新完加载动画关了
      this.loading = false
    }
  }
}
</script>

<style scoped lang="less"></style>
