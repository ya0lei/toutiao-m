<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar title="登录" class="page-nav-bar" >
      <!-- 添加回退按钮 -->
      <!-- 回退字体图标 -->
      <van-icon name="cross" slot="left" @click="$router.go(-1)"></van-icon>
    </van-nav-bar>
    <!-- 登录表单 -->
    <van-form ref="loginForm" @submit="onSubmit">
      <van-field
        :rules="userFormRules.mobile"
        v-model="user.mobile"
        name="mobile"
        placeholder="请输入手机号"
        type="number"
        maxlength="11"
      >
        <!-- 插槽左侧字体图标-手机 -->
        <i slot="left-icon" class="toutiao toutiao-shouji"></i>
      </van-field>
      <van-field
        :rules="userFormRules.required"
        v-model="user.code"
        name="code"
        placeholder="请输入验证码"
        type="number"
        maxlength="6"
      >
        <!-- 插槽左侧字体图标-验证码-->
        <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
        <!-- 验证码倒计时 -->
        <van-count-down
          v-if="isCountDownShowing"
          :time="1000 * 5"
          format="ss 秒"
          @finish="isCountDownShowing = false"
          slot="button"
        />
        <!--增加发送按钮-->
        <!--这里注意，要加上native-type,否则也可以实现表单提交-->
        <van-button
          v-else
          slot="button"
          class="send-sms-btn"
          round
          size="small"
          native-type="button"
          type="default"
          @click="onSendSms"
        >
          发送验证码
        </van-button>
      </van-field>
      <div class="login-btn-wrap">
        <van-button block type="info" native-type="submit" class="login-btn"
          >登录</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
// 引入接口
import { login, sendSms } from '@/api/login'
// 引入vuex
import { mapMutations } from 'vuex'
export default {
  name: 'LoginPage',
  components: {},
  props: {},
  data () {
    return {
      // 是否展示倒计时
      isCountDownShowing: false,
      user: {
        mobile: '',
        code: ''
      },
      // 验证规则对象
      userFormRules: {
        mobile: [
          {
            required: true,
            message: '手机号不能为空'
          },
          {
            pattern: /^1[3|5|7|8]\d{9}$/,
            message: '手机号格式错误'
          }
        ],
        code: [
          {
            required: true,
            message: '验证码不能为空'
          },
          {
            pattern: /^\d{6}$/,
            message: '验证码格式错误'
          }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},

  methods: {
    // 映射vuex中的函数
    ...mapMutations(['setUser']),
    async onSubmit () {
      // 获取表单数据
      const user = this.user
      // 获取数据前给个加载中
      this.$toast.loading({
        duration: 0, // 持续时间，0表示持续展示不停止
        forbidClick: true, // 是否禁止背景点击
        message: '登录中...' // 提示消息

      })
      // 发送请求
      try {
        const { data } = await login(user)
        this.$toast.success('登陆成功', data)
        // 登陆成功回退上一次的页面
        this.$router.go(-1)
        // token存入vuex
        this.setUser(data.data)
      } catch (err) {
        if (err.response && err.response.status === 400) {
          this.$toast.fail('手机号或验证码错误')
        } else {
          this.$toast.fail('登录失败，请稍后重试', err)
        }
      }
    },
    async onSendSms () {
      // 1.校验手机号
      try {
        await this.$refs.loginForm.validate('mobile')
      } catch (err) {
        return console.log('验证失败', err)
      }

      // 2.验证通过,显示倒计时
      this.isCountDownShowing = true
      // 3.请求发送验证码
      try {
        await sendSms(this.user.mobile)
        this.$toast('发送成功')
      } catch (err) {
        // 发送失败,关闭定时器
        this.isCountDownShow = false
        if (err.response && err.response.status === 429) {
          this.$toast('发送太频繁了,请稍后重试')
        } else {
          this.$toast('发送失败,请稍后再试')
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  .toutiao {
    font-size: 37px;
  }
  .send-sms-btn {
    // width: 152px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 22px;
    color: #666;
  }
  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>
