/***栏目选择弹框****/
this.columnList = JSON.parse(window.sessionStorage.getItem('column-chose')) ? JSON.parse(window.sessionStorage.getItem('column-chose')) : this.columnList;
 <column-selection v-on:handle-column-chose="columnChose"></column-selection>
<template>
  <div class="column-selection" >
        <div @click="showDialog" class="showBtn flex-v-center flex-center">
            已选择{{checkedList.length}}个栏目
        </div>
        <el-dialog title="栏目选择" width='800px' :visible.sync="showColumn">
          <div v-loading="columnLoading" class="modal-box d-flex">
            <div class="left-box">
              <div class="site-chose">
                <el-select v-model="siteId" placeholder="请选择" @change="changeSite">
                  <el-option
                    v-for="item in siteList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
              <swiper ref="mySwiper" :options="swiperOption"  v-if="!columnLoading">
                <!-- slides -->
                <swiper-slide v-for="(slide,idx) in swiperColumnData"  :key="idx" class="swiper-slide">
                    <div class="slide-item" @click="getNextLevel(item,idx+1,$event)" :class="{'active-item':item.active}" v-for="(item,index) in slide" :key="index">
                      <div class="flex-v-center">
                        <span>
                            <input type="checkbox"  :checked="itemCheck(item)" @click="addCheck(item,$event)">
                        </span>
                        <span :title="item.site_id" class="column-title ellipsis d-inline-block">{{item.name}}</span>
                        <span v-if="!item.is_last">
                          <i class="el-icon-arrow-right"></i>
                        </span>
                      </div>
                    </div>
                </swiper-slide>
              </swiper>
            </div>
            <div class="right-box">
                <div v-for="(list,keys) in siteList" :key="keys" v-if="showRightSite(list)">
                  <span class="right-site-box d-block">{{list.name}}</span>
                  <div class="d-inline-block" v-for="(lists,k) in checkList" :key="k" v-if="lists.site_id==list.id">
                    <span class="right-column-box d-inline-block" @click="deleteCheck(lists,$event)">
                      <span class=" d-inline-block ellipsis">{{lists.name}}</span>
                       <i class="el-icon-close"></i>
                    </span>
                  </div>
                </div>

            </div>
        </div>
        <div slot="footer" class="text-center modal-foot flex-v-center flex-center">
          <el-button size="small" class="button-left" type="primary" @click="choseColumn()">确定</el-button>
          <el-button size="small" @click="cancel()">取 消</el-button>
        </div>
    </el-dialog>
        <!-- 弹框 end -->
  </div>
</template>

