// TAG:搜索联想建议组件
<template>
  <div class="search-suggestion">
    <!-- v-show="suggestion"不行,正则替换会有问题,冥冥中自有天意 -->
    <van-cell
      v-for="(suggestion, index) in suggestions"
      :key="index"
      icon="search"
      @click="$emit('search',suggestion)"
    >
      <!-- 因为需要用v-html,必须使用插槽 -->
      <div slot="title" v-html="highlight(suggestion)"></div
    ></van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search'
// 导入鲁大师
import { debounce } from 'lodash'
export default {
  name: 'SearchSuggestion',
  components: {},
  props: {
    //   接受父组件传递过来输入框内容
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      suggestions: [] // 联想建议数据列表
    }
  },
  computed: {},
  watch: {
    //   监听父组件传递过来的输入框文本
    searchText: {
      // 利用鲁大师做个防抖
      handler: debounce(function (newV) {
        this.loadSearchSuggestions(newV)
        console.log(newV)
      }, 500),
      // 组件刚被v-if创建立即触发
      immediate: true
    }
  },
  created () {},
  mounted () {},
  methods: {
    // 定义获取数据方法
    async loadSearchSuggestions (q) {
      try {
        const { data } = await getSearchSuggestions(q)
        // 后端没数据的时候,传了一个null,我们要把它改成空[]
        if (data.data.options[0] == null) return (this.suggestions = [])
        this.suggestions = data.data.options
      } catch (err) {
        this.$toast('数据获取失败，请稍后重试')
      }
    },
    // 匹配词高亮
    highlight (suggestion) {
      const highlightStr = `<span style="color:blue">${this.searchText}</span>`
      //   正则表达式//的写法,中间的内容会被当做匹配字符,而不是变量,所以我们这里需要new RegExp
      // new RegExp,
      // 参数1:匹配模式字符串,它会根据这个字符串创建正则对象
      // 参数2:匹配模式,写在字符中
      const reg = new RegExp(this.searchText, 'gi')
      //   字符替换
      return suggestion.replace(reg, highlightStr)
      //   return 123
    }
  }
}
</script>

<style scoped lang="less"></style>
