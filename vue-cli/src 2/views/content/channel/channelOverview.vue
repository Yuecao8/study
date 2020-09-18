<template>
  <div class="overview">
    <div class="select-box">
      <div class="d-flex flex-v-center">
        <span class="select-label">频道：</span>
        <div class="flex-one">
            <drop-checkbox :opt="channelList" :text="'频道'" :keys="'channel'" v-on:handle-sites-chose="channelChose"></drop-checkbox>
        </div>
      </div>
    </div>
    <div class="data-box" v-loading="allLoading">
      <div class="title-box">
        <span class="title">关键指标</span>
      </div>
      <div class="cards-box flex-between media">
        <data-card :options="currentViews"></data-card>
        <!-- <data-card :options="playPeopleViews"></data-card> -->
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
            :tab-list="[{name:'观看人次',id:'watch'},
            {name:'平均观看时长',id:'playLong'},{name:'评论次数',id:'comment'}]"
            v-on:handle-active-tab="handleTabChange" :handle-active="activeItem"
            ></tab-box>
            <line-charts :charts-options="chartsOptions" :refresh-data="refresh"></line-charts>
        </div>
      </div>
       <div class="table-box">
        <div class="title-box">
          <span class="title">详细数据</span>
        </div>
        <div class="table-body white" v-loading="detailLoading">
              <div class="table-header flex-v-center">
                  <div class="time flex-one">时间</div>
                   <div class="w-100">观看人次</div>
                   <!-- <div class="w-100">观看用户数</div> -->
                   <div class="w-100">平均观看时长</div>
                   <div class="w-100">评论次数</div>
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
                      <!-- <div class="w-100">{{item.user_click_num}}</div> -->
                      <div class="w-100">{{item.duration_num}}</div>
                      <div class="w-100">{{item.comment_num}}</div>
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
import TableHeadSort from '../../../components/common/TableHeadSort';
import DropCheckbox from '../../../components/select/dropCheckbox';
let moment = require('moment');
export default {
  name: 'channelOverview',
  components: {
    DataCard: DataCard,
    TabBox,
    LineCharts,
    TableHeadSort,
    DropCheckbox,
  },
  data () {
    return {
      refreshSelect: 0,
      sort: '',
      // 频道
      channelId: '',
      channelList: [],
      sortObj: {},
      chartsOptions: {},
      dataList: [],
      allLoading: true,
      // 当前观看人数
      currentViews: {
      // readViews: {
        colorStyle: 'green-style', // colorStyle 颜色风格
        title: '当前观看人数',
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
        title: '观看时长（小时）',
        brief: '',
        num: '0',
        beforeImg: false,
        afterImg: false,
      },
      // 互动次数
      commentViews: {
        colorStyle: 'purple-style', // colorStyle 颜色风格
        title: '互动次数',
        brief: '',
        num: '0',
        beforeImg: false,
        afterImg: false,
      },
      // 累计观看用户数
      playPeopleViews: {
        colorStyle: 'blue-style', // colorStyle 颜色风格
        title: '累计观看用户数',
        brief: '',
        num: '0',
        beforeImg: false,
        afterImg: false,
      },
      // listLoading: false,
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
      playPeopleData: [],
      playLongData: [],
      watchData: [], // 观看人次
      commentData: [],
      // siteList: [],
      detailLoading: false,
      detailList: [],
      detailAllList: [],
      channelArr: [],
      active: '0',
      activeItem: { id: 'watch' },
    };
  },
  methods: {
    // 切换分时数据
    handleTabChange (data) {
      // 测试数据
      switch (data.id) {
        case 'watch':
          this.chartsOptions.seriesData = [this.watchData];
          break;
        case 'playPeople':
          this.chartsOptions.seriesData = [this.playPeopleData];
          break;
        case 'playLong':
          this.chartsOptions.seriesData = [this.playLongData];
          break;
        case 'comment':
          this.chartsOptions.seriesData = [this.commentData];
          break;
        default:
          break;
      }

      this.refresh = this.refresh + 1;
    },
    getParams (param) {
      if (this.channelArr.length && parseInt(this.active, 10) !== 0) {
        const ids = [];
        this.channelArr.forEach((vv) => {
          ids.push(vv.id);
        });
        param.channel_id = ids.join(',');
      }
      return param;
    },
    // 频道选择变化
    channelChose () {
      const arr = JSON.parse(window.sessionStorage.getItem('channel-chose'));
      const active = JSON.parse(window.sessionStorage.getItem('channel-chose-active'));
      this.channelArr = arr || [];
      this.active = active || '0';
      this.changeData();
    },
    // 获取图表数据和详细数据
    async fetchData () {
      try {
        let param = {
          start_date: moment().subtract(14, 'days').format('YYYY-MM-DD'),
          end_date: moment().subtract(1, 'days').format('YYYY-MM-DD'),
          // end_date: moment().format('YYYY-MM-DD'),
          channel_id: this.channelId,
        };
        if (this.channelId === '') {
          delete param.channel_id;
        };
        param = this.getParams(param);
        const data = await this.$api.channelDayList(param);
        this.allLoading = false;
        this.detailAllList = JSON.parse(JSON.stringify(data));
        this.detailList = JSON.parse(JSON.stringify(this.detailAllList.slice(0, 5)));
        this.detailPageOptions.total = parseInt(data.length, 10);
        this.detailPageOptions.pageNum = Math.ceil(this.detailPageOptions.total / this.detailPageOptions.pageSize);
        let xAxisData = [];
        this.playPeopleData = [];
        this.playLongData = [];
        this.watchData = [];
        this.commentData = [];
        if (data.length) {
          data.forEach((vv) => {
            xAxisData.push(moment(vv.time).format('YYYY/MM/DD'));
            this.watchData.push(vv.click_num); // 已对接
            this.playPeopleData.push(vv.user_click_num); // 已对接
            this.playLongData.push(vv.duration_num); // 已对接
            this.commentData.push(vv.comment_num); // 已对接
          });
          this.chartsOptions.xAxisData = xAxisData;
          this.chartsOptions.seriesData = [this.watchData];
          this.chartsOptions.showLegend = false;
          this.refresh += 1;
        }
      } catch (e) {

      }
    },
    // 获取累计数据
    async getTargetData () {
      // this.pagination = false; // 强制刷新分页组件 不然导致分页切至第二页刷新后 1高亮问题
      // this.allLoading = true;
      try {
        let param = {
          channel_id: this.channelId,
        };
        if (this.channelId === '') {
          delete param.channel_id;
        };
        param = this.getParams(param);
        const data = await this.$api.indicatorsList(param);
        this.commentViews.num = data.comment_num + data.share_num + data.like_num;
        this.currentViews.num = data.current_click ? data.current_click : 0;
        this.playPeopleViews.num = data.user_click_num;
        this.peopleViews.num = data.click_num;
        this.longtimeViews.num = data.duration_num;
      } catch (e) {

      }
      try {
        let param = { channel_id: this.channelId,
          start_date: moment().subtract(1, 'days').format('YYYY-MM-DD'),
          end_date: moment().subtract(1, 'days').format('YYYY-MM-DD'),
        };
        if (this.channelId === '') {
          delete param.channel_id;
        };
        param = this.getParams(param);
        const data = await this.$api.indicatorsList(param);
        this.commentViews.brief = `昨日 ${data.comment_num + data.share_num + data.like_num}`;
        this.currentViews.brief = `昨日 ${data.current_click ? data.current_click : 0}`;
        this.playPeopleViews.brief = `昨日 ${data.user_click_num}`;
        this.peopleViews.brief = `昨日 ${data.like_num}`;
        this.longtimeViews.brief = `昨日 ${data.duration_num}`;
      } catch (e) {
        this.commentViews.brief = '昨日 0';
        this.currentViews.brief = '昨日 0';
        this.playPeopleViews.brief = '昨日 0';
        this.peopleViews.brief = '昨日 0';
        this.longtimeViews.brief = '昨日 0';
      }
      this.allLoading = false;
    },
    // 获取频道数据
    async getChannelList () {
      try {
        const data = await this.$api.channelList();
        this.channelList = this.channelList.concat(data);
      } catch (e) {
      }
    },
    // 切换频道
    changeChannel (value) {
      this.changeData();
    },
    // 页码切换
    handleCurrentChange (val) {
      // page: val, pageSize: this.pageOptions.pageSize
    },
    // 切换每页显示条数
    handleSizeChange (size) {
      // this.getTodayData(1, size);
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
    changeData () {
      this.allLoading = true;
      this.pageOptions.page = 1;
      this.detailPageOptions.page = 1;
      this.fetchData();
      this.getTargetData();
      this.activeItem = { id: 'watch' };
    },
  },
  created () {
    this.allLoading = true;
    this.getChannelList();
    const arr = JSON.parse(window.sessionStorage.getItem('channel-chose'));
    const active = JSON.parse(window.sessionStorage.getItem('channel-chose-active'));
    this.channelArr = arr || [];
    this.active = active || '0';
    this.changeData();
  },
  destroyed () {
    window.sessionStorage.removeItem('channel-chose');
    window.sessionStorage.removeItem('channel-chose-active');
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
    // background-size:200px;
    // width: 200px;
  }
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
