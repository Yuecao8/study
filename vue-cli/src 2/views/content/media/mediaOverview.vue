<template>
  <div class="overview">
    <div class="data-box" v-loading="allLoading">
      <div class="title-box">
        <span class="title">关键指标</span>
      </div>
      <div class="cards-box flex-between media">
        <data-card :options="currentViews"></data-card>
        <data-card :options="playViews"></data-card>
        <data-card :options="commentViews"></data-card>
        <data-card :options="peopleViews"></data-card>
        <data-card :options="longtimeViews"></data-card>
      </div>
      <div class="charts-box">
        <div class="title-box">
          <span class="title">14天分时数据</span>
        </div>
        <div class="charts-contain">
            <tab-box
            :tab-list="[{name:'点击次数',id:'click'},{name:'播放次数',id:'play'},
            {name:'观看人次',id:'watch'},{name:'评论次数',id:'comment'}]"
            v-on:handle-active-tab="handleTabChange"
            ></tab-box>
            <line-charts :charts-options="chartsOptions" :refresh-data="refresh"></line-charts>
        </div>
      </div>
      <div class="table-box">
        <div class="title-box">
          <span class="title">当日内容数据</span>
        </div>
        <div class="table-body white" v-loading="listLoading">
              <div class="table-header flex-v-center">
                  <div class="time flex-one">内容标题</div>
                  <!-- <div class="w-200">发稿日期</div> -->
                   <table-head-sort
                  :width="'w-100'"
                  :title="'点击次数'"
                  v-on:table-sort-change="handleSortChange"
                  :sort-key="'click_num'"
                  :is-sort="sort"></table-head-sort>
                   <table-head-sort
                  :width="'w-100'"
                  :title="'播放次数'"
                  v-on:table-sort-change="handleSortChange"
                  :sort-key="'play_num'"
                  :is-sort="sort"></table-head-sort>
                   <table-head-sort
                  :width="'w-100'"
                  :title="'评论次数'"
                  v-on:table-sort-change="handleSortChange"
                  :sort-key="'comment_num'"
                  :is-sort="sort"></table-head-sort>
                   <table-head-sort
                  :width="'w-100'"
                  :title="'观看人次'"
                  v-on:table-sort-change="handleSortChange"
                  :sort-key="'visit_num'"
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
                      <div class="w-200">{{item.time}}</div>
                      <!-- <div class="w-200">{{item.time.toString().substring(0,4)}}/{{item.time.toString().substring(4,6)}}/{{item.time.toString().substring(6)}}</div> -->
                      <div class="w-100">{{item.click_num}}</div>
                      <div class="w-100">{{item.play_num}}</div>
                      <div class="w-100">{{item.comment_num}}</div>
                      <div class="w-100">{{item.visit_num}}</div>
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
let moment = require('moment');
export default {
  name: 'mediaOverview',
  components: {
    DataCard: DataCard,
    TabBox,
    LineCharts,
    TableHeadSort,
  },
  data () {
    return {
      sort: '',
      sortObj: {},
      chartsOptions: {},
      dataList: [],
      allLoading: true,
      // 评论次数
      commentViews: {
        colorStyle: 'purple-style', // colorStyle 颜色风格
        title: '评论次数',
        brief: '',
        num: '0',
        beforeImg: false,
        afterImg: false,
      },
      // 当前观看人数
      currentViews: {
      // readViews: {
        colorStyle: 'green-style', // colorStyle 颜色风格
        title: '分享次数',
        brief: '',
        num: '0',
        beforeImg: false,
        afterImg: false,
      },
      // 播放次数
      playViews: {
      // shareViews: {
        colorStyle: 'blue-style', // colorStyle 颜色风格
        title: '播放次数',
        brief: '',
        num: '0',
        beforeImg: false,
        afterImg: false,
      },
      // 观看人次
      peopleViews: {
        colorStyle: 'red-style', // colorStyle 颜色风格
        title: '观看人次',
        brief: '',
        num: '0',
        beforeImg: false,
        afterImg: false,
      },
      // 播放时长
      longtimeViews: {
        colorStyle: 'orange-style', // colorStyle 颜色风格
        title: '播放时长 （小时）',
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
      refresh: 0,
      clickData: [],
      playData: [],
      watchData: [],
      commentData: [],
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
        case 'watch':
          this.chartsOptions.seriesData = [this.watchData];
          break;
        case 'comment':
          this.chartsOptions.seriesData = [this.commentData];
          break;
        default:
          break;
      }

      this.refresh = this.refresh + 1;
    },
    // 获取数据
    async fetchData () {
      try {
        const data = await this.$api.contentDay(
          {
            start_date: moment().subtract(14, 'days').format('YYYY-MM-DD'),
            end_date: moment().subtract(1, 'days').format('YYYY-MM-DD'),
            // end_date: moment().format('YYYY-MM-DD'),
            content_type: 'livmedia',
          },
        );
        let xAxisData = [];
        this.clickData = [];
        this.playData = [];
        this.watchData = [];
        this.commentData = [];
        if (data.length) {
          data.forEach((vv) => {
            xAxisData.push(moment(vv.time).format('YYYY/MM/DD'));
            this.clickData.push(vv.click_num);
            this.playData.push(vv.play_num);
            this.watchData.push(vv.visit_num);
            this.commentData.push(vv.comment_num);
          });
          this.chartsOptions.xAxisData = xAxisData;
          this.chartsOptions.seriesData = [this.clickData];
          this.chartsOptions.showLegend = false;
          this.refresh += 1;
        }
      } catch (e) {

      }
    },
    // 获取列表数据
    async getTodayData (page, size) {
      this.pagination = false; // 强制刷新分页组件 不然导致分页切至第二页刷新后 1高亮问题
      this.listLoading = true;
      this.pageOptions.page = page || this.pageOptions.page;
      this.pageOptions.pageSize = size || this.pageOptions.pageSize;
      const param = {
        page: parseInt(this.pageOptions.page, 10),
        size: parseInt(this.pageOptions.pageSize, 10),
        content_type: 'livmedia',
      };
      if (this.sortObj && this.sortObj.status) {
        param.order = this.sortObj.key;
        param.sort = this.sortObj.status === 'up' ? 1 : -1;
      }
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
    // 获取累计数据
    async getTargetData () {
      try {
        const data = await this.$api.contentTarget({ content_type: 'livmedia' });
        this.commentViews.num = data.comment_num;
        this.currentViews.num = data.share_num;
        this.playViews.num = data.play_num;
        this.peopleViews.num = data.visit_num;
        this.longtimeViews.num = data.duration_num;
      } catch (e) {

      }
      try {
        const data = await this.$api.contentTarget(
          { content_type: 'content',
            start_date: moment().subtract(1, 'days').format('YYYY-MM-DD'),
            end_date: moment().subtract(1, 'days').format('YYYY-MM-DD'),
          },
        );
        this.commentViews.brief = `昨日 ${data.comment_num}`;
        this.currentViews.brief = `昨日 ${data.share_num}`;
        this.playViews.brief = `昨日 ${data.share_num}`;
        this.peopleViews.brief = `昨日 ${data.like_num}`;
        this.longtimeViews.brief = `昨日 ${data.like_num}`;
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
      // page: 1, pageSize: size
      this.getTodayData(1, size);
    },
    // 切换排序项
    handleSortChange (keyObj) {
      this.sort = keyObj.key;
      this.sortObj = keyObj;
      this.getTodayData(1, this.pageOptions.pageSize, keyObj);
    },
  },
  created () {
    this.allLoading = true;
    this.fetchData();
    this.getTargetData();
    this.getTodayData();
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
</style>
