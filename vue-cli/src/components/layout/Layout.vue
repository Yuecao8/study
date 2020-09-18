<template>
    <div id="layout">
      <el-container class="main">
          <el-header class="app-header">
            <v-head></v-head>
          </el-header>
          <div class="app-bottom">
            <router-view></router-view>
          </div>

        </el-container>
    </div>

</template>

<script>
import VHead from './Head';
export default {
  name: 'layout',
  components: {
    VHead: VHead,
  },
};
</script>

<style lang="scss" scoped>
$header-height:50px;
$aside-width:200px;
#layout{
  width: 100%;
  height: 100%;
  .app-header{
    height: $header-height !important;
    padding: 0;
    background: #27313C;
  }
  .app-bottom{
    height: calc(100% - #{$header-height});
    width: 100%;
  }
  .app-main{
    width: calc(100% - #{$aside-width});
    height: 100%;
  }
}
</style>
<style lang="scss">
#layout{

}
</style>
