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
        <span class="select-label">网站：</span>
        <div class="flex-one">
           <drop-checkbox :opt="webList" :text="'网站'" :keys="'web'" v-on:handle-sites-chose="webChose"></drop-checkbox>
        </div>
      </div>
    </div>

    <div class="data-box" v-loading="allLoading">
      <div class="table-box">
        <div class="title-box">
          <span class="title">详细数据</span>
        </div>
        <!-- <div class="table-export">
          <span><i class="icon-export"></i>导出CSV</span>
        </div> -->
        <div class="table-body white">
              <div class="table-header flex-v-center">
                  <div class="time flex-one">页面url</div>
                  <div class="w-200">页面title</div>
                  <!-- <div class="w-200">发稿日期</div> 暂无 -->
                   <table-head-sort
                  :width="'w-100'"
                  :title="'浏览量（PV）'"
                  v-on:table-sort-change="handleSortChange"
                  :sort-key="'pv_count'"
                  :is-sort="sort"></table-head-sort>
                   <table-head-sort
                  :width="'w-140'"
                  :title="'独立用户（UV）'"
                  v-on:table-sort-change="handleSortChange"
                  :sort-key="'visitor_count'"
                  :is-sort="sort"></table-head-sort>
                   <table-head-sort
                  :width="'w-100'"
                  :title="'独立IP'"
                  v-on:table-sort-change="handleSortChange"
                  :sort-key="'ip_count'"
                  :is-sort="sort"></table-head-sort>
                   <table-head-sort
                  :width="'w-100'"
                  :title="'下游引流量'"
                  v-on:table-sort-change="handleSortChange"
                  :sort-key="'outward_count'"
                  :is-sort="sort"></table-head-sort>
                  <table-head-sort
                  :width="'w-100'"
                  :title="'页面受访比率'"
                  v-on:table-sort-change="handleSortChange"
                  :sort-key="'outward_count'"
                  :is-sort="sort"></table-head-sort>
                  <table-head-sort
                  :width="'w-100'"
                  :title="'跳出率'"
                  v-on:table-sort-change="handleSortChange"
                  :sort-key="'exit_ratio'"
                  :is-sort="sort"></table-head-sort>
              </div>
              <div class="table-content">
                  <div v-if="!dataList.length" class="table-no-data">
                      暂无数据
                  </div>
                  <div class="table-item flex-v-center" v-if="dataList.length" v-for="(item,index) in dataList" :key="index">
                      <div class="flex-one">
                          {{item.page_name}}
                      </div>
                      <div class="w-200">{{item.page_name}}</div>
                      <div class="w-100">{{item.pv_count}}</div>
                      <div class="w-140">{{item.visitor_count}}</div>
                      <div class="w-100">{{item.ip_count}}</div>
                      <div class="w-100">{{item.outward_count}}</div>
                      <div class="w-100">{{item.outward_count}}</div>
                      <div class="w-100">{{item.exit_ratio.toFixed(2)}}</div>
                    </div>
              </div>
              <div class="table-bottom flex-v-center table-bottom-page" v-if="dataList.length">
                  <span class="page-total">总共 {{pageOptions.total}} 条记录</span>
                  <el-pagination v-if="pagination"
                      background
                      layout="prev, pager, next,sizes,jumper"
                      :page-size=pageOptions.pageSize
                      :page-sizes="[10,20,50]"
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
    // CheckboxSelect,
    typeSelect,
    // dropCheckbox,
  },
  data () {
    return {
      sort: '',
      sortObj: {},
      opt: ['昨天', '3天', '7天', '30天', '90天'],
      allLoading: false,
      // 站点
      webList: [],
      webArr: [],
      active: '0',
      pageOptions: {
        page: 1, // 当前页
        pageSize: 10, // 每页条数
        pageNum: 1, // 总共页码
        total: 0, // 总共条数
      },
      // 列表
      dataList: [],
      pagination: false,
    };
  },
  methods: {

    // 切换排序项
    handleSortChange (keyObj) {
      this.sort = keyObj.key;
      this.sortObj = keyObj;
      this.pageOptions.page = 1;
      this.changeData();
    },
    // 分页
    handleCurrentChange (val) {
      this.pageOptions.page = val;
      this.changeData();
    },
    handleSizeChange (size) {
      this.pageOptions.pageSize = size;
      this.changeData();
    },
    // 网站选择
    webChose () {
      const arr = JSON.parse(window.sessionStorage.getItem('web-chose'));
      const active = JSON.parse(window.sessionStorage.getItem('web-chose-active'));
      this.webArr = arr || [];
      this.active = active || '0';
      this.clear();
      this.changeData();
    },
    // 清空参数
    clear () {
      this.pageOptions.page = 1;
      this.sort = '';
      this.sortObj = {};
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
      this.clear();
      this.$router.push({
        path: '/terminal/web/access',
        query: params,
      });
    },
    changeData () {
      this.allLoading = true;
      this.fetchData();
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
    // 获取数据
    async fetchData () {
      this.pagination = false;
      let param = {
        page: parseInt(this.pageOptions.page, 10),
        size: parseInt(this.pageOptions.pageSize, 10),
      };
      if (this.sortObj && this.sortObj.status) {
        param.order = this.sortObj.key;
        param.sort = this.sortObj.status === 'up' ? 1 : -1;
      }
      if (this.$route.query.start_date) {
        param.start_date = this.$route.query.start_date;
        param.end_date = this.$route.query.end_date;
      } else {
        param.start_date = moment().subtract(1, 'days').format('YYYY-MM-DD');
        param.end_date = moment().subtract(1, 'days').format('YYYY-MM-DD');
      }
      param = this.getParams(param);
      try {
        const data = await this.$api.webPage(param); // todo
        this.dataList = data.data;
        this.pageOptions.total = parseInt(data.total, 10);
        this.pageOptions.pageNum = Math.ceil(this.pageOptions.total / this.pageOptions.pageSize);
        this.allLoading = false;
        this.pagination = true;
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
        param.site_id = ids.join(',');
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
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': 'changeData', // 只有这个页面初始化之后，这个监听事件才开始生效
  },
  destroyed () {
    window.sessionStorage.removeItem('web-chose');
    window.sessionStorage.removeItem('web-chose-active');
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
