<template>
  <div class="login-box"
  v-loading="loading"
  element-loading-text="加载中"
  element-loading-spinner="el-icon-loading"
  >
  </div>
</template>

<script>

export default {
  name: 'Login',
  props: [],
  data () {
    return {
      loading: true,

    };
  },
  methods: {

  },
  mounted () {
  },
  async created () {
  },
};
</script>

<style lang="scss" scoped>
.login-box{
  .error-box{
    height: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    img{
      margin-bottom:20px;
    }
  }
  background: #f6f6f6;
  height:100vh;
  .error{
    width: 200px;
    height: 200px;
  }
}

</style>
<style lang="scss">
.login-box{
  .el-icon-loading{
   font-size: 40px;
  }
  .el-loading-text{
    font-size: 60px;
  }
}
</style>