<script>
// 引入swiper
import 'swiper/dist/css/swiper.css';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
export default {
  name: 'ColumnSelection',
  components: {
    swiper,
    swiperSlide,
  },
  mounted () {
    // you can use current swiper instance object to do something(swiper methods)
    // 然后你就可以使用当前上下文内的swiper对象去做你想做的事了
    // console.log('this is current swiper instance object', this.swiper)
  },
  computed: {
    swiper () {
      return this.$refs.mySwiper.swiper;
    },
  },
  data () {
    return {
      showColumn: false,
      columnLoading: false,
      columnList: [], // columnList 测试数据 获取的所有不分层级的栏目数据
      finishedList: [], // 处理后数据 columnList[father_id]=[{},{}]
      swiperColumnData: [[], [], [], []], // 在swiper中展示的数据
      // swiper配置
      swiperOption: {
        simulateTouch: true, // Swiper接受鼠标点击、拖动
        slidesPerView: 4, // 设置slider容器能够同时显示的slides数量
        // initialSlide: 0,
        observer: true,
        observeParents: true,
      },
      checkList: [],
      checkedList: [],
      siteId: '',
      siteList: [],

    };
  },
  methods: {
    // 切换站点
    changeSite (id) {
      this.columnLoading = true;
      this.finishedList = [];
      this.handleColumn(0, id);
      this.swiperColumnData = [[], [], [], []];
      this.swiperColumnData[0] = this.finishedList[0];
      this.columnLoading = false;
    },
    // 选择交互
    itemCheck (item) {
      const index = this.checkList.findIndex(obj => parseInt(item.id, 10) === parseInt(obj.id, 10));
      return index > -1;
    },
    // 是否显示右侧的站点
    showRightSite (item) {
      const index = this.checkList.findIndex(obj => parseInt(obj.site_id, 10) === parseInt(item.id, 10));
      return index > -1;
    },
    addCheck (item, event) {
      event.stopPropagation();
      if (item.disabled) {
        return false;
      } else {
        const idx = this.checkList.findIndex(obj => (parseInt(obj.id, 10) === parseInt(item.id, 10)));
        if (idx > -1) {
          this.checkList.splice(idx, 1);
        } else {
          this.checkList.push(item);
        }
      }
    },
    deleteChecked (item, event) {
      event.stopPropagation();
      if (this.checkedList.length === 1) {
        this.$message({
          message: '请至少选择一个栏目',
          type: 'error',
        });
        return;
      }
      const idx = this.checkedList.findIndex(obj => (parseInt(obj.id, 10) === parseInt(item.id, 10)));
      this.checkedList.splice(idx, 1);
      window.sessionStorage.setItem('column-chose', JSON.stringify(this.checkedList));
      this.checkedList = JSON.parse(window.sessionStorage.getItem('column-chose')) ? JSON.parse(window.sessionStorage.getItem('column-chose')) : this.checkList;
      this.$emit('handle-column-chose');
    },
    deleteCheck (item, event) {
      event.stopPropagation();
      const idx = this.checkList.findIndex(obj => (parseInt(obj.id, 10) === parseInt(item.id, 10)));
      this.checkList.splice(idx, 1);
    },
    // 获取栏目数据
    async fetchDate () {
      this.columnLoading = true;
      try {
        const data = await this.$api.columnList();
        this.columnList = data;
        this.columnLoading = false;
      } catch (e) {

      }
    },
    async showDialog () {
      this.showColumn = true;
      this.columnLoading = true;
      this.checkList = JSON.parse(window.sessionStorage.getItem('column-chose')) ? JSON.parse(window.sessionStorage.getItem('column-chose')) : this.checkList;
      this.columnLoading = false;
    },
    // 处理栏目数据  处理后数据 columnList[father_id]=[{},{}]
    handleColumn (fid, siteId) {
      this.finishedList[fid] = [];
      this.columnList.forEach((vv) => {
        if (parseInt(vv.father_id, 10) === parseInt(fid, 10) && parseInt(vv.site_id, 10) === parseInt(this.siteId, 10)) {
          this.finishedList[fid].push(vv);
          if (!vv.is_last) {
            this.handleColumn(vv.id, siteId);
          }
        }
      });
    },
    // 点击获取下一级
    async getNextLevel (item, index, event) {
      event.stopPropagation();
      // 清空数据 点击栏目所在层级的下一级数据
      const length = this.swiperColumnData.length;
      for (let i = length, len = index; i >= len; i -= 1) {
        if (i > 3) {
          this.swiperColumnData.splice(i, 1);
        } else {
          this.swiperColumnData[i] = [];
        }
      }
      this.addColumn(item, index);
      this.selectChange(item.id, index - 1);
    },
    addColumn (item, index) {
      if (!item.active) {
        if (this.swiperColumnData[index] && index < 4) {
          this.swiper.activeIndex = 0;
          this.swiperColumnData[index] = this.finishedList[item.id];
        } else if (this.finishedList[item.id]) {
          this.swiper.activeIndex = this.swiperColumnData.length;
          this.swiperColumnData.push(this.finishedList[item.id]);
        }
      }
      item.active = !item.active;
    },
    selectChange (id, index) {
      this.swiperColumnData[index].forEach((vv) => {
        if (parseInt(id, 10) !== parseInt(vv.id)) {
          vv.active = false;
        }
      });
    },
    // 确定选择
    choseColumn () {
      if (!this.checkList.length) {
        this.$message({
          message: '请选择栏目',
          type: 'error',
        });
        return;
      }
      window.sessionStorage.setItem('column-chose', JSON.stringify(this.checkList));
      this.checkedList = JSON.parse(window.sessionStorage.getItem('column-chose')) ? JSON.parse(window.sessionStorage.getItem('column-chose')) : this.checkList;
      this.$emit('handle-column-chose');
      this.showColumn = false;
    },
    // 取消
    cancel () {
      this.showColumn = false;
    },
    // 获取站点信息
    async getSiteList () {
      try {
        const data = await this.$api.siteList();
        this.siteList = data;
        // 详情情况
        if (this.$route.query.siteId) {
          // this.siteId = this.$route.query.siteId; // 必须要转为number
          this.siteId = parseInt(this.$route.query.siteId, 10); // 必须要转为number
          this.siteList.forEach((vv) => {
            if (parseInt(vv.id, 10) === parseInt(this.$route.query.siteId, 10)) {
              this.siteSelect = vv;
            }
          });
          // this.siteId = this.siteSelect;
        } else { // 非详情情况
          this.siteId = data.length ? data[0].id : '';
          this.siteSelect = data.length ? data[0] : [];
        }
      } catch (e) {
      }
    },
  },
  async created () {
    await this.getSiteList();
    await this.fetchDate();
    await this.handleColumn(0, this.siteId);// 处理栏目
    this.swiperColumnData = [[], [], [], []];
    this.swiperColumnData[0] = this.finishedList[0];
    // debugger;// eslint-disable-line
    // 跳转详情页
    if (this.$route.query.colId && !window.sessionStorage.getItem('column-chose')) {
      const index = this.columnList.findIndex(obj => parseInt(obj.id, 10) === parseInt(this.$route.query.colId, 10));
      const arr = [];
      arr.push(this.columnList[index]);
      this.checkList = JSON.parse(JSON.stringify(arr));
      this.checkedList = JSON.parse(JSON.stringify(arr));
      window.sessionStorage.setItem('column-chose', JSON.stringify(arr));
      // 详情或概览选择后
    } else if (window.sessionStorage.getItem('column-chose') && window.sessionStorage.getItem('column-chose').length) {
      this.checkList = JSON.parse(window.sessionStorage.getItem('column-chose')) ? JSON.parse(window.sessionStorage.getItem('column-chose')) : this.checkList;
      this.checkedList = JSON.parse(window.sessionStorage.getItem('column-chose')) ? JSON.parse(window.sessionStorage.getItem('column-chose')) : this.checkedList;
    // 概览未选择
    } else {
      this.checkList = JSON.parse(JSON.stringify(this.finishedList[0]));
      this.checkedList = JSON.parse(JSON.stringify(this.finishedList[0]));
      window.sessionStorage.setItem('column-chose', JSON.stringify(this.checkList));
    }
    this.$emit('handle-column-chose');
  },
};
</script>

