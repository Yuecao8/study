<template>
  <div class="main">
    <el-container class="main">
        <el-aside class="side-width">
          <v-side :basic-content = 'changeRout'></v-side>
        </el-aside>
        <el-main>
          <bread-crumb></bread-crumb>
          <router-view/>
        </el-main>
    </el-container>
  </div>
</template>

<script>
import VSide from './../../components/layout/Side';
export default {
  name: 'Content',
  data () {
    return {
      changeRout: this.$route.name,
    };
  },
  components: {
    VSide,
  },
  mounted () {
    // console.log(this.$route, '我传的');
  },
};
</script>

<style lang="scss" scoped>
.main{
  background: #eaedf1;
}
.side-width{
  width: 160px !important;
}
</style>
