// TAG:一键三连:收藏
<template>
  <div>
    <van-button :loading="loading" @click="onCollect">
      <van-icon
        slot="icon"
        color="#777"
        :name="value ? 'star' : 'star-o'"
        :style="{ color: value ? 'orange' : '' }"
      ></van-icon>
    </van-button>
  </div>
</template>

<script>
import { addCollect, deleteCollect } from '@/api/article'
export default {
  name: 'CollectArticle',
  data () {
    return {
      loading: false
    }
  },
  props: {
    // 收藏状态
    value: {
      type: Boolean,
      required: true
    },
    // 文章id
    artId: {
      type: [Number, String],
      required: true
    }
  },
  methods: {
    async onCollect () {
      try {
        // 先打开loading
        this.loading = true
        if (this.value) {
          // 取消收藏
          await deleteCollect(this.artId)
          this.$toast.success('取消收藏成功')
        } else {
          // 收藏
          await addCollect(this.artId)
          this.$toast.success('收藏成功')
        }
        // 触发父组件的value值修改
        this.$emit('update:value', !this.value)
      } catch (err) {
        this.$toast.fail('操作失败')
      }
      // 结束把loading关了
      this.loading = false
    }
  }
}
</script>

<style scoped lang="less">
// .collected {
//   color: orange !important;
// }
</style>
