<template>
  <div>
    bufyvhfjgjkgjgh
    <vuex-a>
      <div slot="ceshi" slot-scope="name" @click='getData(name.text)'>solt这是个啥 {{name.text}} </div>
    </vuex-a>
    <!-- <router-view/> -->

        <p>11111222</p>
        <p>11111222</p>
    <test2 >
        <p slot="section">我是插在section里面的</p>
        <h2>我是标题标签</h2>
    </test2>
    <router-link to="echartsDemo">echartsDemo</router-link>
  </div>
</template>
<script>
// import componentsA from '@/components/componentsA'
import vuexA from "../components/vuexA";
import vuexB from "../components/vuexB";
export default {
  name: "vudxDemo",
  components: {
    vuexA,
    vuexB,
    test2:{
      template:
      `<div class="contain">
        <header>我是头部</header>
        <section>
          我是底部
          <slot name="section"></slot>
        </section>
        <footer>
          我是底部
          <slot></slot>
        </footer>
      </div>`,
    }
  },
  data() {
    return {
      msg: ""
    };
  },
  methods:{
    getData(item){
      console.log(item)
    }
  }
};
</script>
<style lang='scss' scoped>
</style>


