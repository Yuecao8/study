// 传入opt: ['昨天', '3天', '7天', '30天'],
// url带参如下
// if (data.time.timeRang.start_date) {
        params.start_date = data.time.timeRang.start_date;
        params.end_date = data.time.timeRang.end_date;
      }
      if (parseInt(data.key, 10) !== 0) {
        params.keys = data.key;
      }
<template>
  <div class="time-select-component d-inline-block">
    <div v-if="item.show" :class="{'active':activeClass ==key}" @click="changeTime(item,key)" v-for="(item,key) in showData" :key="key" :style="{left:`-${key*1}px`}"     class="fixed-btn select-button d-inline-block">{{item.name}}</div>
    <div class="select-button d-inline-block" :class="{'active':activeClass == 'cur'}" :style="{left:`-${showData.length*1}px`}">
      <el-date-picker
        size="small"
        :picker-options="customizeOption"
        :clearable=false
        v-model="customizeTime"
        @change="changeCustomizeTime"
        value-format='yyyy-MM-dd'
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
    </div>

  </div>
</template>

<script>
let moment = require('moment');
export default {
  name: 'TimeSelect',
  props: ['opt'],
  data () {
    return {
      customizeOption: {
        // disabledDate (time) {
        //   return time.getTime() > Date.now() - 8.64e7;
        // },
      },
      listData: [
        { show: false, name: '昨天', timeRang: { start_date: moment().subtract(1, 'days').format('YYYY-MM-DD'), end_date: moment().subtract(1, 'days').format('YYYY-MM-DD') } },
        { show: false, name: '3天', timeRang: { start_date: moment().subtract(3, 'days').format('YYYY-MM-DD'), end_date: moment().subtract(1, 'days').format('YYYY-MM-DD') } },
        { show: false, name: '7天', timeRang: { start_date: moment().subtract(7, 'days').format('YYYY-MM-DD'), end_date: moment().subtract(1, 'days').format('YYYY-MM-DD') } },
        { show: false, name: '30天', timeRang: { start_date: moment().subtract(30, 'days').format('YYYY-MM-DD'), end_date: moment().subtract(1, 'days').format('YYYY-MM-DD') } },
        { show: false, name: '90天', timeRang: { start_date: moment().subtract(90, 'days').format('YYYY-MM-DD'), end_date: moment().subtract(1, 'days').format('YYYY-MM-DD') } },
      ],
      showData: [],
      activeClass: '0',
      customizeTime: [],
    };
  },
  methods: {
    // 切换选项
    changeTime (time, key) {
      this.activeClass = key;
      this.customizeTime = [];
      this.$emit('time-select-change', { time: time, key: key });
    },
    // 自定义时间
    changeCustomizeTime (value) {
      // 可以clear时
      // if (value == null) {
      //   this.activeClass = 0;
      //   this.$emit('time-select-change', { time: { timeRang: { start_date: '', end_date: '' } }, key: '0' });
      //   return;
      // }
      this.activeClass = 'cur';
      this.$emit('time-select-change', { time: { timeRang: { start_date: value[0], end_date: value[1] } }, key: 'cur' });
    },
  },
  mounted () {
  },
  created () {
    this.activeClass = this.$route.query.keys ? this.$route.query.keys : this.activeClass;
    if (this.activeClass === 'cur') {
      this.customizeTime[0] = this.$route.query.start_date ? this.$route.query.start_date : '';
      this.customizeTime[1] = this.$route.query.end_date ? this.$route.query.end_date : '';
    }
    this.listData.forEach((vv) => {
      if (this.opt.includes(vv.name)) {
        vv.show = true;
        this.showData.push(vv);
      }
    });
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
  width: 72px;
  height: 32px;
  text-align: center;
  line-height: 32px;
  font-size: 12px;
  color: #666666;
  text-align: center;
}
</style>
<style lang="scss">
  .time-select-component {
    //时间选择
  .el-input__icon.el-range__close-icon{
      display: none;
  }
  .el-range-separator{
    width: 25px;
  }

  .el-range-editor--small.el-input__inner{
      height: 30px;
      width: 220px;
      border:none;
      box-shadow:none;
      border-radius:0 !important;
  }
  .active .el-input__icon.el-range__icon.el-icon-date{
    color:#52A1F4
  }
}
</style>
