<template>
  <div class="overview" v-loading="allLoading">
    <div class="select-box">
      <div class="d-flex flex-v-center">
        <span class="select-label">统计日期：</span>
        <div class="flex-one">
           <time-select :opt="opt" v-on:time-select-change="timeSelectChange"></time-select>
        </div>
      </div>
      <div class="d-flex m-t-20 flex-v-center">
        <span class="select-label check-label">站点：</span>
        <div class="flex-one z-index-6">
          <drop-checkbox :opt="siteList" :text="'站点'" :keys="'sites'" v-on:handle-sites-chose="sitesChose"></drop-checkbox>
        </div>
      </div>
      <div class="d-flex m-t-20 flex-v-center">
        <span class="select-label check-label">内容类型：</span>
        <div class="site-check flex-one">
          <type-select :opt="typeList" :widths="'72px'" :heights="'32px'" v-on:select-type="typeSelectChang" :keys="'sytleData'"></type-select>
        </div>
        <!-- <div class="site-check flex-one">
          <checkbox-select :opt="typeList" :widths="'58px'" v-on:checkbox-type="typeSelectChang" :keys="'type'"></checkbox-select>
        </div> -->

      </div>

    </div>

    <div class="data-box" v-loading="bodyLoading">
      <div class="title-box">
        <span class="title">关键指标</span>
      </div>
      <div class="cards-box flex-between">
        <data-card :options="readViews"></data-card>
        <data-card :options="commentViews"></data-card>
        <data-card :options="shareViews"></data-card>
        <data-card :options="praiseViews"></data-card>
      </div>
      <div class="charts-box">
        <div class="title-box">
          <span class="title">数据指标</span>
        </div>
        <div class="charts-contain">
            <tab-box
            :tab-list="[{name:'阅读次数',id:'read'},{name:'评论次数',id:'comment'},
            {name:'分享次数',id:'share'},{name:'点赞次数',id:'praise'}]"
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
                  <div class="time flex-one">时间</div>
                   <div class="w-100">阅读次数</div>
                   <div class="w-100">评论次数</div>
                   <div class="w-100">转发次数</div>
                   <div class="w-100">点赞次数</div>
              </div>
              <div class="table-content">
                  <div v-if="!detailList.length" class="table-no-data">
                      暂无数据
                  </div>
                  <div class="table-item flex-v-center" v-if="detailList.length" v-for="(item,index) in detailList" :key="index">
                      <div class="flex-one">
                          {{item.time.substring(0,4)}}/{{item.time.substring(5,7)}}/{{item.time.substring(8)}}
                      </div>
                      <!-- <div class="w-100">{{item.date.toString().substring(0,4)}}/{{item.date.toString().substring(4,6)}}/{{item.date.toString().substring(6)}}</div> -->
                      <div class="w-100">{{item.click_num}}</div>
                      <div class="w-100">{{item.comment_num}}</div>
                      <div class="w-100">{{item.share_num}}</div>
                      <div class="w-100">{{item.like_num}}</div>
                    </div>
              </div>
              <div class="table-bottom flex-v-center table-bottom-page" v-if="detailList.length">
                  <span class="page-total">总共 {{detailPageOptions.total}} 条记录</span>
                  <el-pagination v-if="!bodyLoading"
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
      <div class="table-box">
        <div class="title-box">
          <span class="title">当日内容数据</span>
        </div>
        <div class="table-body white" v-loading="listLoading">
              <div class="table-header flex-v-center">
                  <div class="time flex-one">内容标题</div>
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
                  :title="'转发次数'"
                  v-on:table-sort-change="handleSortChange"
                  :sort-key="'share_num'"
                  :is-sort="sort"></table-head-sort>
                   <table-head-sort
                  :width="'w-100'"
                  :title="'点赞次数'"
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
                          {{item.title}}
                      </div>
                      <!-- <div class="w-100">{{item.date.toString().substring(0,4)}}/{{item.date.toString().substring(4,6)}}/{{item.date.toString().substring(6)}}</div> -->
                      <div class="w-100">{{item.click_num}}</div>
                      <div class="w-100">{{item.comment_num}}</div>
                      <div class="w-100">{{item.share_num}}</div>
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
import DataCard from '../../components/common/DataCard';
import TabBox from '../../components/common/TabBox';
import LineCharts from '../../components/charts/LineCharts';
import TableHeadSort from '../../components/common/TableHeadSort';
import TimeSelect from '../../components/select/TimeSelect';
// import CheckboxSelect from '../../components/select/CheckboxSelect';
import typeSelect from '../../components/select/typeSelect';
import DropCheckbox from '../../components/select/dropCheckbox';
let moment = require('moment');
export default {
  name: 'ContentHistory',
  components: {
    DataCard: DataCard,
    TabBox,
    LineCharts,
    TableHeadSort,
    TimeSelect,
    // CheckboxSelect,
    typeSelect,
    DropCheckbox,
  },
  data () {
    return {
      siteArr: [],
      active: '0',
      opt: ['昨天', '3天', '7天', '30天'],
      typeList: [
        { name: '文稿', id: 'news', isActive: 0 },
        { name: '图集', id: 'tuji', isActive: 0 },
        { name: '外链', id: 'outlink', isActive: 0 },
      ],
      refreshSelect: 0,
      sort: '',
      sortObj: {},
      chartsOptions: {},
      dataList: [],
      bodyLoading: false,
      allLoading: false,
      // 评论次数
      commentViews: {
        colorStyle: 'purple-style', // colorStyle 颜色风格
        title: '评论次数',
        brief: '',
        num: '0',
        beforeImg: false,
        afterImg: false,
      },
      // 阅读次数
      readViews: {
        colorStyle: 'green-style', // colorStyle 颜色风格
        title: '阅读次数',
        brief: '',
        num: '0',
        beforeImg: false,
        afterImg: false,
      },
      // 分享次数
      shareViews: {
        colorStyle: 'blue-style', // colorStyle 颜色风格
        title: '分享次数',
        brief: '',
        num: '0',
        beforeImg: false,
        afterImg: false,
      },
      // 点赞次数
      praiseViews: {
        colorStyle: 'red-style', // colorStyle 颜色风格
        title: '点赞次数',
        brief: '',
        num: '0',
        beforeImg: false,
        afterImg: false,
      },
      listLoading: false,
      pageOptions: {
        page: 1, // 当前页
        pageSize: 5, // 每页条数
        pageNum: 1, // 总共页码
        total: 0, // 总共条数
      },
      detailPageOptions: {
        page: 1, // 当前页
        pageSize: 5, // 每页条数
        pageNum: 1, // 总共页码
        total: 0,
      },
      refresh: 0,
      readData: [],
      commentData: [],
      shareData: [],
      praiseData: [],
      siteList: [],
      detailList: [],
      detailAllList: [],
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
    // 获取图表数据和详细数据
    async fetchData () {
      try {
        let param = {
          content_type: 'content',
        };
        if (this.$route.query.start_date) {
          param.start_date = this.$route.query.start_date;
          param.end_date = this.$route.query.end_date;
        } else {
          param.start_date = moment().subtract(1, 'days').format('YYYY-MM-DD');
          param.end_date = moment().subtract(1, 'days').format('YYYY-MM-DD');
        }
        param = this.getParam(param);
        const data = await this.$api.contentDay(param);
        this.detailAllList = JSON.parse(JSON.stringify(data));
        this.detailList = JSON.parse(JSON.stringify(this.detailAllList.slice(0, 5)));
        this.detailPageOptions.total = parseInt(data.length, 10);
        this.detailPageOptions.pageNum = Math.ceil(this.detailPageOptions.total / this.detailPageOptions.pageSize);
        let xAxisData = [];
        this.readData = [];
        this.commentData = [];
        this.shareData = [];
        this.praiseData = [];
        if (data.length) {
          data.forEach((vv) => {
            xAxisData.push(moment(vv.time).format('YYYY/MM/DD'));
            this.readData.push(vv.click_num);
            this.commentData.push(vv.comment_num);
            this.shareData.push(vv.share_num);
            this.praiseData.push(vv.like_num);
          });
          this.chartsOptions.xAxisData = xAxisData;
          this.chartsOptions.seriesData = [this.readData];
          this.chartsOptions.showLegend = false;
          this.refresh += 1;
        }
      } catch (e) {

      }
    },
    getParam (param) {
      if (JSON.parse(window.sessionStorage.getItem('sytleData')) && JSON.parse(window.sessionStorage.getItem('sytleData')).length) {
        const arr = JSON.parse(window.sessionStorage.getItem('sytleData'));
        const ids = [];
        arr.forEach((vv) => {
          ids.push(vv.id);
        });
        param.bundle_id = ids.join(',');
      }
      if (this.siteArr.length && parseInt(this.active, 10) !== 0) {
        const ids = [];
        this.siteArr.forEach((vv) => {
          ids.push(vv.id);
        });
        param.site_id = ids.join(',');
      }
      return param;
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
        content_type: 'content',
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
      param = this.getParam(param);
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
      this.bodyLoading = false;
    },
    async getData () {
      try {
        let param = {
          content_type: 'content',
        };
        if (this.$route.query.start_date) {
          param.start_date = this.$route.query.start_date;
          param.end_date = this.$route.query.end_date;
        } else {
          param.start_date = moment().subtract(1, 'days').format('YYYY-MM-DD');
          param.end_date = moment().subtract(1, 'days').format('YYYY-MM-DD');
        }
        param = this.getParam(param);
        const data = await this.$api.contentTarget(param);
        this.commentViews.num = data.comment_num ? data.comment_num : 0;
        this.readViews.num = data.click_num ? data.click_num : 0;
        this.shareViews.num = data.share_num ? data.share_num : 0;
        this.praiseViews.num = data.like_num ? data.like_num : 0;
      } catch (e) {

      }
    },
    // 获取累计数据
    async getTargetData () {
      this.getData();
      try {
        let param = {
          content_type: 'content',
          start_date: moment().subtract(1, 'days').format('YYYY-MM-DD'),
          end_date: moment().subtract(1, 'days').format('YYYY-MM-DD'),
        };
        param = this.getParam(param);
        const data = await this.$api.contentTarget(param);
        this.commentViews.brief = `昨日 ${data.comment_num}`;
        this.readViews.brief = `昨日 ${data.click_num}`;
        this.shareViews.brief = `昨日 ${data.share_num}`;
        this.praiseViews.brief = `昨日 ${data.like_num}`;
      } catch (e) {
        this.commentViews.brief = '昨日 0';
        this.readViews.brief = '昨日 0';
        this.shareViews.brief = '昨日 0';
        this.praiseViews.brief = '昨日 0';
      }
    },
    // 获取站点数据
    async getSiteList () {
      try {
        const data = await this.$api.siteList();
        if (this.$route.query.siteId && this.$route.query.siteId !== 0) {
          const index = data.findIndex(obj => parseInt(obj.id, 10) === parseInt(this.$route.query.siteId, 10));
          this.siteId = data[index].id;
        }
        if (!this.$route.query.siteId || this.$route.query.siteId === 0) {
          this.siteId = 0;
        }
        this.siteList = data;
      } catch (e) {
      }
    },
    // 页码切换
    handleCurrentChange (val) {
      // page: val, pageSize: this.pageOptions.pageSize
      this.getTodayData(val, this.pageOptions.pageSize);
    },
    // 切换每页显示条数
    handleSizeChange (size) {
      this.getTodayData(1, size);
    },
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
        path: '/content/basic/history',
        query: params,
      });
    },
    // 站点选择变化
    sitesChose () {
      const arr = JSON.parse(window.sessionStorage.getItem('sites-chose'));
      const active = JSON.parse(window.sessionStorage.getItem('sites-chose-active'));
      this.siteArr = arr || [];
      this.active = active || '0';
      this.changeData();
    },
    // 内容类型变化
    typeSelectChang (selectData) {
      this.changeData();
    },
    changeData () {
      this.pageOptions.page = 1;
      this.detailPageOptions.page = 1;
      this.bodyLoading = true;
      this.fetchData();
      this.getTargetData();
      this.getTodayData();
      this.activeItem = { id: 'read' };
    },
  },
  created () {
    this.bodyLoading = true;
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
    window.sessionStorage.removeItem('type');
    window.sessionStorage.removeItem('sytleData');
  },
};
</script>

<style lang="scss" scoped>
@import '~@/assets/style/table.scss';
.z-index-6{
  z-index: 6;
}
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
.table-box{
  margin-bottom:30px;
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
<style lang="scss">
  .el-input__inner{
    // height: 32px;
  }
</style>
