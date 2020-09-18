<template>
  <div class="appPeriodTime">
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
          <div class="charts-box">
            <div class="title-box">
              <span class="title">小时数据</span>
            </div>
            <div class="charts-contain">
                <tab-box
                :tab-list="[{name:'启动次数',id:'startNum'},{name:'活跃用户',id:'activeUser'},
                ]"
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
                    <span class="w-100">启动次数</span>
                    <span class="w-100">活跃用户</span>
                </div>
                <div class="table-content">
                    <div v-if="!detailList.length" class="table-no-data">
                        暂无数据
                    </div>
                    <div class="table-item flex-v-center" v-if="detailList.length" v-for="(item,index) in detailList" :key="index">
                        <div class="flex-one">{{item.time.toString().substring(0,4)}}/{{item.time.toString().substring(5,7)}}/{{item.time.toString().substring(8)}}</div>
                        <div class="w-100">{{item.click_num}}</div>
                        <div class="w-100">{{item.comment_num}}</div>
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
import LineCharts from '../../../components/charts/LineCharts';
import TimeSelect from '../../../components/select/TimeSelect';
import TabBox from '../../../components/common/TabBox';
let moment = require('moment');
export default {
  name: 'AppPeriodTime',

  components: {
    DropCheckbox,
    LineCharts,
    TabBox,
    TimeSelect,
  },
  data () {
    return {
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
      // 图表
      activeItem: { id: 'startNum' },
      refresh: 0,
      chartsOptions: {},
      startNum: [],
      activeUser: [],
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
        case 'startNum':
          this.chartsOptions.seriesData = [this.startNum];
          break;
        case 'activeUser':
          this.chartsOptions.seriesData = [this.activeUser];
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
        path: '/terminal/app/periodTime',
        query: params,
      });
    },
    changeData () {
      this.allLoading = true;
      this.pageOptions.page = 1;
      this.fetchData();
      this.activeItem = { id: 'startNum' };
    },
    async getWebList () {
      try {
        const data = await this.$api.channelList();
        this.webList = data;
      } catch (e) {
      }
    },
    // 获取数据
    async fetchData () {
      let param = {
        content_type: 'livmedia', // todo
      };
      if (this.$route.query.start_date) {
        param.start_date = this.$route.query.start_date;
        param.end_date = this.$route.query.end_date;
      } else {
        param.start_date = moment().subtract(1, 'days').format('YYYY-MM-DD');
        param.end_date = moment().subtract(1, 'days').format('YYYY-MM-DD');
      }
      param = this.getParams(param);
      try {
        const data = await this.$api.contentDay(param); // todo
        this.detailAllList = JSON.parse(JSON.stringify(data));
        this.detailList = JSON.parse(JSON.stringify(this.detailAllList.slice(0, 5)));
        this.pageOptions.total = parseInt(data.length, 10);
        this.pageOptions.pageNum = Math.ceil(this.pageOptions.total / this.pageOptions.pageSize);
        let xAxisData = [];
        this.startNum = [];
        this.activeUser = [];

        if (data.length) {
          data.forEach((vv) => {
            xAxisData.push(moment(vv.time).format('YYYY/MM/DD'));
            this.startNum.push(vv.visit_num);// todo
            this.activeUser.push(vv.play_num);// tod
          });
          this.chartsOptions.xAxisData = xAxisData;
          // this.chartsOptions.seriesData = [this.addUser, this.activeUser];
          this.chartsOptions.seriesData = [this.startNum];
          this.chartsOptions.showLegend = false;
          this.refresh += 1;
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
