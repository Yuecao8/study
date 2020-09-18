<template>
  <div class="userActive">
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
      <div class="data-box" v-loading="allLoading">
          <div class="title-box">
            <span class="title">昨日关键指标</span>
          </div>
          <div class="cards-box flex-between">
            <data-card :options="startUpViews"></data-card>
            <data-card :options="activesViews"></data-card>
            <data-card :options="addDeviceViews"></data-card>
            <data-card :options="addRegViews"></data-card>
          </div>
          <div class="charts-box">
            <div class="title-box">
              <span class="title">每日数据</span>
            </div>
            <div class="charts-contain">
                <tab-box
                :tab-list="[{name:'活跃用户',id:'activeUser'},{name:'新增用户（含未注册用户）',id:'addUser'},
                {name:'新增注册',id:'addRegistered'}]"
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
                    <span class="w-100">活跃用户</span>
                    <span class="w-200">新增用户（含未注册用户）</span>
                    <span class="w-100">新增注册</span>
                </div>
                <div class="table-content">
                    <div v-if="!detailList.length" class="table-no-data">
                        暂无数据
                    </div>
                    <div class="table-item flex-v-center" v-if="detailList.length" v-for="(item,index) in detailList" :key="index">
                        <div class="flex-one">{{item.time.toString().substring(0,4)}}/{{item.time.toString().substring(5,7)}}/{{item.time.toString().substring(8)}}</div>
                        <div class="w-100">{{item.click_num}}</div>
                        <div class="w-200">{{item.comment_num}}</div>
                        <div class="w-100">{{item.share_num}}</div>
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
let moment = require('moment');
export default {
  name: 'userActive',

  components: {
    DropCheckbox,
    DataCard,
    LineCharts,
    TabBox,
    TimeSelect,
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
      // 启动次数
      startUpViews: {
        colorStyle: 'green-style', // colorStyle 颜色风格
        title: '累计用户',
        brief: '',
        num: '0',
        beforeImg: false,
        afterImg: false,
      },
      // 活跃用户
      activesViews: {
        colorStyle: 'purple-style', // colorStyle 颜色风格
        title: '活跃用户',
        brief: '',
        num: '0',
        beforeImg: false,
        afterImg: false,
      },
      // 新增用户
      addDeviceViews: {
        colorStyle: 'blue-style', // colorStyle 颜色风格
        title: '新增用户',
        brief: '',
        num: '0',
        beforeImg: false,
        afterImg: false,
      },
      // 新增注册
      addRegViews: {
        colorStyle: 'red-style', // colorStyle 颜色风格
        title: '新增注册',
        brief: '',
        num: '0',
        beforeImg: false,
        afterImg: false,
      },
      // 图表
      activeItem: { id: 'activeUser' },
      refresh: 0,
      chartsOptions: {},
      activeUser: [],
      addUser: [],
      addRegistered: [],
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
        case 'activeUser':
          this.chartsOptions.seriesData = [this.activeUser];
          break;
        case 'addUser':
          this.chartsOptions.seriesData = [this.addUser];
          break;
        case 'addRegistered':
          this.chartsOptions.seriesData = [this.addRegistered];
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
        path: '/user/data/active',
        query: params,
      });
    },
    changeData () {
      this.allLoading = true;
      this.pageOptions.page = 1;
      this.getTargetData();
      this.fetchData();
      this.activeItem = { id: 'activeUser' };
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
        this.activeUser = [];
        this.addUser = [];
        this.addRegistered = [];
        if (data.length) {
          data.forEach((vv) => {
            xAxisData.push(moment(vv.time).format('YYYY/MM/DD'));
            this.activeUser.push(vv.click_num);// todo
            this.addUser.push(vv.play_num);// todo
            this.addRegistered.push(vv.visit_num);// todo
          });
          this.chartsOptions.xAxisData = xAxisData;
          this.chartsOptions.seriesData = [this.activeUser];
          this.chartsOptions.showLegend = false;
          this.refresh += 1;
          this.allLoading = false;
        }
      } catch (e) {
        this.allLoading = false;
      }
    },
    // 获取实时卡片数据
    async getTargetData () {
      try {
        let param = {
          content_type: 'livmedia',
        };
        param.start_date = moment().subtract(1, 'days').format('YYYY-MM-DD');
        param.end_date = moment().subtract(1, 'days').format('YYYY-MM-DD');
        param = this.getParams(param);
        const data = await this.$api.contentTarget(param);
        this.startUpViews.num = data.comment_num ? data.comment_num : 0;
        this.activesViews.num = data.click_num ? data.click_num : 0;
        this.addDeviceViews.num = data.play_num ? data.play_num : 0;
        this.addRegViews.num = data.visit_num ? data.visit_num : 0;
      } catch (e) {
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
