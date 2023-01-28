<template>
  <div class="one_page">
      <button @click="$router.go(-1)">返回上一级</button><br>
      <p>我是onePage组件</p>
  </div>
</template>

<script>
export default {
  name: 'OnePage',
  data () {
    return {}
  }
}
</script>

<style scoped lang="less">
.one_page {
  background-color: #ccc;
}
</style>
