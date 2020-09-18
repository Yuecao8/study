<template>
  <div class='echarts'>
    11111
    <div id="main" ref="my"></div>
  </div>
</template>
<script>
// 引入 ECharts 主模块
const echarts = require('echarts/lib/echarts');
// 引入柱状图
require('echarts/lib/chart/bar');
// 引入提示框和标题组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
  export default {
  name: '',
  data () {
    return {
      msg: '',
      option: {}
    }
  },
  methods: {
    initEchrts() {
      // 基于准备好的dom，初始化echarts实例
      // 绘制图表

this.option = {
    title: {
        // text: '柱状图动画延迟'
    },
    legend: {
        data: ['bar', 'bar2'],
        align: 'left'
    },
    toolbox: {
        // y: 'bottom',
        feature: {
            magicType: {
                type: ['stack', 'tiled']
            },
            dataView: {},
            saveAsImage: {
                pixelRatio: 2
            }
        }
    },
    tooltip: {},
    xAxis: {
        data: xAxisData,
        silent: false,
        splitLine: {
            show: false
        }
    },
    yAxis: {
    },
    series: [{
        name: 'bar',
        type: 'bar',
        data: data1,
        animationDelay: function (idx) {
            return idx * 10;
        }
    }, {
        name: 'bar2',
        type: 'bar',
        data: data2,
        animationDelay: function (idx) {
            return idx * 10 + 100;
        }
    }],
    animationEasing: 'elasticOut',
    animationDelayUpdate: function (idx) {
        return idx * 5;
    }
};
      var myChart = echarts.init(this.$refs.my)
      myChart.setOption(this.option)
    }
  },
  mounted () {
    this.initEchrts()
  }
}
</script>
<style lang='scss' scoped>
#main{
  height: 500px;
}
</style>
