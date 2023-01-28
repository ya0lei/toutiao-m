<template>
  <div class="qa-container">
    <h1>问答</h1>
    <!-- <router-link to="/ceshi">点我跳转</router-link> -->
    <router-link :to="{ name: 'ceshi', params: { ceshiId: ceshi_id } }">
      点击跳转并传参</router-link
    >
    <!-- <router-link to="/ceshi'哈哈哈'></router-link> -->

    <router-view />
  </div>
</template>
<script>
export default {
  name: 'QaPage',
  components: {},
  props: {},
  data () {
    return {
      ceshi_id: '我是一个动态的值'
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {}
}
</script>
<style scoped lang="less"></style>
