<template>
  <div class="appHabit">
      <div class="select-box">
        <div class="d-flex flex-v-center">
          <span class="select-label">统计日期：</span>
          <div class="flex-one">
            <time-select :opt="opt" v-on:time-select-change="timeSelectChange"></time-select>
          </div>
        </div>
        <div class="d-flex flex-v-center m-t-20">
          <span class="select-label">客户端：</span>
          <div class="flex-one">
            <drop-checkbox :opt="webList" :text="'客户端'" :keys="'web'" v-on:handle-sites-chose="webChose"></drop-checkbox>
          </div>
        </div>
      </div>
      <div class="data-box">
        <div class="charts fl">
           <div class="title-box">
            <span class="title">使用频率分布</span>
          </div>
          <div class="frequency-charts">
              <bar-charts :heights="'300px'" :widths="'100%'" :charts-options="frequencyOption" :refresh-data="frequencyRefresh"></bar-charts>
          </div>
        </div>
        <div class="charts fl">
           <div class="title-box">
            <span class="title">访问页面数分布</span>
          </div>
          <div class="frequency-charts">
              <bar-charts :heights="'300px'" :widths="'100%'" :charts-options="accessOption" :refresh-data="accessRefresh"></bar-charts>
          </div>
        </div>
         <div class="charts">
           <div class="title-box">
            <span class="title">使用时长分布</span>
          </div>
          <div class="frequency-charts">
              <bar-charts :heights="'300px'" :widths="'100%'" :charts-options="useOption" :refresh-data="useRefresh"></bar-charts>
          </div>
        </div>

      </div>
  </div>
