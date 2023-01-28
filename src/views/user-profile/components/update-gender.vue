//TAG:编辑性别组件
<template>
  <div class="update-gender">
    <van-picker
      show-toolbar
      title="标题"
      :columns="columns"
      :default-index="gender"
      @cancel="$emit('close')"
      @confirm="onConfirm"
      @change="Change"
    />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/login'
export default {
  name: 'UpdateGender',
  components: {},
  props: {
    gender: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      columns: ['男', '女'],
      localGender: this.gender // 当前性别
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    // change发生变化的时候
    Change (picker, value, index) {
      this.localGender = index
    },
    // 点击确定发送ajax
    async onConfirm () {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 持续展示
      })

      try {
        await updateUserProfile({
          gender: this.localGender
        })

        // 更新视图
        this.$emit('update:gender', this.localGender)

        // 关闭弹层
        this.$emit('close')

        // 提示成功
        this.$toast.success('更新成功')
      } catch (err) {
        this.$toast.fail('更新失败')
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
