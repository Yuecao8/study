<template>
  <div class="userPortrait">
      <div class="select-box">
        <div class="d-flex flex-v-center">
          <span class="select-label">统计日期：</span>
          <div class="flex-one">
            <time-select :opt="opt" v-on:time-select-change="timeSelectChange"></time-select>
          </div>
        </div>
        <div class="d-flex flex-v-center m-t-20">
          <span class="select-label">站点：</span>
          <div class="flex-one">
              <drop-checkbox :opt="webList" :text="'客户端'" :keys="'web'" v-on:handle-sites-chose="webChose"></drop-checkbox>
          </div>
        </div>
      </div>
       <div class="data-box">
        <div class="charts fl">
            <div class="title-box">
              <span class="title">性别占比</span>
            </div>
            <div class="content-box h-340 flex-v-center">
              <div>
                 <div class="sex-box">
                    <img src="~@/assets/image/man.png" v-for="(item,index) in genderShareData[0].arr" :key="index">
                    <span class="percet">{{genderShareData[0].percentage}}</span>
                </div>
                 <div class="sex-box m-t-20">
                    <img src="~@/assets/image/woman.png" v-for="(item,index) in genderShareData[1].arr" :key="index">
                    <span class="percet">{{genderShareData[1].percentage}}</span>
                </div>
              </div>

            </div>
        </div>
        <div class="charts fl">
            <div class="title-box">
              <span class="title">年龄分布</span>
            </div>
            <div class="content-box">
                 <bar-charts :charts-options="chartsOptions" :refresh-data="refresh"></bar-charts>
            </div>
        </div>
         <div class="charts fl">
            <div class="title-box">
              <span class="title">教育程度占比</span>
            </div>
            <div class="content-box">
                 <bar-charts :charts-options="pieOptions" :refresh-data="pieRefresh"></bar-charts>
            </div>
        </div>
        <div class="charts fl">
            <div class="title-box">
              <span class="title">职业分布</span>
            </div>
            <div class="content-box">
              <bubble-charts :plant-cap="careerData" :refresh-data="careerRefresh"></bubble-charts>
            </div>
        </div>
        <div class="flex-one">
            <div class="title-box">
              <span class="title">兴趣</span>
            </div>
            <div class="content-box">
              <bubble-charts :plant-cap="interestData" :refresh-data="interestRefresh"></bubble-charts>
            </div>
        </div>
      </div>
  </div>