<style lang="scss" scoped>
.column-selection{
  .site-chose{
    height: 37px;
    border-bottom: 1px solid #e5e5e5;
  }
  ::-webkit-scrollbar {
      display: none!important;
  }
  .active-item{
    color:#5D8FFE;
  }
  .left-box{
    width: 600px;
  }
  .showBtn{
    padding-bottom:0;
    width: max-content;
    border:1px solid #eee;
    min-width: 200px;
    max-width:500px;
    min-height: 32px;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    color: #606266;
    cursor: pointer;
  }
  //swiper样式
  .swiper-container{
    width: 600px;
    height: 362px;
  }
  .swiper-wrapper{
    height: 362px;
  }
  .swiper-slide{
    overflow-y: auto;
    overflow-x: hidden;
    border-left: 1px solid #eee!important;
    position: relative;
    .slide-item{
      cursor: pointer;
      padding: 12px 16px;
      border-bottom: 1px solid #eee;
    }
    .column-title{
      margin-left:4px;
      width: 82px;
    }
    .el-icon-arrow-right{
      position: absoult;
      right:20px;
    }
  }
  .site-box{
    width: 600px;
    overflow: hidden;
    position: relative;
    height: 37px;
    border-bottom: 1px solid #e5e5e5;
  }
  .site-list{
    height: 37px;
    line-height: 37px;
    position: absolute;
    transition: left .5s;
    display: inline-block;
    .nav-item{
      cursor: pointer;
      width: 100px;
      margin: 0 10px;
      text-align: center;
    }
  }
  .right-column-box{
    span{
       max-width: 110px;
    }
    i{
      display: inline-block;
      vertical-align: super;
    }
    cursor: pointer;
    font-size: 14px;
    padding: 0 8px;
    background: #eee;
    border-radius: 4px;
    margin: 0 5px 8px 0;
    display: inline-block;
    border: 1px solid #eee;
    height: 22px;
    line-height:22px;
  }
  .right-site-box{
    margin-bottom:2px;
    height: 27px;
    color: #333333;
    line-height: 27px;
  }
  .modal-foot{
    border-top: 1px solid #e5e5e5;
    height: 56px;
  }
  .right-box{
    width: 200px;
    padding:20px;
    border-left: 1px solid #eee;
    height: 399px;
    overflow-y: auto;
  }
  .m-b-4{
    margin-bottom:4px !important;
  }
}
</style>
<style lang="scss">
 #app  .column-selection {
   .el-dialog__footer{
     padding:0 !important;
   }
   .el-dialog__body{
    padding:0 !important;
  }
  .el-input__inner{
    height: 36px;
    border: none;
  }
 }
</style>
