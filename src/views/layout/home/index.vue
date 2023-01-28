<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button
        class="search-btn"
        slot="title"
        type="info"
        size="small"
        round
        icon="search"
        to="/search"
        >搜索</van-button
      >
    </van-nav-bar>
    <!-- /导航栏 -->
    <!-- TAG频道列表 -->
    <van-tabs class="channel-tabs" v-model="active" swipeable animated border>
      <van-tab
        v-for="channel in channels"
        :key="channel.id"
        :title="channel.name"
      >
        <!-- TAG频道的文章列表组件 -->
        <ArticleList :channel="channel"></ArticleList>
        <!-- /频道的文章列表组件 -->
      </van-tab>
      <!-- 右侧自定义内容 -->
      <!-- 占位元素 -->
      <div slot="nav-right" class="placeholder"></div>
      <!-- 右侧按钮 -->
      <div
        slot="nav-right"
        class="hamburger-btn"
        @click="isChannelEditShow = true"
      >
        <i class="toutiao toutiao-gengduo"></i>
      </div>
    </van-tabs>
    <!-- /频道列表 -->
    <!-- TAG频道编辑弹出层 -->
    <van-popup
      v-model="isChannelEditShow"
      closeable
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <!-- 频道编辑内容组件 -->
      <ChannelEdit
        :myChannels="channels"
        :active.sync="active"
        :isShow.sync="isChannelEditShow"
        @onAddChannel="onAddChannel"
        @deleteChannel="deleteChannel"
      ></ChannelEdit>
    </van-popup>
    <!-- /频道编辑弹出层 -->
  </div>
</template>

<script>
// 导入获取频道列表方法
import { getUserChannels } from '@/api/login'
// 导入频道列表组件
import ArticleList from './components/article-list.vue'
// 导入频道编辑内容组件
import ChannelEdit from './components/channel-edit.vue'
// 导入本地存储
import { getItem } from '@/utils/storage'
// 导入vueX的映射函数
import { mapState } from 'vuex'
export default {
  name: 'HomeIndex',
  props: {},
  data () {
    return {
      active: 0,
      channels: [], // 频道列表
      isChannelEditShow: false // 编辑弹出层显示状态
    }
  },
  computed: {
    // 辅助函数
    ...mapState(['user'])
  },
  watch: {},
  created () {
    this.loadChannels()
  },
  mounted () {},
  methods: {
    async loadChannels () {
      try {
        // 发请求
        const { data } = await getUserChannels()
        // 成功赋值
        this.channels = data.data.channels
        // 非登录状态下:1.用户首次使用,本地没数据,拿默认频道数据 2.用户本地存过数据了,渲染数据
        if (!this.user && getItem('TOUTIAO_CHANNELS')) {
          // 如果本地存储有数据,把数据给channels
          this.channels = getItem('TOUTIAO_CHANNELS')
        }
      } catch (err) {
        // 失败处理
        this.$toast('获取频道数据失败')
      }
    },
    // 子传父,更新子组件传递的数据
    onAddChannel (obj) {
      this.channels.push(obj)
    },
    // 子传父,删除对应数据
    deleteChannel (index) {
      // 删
      this.channels.splice(index, 1)
    }
  },
  components: { ArticleList, ChannelEdit }
}
</script>

<style scoped lang="less">
// 坑:如果想修改子组件的固有选择器的样式,加/deep/即可,他叫深度选择器
.home-container {
  padding-top: 174px;
  padding-bottom: 100px;
  /deep/ .van-nav-bar__title {
    max-width: unset;
  }
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }
  //二次添加的
  /deep/ .channel-tabs {
    .van-tabs__wrap {
      position: fixed;
      top: 92px;
      z-index: 1;
      left: 0;
      right: 0;
      height: 82px;
    }

    .van-tab {
      border-right: 1px solid #edeff3;
      min-width: 200px;
      font-size: 30px;
      color: #777777;
    }

    .van-tab--active {
      color: #333333;
    }

    .van-tabs__nav {
      padding-bottom: 0;
    }

    .van-tabs__line {
      bottom: 8px;
      width: 31px !important;
      height: 6px;
      background-color: #3296fa;
    }

    .placeholder {
      flex-shrink: 0;
      width: 66px;
      height: 82px;
    }

    .hamburger-btn {
      position: fixed;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 66px;
      height: 82px;
      background-color: #fff;
      background-color: rgba(255, 255, 255, 0.902);
      i.toutiao {
        font-size: 33px;
      }
      &:before {
        content: "";
        position: absolute;
        left: 0;
        width: 1px;
        height: 58px;
        background-image: url(~@/assets/gradient-gray-line.png);
        background-size: contain;
      }
    }
  }
}
</style>
