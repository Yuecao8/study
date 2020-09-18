<template>
<div class="login-box">
   <div class="flex-v-center error-box">
      <img src="~@/assets/image/error.png" alt="" class="error">
      <div class="error-font">非常抱歉！您访问的页面失联啦！</div>
    </div>
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
    // img{
    //   margin-bottom:20px;
    // }
  }
  background: #f6f6f6;
  height:100vh;
  .error{
    width: 462px;
    height: 354px;
  }
  .error-font {
      font-size: 20px;
      margin-top: -70px;
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
