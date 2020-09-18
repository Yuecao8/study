<template>
  <div class="head flex-v-center">
    <!-- <img src="~@/assets/logo.png" alt=""> -->
    <span class="hoge-title">云统计</span>
    <div>
      <head-menu :menu-xist="menuList" :menu-active="menuActive"></head-menu>
    </div>

  </div>
</template>

<script>
import HeadMenu from './../common/HeadMenu';

export default {
  name: 'VHead',
  components: {
    HeadMenu: HeadMenu,
  },
  data () {
    return {
      menuList: [
        { name: '内容数据', id: 'content', path: '/content' },
        { name: '终端数据', id: 'terminal', path: '/terminal' },
        { name: '用户数据', id: 'user', path: '/user' },
        // { name: '配置管理', id: 'config', path: '/config' },
      ],
      menuActive: { name: '内容数据', id: 'content' },
    };
  },
  created () {
    // 判断高亮的元素
    const arr = this.$route.path.split('/');
    const idx = this.menuList.findIndex(obj => obj.id === arr[1]);
    this.menuActive = idx > -1 ? this.menuList[idx] : this.menuActive;
  },
};
</script>

<style lang="scss" scoped>
.head{
  height: 100%;
}
.hoge-title{
    color: #fff;
    font-size: 24px;
    margin-left: 44px;
    margin-right: 44px;
    font-weight: 800;
}
</style>
