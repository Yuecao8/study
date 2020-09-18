//  typeList: [
//         { name: '文稿', id: 'news', isActive: 0 },
//         { name: '图集', id: 'tuji', isActive: 0 },
//         { name: '外链', id: 'outlink', isActive: 0 },
//       ],
// <type-select :opt="typeList" :widths="'72px'" :heights="'32px'" v-on:select-type="typeSelectChang" :keys="'sytleData'"></type-select>
<template>
  <div class="time-select-component d-inline-block">
    <div class="fixed-btn select-button d-inline-block" :class="{'active':activeClass =='0'}" :style="{'width':widths,'height':heights, 'right':`-1px`}" @click="changeType('all', '0')">全部</div>
    <div class="fixed-btn select-button d-inline-block" :class="{'active':item.isActive == 1}" @click="changeType(item, key)" :style="{'width':widths,'height':heights,'left':`-${key*1}px`}" v-for="(item,key) in opt" :key="key">{{item.name}}</div>
  </div>
</template>
<script>
export default {
  name: 'typeSelect',
  props: ['opt', 'widths', 'keys', 'heights'],
  data () {
    return {
      activeItem: {},
      selectType: [],
      activeClass: 0,
    };
  },
  methods: {
    // 切换选项
    changeType (item, key) {
      if (item === 'all') {
        this.selectType = [];
        this.activeClass = 0;
        this.opt.forEach((obj) => {
          obj.isActive = false;
        });
      } else {
        this.activeClass = 1;
        const index = this.selectType.findIndex(obj => obj.id === item.id);
        if (index > -1) {
          this.selectType.splice(index, 1);
          this.opt[key].isActive = 0;
          if (this.selectType.length === 0) {
            this.opt.forEach((obj) => {
              obj.isActive = false;
            });
            this.activeClass = 0;
          }
        } else {
          item.isActive = 1;
          this.selectType.push(item);
        };
      }
    },
  },
  watch: {
    selectType (curVal, oldVal) {
      if (this.opt && this.opt.length) {
        window.sessionStorage.setItem(this.keys, JSON.stringify(curVal));
        this.$emit('select-type', { fiflerData: JSON.parse(window.sessionStorage.getItem(this.keys)) });
      }
    },
    opt (curVal, oldVal) {
      this.selectType = JSON.parse(window.sessionStorage.getItem(this.keys)) ? JSON.parse(window.sessionStorage.getItem(this.keys)) : JSON.parse(JSON.stringify(curVal));
    },
  },
  mounted () {
    this.selectType = JSON.parse(window.sessionStorage.getItem(this.keys)) ? JSON.parse(window.sessionStorage.getItem(this.keys)) : [];
    if (this.selectType.length > 0) {
      this.opt.forEach((opts) => {
        const idx = this.selectType.findIndex(obj => obj.id === opts.id);
        if (idx > -1) {
          opts.isActive = true;
        }
      });
      this.activeClass = 1;
    } else {
      this.activeClass = 0;
    }
    this.$emit('select-type', { fiflerData: this.selectType });
  },
  destroyed () {
    window.sessionStorage.removeItem(this.keys);
  },
};
</script>
<style lang="scss" scoped>
.select-button{
  border:1px solid #DCDCDC;
 position: relative;
  cursor: pointer;
  &.active{
    border:1px solid #52A1F4;
    z-index: 1;
  }
}
.fixed-btn{
  text-align: center;
  line-height: 32px;
  font-size: 12px;
  color: #666666;
  text-align: center;
}
</style>
