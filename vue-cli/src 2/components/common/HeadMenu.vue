/***头部tab切换****/
<template>
  <div class="head-menu flex-v-center">
      <div class="menu-item" v-for="(item,index) in menuXist"
            :class="{'active-item':item.id==activeItem.id}"
            @click="linkTo(item)"
            :key="index">{{item.name}}</div>
  </div>
</template>

<script>

export default {
  name: 'HeadMenu',
  props: ['menuXist', 'menuActive'],
  data () {
    return {
      activeItem: {},
    };
  },
  methods: {
    linkTo (item) {
      this.$router.push({
        path: item.path,
      });
      this.activeItem = item;
      // console
    },
  },
  mounted () {
    this.activeItem = this.menuActive;
  },
};
</script>

<style lang="scss" scoped>
.head-menu{
  height: 42px;
  padding:0px;
  .menu-item{
    font-size: 14px;
    color: #FFFFFF;
    line-height: 14px;
    padding:18px 8px 14px 8px;
    border-bottom:4px solid #27313C;
    cursor: pointer;
    width: 100px;
    text-align: center;
  }
  .active-item{
    border-bottom:4px solid #5D8FFE;
    color: #5D8FFE;
  }
}
</style>
