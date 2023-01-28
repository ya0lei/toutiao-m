<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <!--
          坑: 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮
         -->
    <form class="search-form" action="/">
      <!-- @回车,@回退,@焦点 -->
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        background="#3296fa"
        @search="onSearch"
        @cancel="onCancel"
        @focus="searchText.length === 0 ? (active = 0) : (active = 2)"
      />
    </form>
    <!-- /搜索栏 -->

    <!-- 搜索结果 ,ajax,回车触发-->
    <search-result v-if="active === 1" :search-text="searchText" />
    <!-- /搜索结果 -->

    <!-- 联想建议 ,ajax,键盘弹起触发-->
    <search-suggestion
      v-else-if="active === 2"
      :searchText="searchText"
      @search="onSearch"
    />
    <!-- /联想建议 -->

    <!-- 搜索历史记录,本地存储 -->
    <search-history
      v-else-if="active === 0"
      :search-histories="searchHistories"
      @delHistory="delHistory"
      @delAllHistories="searchHistories = []"
      @search="onSearch"
    />
    <!-- /搜索历史记录 -->
  </div>
</template>
<script>
import SearchResult from './components/search-result'
import SearchHistory from './components/search-history'
import SearchSuggestion from './components/search-suggestion'
// 导入本地存储
import { getItem, setItem } from '@/utils/storage'
export default {
  name: 'SearchPage',
  components: {
    SearchResult,
    SearchHistory,
    SearchSuggestion
  },
  props: {},
  data () {
    return {
      searchText: '', // 绑定输入框变量
      active: 0, // 判断哪个组件显示,默认显示历史记录
      searchHistories: getItem('TOUTIAO_SEARCH_HISTORIES') || [] // 历史记录的数据
    }
  },
  computed: {},
  watch: {
    // 监听输入框内容
    searchText (newV) {
      if (newV.length === 0) {
        // 显示历史记录
        this.active = 0
      } else {
        // 显示联想建议
        this.active = 2
      }
    },
    // 数据进行本地存储
    searchHistories (newV) {
      setItem('TOUTIAO_SEARCH_HISTORIES', newV)
    }
  },
  created () {},
  methods: {
    // 回车搜索
    onSearch (val) {
      val = val.trim()
      this.searchText = val // 重新赋值,让搜索结果val,给searchText,searchText又给搜索结果组件
      // 历史记录,要求:1.不可重复 2.每一次的搜索记录放在数组的最前面
      // 1.有就拿索引号删,没有直接添加至第一位
      const index = this.searchHistories.indexOf(val)
      // 2.删掉旧的,新的放数组最前面
      if (index !== -1) {
        // 删
        this.searchHistories.splice(index, 1)
      }
      // 存第一位
      if (this.searchText !== '') {
        this.searchHistories.unshift(val)
      }

      // console.log(val) // 输入的值
      // 回车显示搜索结果,
      // 坑:并做了一个优化,不要让他立即触发
      this.$nextTick(() => {
        this.active = 1
      })
    },
    onCancel () {
      this.$router.back()
    },
    // 删除单个历史记录
    delHistory (index) {
      this.searchHistories.splice(index, 1)
    }
  }
}
</script>
<style scoped lang="less">
.search-container {
  padding-top: 108px;
  .van-search__action {
    color: #fff;
  }
  .search-form {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>
