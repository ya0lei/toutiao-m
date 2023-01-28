// TAG:搜索历史组件
<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div v-show="isDeleteShow">
        <span @click="$emit('delAllHistories')">全部删除</span>&nbsp;&nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </div>

      <van-icon
        v-show="!isDeleteShow"
        name="delete"
        @click="isDeleteShow = true"
      />
    </van-cell>
    <!-- 把父组件传来的历史记录数组遍历下 -->
    <van-cell
      :title="item"
      v-for="(item, index) in searchHistories"
      :key="index"
      @click="onSearchItemClick(item, index)"
    >
      <van-icon name="close" v-show="isDeleteShow" />
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  components: {},
  props: {
    //   父组件传来的历史记录
    searchHistories: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isDeleteShow: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    // 历史记录的点击事件
    onSearchItemClick (item, index) {
      // 如果有小X号，点击则执行删除操作
      if (this.isDeleteShow) {
        // 删除单个历史记录
        this.$emit('delHistory', index)
      } else {
        // 否则点击执行搜索操作
        this.$emit('search', item)
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
