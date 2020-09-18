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
          <span class="title">每日数据</span>
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
      <!-- 饼图 -->
      <div class="charts-box">
        <div class="title-box">
          <span class="title">分布数据</span>
        </div>
        <div class="charts-contain">
            <tab-box
            :tab-list="[{name:'浏览量（PV）',id:'pvClick'},{name:'独立用户（UV）',id:'userClick'},
            {name:'独立IP',id:'ipClick'}]"
            v-on:handle-active-tab="PieDataChange" :handle-active="activeItem"
            ></tab-box>
            <pie-charts :pie-options="pieOptions" :refresh-piedata="pierefresh"></pie-charts>
        </div>
      </div>
      <!-- 饼图 -->
       <div class="table-box table-first">
        <div class="table-export">
          <span><i class="icon-export"></i>导出CSV</span>
        </div>
        <div class="table-body white" v-loading="detailLoading">
              <div class="table-header flex-v-center">
                  <div class="time flex-one">时间</div>
                   <div class="w-100">点击次数</div>
                   <div class="w-100">播放次数</div>
                   <div class="w-100">评论次数</div>
                   <div class="w-100">观看人次</div>
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
                      <div class="w-100">{{item.visit_num}}</div>
                    </div>
              </div>
              <div class="table-bottom flex-v-center table-bottom-page" v-if="detailList.length">
                  <span class="page-total">总共 {{detailPageOptions.total}} 条记录</span>
                  <el-pagination
                      background
                      layout="prev, pager, next,sizes,jumper"
                      :page-size=detailPageOptions.pageSize
                      :page-sizes="[5, 10, 20,50]"
                      :current-page.sync=detailPageOptions.page
                      :total=detailPageOptions.total
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
import barCharts from '../../../components/charts/BarCharts';
import pieCharts from '../../../components/charts/pieCharts';
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
    barCharts,
    pieCharts,
  },
  data () {
    return {
      opt: ['昨天', '3天', '7天', '30天', '90天'],
      refreshSelect: 0,
      sort: '',
      siteId: '',
      sortObj: {},
      chartsOptions: {},
      pieOptions: {
        name: '来源分布',
        radius: '55%',
        // radius: ['50%', '70%'],  空心的饼图
        color: ['#0191FF', '#6CBC36', '#F15151'],
        center: ['20%', '50%'],
      },
      dataList: [],
      allLoading: true,
      detailPageOptions: {
        page: 1, // 当前页
        pageSize: 5, // 每页条数
        pageNum: 1, // 总共页码
        total: 0,
      },
      refresh: 0,
      pierefresh: 0,
      clickData: [],
      playData: [],
      watchData: [],
      longtimeData: [],
      detailLoading: false,
      detailList: [],
      detailAllList: [],
      siteList: [],
      siteArr: [],
      active: '0',
      activeItem: { id: 'click' },
      data1: [],
      data2: [],
      data3: [],
    };
  },
  methods: {
    // 切换分时数据
    handleTabChange (data) {
      // 测试数据
      switch (data.id) {
        case 'click':
          console.log(this.clickData);
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
    PieDataChange (data) {
      // 测试数据
      switch (data.id) {
        case 'pvClick':
          this.pieOptions.seriesData = this.data1;
          break;
        case 'userClick':
          this.pieOptions.seriesData = this.data2;
          break;
        case 'ipClick':
          this.pieOptions.seriesData = this.data3;
          break;
        default:
          break;
      }

      this.pierefresh = this.pierefresh + 1;
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
        this.detailPageOptions.total = parseInt(data.length, 10);
        this.detailPageOptions.pageNum = Math.ceil(this.detailPageOptions.total / this.detailPageOptions.pageSize);
        let xAxisData = [];
        this.clickData = [];
        this.playData = [];
        this.watchData = [];
        this.longtimeData = [];
        if (data.length) {
          data.forEach((vv) => {
            xAxisData.push(moment(vv.time).format('YYYY/MM/DD'));
            this.clickData.push(vv.click_num);
            this.playData.push(vv.play_num);
            this.watchData.push(vv.visit_num);
            this.longtimeData.push(vv.duration_num);
          });
          this.chartsOptions.xAxisData = xAxisData;
          this.chartsOptions.seriesData = [this.clickData];
          this.chartsOptions.showLegend = false;
          this.refresh += 1;
        }
      } catch (e) {

      }
      this.allLoading = false;
    },
    // 饼图数据 start
    async GetpieData () {
      this.data1 = [{ value: 335, name: '直接访问' },
        { value: 310, name: '搜索引擎' },
        { value: 234, name: '外部访问' }];
      this.data2 = [{ value: 122, name: '直接访问' },
        { value: 310, name: '搜索引擎' },
        { value: 1234, name: '外部访问' }];
      this.data3 = [{ value: 335, name: '直接访问' },
        { value: 310, name: '搜索引擎' },
        { value: 234, name: '外部访问' }];
      const lendata = ['直接访问', '搜索引擎', '外部访问'];
      this.pieOptions.legendData = lendata;
      this.pieOptions.seriesData = this.data1;
      this.pieOptions.showLegend = false;
      this.pierefresh += 1;
    },
    // end
    // 获取站点数据
    async getSiteList () {
      try {
        const data = await this.$api.siteList();
        this.siteList = data;
      } catch (e) {
      }
    },
    // watch: {
    //   currentSite (curVal, oldVal) {
    //     window.sessionStorage.setItem('site', JSON.stringify(curVal));
    //   },
    // },

    handleDetailCurrentChange (val) {
      const offset = (this.detailPageOptions.pageSize) * (val - 1);
      this.detailPageOptions.page = val;
      this.detailList = [];
      const all = JSON.parse(JSON.stringify(this.detailAllList));
      this.detailList = all.slice(offset, this.detailPageOptions.pageSize + offset);
    },
    handleDetailSizeChange (size) {
      this.detailPageOptions.page = 1;
      this.detailPageOptions.pageSize = size;
      this.detailList = [];
      const all = JSON.parse(JSON.stringify(this.detailAllList));
      this.detailList = all.slice(0, this.detailPageOptions.pageSize);
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
        path: '/terminal/web/traffic',
        query: params,
      });
    },
    changeData () {
      this.detailPageOptions.page = 1;
      this.allLoading = true;
      this.fetchData();
      this.GetpieData();
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
    window.sessionStorage.removeItem('site');
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
