<template>
    <div :class="width" class="table-head-sort type d-flex flex-v-center sort-header" @click="handleSort()">
      <span>{{title}}</span>
      <span class="direction-column d-flex sort-box">
        <i class="el-icon-caret-top sort-icon" :class="{'active':status=='up' && isSort==sortKey}"></i>
        <i class="el-icon-caret-bottom sort-icon" :class="{'active':status=='down' && isSort==sortKey}"></i>
      </span>
    </div>
</template>

<script>

export default {
  name: 'TableHeadSort',
  props: ['width', 'sortKey', 'isSort', 'title'],
  // width:宽度calss名 w-140 w-80
  // sortKey 排序的关键词 随便定义 但一个列表中不可同名
  // isSort 当前排序的项目关键词
  // title 头部标题
  data () {
    return {
      status: '',
    };
  },
  methods: {
    handleSort () {
      if (this.isSort !== this.sortKey) {
        this.status = '';
      }
      if (this.status === 'up') {
        this.status = 'down';
      } else if (this.status === 'down') {
        this.status = '';
      } else {
        this.status = 'up';
      }
      this.$emit('table-sort-change', { key: this.sortKey, status: this.status });
    },
  },
  mounted () {
    this.status = '';
  },
};
</script>

<style lang="scss" scoped>
.sort-header{
  .sort-icon{
    width: 12px;
    height: 6px;
    display: block;
    line-height: 5px;
    color:#c7c3c3;
    &.active{
      color:#5D8FFE
    }
  }
  .sort-box{
    margin-left:3px;
  }
  cursor: pointer;
}

</style>