</template>
<script>
import DropCheckbox from '../../../components/select/dropCheckbox';
import TimeSelect from '../../../components/select/TimeSelect';
import BarCharts from '../../../components/charts/BarCharts';
let moment = require('moment');
export default {
  name: 'AppHabit',
  components: {
    DropCheckbox,
    TimeSelect,
    BarCharts,
  },
  data () {
    return {
      opt: ['昨天', '3天', '7天', '30天', '90天'],
      webList: [],
      allLoading: false,
      webArr: [],
      active: '0',
      // 使用频次
      frequencyRefresh: 0,
      frequencyOption: {},
      frequencyData: [],
      // 访问页面数
      accessRefresh: 0,
      accessOption: {},
      accessData: [],
      // 使用时长
      useRefresh: 0,
      useOption: {},
      useData: [],
    };
  },
  methods: {
    // 网站选择
    webChose () {
      const arr = JSON.parse(window.sessionStorage.getItem('web-chose'));
      const active = JSON.parse(window.sessionStorage.getItem('web-chose-active'));
      this.webArr = arr || [];
      this.active = active || '0';
      this.changeData();
    },
    // 时间变化
    timeSelectChange (data) {
      const params = {};
      if (data.time.timeRang.start_date) {
        params.start_date = data.time.timeRang.start_date;
        params.end_date = data.time.timeRang.end_date;
      }
      if (parseInt(data.key, 10) !== -1) {
        params.keys = data.key;
      }
      this.$router.push({
        path: '/terminal/app/habit',
        query: params,
      });
    },
    changeData () {
      this.allLoading = true;
      this.getfrequencyData();
      this.getAccessData();
      this.getUseData();
    },
    async getWebList () {
      try {
        const data = await this.$api.channelList();
        this.webList = data;
      } catch (e) {
      }
    },
    // 获取使用频次
    async getfrequencyData () {
      let param = {
        content_type: 'livmedia', // todo
      };
      this.getParams(param);
      if (this.$route.query.start_date) {
        param.start_date = this.$route.query.start_date;
        param.end_date = this.$route.query.end_date;
      } else {
        param.start_date = moment().subtract(1, 'days').format('YYYY-MM-DD');
        param.end_date = moment().subtract(1, 'days').format('YYYY-MM-DD');
      }
      try {
        const data = await this.$api.contentDay(param);
        let xAxisData = [];
        this.frequencyData = [];
        if (data.length) {
          data.forEach((vv) => {
            xAxisData.push(moment(vv.time).format('YYYY/MM/DD'));
            this.frequencyData.push(vv.click_num);
          });
          this.frequencyOption.axisData = xAxisData;
          this.frequencyOption.xAxisType = 'value';
          this.frequencyOption.seriesData = [[0, 6, 7, 8, 6, 33, 54]];
          this.frequencyOption.showLegend = true;
          this.frequencyOption.height = '400px';
          this.frequencyRefresh += 1;
        }
      } catch (e) {
      }
    },
    // 访问页面数
    async getAccessData () {
      // accessRefresh: 0,
      // accessOption: {},
      let param = {
        content_type: 'livmedia', // todo
      };
      this.getParams(param);
      if (this.$route.query.start_date) {
        param.start_date = this.$route.query.start_date;
        param.end_date = this.$route.query.end_date;
      } else {
        param.start_date = moment().subtract(1, 'days').format('YYYY-MM-DD');
        param.end_date = moment().subtract(1, 'days').format('YYYY-MM-DD');
      }
      try {
        const data = await this.$api.contentDay(param);
        let xAxisData = [];
        this.accessData = [];
        if (data.length) {
          data.forEach((vv) => {
            xAxisData.push(moment(vv.time).format('YYYY/MM/DD'));
            this.accessData.push(vv.click_num);
          });
          this.accessOption.axisData = xAxisData;
          this.accessOption.xAxisType = 'value';
          this.accessOption.seriesData = [this.accessData];
          this.accessOption.showLegend = true;
          this.accessOption.height = '400px';
          this.accessRefresh += 1;
        }
      } catch (e) {
      }
    },
    // 使用时长
    async getUseData () {
      // useRefresh: 0,
      // useOption: {},
      // useData: [],
      let param = {
        content_type: 'livmedia', // todo
      };
      this.getParams(param);
      if (this.$route.query.start_date) {
        param.start_date = this.$route.query.start_date;
        param.end_date = this.$route.query.end_date;
      } else {
        param.start_date = moment().subtract(1, 'days').format('YYYY-MM-DD');
        param.end_date = moment().subtract(1, 'days').format('YYYY-MM-DD');
      }
      try {
        const data = await this.$api.contentDay(param);
        let xAxisData = [];
        this.useData = [];
        if (data.length) {
          data.forEach((vv) => {
            xAxisData.push(moment(vv.time).format('YYYY/MM/DD'));
            this.useData.push(vv.click_num);
          });
          this.useOption.axisData = xAxisData;
          this.useOption.xAxisType = 'value';
          this.useOption.seriesData = [this.useData];
          this.useOption.showLegend = true;
          this.useOption.height = '400px';
          this.useRefresh += 1;
          this.allLoading = false;
        }
      } catch (e) {
        this.allLoading = false;
      }
    },
    // 获取参数
    getParams (param) {
      if (this.webArr.length && parseInt(this.active, 10) !== 0) {
        const ids = [];
        this.webArr.forEach((vv) => {
          ids.push(vv.id);
        });
        param.channel_id = ids.join(',');
      }
      return param;
    },

  },
  created () {
    this.allLoading = true;
    this.getWebList();
    const arr = JSON.parse(window.sessionStorage.getItem('web-chose'));
    const active = JSON.parse(window.sessionStorage.getItem('web-chose-active'));
    this.webArr = arr || [];
    this.active = active || '0';
    this.changeData();
  },
  destroyed () {
    window.sessionStorage.removeItem('web-chose');
    window.sessionStorage.removeItem('web-chose-active');
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': 'changeData', // 只有这个页面初始化之后，这个监听事件才开始生效
  },
};
</script>

<style lang="scss" scoped>
@import '~@/assets/style/table.scss';
.m-t-20{
  margin-top: 20px;
}
// 选择
.select-box{
  margin-bottom:30px;
  background:#fff;
  padding:20px;
  .select-label{
    font-size: 12px;
    color: #666666;
    text-align: right;
    line-height: 12px;
    width: 60px;
    display:inline-block;
  }
}
.data-box{
  .charts{
    width: calc(50% - 10px);
    &:first-child{
      margin-right:20px;
      margin-bottom:20px;
    }
  }
  .frequency-charts{
    background: #fff;
  }
}
</style>
