<template>
  <div class="ce-shi">
    <button @click="$router.go(-1)">点我返回上一页</button>
    <hr />
    <span> 我是一只小小小小鸟 </span>
    <span>{{ ceshiId }}</span><br>
    <!-- <router-link to="/qa"></router-link>
      <router-view></router-view> -->
      <router-link to="/onePage">点我去onePage</router-link>
      <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'CeShi',

  props: {
    ceshiId: {
      type: [String, Number]
    }
  }
}
</script>

<style scoped lang="less">
.ce-shi{
background-color: rgb(233, 187, 187);}
</style>
