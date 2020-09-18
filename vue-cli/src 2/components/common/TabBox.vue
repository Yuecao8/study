/***图表部分的tab切换****/
<template>
  <div class="head-menu flex-v-center">
    <div class="menu-item" v-for="(item,index) in tabList"
          :class="{'active-item':item.id==activeItem.id}"
          @click="changeItem(item)"
          :key="index">{{item.name}}</div>
  </div>
</template>

<script>

export default {
  name: 'TabBox',
  props: ['tabList', 'handleActive'],
  data () {
    return {
      activeItem: {},
    };
  },
  methods: {
    changeItem (item) {
      this.activeItem = item;
      this.$emit('handle-active-tab', item);
    },
  },
  mounted () {
    this.activeItem = this.tabList[0];
  },
  watch: {
    handleActive (newarr) {
      this.activeItem = newarr;
    },
  },
};
</script>

<style lang="scss" scoped>
.head-menu{
  height: 44px;
  padding:0 20px;
  .menu-item{
    font-size: 14px;
    color: #666666;
    line-height: 14px;
    padding:20px 0px 10px 0px;
    border-bottom:2px solid #fff;
    margin-right:30px;
    cursor: pointer;
    font-size: 12px;
    line-height: 12px;
  }
  .active-item{
    border-bottom:2px solid #5D8FFE;
    color: #5D8FFE;
  }
}
</style>
