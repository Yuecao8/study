<template>
  <div class="overview history">
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
           <drop-checkbox :opt="siteList" :text="'站点'" :keys="'sites'" v-on:handle-sites-chose="sitesChose"></drop-checkbox>
        </div>
      </div>
    </div>

    <div class="data-box" v-loading="allLoading">

      <div class="charts-box">
        <div class="title-box">
          <span class="title">分时数据</span>
        </div>
        <div class="charts-contain">
            <tab-box
            :tab-list="[{name:'浏览量（PV）',id:'click'},{name:'独立用户（UV）',id:'play'},
            {name:'独立IP',id:'people'}]"
            v-on:handle-active-tab="handleTabChange" :handle-active="activeItem"
            ></tab-box>
            <line-charts :charts-options="chartsOptions" :refresh-data="refresh"></line-charts>
        </div>
      </div>
       <div class="table-box table-first">
        <div class="title-box">
          <span class="title">详细数据</span>
        </div>
        <div class="table-export">
          <span><i class="icon-export"></i>导出CSV</span>
        </div>
        <div class="table-body white" v-loading="detailLoading">
              <div class="table-header flex-v-center">
                  <div class="time flex-one">时间</div>
                   <div class="w-100">浏览量均值</div>
                   <div class="w-100">独立用户均值</div>
                   <div class="w-100">独立IP均值</div>
              </div>
              <div class="table-content">
                  <div v-if="!detailList.length" class="table-no-data">
                      暂无数据
                  </div>
                  <div class="table-item flex-v-center" v-if="detailList.length" v-for="(item,index) in detailList" :key="index">
                      <div class="flex-one">
                          {{item.time.toString().substring(0,4)}}/{{item.time.toString().substring(5,7)}}/{{item.time.toString().substring(8)}}
                      </div>
                      <!-- <div class="w-100">{{item.date.toString().substring(0,4)}}/{{item.date.toString().substring(4,6)}}/{{item.date.toString().substring(6)}}</div> -->
                      <div class="w-100">{{item.click_num}}</div>
                      <div class="w-100">{{item.play_num}}</div>
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
                      @current-change="handleDetailCurrentChange"
                      @size-change="handleDetailSizeChange"
                      >
                  </el-pagination>
              </div>
          </div>
      </div>
    </div>

  </div>
