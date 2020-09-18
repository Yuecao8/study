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
      <div class="table-box">
        <div class="title-box">
          <span class="title">详细数据</span>
        </div>
        <div class="table-export">
          <span><i class="icon-export"></i>导出CSV</span>
        </div>
        <div class="table-body white" v-loading="listLoading">
              <div class="table-header flex-v-center">
                  <div class="time flex-one">外部链接</div>
                  <!-- <div class="w-200">发稿日期</div> 暂无 -->
                   <table-head-sort
                  :width="'w-100'"
                  :title="'浏览量（PV）'"
                  v-on:table-sort-change="handleSortChange"
                  :sort-key="'click_num'"
                  :is-sort="sort"></table-head-sort>
                   <table-head-sort
                  :width="'w-200'"
                  :title="'独立用户（UV）'"
                  v-on:table-sort-change="handleSortChange"
                  :sort-key="'comment_num'"
                  :is-sort="sort"></table-head-sort>
                   <table-head-sort
                  :width="'w-100'"
                  :title="'独立IP'"
                  v-on:table-sort-change="handleSortChange"
                  :sort-key="'share_num'"
                  :is-sort="sort"></table-head-sort>
                  <table-head-sort
                  :width="'w-100'"
                  :title="'跳出率'"
                  v-on:table-sort-change="handleSortChange"
                  :sort-key="'like_num'"
                  :is-sort="sort"></table-head-sort>
              </div>
              <div class="table-content">
                  <div v-if="!dataList.length" class="table-no-data">
                      暂无数据
                  </div>
                  <div class="table-item flex-v-center" v-if="dataList.length" v-for="(item,index) in dataList" :key="index">
                      <div class="flex-one">
                          {{item.title}} 页面url
                      </div>
                      <div class="w-100">浏览量（PV）</div>
                      <div class="w-200">独立用户（UV）</div>
                      <div class="w-100">{{item.like_num}}</div>
                      <div class="w-100">{{item.like_num}}</div>
                    </div>
              </div>
              <div class="table-bottom flex-v-center table-bottom-page" v-if="dataList.length">
                  <span class="page-total">总共 {{pageOptions.total}} 条记录</span>
                  <el-pagination v-if="pagination"
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
      opt: ['昨天', '3天', '7天', '30天', '90天'],
      refreshSelect: 0,
      sort: '',
      siteId: '',
      sortObj: {},
      chartsOptions: {},
      dataList: [],
      allLoading: true,
      listLoading: false,
      pageOptions: {
        page: 1, // 当前页
        pageSize: 5, // 每页条数
        pageNum: 1, // 总共页码
        total: 0, // 总共条数
      },
      refresh: 0,
      clickData: [],
      playData: [],
      watchData: [],
      longtimeData: [],
      siteList: [],
      siteArr: [],
      active: '0',
    };
  },
  methods: {

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

    // 获取列表数据
    async getTodayData (page, size) {
      this.pagination = false; // 强制刷新分页组件 不然导致分页切至第二页刷新后 1高亮问题
      this.listLoading = true;
      this.pageOptions.page = page || this.pageOptions.page;
      this.pageOptions.pageSize = size || this.pageOptions.pageSize;
      let param = {
        page: parseInt(this.pageOptions.page, 10),
        size: parseInt(this.pageOptions.pageSize, 10),
        content_type: 'livmedia',
      };
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
      param = this.getParams(param);
      try {
        const data = await this.$api.contentList(param);
        this.dataList = data.data;
        this.pageOptions.total = parseInt(data.total, 10);
        this.pageOptions.pageNum = Math.ceil(this.pageOptions.total / this.pageOptions.pageSize);
      } catch (e) {

      }
      this.pagination = true;
      this.listLoading = false;
      this.allLoading = false;
    },
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
    // 页码切换
    handleCurrentChange (val) {
      // page: val, pageSize: this.pageOptions.pageSize
      this.getTodayData(val, this.pageOptions.pageSize);
    },
    // 切换每页显示条数
    handleSizeChange (size) {
      this.getTodayData(1, size);
    },
    // 切换排序项
    handleSortChange (keyObj) {
      this.sort = keyObj.key;
      this.sortObj = keyObj;
      this.getTodayData(1, this.pageOptions.pageSize);
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
        path: '/terminal/web/link',
        query: params,
      });
    },
    changeData () {
      this.allLoading = true;
      this.pageOptions.page = 1;
      this.getTodayData();
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
