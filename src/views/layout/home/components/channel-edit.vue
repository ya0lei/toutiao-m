<template>
  <div class="channel-edit">
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <!-- 点击按钮编辑或完成 -->
      <van-button
        @click="isEdit = !isEdit"
        class="edit-btn"
        type="danger"
        plain
        round
        size="mini"
        >{{ isEdit ? "完成" : "编辑" }}</van-button
      >
    </van-cell>
    <van-grid class="my-grid" :gutter="10">
      <!-- 点击父传子 -->
      <van-grid-item
        @click="onMyChannelClick(channel, index)"
        class="grid-item"
        v-for="(channel, index) in myChannels"
        :key="index"
      >
        <!-- 每一项的小X号 -->
        <!-- 推荐没X号,第一种写法 -->
        <!-- <van-icon v-show="isEdit && !fixedChannels.includes(channel.id)" slot="icon" name="clear"></van-icon> -->
        <!-- 推荐没X号,第二种写法 -->
        <van-icon
          v-show="isEdit && fixedChannels.indexOf(channel.id) == -1"
          slot="icon"
          name="clear"
        ></van-icon>
        <!-- 给对应文字设置高亮 -->
        <span class="text" :class="{ active: index == active }" slot="text">{{
          channel.name
        }}</span>
      </van-grid-item>
    </van-grid>

    <!-- 频道推荐 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <van-grid class="recommend-grid" :gutter="10">
      <van-grid-item
        v-for="(obj, index) in recommentChannels"
        :key="index"
        class="grid-item"
        icon="plus"
        :text="obj.name"
        @click="onAddChannel(obj)"
      >
      </van-grid-item>
    </van-grid>
    <!-- /频道推荐 -->
  </div>
</template>

<script>
// 导入请求,获取所有频道列表,添加用户频道
import {
  getAllChannels,
  addUserChannel,
  deleteUserChannel
} from '@/api/channel'
// 导入lodash
import { differenceBy } from 'lodash'

// 导入本地存储方法
import { setItem } from '@/utils/storage'
export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    // 接受数据

    myChannels: {
      type: Array,
      required: true
    },
    // 接受父组件的active,设置高亮
    active: {
      type: Number,
      required: true
    },
    // 接受父组件传递过来的控制弹层的变量
    isShow: {
      type: Boolean
    }
  },
  data () {
    return {
      allChannels: [], // 所有频道列表
      isEdit: false, // 小X号是否显示
      fixedChannels: [0] // 不出现小X号的选项
    }
  },
  computed: {
    // 全部频道 - 我的频道 = 利用插件数组去重
    recommentChannels () {
      return differenceBy(this.allChannels, this.myChannels, 'name')
    }
  },
  watch: {},
  created () {
    // 调用获取所有频道列表的方法
    this.loadAllChannels()
  },
  mounted () {},
  methods: {
    // 请求数据,获取所有频道列表

    async loadAllChannels () {
      try {
        const { data } = await getAllChannels()
        this.allChannels = data.data.channels
      } catch (err) {
        console.log(err)
        this.toast('获取所有频道列表失败')
      }
    },
    // 添加频道功能
    async onAddChannel (obj) {
      // this.myChannels.push(obj)
      this.$emit('onAddChannel', obj)
      // 数据持久化处理

      // 已登录,存线上
      if (this.user) {
        // 发请求,添加数据
        try {
          await addUserChannel({
            id: obj.id,
            seq: this.myChannels.length
          })
        } catch {
          this.$toast('数据获取失败')
        }
      } else {
        // 未登录,存本地
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },
    // 删除/编辑功能
    async onMyChannelClick (channel, index) {
      if (this.isEdit) {
        // 删前判断,如果是fixedChannels数组中保存的id的元素不删
        if (this.fixedChannels.indexOf(channel.id) !== -1) {
          return
        }
        // 删前判断,如果index<=active,删完让active-1
        if (index <= this.active) {
          this.$emit('update:active', this.active - 1)
        }
        // 编辑状态,执行删除我的频道
        this.$emit('deleteChannel', channel, index)
        // this.myChannels.splice(index, 1)
        // 登陆状态
        // 已登录,存线上
        if (this.user) {
          // 发请求,添加数据
          try {
            await deleteUserChannel(channel.id)
          } catch {
            this.$toast('数据获取失败')
          }
        } else {
          // 未登录,存本地
          setItem('TOUTIAO_CHANNELS', this.myChannels)
        }
      } else {
        // 非编辑状态,执行切换频道
        // 切换父组件的active值
        this.$emit('update:active', index)
        // 关闭弹层
        // 这种写法强制更新,相当于子传父
        this.$emit('update:isShow', false)
      }
    }
  }
}
</script>

<style scoped lang="less">
.channel-edit {
  padding: 85px 0;
  .title-text {
    font-size: 32px;
    color: #333333;
  }

  .edit-btn {
    // 先注释掉,以后再解开
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }

  /deep/ .grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }
      .active {
        color: red;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }

  /deep/ .my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }

  /deep/ .recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
