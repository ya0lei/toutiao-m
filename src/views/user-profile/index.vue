//TAG:用户信息编辑
<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- /导航栏 -->

    <!-- 个人信息 -->
    <van-cell
      class="avatar-cell"
      title="头像"
      is-link
      center
      @click="$refs.file.click()"
    >
      <van-image class="avatar" fit="cover" round :src="user.photo" />
    </van-cell>
    <van-cell
      title="昵称"
      :value="user.name"
      is-link
      @click="isUpdateNameShow = true"
    />
    <van-cell
      title="性别"
      :value="user.gender === 0 ? '男' : '女'"
      is-link
      @click="isUpdateGenderShow = true"
    />
    <van-cell
      title="生日"
      :value="user.birthday"
      is-link
      @click="isUpdateBirthdayShow = true"
    />
    <!-- 个人信息 -->
    <!-- 隐藏的获取文件的input-->
    <input type="file" hidden ref="file" @change="onFileChange" />
    <!-- /隐藏的获取文件的input-->
    <!-- 编辑昵称 -->
    <van-popup
      v-model="isUpdateNameShow"
      style="height: 100%"
      position="bottom"
    >
      <update-name
        @close="isUpdateNameShow = false"
        v-if="isUpdateNameShow"
        :name.sync="user.name"
      />
    </van-popup>
    <!-- /编辑昵称 -->
    <!-- 编辑性别 -->
    <van-popup v-model="isUpdateGenderShow" position="bottom">
      <UpdateGender
        @close="isUpdateGenderShow = false"
        v-if="isUpdateGenderShow"
        :gender.sync="user.gender"
      ></UpdateGender>
    </van-popup>
    <!-- /编辑性别 -->
    <!-- 编辑生日 -->
    <van-popup v-model="isUpdateBirthdayShow" position="bottom">
      <UpdateBirthday
        v-if="isUpdateBirthdayShow"
        :birthday.sync="user.birthday"
        @close="isUpdateBirthdayShow = false"
      ></UpdateBirthday>
    </van-popup>
    <!-- /编辑生日 -->
    <!-- 编辑头像 -->
    <van-popup
      v-model="isUpdatePhotoShow"
      position="bottom"
      style="height: 100%"
    >
      <update-photo
        v-if="isUpdatePhotoShow"
        :img="img"
        @close="isUpdatePhotoShow = false"
      />
    </van-popup>
    <!-- /编辑头像 -->
  </div>
</template>

<script>
import { getUserProfile } from '@/api/login' // 导入获取当前登录用户的个人资料请求
import UpdateName from './components/update-name' // 修改name
import UpdateGender from './components/update-gender' // 修改sex
import UpdateBirthday from './components/update-birthday.vue' // 修改生日
import UpdatePhoto from './components/update-photo' // 修改头像
export default {
  name: 'UserProfile',
  components: { UpdateName, UpdateGender, UpdateBirthday, UpdatePhoto },
  props: {},
  data () {
    return {
      user: {}, // 个人信息
      isUpdateNameShow: false, // 修改昵称弹层
      isUpdateGenderShow: false, // 修改性别弹出层
      isUpdateBirthdayShow: false, // 修改生日
      isUpdatePhotoShow: false, // 修改头像
      img: null // 预览的图片
    }
  },
  computed: {},
  watch: {},
  created () {
    // 获取当前登录用户的个人资料
    this.loadUserProfile()
  },
  mounted () {},
  methods: {
    // 获取当前登录用户的个人资料的方法
    async loadUserProfile () {
      try {
        const { data } = await getUserProfile()
        this.user = data.data
      } catch (err) {
        this.$toast('数据获取失败')
      }
    },
    // 注册上传文件事件
    onFileChange () {
      // 获取文件
      const file = this.$refs.file.files[0]
      // 创建文件的bob地址
      const url = URL.createObjectURL(file)
      // 把url地址赋值给imgSrc
      this.img = url
      // 让弹出层显现
      this.isUpdatePhotoShow = true
      // 清空file文件,否则下次上传相同的文件不会弹框
      this.$refs.file.value = ''
    }
  }
}
</script>

<style scoped lang="less">
.user-profile {
  .avatar-cell {
    .van-cell__value {
      display: flex;
      flex-direction: row-reverse;
    }
    .avatar {
      width: 60px;
      height: 60px;
    }
  }
  .van-popup {
    background-color: #f5f7f9;
  }
}
</style>