</template>
<script>
import DataCard from '../../../components/common/DataCard';
import TabBox from '../../../components/common/TabBox';
import LineCharts from '../../../components/charts/LineCharts';
import TableHeadSort from '../../../components/common/TableHeadSort';
import TimeSelect from '../../../components/select/TimeSelect';
// import CheckboxSelect from '../../components/select/CheckboxSelect';
import typeSelect from '../../../components/select/typeSelect';
import DropCheckbox from '../../../components/select/dropCheckbox';
let moment = require('moment');
export default {
  name: 'ContentHistory',
  components: {
    DataCard: DataCard,
    TabBox,
    LineCharts,
    TableHeadSort,
    TimeSelect,
    DropCheckbox,
    typeSelect,
  },
  data () {
    return {
      opt: ['昨天', '3天', '7天', '30天', '90天'],
      refreshSelect: 0,
      sort: '',
      siteId: '',
      sortObj: {},
      chartsOptions: {},
      dataList: [],
      allLoading: true,
      pageOptions: {
        page: 1, // 当前页
        pageSize: 5, // 每页条数
        pageNum: 1, // 总共页码
        total: 0,
      },
      refresh: 0,
      // 图表
      clickData: [],
      playData: [],
      watchData: [],
      detailLoading: false,
      // 列表
      detailList: [],
      detailAllList: [],
      // 站点
      siteList: [],
      siteArr: [],
      active: '0',
      activeItem: { id: 'click' },
    };
  },
  methods: {
    // 切换分时数据
    handleTabChange (data) {
      // 测试数据
      switch (data.id) {
        case 'click':
          this.chartsOptions.seriesData = [this.clickData];
          break;
        case 'play':
          this.chartsOptions.seriesData = [this.playData];
          break;
        case 'people':
          this.chartsOptions.seriesData = [this.watchData];
          break;
        default:
          break;
      }

      this.refresh = this.refresh + 1;
    },
    getParams (param) {
      if (this.siteArr.length && parseInt(this.active, 10) !== 0) {
        const ids = [];
        this.siteArr.forEach((vv) => {
          ids.push(vv.id);
        });
        param.site_id = ids.join(',');
      }
      return param;
      // 传 site_id end
    },
    // 站点选择变化
    sitesChose () {
      const arr = JSON.parse(window.sessionStorage.getItem('sites-chose'));
      const active = JSON.parse(window.sessionStorage.getItem('sites-chose-active'));
      this.siteArr = arr || [];
      this.active = active || '0';
      this.changeData();
    },
    // 获取图表数据和详细数据
    async fetchData () {
      try {
        let param = {
          content_type: 'livmedia',
        };
        if (this.$route.query.start_date) {
          param.start_date = this.$route.query.start_date;
          param.end_date = this.$route.query.end_date;
        } else {
          param.start_date = moment().subtract(1, 'days').format('YYYY-MM-DD');
          param.end_date = moment().subtract(1, 'days').format('YYYY-MM-DD');
        }
        param = this.getParams(param);
        const data = await this.$api.contentDay(param);
        this.detailAllList = JSON.parse(JSON.stringify(data));
        this.detailList = JSON.parse(JSON.stringify(this.detailAllList.slice(0, 5)));
        this.pageOptions.total = parseInt(data.length, 10);
        this.pageOptions.pageNum = Math.ceil(this.pageOptions.total / this.pageOptions.pageSize);
        let xAxisData = [];
        this.clickData = [];
        this.playData = [];
        this.watchData = [];
        if (data.length) {
          data.forEach((vv) => {
            xAxisData.push(moment(vv.time).format('YYYY/MM/DD'));
            this.clickData.push(vv.click_num);
            this.playData.push(vv.play_num);
            this.watchData.push(vv.visit_num);
          });
          this.chartsOptions.xAxisData = xAxisData;
          this.chartsOptions.seriesData = [this.clickData];
          this.chartsOptions.showLegend = false;
          this.refresh += 1;
          this.allLoading = false;
        }
      } catch (e) {
        this.allLoading = false;
      }
    },
    // 获取站点数据
    async getSiteList () {
      try {
        const data = await this.$api.webSiteList();
        data.forEach((vv) => {
          vv.id = vv.site_id;
        });
        this.siteList = data;
      } catch (e) {
      }
    },
    handleDetailCurrentChange (val) {
      const offset = (this.pageOptions.pageSize) * (val - 1);
      this.pageOptions.page = val;
      this.detailList = [];
      const all = JSON.parse(JSON.stringify(this.detailAllList));
      this.detailList = all.slice(offset, this.pageOptions.pageSize + offset);
    },
    handleDetailSizeChange (size) {
      this.pageOptions.page = 1;
      this.pageOptions.pageSize = size;
      this.detailList = [];
      const all = JSON.parse(JSON.stringify(this.detailAllList));
      this.detailList = all.slice(0, this.pageOptions.pageSize);
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
        path: '/terminal/web/periodTime',
        query: params,
      });
    },
    changeData () {
      this.pageOptions.page = 1;
      this.allLoading = true;
      this.fetchData();
      this.activeItem = { id: 'click' };
    },
  },
  created () {
    this.allLoading = true;
    this.getSiteList();
    const arr = JSON.parse(window.sessionStorage.getItem('sites-chose'));
    const active = JSON.parse(window.sessionStorage.getItem('sites-chose-active'));
    this.siteArr = arr || [];
    this.active = active || '0';
    this.changeData();
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': 'changeData', // 只有这个页面初始化之后，这个监听事件才开始生效
  },
  destroyed () {
    window.sessionStorage.removeItem('sites-chose');
    window.sessionStorage.removeItem('sites-chose-active');
  },
};
</script>

<style lang="scss" scoped>
@import '~@/assets/style/table.scss';
.charts-contain{
  background:#fff;
}
.cards-box{
  max-width: 1080px;
  margin-bottom:30px;
}
.charts-box{
  margin-bottom:30px;
}
.media{
  .data-card{
    background-size:200px;
    width: 200px;
  }
}
.history{
  .table-first {
      margin-bottom: 20px;
  }
}
.table-export{
    height: 44px;
    display: flex;
    background: #fff;
    line-height: 44px;
    justify-content: flex-end;
    padding-right: 20px;
    span{
      font-size: 12px;
      color: #5D8FFE;
    }
    i{
      padding-left: 16px;
    }
}
.icon-export{
    width: 12px;
    height: 12px;
    @include img-retina('~@/assets/image/content_daochu_icon_default.png','~@/assets/image/content_daochu_icon_default@2x.png',13px,13px);
}
//选择
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
  .site-check{
    width: calc(100% - 60px);
  }
  .check-label{
    position: relative;
    top:3px;
  }
  .m-t-20{
    margin-top:20px;
  }
}
</style>
