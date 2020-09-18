<template>
  <div class="componentsB">
      <P class="title">组件A</P>
      <P class="titleName">餐馆名称：{{resturantName}}</P>
      <div>
          <!-- 点击修改 为 B 餐馆 -->
          <slot  name='ceshi' :text="text"></slot>
          <button class="btn" @click="modifyBName('A餐馆')">修改为A餐馆</button>
      </div>
      <div class="marTop">
          <button class="btn" @click="trunToA">跳转到B页面</button>
      </div>
      <h2>我的名字是{{currentName}}</h2>
      <button @click="changeName('大花')">点击切换名字</button>
  </div>
</template>
 
<script>
import {mapActions, mapGetters} from 'vuex'
export default {
  name: 'B',
  data () {
    return {
        text:'solt子组件的值'
    }
  },
  props:["checked"],
  methods:{
      ...mapActions( // 语法糖
          ['modifyBName','changeName'] // 相当于this.$store.dispatch('modifyName'),提交这个方法
      ),
      trunToA () {
          this.$router.push({path: '/vuexB'}) // 路由跳转到A
      }
  },
  computed: {
      ...mapGetters(['resturantName','currentName']) // 动态计算属性，相当于this.$store.getters.resturantName
  }
}
</script>
 
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .title,.titleName{
        color: red;
        font-size: 20px;
    }
    .btn{
        width: 160px;
        height: 40px;
        background-color: red;
        border: none;
        outline: none;
        color: #ffffff;
        border-radius: 4px;
    }
    .marTop{
        margin-top: 20px;
    }
</style>