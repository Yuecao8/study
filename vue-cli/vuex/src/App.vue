<template>
  <div id="app">
      <!-- <mt-header title="凑热闹">
        <router-link to="/" slot="left">
          +<mt-button @click="handleClose">话题</mt-button>
        </router-link>
        <mt-button icon="more" slot="right"></mt-button>
      </mt-header> -->

      <!-- <mt-swipe :show-indicators="true" :auto="4000">
        <mt-swipe-item>1</mt-swipe-item>
        <mt-swipe-item>2</mt-swipe-item>
        <mt-swipe-item>3</mt-swipe-item>
      </mt-swipe> -->
      
      <router-view></router-view>


      <!-- <mt-tabbar v-model="slected">
        <mt-tab-item id="tab1">
          <img slot="icon" src="./assets/icon_01.png">
          首页
        </mt-tab-item>
        <mt-tab-item id="tab2">
          <img slot="icon" src="./assets/icon_02.png">
          直播
        </mt-tab-item>
        <mt-tab-item id="tab3">
          <img slot="icon" src="./assets/icon_03.png">
          会员
        </mt-tab-item>
        <mt-tab-item id="tab4">
          <img slot="icon" src="./assets/icon_04.png">
          凑热闹
        </mt-tab-item>
      </mt-tabbar> -->
      <!-- <router-link to='HelloWorld'>123</router-link> -->
  </div>
</template>

<script>
export default {
  name: "App",
  data () {
    return {
      slected: ''
    }
  },
  methods: {
    handleClose() {
      this.$toast("Hello world!");
    },
    goDetail(){
      console.log(111)
    }
  }
};
</script>

<style lang="less">
    body,
    html {
      margin: 0;
      padding: 0;
    }
    .mint-header {
      margin: 0;
      padding: 0 5px;
      a{
        text-decoration: none;
      }
    }
   
    .mint-swipe{
      height: 100px;
      .mint-swipe-item{
        background-color: rgb(132, 1, 255);
        text-align: center;
      }
    }
  #app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>

