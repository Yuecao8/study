<template>
  <div class="appEnvironment">
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
      <div class="data-box" v-loading="allLoading">
        <div class="charts fl">
            <div class="title-box">
              <span class="title">系统TOP10</span>
            </div>
            <div class="content-box top-card-box">
                <top-card :data="systemData"></top-card>
            </div>
        </div>
        <div class="charts fl">
            <div class="title-box">
              <span class="title">分辨率TOP10</span>
            </div>
            <div class="content-box top-card-box" >
                 <top-card :data="resolutionData"></top-card>
            </div>
        </div>
        <div class="charts fl">
            <div class="title-box">
              <span class="title">机型TOP10</span>
            </div>
            <div class="content-box top-card-box third-box" >
                 <top-card :data="modelData"></top-card>
            </div>
        </div>
        <div class="charts fl">
            <div class="title-box">
              <span class="title">联网方式占比</span>
            </div>
            <div class="content-box pie-charts">

            </div>
        </div>
        <div class="charts fl">
           <div class="title-box">
            <span class="title">品牌机型分布</span>
          </div>
          <div class="content-box">
              <bar-charts :heights="'300px'" :widths="'100%'" :charts-options="brandOption" :refresh-data="brandRefresh"></bar-charts>
          </div>
        </div>
        <div class="charts fl">
           <div class="title-box">
            <span class="title">运营商占比</span>
          </div>
          <div class="content-box">
              <bar-charts :heights="'300px'" :widths="'100%'" :charts-options="operatorOption" :refresh-data="operatorRefresh"></bar-charts>
          </div>
        </div>
      </div>
  </div>
</template>
<script>
import DropCheckbox from '../../../components/select/dropCheckbox';
import TimeSelect from '../../../components/select/TimeSelect';
import BarCharts from '../../../components/charts/BarCharts';
import TopCard from '../../../components/common/TopCard';
let moment = require('moment');
export default {
  name: 'appEnvironment',
  components: {
    DropCheckbox,
    TimeSelect,
    BarCharts,
    TopCard,
  },
  data () {
    return {
      opt: ['昨天', '3天', '7天', '30天', '90天'],
      webList: [],
      allLoading: false,
      webArr: [],
      active: '0',
      // 品牌机型
      brandRefresh: 0,
      brandOption: {},
      brandData: [],
      // 运营商占比
      operatorRefresh: 0,
      operatorOption: {},
      operatorData: [],
      // top10
      systemData: [],
      resolutionData: [],
      modelData: [],
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
        path: '/terminal/app/environment',
        query: params,
      });
    },
    changeData () {
      this.allLoading = true;
      this.getSystemData();
      this.getResolutionData();
      this.getModelData();
      this.getbrandData();
      this.getAccessData();
    },
    async getWebList () {
      try {
        const data = await this.$api.channelList();
        this.webList = data;
      } catch (e) {
      }
    },
    // 系统top10
    async getSystemData () {
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
        this.systemData = [];
        if (data.length) {
          data.forEach((vv) => {
            this.systemData.push({ name: vv.time, num: vv.click_num });
          });
        }
      } catch (e) {
      }
    },
    // 分辨率TOP10
    async getResolutionData () {
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
        this.resolutionData = [];
        if (data.length) {
          data.forEach((vv) => {
            this.resolutionData.push({ name: vv.time, num: vv.click_num });
          });
        }
      } catch (e) {
      }
    },
    // 机型TOP10
    async getModelData () {
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
        this.modelData = [];
        if (data.length) {
          data.forEach((vv) => {
            this.modelData.push({ name: vv.time, num: vv.click_num });
          });
        }
      } catch (e) {
      }
    },
    // 品牌机型
    async getbrandData () {
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
        this.brandData = [];
        if (data.length) {
          data.forEach((vv) => {
            xAxisData.push(moment(vv.time).format('YYYY/MM/DD'));
            this.brandData.push(vv.click_num);
          });
          this.brandOption.axisData = xAxisData;
          this.brandOption.xAxisType = 'value';
          this.brandOption.seriesData = [[0, 6, 7, 8, 6, 33, 54]];
          this.brandOption.showLegend = true;
          this.brandOption.height = '400px';
          this.brandRefresh += 1;
        }
      } catch (e) {
      }
    },
    // 运营商占比
    async getAccessData () {
      // operatorRefresh: 0,
      // operatorOption: {},
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
        this.operatorData = [];
        if (data.length) {
          data.forEach((vv) => {
            xAxisData.push(moment(vv.time).format('YYYY/MM/DD'));
            this.operatorData.push(vv.click_num);
          });
          this.operatorOption.axisData = xAxisData;
          this.operatorOption.xAxisType = 'value';
          this.operatorOption.seriesData = [this.operatorData];
          this.operatorOption.showLegend = true;
          this.operatorOption.height = '400px';
          this.operatorRefresh += 1;
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
  overflow: hidden;
  .charts{
    width: calc(50% - 10px);
    margin-bottom:20px;
    &:nth-child(odd){
      margin-right:20px;
    }
  }
  .content-box{
    background: #fff;
  }
  .top-card-box{
      padding: 20px 15px 15px;
  }
  .third-box{
     height: 385px;
  }
  .pie-charts{
    height: 385px;
  }
}
</style>
