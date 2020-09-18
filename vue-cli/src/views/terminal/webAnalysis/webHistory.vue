<template>
  <div class="appHistory">
      <div class="select-box">
        <div class="d-flex flex-v-center">
          <span class="select-label">统计日期：</span>
          <div class="flex-one">
            <time-select :opt="opt" v-on:time-select-change="timeSelectChange"></time-select>
          </div>
        </div>
        <div class="d-flex flex-v-center m-t-20">
          <span class="select-label">网站：</span>
          <div class="flex-one">
              <drop-checkbox :opt="webList" :text="'网站'" :keys="'web'" v-on:handle-sites-chose="webChose"></drop-checkbox>
          </div>
        </div>
      </div>
      <div class="data-box" v-loading="allLoading">
          <div class="title-box">
            <span class="title">实时数据</span>
          </div>
          <div class="cards-box flex-between">
            <data-card :options="pageViews"></data-card>
            <data-card :options="indeUserViews"></data-card>
            <data-card :options="todayViews"></data-card>
            <data-card :options="visitLengthViews"></data-card>
          </div>
          <div class="charts-box">
            <div class="title-box">
              <span class="title">分时数据</span>
            </div>
            <div class="charts-contain">
                <tab-box
                :tab-list="[{name:'浏览量（PV）',id:'addUser'},{name:'独立用户（UV）',id:'activeUser'},
                {name:'独立IP',id:'startNum'},{name:'平均访问时间',id:'actives'}]"
                v-on:handle-active-tab="handleTabChange"
                 :handle-active="activeItem"
                ></tab-box>
                <line-charts :charts-options="chartsOptions" :refresh-data="refresh"></line-charts>
            </div>
          </div>
          <div class="table-box">
            <div class="title-box">
              <span class="title">详细数据</span>
            </div>
            <div class="table-body white">
                <div class="table-header flex-v-center">
                    <div class="flex-one">时间</div>
                    <span class="w-100">浏览量（PV）</span>
                    <span class="w-100">独立用户（UV）</span>
                    <span class="w-100">独立IP</span>
                    <span class="w-100">平均访问时间</span>
                </div>
                <div class="table-content">
                    <div v-if="!detailList.length" class="table-no-data">
                        暂无数据
                    </div>
                    <div class="table-item flex-v-center" v-if="detailList.length" v-for="(item,index) in detailList" :key="index">
                        <div class="flex-one">{{moment(item.time).format('YYYY/MM/DD')}}</div>
                        <div class="w-100">{{item.pv_count}}</div>
                        <div class="w-100">{{item.visitor_count}}</div>
                        <div class="w-100">{{item.ip_count}}</div>
                        <div class="w-100">{{item.format_visit_time}}</div>
                    </div>
                </div>
                <div class="table-bottom flex-v-center table-bottom-page" v-if="detailList.length">
                    <span class="page-total">总共 {{pageOptions.total}} 条记录</span>
                    <el-pagination
                        background
                        layout="prev, pager, next,sizes,jumper"
                        :page-size=pageOptions.pageSize
                        :page-sizes="[5, 10, 20,50]"
                        :current-page.sync=pageOptions.page
                        :total=pageOptions.total
                        @current-change="handleCurrentChange"
                        @size-change="handleSizeChange"
                        >
                    </el-pagination>
                </div>
            </div>
        </div>
      </div>
  </div>
