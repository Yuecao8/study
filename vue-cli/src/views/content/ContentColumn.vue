<template>
  <div class="content-column">
      <div class="select-box">
      <div class="d-flex flex-v-center">
        <span class="select-label">统计日期：</span>
        <div class="flex-one">
           <time-select :opt="opt" v-on:time-select-change="timeSelectChange"></time-select>
        </div>
      </div>
      <div class="d-flex flex-v-center">
        <span class="select-label">站点：</span>
        <div class="flex-one">
           <el-select v-model="siteId" placeholder="请选择" @change="changeSite">
              <el-option
                v-for="item in siteList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
        </div>
      </div>
      <div class="d-flex flex-v-center">
        <span class="select-label">栏目：</span>
        <div class="flex-one">
           <column-selection v-on:handle-column-chose="columnChose" :site-list="[{id:1,name:'站点1'},{id:65,name:'站点65'}]"></column-selection>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TimeSelect from '../../components/select/TimeSelect';
import ColumnSelection from '../../components/select/ColumnSelection';
export default {
  name: 'ContentColumn',
  props: [],
  components: {
    TimeSelect,
    ColumnSelection,
  },
  data () {
    return {
      listLoading: false,
      opt: ['昨天', '3天', '7天', '30天'],
      options: [{
        value: '选项1',
        label: '黄金糕',
      }, {
        value: '选项2',
        label: '双皮奶',
      }, {
        value: '选项3',
        label: '蚵仔煎',
      }, {
        value: '选项4',
        label: '龙须面',
      }, {
        value: '选项5',
        label: '北京烤鸭',
      }],
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
    };
  },
  methods: {
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
        path: '/content/basic/column',
        query: params,
      });
    },
    // 切换站点
    changeSite (value) {
      // console.log(value);
    },
    // 切换栏目
    columnChose () {
      this.columnList = JSON.parse(window.sessionStorage.getItem('column-chose')) ? JSON.parse(window.sessionStorage.getItem('column-chose')) : this.columnList;
      this.fetchData();
    },
    // 获取站点列表
    async getSiteList () {
      try {
        const data = await this.$api.siteList();
        this.siteList = data;
      } catch (e) {

      }
    },
    async fetchData () {
      const param = {};
      try {
        const data = await this.$api.getColumnList(param);
        this.dataList = JSON.parse(JSON.stringify(data));
        this.pageList = JSON.parse(JSON.stringify(this.dataList.slice(0, 5)));
        this.pageOptions.total = parseInt(data.length, 10);
        this.pageOptions.pageNum = Math.ceil(this.pageOptions.total / this.pageOptions.pageSize);
      } catch (e) {

      }
    },
  },
  mounted () {
    this.getSiteList();
    this.fetchData();
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': 'changeData', // 只有这个页面初始化之后，这个监听事件才开始生效
  },
  created () {
    this.columnList = JSON.parse(window.sessionStorage.getItem('column-chose')) ? JSON.parse(window.sessionStorage.getItem('column-chose')) : this.columnList;
  },
  destroyed () {
    window.sessionStorage.removeItem('column-chose');
  },
};
</script>

<style lang="scss" scoped>
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
