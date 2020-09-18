<template>
  <div class="componentsA">
      <slot name='ceshi'></slot>
      <P class="title">组件B</P>
      <P class="titleName">餐馆名称：{{resturantName}}</P>
      <div>
            <!-- 点击修改 为 B 餐馆 -->
          <button class="btn" @click="modifyAName('B餐馆')">修改为B餐馆</button>
      </div>
      <div class="marTop">
          <button class="btn" @click="trunToB">跳转到A页面</button>
      </div>
      <h2>B组件的名字是{{currentName}}</h2>
  </div>
</template>
 
<script>
import {mapActions, mapGetters} from 'vuex'
export default {
  name: 'A',
  data () {
    return {
    }
  },
  created() {
    //主任务
    console.log(1);
    // 宏
    setTimeout(() => {
      console.log(2);
      process.nextTick(() => {
        console.log(3);
      });
      new Promise((resolve) => {
        console.log(4);
        resolve();
      }).then(() => {
        console.log(5);
      });
    });
    // 异步
    new Promise((resolve) => {
      console.log(7);
      resolve();
    }).then(() => {
    //   微
      console.log(8);
    });
    process.nextTick(() => {
      console.log(6);
    });
    setTimeout(() => {
      console.log(9);
      process.nextTick(() => {
        console.log(10);
      });
      new Promise((resolve) => {
        console.log(11);
        resolve();
      }).then(() => {
        console.log(12);
      });
    });
  },
  methods:{
      ...mapActions( // 语法糖
          ['modifyAName'] // 相当于this.$store.dispatch('modifyName'),提交这个方法
      ),
    //   modifyAName() {
    //       return this.$store.dispatch('modifyName')
    //   },
      trunToB () {
          this.$router.push({path: '/vuexA'}) // 路由跳转到B
      }
  },
  computed: {
    //   resturantName() {
    //       return this.$store.getters.resturantName
    //   },
      ...mapGetters(['resturantName','currentName']) // 动态计算属性，相当于this.$store.getters.resturantName
  }
}
</script>
 
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .title,.titleName{
        color: blue;
        font-size: 20px;
    }
    .btn{
        width: 160px;
        height: 40px;
        background-color: blue;
        border: none;
        outline: none;
        color: #ffffff;
        border-radius: 4px;
    }
    .marTop{
        margin-top: 20px;
    }
</style>