</template>
<script>
import DropCheckbox from '../../../components/select/dropCheckbox';
import DataCard from '../../../components/common/DataCard';
import LineCharts from '../../../components/charts/LineCharts';
import TimeSelect from '../../../components/select/TimeSelect';
import TabBox from '../../../components/common/TabBox';
import { formatSeconds } from '../../../services/utils.js';
let moment = require('moment');
export default {
  name: 'AppHistory',

  components: {
    DropCheckbox,
    DataCard,
    LineCharts,
    TabBox,
    TimeSelect,
  },
  data () {
    return {
      moment: moment,
      opt: ['昨天', '3天', '7天', '30天', '90天'],
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
      // 启动次数
      pageViews: {
        colorStyle: 'green-style', // colorStyle 颜色风格
        title: '浏览量（PV）',
        brief: '',
        num: '0',
        beforeImg: false,
        afterImg: false,
      },
      // 独立用户
      indeUserViews: {
        colorStyle: 'purple-style', // colorStyle 颜色风格
        title: '独立用户（UV）',
        brief: '',
        num: '0',
        beforeImg: false,
        afterImg: false,
      },
      // 当日独立IP
      todayViews: {
        colorStyle: 'blue-style', // colorStyle 颜色风格
        title: '当日独立IP',
        brief: '',
        num: '0',
        beforeImg: false,
        afterImg: false,
      },
      // 平均访问时长
      visitLengthViews: {
        colorStyle: 'red-style', // colorStyle 颜色风格
        title: '平均访问时长',
        brief: '',
        num: '0',
        beforeImg: false,
        afterImg: false,
      },
      // 图表
      activeItem: { id: 'addUser' },
      refresh: 0,
      chartsOptions: {},
      addUser: [],
      activeUser: [],
      startNum: [],
      actives: [],
      // 列表
      detailAllList: [],
      detailList: [],
    };
  },
  methods: {
    // 分页
    handleCurrentChange (val) {
      const offset = (this.pageOptions.pageSize) * (val - 1);
      this.pageOptions.page = val;
      this.detailList = [];
      const all = JSON.parse(JSON.stringify(this.detailAllList));
      this.detailList = all.slice(offset, this.pageOptions.pageSize + offset);
    },
    handleSizeChange (size) {
      this.pageOptions.page = 1;
      this.pageOptions.pageSize = size;
      this.detailList = [];
      const all = JSON.parse(JSON.stringify(this.detailAllList));
      this.detailList = all.slice(0, this.pageOptions.pageSize);
    },
    // 切换分时数据
    handleTabChange (data) {
      // 测试数据
      switch (data.id) {
        case 'addUser':
          this.chartsOptions.seriesData = [this.addUser];
          break;
        case 'activeUser':
          this.chartsOptions.seriesData = [this.activeUser];
          break;
        case 'startNum':
          this.chartsOptions.seriesData = [this.startNum];
          break;
        case 'actives':
          this.chartsOptions.seriesData = [this.actives];
          break;
        default:
          break;
      }
      this.refresh = this.refresh + 1;
    },
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
        path: '/terminal/web/history',
        query: params,
      });
    },
    changeData () {
      this.allLoading = true;
      this.pageOptions.page = 1;
      this.getTargetData();
      // this.fetchData();
      this.activeItem = { id: 'addUser' };
    },
    async getWebList () {
      try {
        const data = await this.$api.webSiteList();
        data.forEach((vv) => {
          vv.id = vv.site_id;
        });
        this.webList = data;
      } catch (e) {
      }
    },
    // 获取实时卡片数据
    async getTargetData () {
      try {
        let param = {
        };
        param = this.getParams(param);
        const datas = await this.$api.webTrend(param);
        const data = datas.grand;
        this.pageViews.num = data.pv_count ? data.pv_count : 0;
        this.indeUserViews.num = data.visitor_count ? data.visitor_count : 0;
        this.todayViews.num = data.ip_count ? data.ip_count : 0;
        this.visitLengthViews.num = data.avg_visit_time ? formatSeconds(Math.round(data.avg_visit_time)) : '00:00:00';
        this.getCharts(datas.trend_day);
      } catch (e) {
        this.allLoading = false;
      }
    },
    getCharts (data) {
      let xAxisData = [];
      this.addUser = [];
      this.activeUser = [];
      this.startNum = [];
      this.actives = [];
      if (data.length) {
        data.forEach((vv) => {
          xAxisData.push(moment(vv.time).format('YYYY/MM/DD'));
          this.addUser.push(vv.pv_count);// todo
          this.activeUser.push(vv.visitor_count);// todo
          this.startNum.push(vv.ip_count);// todo
          this.actives.push(vv.avg_visit_time);// todo
          vv.format_visit_time = vv.avg_visit_time ? formatSeconds(Math.round(vv.avg_visit_time)) : '00:00:00';
        });
        this.chartsOptions.xAxisData = xAxisData;
        // this.chartsOptions.seriesData = [this.addUser, this.activeUser];
        this.chartsOptions.seriesData = [this.addUser];
        this.chartsOptions.showLegend = false;
        this.refresh += 1;
        this.allLoading = false;
      }
      this.detailAllList = JSON.parse(JSON.stringify(data));
      this.detailList = JSON.parse(JSON.stringify(this.detailAllList.slice(0, 5)));
      this.pageOptions.total = parseInt(data.length, 10);
      this.pageOptions.pageNum = Math.ceil(this.pageOptions.total / this.pageOptions.pageSize);
    },
    // 获取参数
    getParams (param) {
      if (this.webArr.length && parseInt(this.active, 10) !== 0) {
        const ids = [];
        this.webArr.forEach((vv) => {
          ids.push(vv.id);
        });
        param.site_id = ids.join(',');
      }
      if (this.$route.query.start_date) {
        param.start_date = this.$route.query.start_date;
        param.end_date = this.$route.query.end_date;
      } else {
        param.start_date = moment().subtract(1, 'days').format('YYYY-MM-DD');
        param.end_date = moment().subtract(1, 'days').format('YYYY-MM-DD');
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
  .cards-box{
    max-width: 1080px;
    margin-bottom:30px;
  }
  .charts-box{
    margin-bottom:30px;
  }
  .charts-contain{
   background:#fff;
  }
}
</style>
