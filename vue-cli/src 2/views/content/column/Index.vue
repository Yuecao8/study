<template>
  <div class="content-column" v-loading ="allLoading">
      <div class="select-box">
        <div class="d-flex flex-v-center m-b-20">
          <span class="select-label">统计日期：</span>
          <div class="flex-one">
            <time-select :opt="opt" v-on:time-select-change="timeSelectChange"></time-select>
          </div>
        </div>
        <div class="d-flex flex-v-center">
          <span class="select-label">栏目：</span>
          <div class="flex-one">
            <column-selection v-on:handle-column-chose="columnChose"></column-selection>
          </div>
        </div>
      </div>
      <div v-loading ="bodyLoading">
         <div class="charts-box">
          <div class="title-box">
            <span class="title">栏目排行</span>
          </div>
          <div class="charts-contain">
              <tab-box
              :tab-list="[{name:'阅读次数',id:'read'},{name:'评论次数',id:'comment'},
              {name:'分享次数',id:'share'},{name:'点赞次数',id:'praise'}]"
              v-on:handle-active-tab="handleTabChange"
              :handle-active="activeItem"
              ></tab-box>
              <div v-if="!dataList.length" class="table-no-data">
                      暂无数据
              </div>
              <div v-if="dataList.length">
                <bar-charts :charts-options="chartsOptions" :refresh-data="refresh"></bar-charts>
              </div>

          </div>
         </div>
        <div class="table-box">
          <div class="title-box">
            <span class="title">详细数据</span>
          </div>
          <div class="table-body white" v-loading="listLoading">
                <div class="table-header flex-v-center">
                    <div class="time flex-one">栏目名称</div>
                    <!-- <div class="w-100">发稿日期</div> 暂无 -->
                    <table-head-sort
                    :width="'w-100'"
                    :title="'阅读次数'"
                    v-on:table-sort-change="handleSortChange"
                    :sort-key="'click_num'"
                    :is-sort="sort"></table-head-sort>
                    <table-head-sort
                    :width="'w-100'"
                    :title="'评论次数'"
                    v-on:table-sort-change="handleSortChange"
                    :sort-key="'comment_num'"
                    :is-sort="sort"></table-head-sort>
                    <table-head-sort
                    :width="'w-100'"
                    :title="'分享次数'"
                    v-on:table-sort-change="handleSortChange"
                    :sort-key="'share_num'"
                    :is-sort="sort"></table-head-sort>
                    <table-head-sort
                    :width="'w-100'"
                    :title="'点赞次数'"
                    v-on:table-sort-change="handleSortChange"
                    :sort-key="'like_num'"
                    :is-sort="sort"></table-head-sort>
                    <div class="time w-60">栏目详情</div>
                </div>
                <div class="table-content">
                    <div v-if="!pageList.length" class="table-no-data">
                        暂无数据
                    </div>
                    <div class="table-item flex-v-center" v-if="pageList.length" v-for="(item,index) in pageList" :key="index">
                        <div class="flex-one">
                            {{item.name}}
                        </div>
                        <!-- <div class="w-100">{{item.date.toString().substring(0,4)}}/{{item.date.toString().substring(4,6)}}/{{item.date.toString().substring(6)}}</div> -->
                        <div class="w-100">{{item.click_num}}</div>
                        <div class="w-100">{{item.comment_num}}</div>
                        <div class="w-100">{{item.share_num}}</div>
                        <div class="w-100">{{item.like_num}}</div>
                        <div class="w-60">
                          <span class="click-text" @click="goDetail(item)">查看</span>
                        </div>
                      </div>
                </div>
                <div class="table-bottom flex-v-center table-bottom-page" v-if="pageList.length">
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
import TimeSelect from '../../../components/select/TimeSelect';
import ColumnSelection from '../../../components/select/ColumnSelection';
import BarCharts from '../../../components/charts/BarCharts';
import TabBox from '../../../components/common/TabBox';
import TableHeadSort from '../../../components/common/TableHeadSort';
let moment = require('moment');
export default {
  name: 'ColumnIndex',
  props: [],
  components: {
    TimeSelect,
    ColumnSelection,
    BarCharts,
    TabBox,
    TableHeadSort,
  },
  data () {
    return {
      sort: '',
      sortObj: {},
      listLoading: false,
      bodyLoading: false,
      chartsLoading: false,
      allLoading: false,
      opt: ['昨天', '3天', '7天', '30天'],
      siteId: '',
      pageOptions: {
        page: 1, // 当前页
        pageSize: 5, // 每页条数
        pageNum: 1, // 总共页码
        total: 0, // 总共条数
      },
      dataList: [], // 总的
      pageList: [], // 分页的
      columnList: [],
      siteList: [],
      siteSelect: [],
      loading: false,
      refresh: 0,
      chartsOptions: {},
      activeItem: { id: 'read' },
    };
  },
  methods: {
    // 切换分时数据
    handleTabChange (data) {
      // 测试数据
      switch (data.id) {
        case 'read':
          this.chartsOptions.seriesData = [this.readData];
          break;
        case 'comment':
          this.chartsOptions.seriesData = [this.commentData];
          break;
        case 'share':
          this.chartsOptions.seriesData = [this.shareData];
          break;
        case 'praise':
          this.chartsOptions.seriesData = [this.praiseData];
          break;
        default:
          break;
      }

      this.refresh = this.refresh + 1;
    },
    // 切换时间
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
        path: '/content/basic/column/index',
        query: params,
      });
    },
    // 切换栏目
    columnChose () {
      this.chartsLoading = true;
      this.bodyLoading = true;
      this.sort = '';
      this.sortObj = {};
      this.columnList = JSON.parse(window.sessionStorage.getItem('column-chose')) ? JSON.parse(window.sessionStorage.getItem('column-chose')) : this.columnList;
      this.fetchData();
    },
    handleCurrentChange (val) {
      const offset = (this.pageOptions.pageSize) * (val - 1);
      this.pageOptions.page = val;
      this.pageList = [];
      const all = JSON.parse(JSON.stringify(this.dataList));
      this.pageList = all.slice(offset, this.pageOptions.pageSize + offset);
    },
    handleSizeChange (size) {
      this.pageOptions.page = 1;
      this.pageOptions.pageSize = size;
      this.pageList = [];
      const all = JSON.parse(JSON.stringify(this.dataList));
      this.pageList = all.slice(0, this.pageOptions.pageSize);
    },
    // 切换排序项
    handleSortChange (keyObj) {
      this.sort = keyObj.key;
      this.sortObj = keyObj;
      this.pageOptions.page = 1;
      this.changeData();
    },
    // 获取数据
    async fetchData () {
      this.pageOptions.page = 1;
      this.bodyLoading = true;
      const param = {};
      const ids = [];
      this.columnList.forEach((vv) => {
        ids.push(vv.id);
      });
      param.column_ids = ids.join(',');
      if (this.$route.query.start_date) {
        param.start_date = this.$route.query.start_date;
        param.end_date = this.$route.query.end_date;
      } else {
        param.start_date = moment().subtract(1, 'days').format('YYYY-MM-DD');
        param.end_date = moment().subtract(1, 'days').format('YYYY-MM-DD');
      }
      try {
        const data = await this.$api.getColumnList(param);
        this.dataList = JSON.parse(JSON.stringify(data));
        this.pageList = JSON.parse(JSON.stringify(this.dataList.slice(0, 5)));
        this.pageOptions.total = parseInt(data.length, 10);
        this.pageOptions.pageNum = Math.ceil(this.pageOptions.total / this.pageOptions.pageSize);
        let xAxisData = [];
        this.readData = [];
        this.commentData = [];
        this.shareData = [];
        this.praiseData = [];
        if (data.length) {
          data.forEach((vv) => {
            xAxisData.push(vv.name);
            this.readData.push(vv.click_num);
            this.commentData.push(vv.comment_num);
            this.shareData.push(vv.share_num);
            this.praiseData.push(vv.like_num);
          });
          this.chartsOptions.axisData = xAxisData;
          this.chartsOptions.xAxisType = 'category';
          this.chartsOptions.seriesData = [this.readData];
          this.chartsOptions.showLegend = false;
          this.refresh += 1;
          // console.log(this.refresh);
        }
      } catch (e) {

      }
      this.activeItem = { id: 'read' };
      this.bodyLoading = false;
      this.listLoading = false;
      this.allLoading = false;
    },
    // 排序更新列表数据
    async changeData () {
      this.listLoading = true;
      const param = {};
      const ids = [];
      this.columnList.forEach((vv) => {
        ids.push(vv.id);
      });
      param.column_ids = ids.join(',');
      if (this.$route.query.start_date) {
        param.start_date = this.$route.query.start_date;
        param.end_date = this.$route.query.end_date;
      } else {
        param.start_date = moment().subtract(1, 'days').format('YYYY-MM-DD');
        param.end_date = moment().subtract(1, 'days').format('YYYY-MM-DD');
      }
      if (this.sortObj && this.sortObj.status) {
        param.order = this.sortObj.key;
        param.sort = this.sortObj.status === 'up' ? 1 : -1;
      }
      try {
        const data = await this.$api.getColumnList(param);
        this.dataList = JSON.parse(JSON.stringify(data));
        this.pageList = JSON.parse(JSON.stringify(this.dataList.slice(0, 5)));
        this.pageOptions.total = parseInt(data.length, 10);
        this.pageOptions.pageNum = Math.ceil(this.pageOptions.total / this.pageOptions.pageSize);
        this.listLoading = false;
      } catch (e) {
        this.listLoading = false;
      }
    },
    // 跳转页面
    goDetail (item) {
      this.$router.push({
        path: '/content/basic/column/detail', query: { colId: item.column_id, siteId: item.site_id },
      });
    },
  },
  mounted () {
    this.allLoading = true;
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': 'fetchData', // 只有这个页面初始化之后，这个监听事件才开始生效
  },
  created () {
  },
  destroyed () {
    window.sessionStorage.removeItem('column-chose');
  },
};
</script>

<style lang="scss" scoped>
@import '~@/assets/style/table.scss';
//选择
.m-b-20{
  margin-bottom:20px;
}
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
.charts-box{
  margin-bottom:30px;
}
.charts-contain{
  background: #fff;
}
.click-text{
  color: #5D8FFE;
  cursor: pointer;
}
</style>
