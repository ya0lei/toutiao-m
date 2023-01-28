// postcss.config.js
// 这个文件可以将px自动转为rem,坑:行内的不可以转
module.exports = {
  plugins: {
    // postcss-pxtorem 插件的版本需要 >= 5.0.0
    'postcss-pxtorem': {
      rootValue ({ file }) {
        // 如果是vant的就按照375 尺寸， 如果是其他的就是按照750
        return file.indexOf('vant') !== -1 ? 37.5 : 75 // rootValue 的值一般是 设计稿  1/10
      },
      propList: ['*'],
      // 配置不要转换的样式资源
      exclude: 'github-markdown' // 增加这一句！
    }
  }
}
