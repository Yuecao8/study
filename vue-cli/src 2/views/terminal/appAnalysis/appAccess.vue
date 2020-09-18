<template>
  <div class="appAccess">
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
        <div class="table-body white">
              <div class="table-header flex-v-center">
                  <div class="time flex-one">页面ID</div>
                  <div class="w-100">备注名</div>
                   <table-head-sort
                  :width="'w-100'"
                  :title="'访问次数'"
                  v-on:table-sort-change="handleSortChange"
                  :sort-key="'click_num'"
                  :is-sort="sort"></table-head-sort>
                   <table-head-sort
                  :width="'w-100'"
                  :title="'人均访问时长'"
                  v-on:table-sort-change="handleSortChange"
                  :sort-key="'comment_num'"
                  :is-sort="sort"></table-head-sort>
                   <table-head-sort
                  :width="'w-100'"
                  :title="'页面受访比率'"
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
                  <div v-if="!detailList.length" class="table-no-data">
                      暂无数据
                  </div>
                  <div class="table-item flex-v-center" v-if="detailList.length" v-for="(item,index) in detailList" :key="index">
                      <div class="flex-one">
                          {{item.title}}
                      </div>
                      <div class="w-100">{{item.click_num}}</div>
                      <div class="w-100">{{item.click_num}}</div>
                      <div class="w-100">{{item.comment_num}}</div>
                      <div class="w-100">{{item.share_num}}</div>
                      <div class="w-100">{{item.like_num}}</div>
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
</template>
<script>
import DropCheckbox from '../../../components/select/dropCheckbox';
import TimeSelect from '../../../components/select/TimeSelect';
import TabBox from '../../../components/common/TabBox';
import TableHeadSort from '../../../components/common/TableHeadSort';
let moment = require('moment');
export default {
  name: 'AppAccess',

  components: {
    DropCheckbox,
    TabBox,
    TimeSelect,
    TableHeadSort,
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
        pageSize: 5, // 每页条数
        pageNum: 1, // 总共页码
        total: 0, // 总共条数
      },
      // 列表
      detailList: [],
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
        path: '/terminal/app/access',
        query: params,
      });
    },
    changeData () {
      this.allLoading = true;
      this.fetchData();
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
      this.pagination = false;
      let param = {
        content_type: 'content',
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
        const data = await this.$api.contentList(param); // todo
        this.detailList = data.data;
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
