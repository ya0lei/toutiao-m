// 登录接口
// 导入axios
import request from '@/utils/request'
// 导入vueX数据
// 按需导出登录
export const login = (obj) =>
  request({
    url: '/v1_0/authorizations',
    method: 'post',
    data: obj
  })
// 获取短信验证码
export const sendSms = (mobile) =>
  request({
    url: `/v1_0/sms/codes/${mobile}`,
    method: 'GET'
    //   data: obj
  })
// 获取用户的基本信息
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/v1_0/user'
    // 发送请求头数据
  })
}

// 获取频道列表
export const getUserChannels = () => {
  return request({
    method: 'GET',
    url: '/v1_0/user/channels'
  })
}

// 添加关注
export const addFollow = (userId) => {
  return request({
    method: 'POST',
    url: '/v1_0/user/followings',
    data: {
      target: userId
    }
  })
}

// 取消关注
export const deleteFollow = (userId) => {
  return request({
    method: 'DELETE',
    url: `/v1_0/user/followings/${userId}`
  })
}

// 获取当前登录用户的个人资料

export const getUserProfile = (target) => {
  return request({
    method: 'GET',
    url: '/v1_0/user/profile'
  })
}

// 更新用户资料

export const updateUserProfile = (data) => {
  return request({
    method: 'PATCH',
    url: '/v1_0/user/profile',
    data
  })
}

// 更新用户照片资料

export const updateUserPhoto = (data) => {
  return request({
    method: 'PATCH',
    url: '/v1_0/user/photo',
    data
  })
}
