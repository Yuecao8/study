/***面包屑****/
<template>
  <div id="breadCrumb">
      <el-breadcrumb  separator="/">
        <el-breadcrumb-item v-for="(item,index) in breadList" :class="{'no-event':item.path==$route.path}" :key="index" :to="{ path: item.path }">{{item.meta.breadcrumbName}}</el-breadcrumb-item>
      </el-breadcrumb>
  </div>
</template>
<script>
export default {
  name: 'BreadCrumb',
  watch: {
    '$route': 'getPath',
  },
  data () {
    return {
      breadList: [],
    };
  },
  mounted () {
    this.getPath();
  },
  methods: {
    getPath () {
      this.breadList = [];
      this.$route.matched.forEach((rout) => {
        if (rout.meta.breadcrumbName) {
          this.breadList.push(rout);
        }
      });
    },
  },
  computed: {

  },
};
</script>
<style lang="scss" scoped>
#breadCrumb {
  margin-bottom:20px;
}
.no-event{
  pointer-events: none;
}
</style>
<style lang="scss">
#breadCrumb .el-breadcrumb__inner.is-link{
  font-size: 12px;
  color: #B7B9C7;
  line-height: 12px;
}
#breadCrumb .el-breadcrumb__separator.el-icon-arrow-right{
  color:#B7B9C7;
  font-size: 12px;
}
#breadCrumb .el-breadcrumb__item:last-child .el-breadcrumb__inner.is-link{
  color: #515B71;
  line-height: 12px;
}
</style>