</template>
<script>
import DropCheckbox from '../../../components/select/dropCheckbox';
import TimeSelect from '../../../components/select/TimeSelect';
import BarCharts from '../../../components/charts/BarCharts';
import BubbleCharts from '../../../components/charts/BubbleCharts';
let moment = require('moment');
export default {
  name: 'userPortrait',
  components: {
    DropCheckbox,
    BarCharts,
    TimeSelect,
    BubbleCharts,
  },
  data () {
    return {
      opt: ['昨天', '3天', '7天', '30天'],
      webList: [],
      allLoading: false,
      webArr: [],
      active: '0',
      pageOptions: {
        page: 1, // 当前页
        pageSize: 5, // 每页条数
        pageNum: 1, // 总共页码
        total: 0, // 总共条数
      },
      // 性别占比
      genderShareData: [],
      // 年龄分布
      chartsOptions: {},
      refresh: 0,
      yearsData: [],
      // 教育程度
      pieRefresh: 0,
      pieOptions: {},
      pieData: [],
      // 职业分布
      careerRefresh: 0,
      careerData: [],
      // 兴趣
      interestRefresh: 0,
      interestData: [],
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
        path: '/user/data/portrait',
        query: params,
      });
    },
    changeData () {
      this.allLoading = true;
      this.genderShare();
      this.getYears();
      this.getPieData();
      this.getCareer();
      this.getInterest();
    },
    async getWebList () {
      try {
        const data = await this.$api.channelList();
        this.webList = data;
      } catch (e) {
      }
    },
    // 获取性别占比
    async genderShare () {
      let param = {
        content_type: 'livmedia', // todo
      };
      this.getParams(param);
      try {
        // let data = await this.$api.contentDay(param);
        this.genderShareData = [
          { name: 'male', num: 0, percentage: '32%' },
          { name: 'female', num: 0, percentage: '100%' },
        ];
        this.genderShareData.forEach((vv) => {
          vv.num = this.getGenderNum(vv.percentage);
          vv.arr = new Array(vv.num).fill([]);
        });
      } catch (e) {

      }
    },
    // 获取显示性别人数
    getGenderNum (percet) {
      let str = percet.split('%')[0];
      return Math.ceil(str / 10);
    },
    // 获取年龄分布
    async getYears () {
      let param = {
        column_ids: '1',
      };
      this.getParams(param);
      try {
        const data = await this.$api.columnDay(param);
        let xAxisData = [];
        this.yearsData = [];
        if (data.length) {
          data.forEach((vv) => {
            xAxisData.push(moment(vv.time).format('YYYY/MM/DD'));
            this.yearsData.push(vv.click_num);
          });
          this.chartsOptions.axisData = xAxisData;
          this.chartsOptions.xAxisType = 'category';
          this.chartsOptions.seriesData = [[1, 2, 33, 4, 32, 3, 9]];
          this.chartsOptions.showLegend = false;
          this.refresh += 1;
        }
      } catch (e) {

      }
    },
    // 获取教育占比
    async getPieData () {
      let param = {
        column_ids: '1',
      };
      this.getParams(param);
      try {
        const data = await this.$api.columnDay(param);
        let xAxisData = [];
        this.pieData = [];
        if (data.length) {
          data.forEach((vv) => {
            xAxisData.push(moment(vv.time).format('YYYY/MM/DD'));
            this.pieData.push(vv.click_num);
          });
          this.pieOptions.axisData = xAxisData;
          this.pieOptions.xAxisType = 'category';
          this.pieOptions.seriesData = [[1, 2, 33, 4, 32, 3, 9]];
          this.pieOptions.showLegend = false;
          this.pieRefresh += 1;
        }
      } catch (e) {

      }
    },
    // 获取职业分布
    async getCareer () {
      let param = {
        column_ids: '1',
      };
      this.getParams(param);
      try {
        const data = await this.$api.columnDay(param);
        console.log(data);
        this.careerData = [{
          name: '重大项目决策',
          value: '222',
        }, {
          name: '重要人事任免',
          value: '115',
        }, {
          name: '大额度资金运作',
          value: '113',
        }, {
          name: '重大事项安排',
          value: '95',
        }, {
          name: '十九大',
          value: '92',
        }, {
          name: '党建',
          value: '87',
        }, {
          name: '贯彻落实',
          value: '87',
        }, {
          name: '党廉',
          value: '60',
        }, {
          name: '党廉',
          value: '45',
        }, {
          name: '党廉党廉党廉',
          value: '23',
        }];
        this.careerRefresh += 1;
      } catch (e) {
      }
    },
    // 兴趣分布
    async getInterest () {
      let param = {
        column_ids: '1',
      };
      this.getParams(param);
      try {
        const data = await this.$api.columnDay(param);
        console.log(data);
        this.interestData = [{
          name: '重大项目决策',
          value: '222',
        }, {
          name: '重要人事任免',
          value: '115',
        }, {
          name: '大额度资金运作',
          value: '113',
        }, {
          name: '重大事项安排',
          value: '95',
        }, {
          name: '十九大',
          value: '92',
        }, {
          name: '党建',
          value: '87',
        }, {
          name: '贯彻落实',
          value: '87',
        }, {
          name: '党廉',
          value: '60',
        }, {
          name: '党廉',
          value: '45',
        }, {
          name: '党廉党廉党廉',
          value: '23',
        }];
        this.interestRefresh += 1;
        this.allLoading = false;
      } catch (e) {
        this.allLoading = false;
      }
    },
    // 获取参数
    getParams (param) {
      if (this.$route.query.start_date) {
        param.start_date = this.$route.query.start_date;
        param.end_date = this.$route.query.end_date;
      } else {
        param.start_date = moment().subtract(1, 'days').format('YYYY-MM-DD');
        param.end_date = moment().subtract(1, 'days').format('YYYY-MM-DD');
      }
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
  .h-340{
    height: 340px;
    >div{
      width: 100%;
    }
  }
  .sex-box{
    width: 100%;
    position: relative;
    line-height:70px;
    &:first-child{
      margin-bottom: 40px;
    }
    img{
      width: 70px;
      margin-right:0px;
    }
    .percet{
      position: absolute;
      right:0;
      font-size: 14px;
      color: #333333;
      margin-right:10px;
    }
  }
  .m-t-20{
    margin-top:20px;
  }
  .content-box{
    padding:20px;
    background: #fff;
  }
  .pie-charts{
    height: 385px;
  }
  .circle-content{
    width: 100%;
  }
}
</style>
