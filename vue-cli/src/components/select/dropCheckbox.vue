<template>
  <div class="time-select-component d-inline-block">
    <div class="fixed-btn select-button d-inline-block" :class="{'active':activeClass =='0'}" :style="{'right':`-1px`}" @click="choseAll('0')">全部</div>
    <div class="fixed-btn select-button d-inline-block drop-btn"  :class="{'active':activeClass =='1','show':dropShow}" @click.stop="toggleShow()" :style="{'left':'0px'}">
      <span @click.stop="toggleShow()">{{text}}组合<i class="cart el-icon-arrow-down"></i></span>
      <div class="drop-div" v-if="dropShow" @click.stop="stopEvent()">
          <div class="drop-down">
            <div class="item-div" v-for="(item,idx) in opt" :key="idx">
              <input type="checkbox" :checked="checkItem(item)" @click="toggleItem(item)"><span class="item-span">{{item.name}}</span>
            </div>
          </div>
          <div class="drop-bottom flex-v-center">
            <input class="all-select" type="checkbox" :checked="checkAll()" @click="toggleAll()">全选
            <el-button type="primary" size="mini" class="btn-left" @click="sure()">确定</el-button>
            <el-button size="mini" @click="cancel()">取消</el-button>
          </div>
      </div>

    </div>
  </div>
</template>
<script>
import { DeepCopyArr } from './../../services/utils';
export default {
  name: 'dropCheckbox',
  props: ['opt', 'text', 'keys'],
  data () {
    return {
      activeClass: '0',
      dropShow: false,
      selectList: [], // checkbox选择的中转list
      checkedList: [], // 选中的list
      originList: [],
    };
  },
  methods: {
    // checkbox选择 start
    toggleItem (item) {
      const idx = this.selectList.findIndex(obj => parseInt(obj.id, 10) === parseInt(item.id, 10));
      if (idx > -1) {
        this.selectList.splice(idx, 1);
      } else {
        this.selectList.push(item);
      }
    },
    checkItem (item) {
      return this.selectList.length && this.selectList.findIndex(obj => parseInt(obj.id, 10) === parseInt(item.id, 10)) > -1;
    },
    checkAll () {
      return this.selectList.length && this.selectList.length === this.opt.length;
    },
    toggleAll () {
      if (this.selectList.length && this.selectList.length === this.opt.length) {
        this.selectList = [];
      } else {
        this.selectList = [];
        this.opt.forEach((vv) => {
          this.selectList.push(vv);
        });
      }
    },
    // checkbox选择 end
    stopEvent () {

    },
    // 切换值全部
    choseAll (key) {
      if (this.activeClass === '0') {
        return;
      }
      this.activeClass = '0';
      window.sessionStorage.setItem(`${this.keys}-chose`, JSON.stringify(this.checkedList));
      window.sessionStorage.setItem(`${this.keys}-chose-active`, this.activeClass);
      this.$emit('handle-sites-chose');
    },
    // 点击其它地方
    handleBodyClick () {
      if (this.dropShow) {
        this.dropShow = false;
      }
    },
    // 点击站点组合
    toggleShow () {
      const arr = window.sessionStorage.getItem(`${this.keys}-chose`);
      if (arr && arr.length) {
        this.checkedList = JSON.parse(arr);
        this.selectList = JSON.parse(arr);
      }
      this.activeClass = '1';
      this.dropShow = !this.dropShow;
    },
    // 取消选择
    cancel () {
      this.dropShow = false;
      if (!this.checkedList.length || window.sessionStorage.getItem(`${this.keys}-chose-active`) === '0') {
        this.activeClass = '0';
      }
      this.selectList = DeepCopyArr(this.checkedList);
    },
    // 确认选择
    sure () {
      if (!this.selectList.length) {
        this.$message({
          message: '请选择站点',
          type: 'error',
        });
        return;
      }
      this.dropShow = false;
      this.checkedList = DeepCopyArr(this.selectList);
      window.sessionStorage.setItem(`${this.keys}-chose`, JSON.stringify(this.checkedList));
      window.sessionStorage.setItem(`${this.keys}-chose-active`, this.activeClass);
      this.$emit('handle-sites-chose');
    },
  },
  created () {
    const siteArr = window.sessionStorage.getItem(`${this.keys}-chose`);
    const active = window.sessionStorage.getItem(`${this.keys}-chose-active`);
    if (siteArr && siteArr.length) {
      this.checkedList = JSON.parse(siteArr);
      this.selectList = JSON.parse(siteArr);
    }
    if (active) {
      this.activeClass = active;
    }
  },
  mounted () {
    document.addEventListener('click', this.handleBodyClick);
  },
  destroyed () {
    document.removeEventListener('click', this.handleBodyClick);
  },
};
</script>
<style lang="scss">
.time-select-component{
  .drop-btn{
    z-index: 3;
    position: relative;
  }
  .fixed-btn{
      width: 72px;
      height: 32px;
      text-align: center;
      line-height: 32px;
      font-size: 12px;
      color: #666666;
      text-align: center;
      border: 1px solid #DCDCDC;
      position: relative;
      cursor: pointer;
      &.active{
        border: 1px solid #52A1F4;
        z-index: 4;
      }
  }
  .drop-btn{
    width: 90px;
    .el-icon-arrow-down{
      position: relative;
      left:4px;
    }
  }
  .drop-div {
      width: 200px;
      max-height: 350px;
      border: 1px solid #ddd;
      position: absolute;
      z-index: 10;
      background: #fff;
      border-radius: 2px;
  }
  .drop-down {
      max-height: 300px;
      width: 100%;
      overflow-y: scroll;
      padding: 5px;
  }

  .item-div {
      padding: 6px 8px;
      border-bottom: 1px solid #ddd;
      font-size: 13px;
      color: #666;
      height: 32px;
      display: flex;
      &:last-child{
        border-bottom: 0px;
      }
  }
  .item-span {
      width: 80px !important;
      margin-left: 2px;
      overflow: hidden;
      text-overflow: ellipsis;
      height: 18px;
      white-space: nowrap;
      line-height: 18px;
  }
  .all-select{
    margin-left:16px;
  }
  .drop-bottom{
    height: 50px;
  }
  .el-button--mini{
    padding:6px 10px
  }
  .btn-left{
    margin-left:20px;
  }
}

</style>
