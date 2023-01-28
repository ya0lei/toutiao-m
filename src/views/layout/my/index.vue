// TODO:我的页面
<template>
  <div class="my-container">
    <!-- TAG已登录 -->
    <div class="header user-info" v-if="user">
      <!-- 用户信息 -->
      <div class="base-info">
        <div class="left">
          <van-image class="avatar" round fit="cover" :src="userInfo.photo" />
          <span class="name">userInfo.name</span>
        </div>
        <div class="right">
          <!-- <van-button size="mini" round>编辑资料</van-button> -->
          <van-button size="mini" round to="/user/profile">编辑资料</van-button>
        </div>
      </div>
      <!-- 用户数据 -->
      <div class="data-stats">
        <div class="data-item">
          <span class="count">{{ userInfo.art_count }}</span>
          <span class="text">头条</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.follow_count }}</span>
          <span class="text">关注</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.fans_count }}</span>
          <span class="text">粉丝</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.like_count }}</span>
          <span class="text">喜欢</span>
        </div>
      </div>
    </div>
    <!-- TAG未登录 -->
    <div class="header not-login" v-else>
      <!-- 点击去登录 -->
      <div class="login-btn" @click="$router.push('/login')">
        <img class="mobile-img" src="@/assets/mobile.png" />
        <span class="text">登录&nbsp;/&nbsp;注册</span>
      </div>
    </div>

    <!-- TAG宫格导航 -->
    <van-grid class="grid-nav mb-9" :column-num="2" clickable>
      <van-grid-item class="grid-item">
        <i slot="icon" class="toutiao toutiao-shoucang"></i>
        <span slot="text" class="text">收藏</span>
      </van-grid-item>
      <van-grid-item class="grid-item">
        <i slot="icon" class="toutiao toutiao-lishi"></i>
        <span slot="text" class="text">历史</span>
      </van-grid-item>
    </van-grid>
    <!-- /宫格导航 -->
    <!-- TAG单元格导航 -->
    <van-cell title="消息通知" is-link />
    <van-cell class="mb-9" :title="userInfo.name" is-link />
    <van-cell
      v-if="user"
      class="logout-cell"
      clickable
      title="退出登录"
      @click="onLogout"
    />
  </div>
</template>

<script>
// 从vuex获取token
import { mapState, mapMutations } from 'vuex'
import { Dialog } from 'vant'
// 引入获取用户信息的方法
import { getUserInfo } from '@/api/login'
export default {
  name: 'MyPage',
  components: {},
  props: {},
  data () {
    return {
      // 保存用户基本信息
      userInfo: {}
    }
  },
  // 计算属性
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  created () {
    if (this.user) {
      this.loadUserInfo()
    }
  },
  mounted () {},
  methods: {
    // 映射mutations内的方法
    ...mapMutations(['setUser']),
    onLogout () {
      // 点击退出登录,弹出确认退出
      // 弹框组件
      Dialog.confirm({
        title: '确认退出吗?'
      })
        .then(() => {
          // on confirm
          this.setUser(null)
        })
        .catch(() => {
          // on cancel
        })
    },
    // 获取用户信息
    async loadUserInfo () {
      try {
        const { data } = await getUserInfo()
        // 存
        this.userInfo = data.data
      } catch (err) {
        //   失败请求
        if (err.response && err.response.status === 401) {
          this.$toast('登录失败,请重新登录')
          // 跳转登录页面
          this.$router.push('/login')
        } else {
          this.$toast('数据获取失败')
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.my-container {
  .header {
    height: 361px;
    background: url("~@/assets/banner.png");
    background-size: cover;
  }
  .not-login {
    display: flex;
    justify-content: center;
    align-items: center;
    .login-btn {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .mobile-img {
        width: 132px;
        height: 132px;
        margin-bottom: 15px;
      }
      .text {
        font-size: 28px;
        color: #fff;
      }
    }
  }
}
/*上面是其他样式*/
.user-info {
  .base-info {
    height: 231px;
    padding: 76px 32px 23px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      display: flex;
      align-items: center;
      .avatar {
        width: 132px;
        height: 132px;
        border: 4px solid #fff;
        margin-right: 23px;
      }
      .name {
        font-size: 30px;
        color: #fff;
      }
    }
  }
  .data-stats {
    display: flex;
    .data-item {
      height: 130px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #fff;
      .count {
        font-size: 36px;
      }
      .text {
        font-size: 23px;
      }
    }
  }
}
/*上面是其他样式*/
.grid-nav {
  .grid-item {
    height: 141px;
    i.toutiao {
      font-size: 45px;
    }
    .toutiao-shoucang {
      color: #eb5253;
    }
    .toutiao-lishi {
      color: #ff9d1d;
    }
    span.text {
      font-size: 28px;
    }
  }
}
// 三个单元格
.logout-cell {
  text-align: center;
  color: #d86262;
}
.mb-9 {
  margin-bottom: 9px;
}
</style>
