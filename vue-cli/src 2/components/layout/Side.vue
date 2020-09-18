<template>
  <div class="side">
    <div class="side-list" v-for="(side,index) in sideList" :key="index">
      <div class="side-item"
        v-for="(item,idx) in side"
        :key="idx"
        @click ='linkTo(item)'
      >
        <span v-if="item.total_module" class="d-inline-block side-item-title">
          <img class="nav-icon" src="~@/assets/image/nav_jichu_icon_default.png" alt="" v-if='item.style==1'>
          <img class="nav-icon" src="~@/assets/image/nav_shiting_icon_default.png" alt="" v-if='item.style==2'>
          <img class="nav-icon" src="~@/assets/image/nav_pindao_icon_default.png" alt="" v-if='item.style==3'>
          <img class="nav-icon" src="~@/assets/image/nav_yunzhibo_icon_default.png" alt="" v-if='item.style==4'>
          <img class="nav-icon" src="~@/assets/image/nav_pindao_icon_default.png" alt="" v-if='item.style==11'>
          <img class="nav-icon" src="~@/assets/image/nav_yunzhibo_icon_default.png" alt="" v-if='item.style==12'>
           <img class="nav-icon" src="~@/assets/image/nav_yunzhibo_icon_default.png" alt="" v-if='item.style==21'>
          {{item.name}}
        </span>
        <span  :class="{'active-item':item.module==activeModule || item.subModule == activeModule}" v-if="!item.total_module" class="d-inline-block side-item-title side-item-nav">
          {{item.name}}
        </span>
        <!-- <span>{{basicContent}}</span> -->
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: ['basicContent'],
  name: 'VSide',
  data () {
    return {
      activeModule: 'content.basic.overview',
      sideList: [],
    };
  },
  methods: {
    // 点击跳转
    linkTo (item) {
      this.activeModule = item.module;
      this.$router.push({ name: item.module });
    },
    changeData (id) {
      // debugger;// eslint-disable-line
      if (id === 'terminal') {
        this.activeModule = 'terminal.web.today';
        this.sideList = [
          [ { name: '网站分析', module: 'terminal.web', total_module: true, style: 11 },
            { name: '当日概览', module: 'terminal.web.today', total_module: false },
            { name: '历史趋势', module: 'terminal.web.history', total_module: false },
            { name: '页面访问', module: 'terminal.web.access', total_module: false },
            { name: '使用时段分析', module: 'terminal.web.periodTime', total_module: false },
            { name: '流量来源概览', module: 'terminal.web.traffic', total_module: false },
            { name: '搜索引擎引流分析', module: 'terminal.web.engine', total_module: false },
            { name: '外部链接分析', module: 'terminal.web.link', total_module: false },
            // { name: '使用环境分析', module: 'terminal.web.environment', total_module: false },
            // { name: '用户路径', module: 'terminal.web.userUrl', total_module: false },
          ],
          [ { name: 'APP分析', module: 'terminal.app', total_module: true, style: 12 },
            { name: '当日概览', module: 'terminal.app.today', total_module: false },
            { name: '历史趋势', module: 'terminal.app.history', total_module: false },
            { name: '页面访问', module: 'terminal.app.access', total_module: false },
            { name: '使用时段分析', module: 'terminal.app.periodTime', total_module: false },
            { name: '使用习惯', module: 'terminal.app.habit', total_module: false },
            // { name: '安装统计', module: 'terminal.app.installation', total_module: false },
            { name: '使用环境分析', module: 'terminal.app.environment', total_module: false },
            // { name: '用户路径', module: 'terminal.app.userUrl', total_module: false },
          ],
        ];
      } else if (id === 'content') {
        this.sideList = [
          [ { name: '基础内容统计', module: 'content.basic', total_module: true, style: 1 },
            { name: '内容数据概览', module: 'content.basic.overview', total_module: false },
            { name: '内容历史趋势', module: 'content.basic.history', total_module: false },
            { name: '栏目统计', module: 'content.basic.column.index', subModule: 'content.basic.column.detail', total_module: false },
          ],
          [ { name: '视听内容统计', module: 'content.media', total_module: true, style: 2 },
            { name: '视听数据概览', module: 'content.media.overview', total_module: false },
            { name: '视听历史趋势', module: 'content.media.history', total_module: false },
          ],
          [ { name: '频道收视统计', module: 'content.channel', total_module: true, style: 3 },
            { name: '频道数据概览', module: 'content.channel.overview', total_module: false },
            { name: '频道历史趋势', module: 'content.channel.history', total_module: false },
          ],
          // [ { name: '云直播活动统计', module: 'content.activity', total_module: true, style: 4 },
          //   { name: '活动统计', module: 'content.activity.statistical', total_module: false },
          // ],
        ];
      } else if (id === 'user') {
        this.activeModule = 'user.data.active';
        this.sideList = [
          [ { name: '用户数据', module: 'user.data', total_module: true, style: 21 },
            { name: '用户活跃度', module: 'user.data.active', total_module: false },
            { name: '新老用户', module: 'user.data.newRegister', total_module: false },
            { name: '用户留存', module: 'user.data.retained', total_module: false },
            { name: '流失与回流', module: 'user.data.backflow', total_module: false },
            // { name: '注册渠道和方式', module: 'user.data.registered', total_module: false },
            { name: '用户画像', module: 'user.data.portrait', total_module: false },
          ],
        ];
      };
    },
  },
  watch: {
    $route (newdate, olddate) {
      // 监听路由
      if (newdate.name !== olddate.name) {
        this.activeModule = newdate.name;
      }
    },
  },
  created () {
    const str = this.basicContent.substring(0, this.basicContent.indexOf('.'));
    this.changeData(str);
    this.activeModule = this.$route.name;
  },
};
</script>

<style lang="scss" scoped>
.side{
  height: 100%;
  width: 100%;
  background: #fff;
  .side-list{
    padding-bottom: 10px;
  }
  .active-item{
    border-left:1px solid #5D8FFE;
    color: #5D8FFE !important;
  }
  .side-item{
    height: 20px;
    line-height: 20px;
    padding:20px 0;
  }
  .side-item-title{
    width: 130px;
    margin-left: 30px;
    padding-left: 10px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #333333;
    position: relative;

  }
  .nav-icon {
    position: absolute;
    top: 2px;
    left: -10px;
    width: 15px;
    height: 15px;
  }
  .side-item-nav{
      font-size: 13px;
      color: #666666;
      cursor: pointer;
    }
}
</style>
