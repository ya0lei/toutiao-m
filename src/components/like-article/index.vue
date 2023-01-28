// TAG:一键三连:点赞
<template>
  <van-button @click="onLike" :loading="loading">
    <van-icon
      slot="icon"
      color="#777"
      :name="value === 1 ? 'good-job' : 'good-job-o'"
      :style="{ color: value ? 'orange' : '' }"
    />
  </van-button>
</template>

<script>
import { addLike, deleteLike } from '@/api/article'
export default {
  name: 'LikeArticle',
  data () {
    return {
      loading: false // 加载状态
    }
  },
  props: {
    // 点赞状态
    value: {
      type: [Number],
      required: true
    },
    // 文章id
    artId: {
      type: [Number, String],
      required: true
    }
  },
  methods: {
    async onLike () {
      try {
        // 先打开loading
        this.loading = true
        if (this.value === 1) {
          // 取消收藏
          await deleteLike(this.artId)
          this.$emit('update:value', 0)
          this.$toast.success('取消点赞成功')
        } else {
          // 收藏
          await addLike(this.artId)
          this.$toast.success('点赞成功')
          // 触发父组件的value值修改
          this.$emit('update:value', 1)
        }
      } catch (err) {
        this.$toast.fail('操作失败')
      }
      // 结束把loading关了
      this.loading = false
    }
  },
  created () {}
}
</script>

<style></style>
