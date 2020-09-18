<template>
  <div class="hello">
    <h1>组件1</h1>
    <h2>也不知道写什么</h2>
    <ul>
      <li>{{message}}</li>
      <li></li>
    </ul>
    <p @click="csl()">点击</p>
    <router-link to="first">去第二个</router-link>
    <router-link to='vudxDemo'>shibushisha </router-link>
  </div>
</template>

<script>
import first from './first'
export default {
  name: 'HelloWorld',
  data () {
    return {
      message: '这是父组件插值表达式的内容',
      // child:'子组件的数据'
    }
  },
  components:{
    first
  },
  
  methods:{
    csl(){
      console.log(111)
    }
  }
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped >
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
  li {
    display: inline-block;
    margin: 0 10px;
  }
}


</style>




