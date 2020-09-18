/***饼图****/
<template>
  <div class="pie-charts">
    <div ref="myChart" class="myChart flex-one" option></div>
  </div>
</template>

<script>
import debounce from './../../mixins/debounce.js';// 混入图表自适应
let echarts = require('echarts/lib/echarts');
require('echarts/lib/component/tooltip');
require('echarts/lib/component/legend'); // 图例
require('echarts/lib/chart/pie');
export default {
  name: 'pieCharts',
  // 刚进来取阅读次数 将数据整理为以下格式 分别为 图例数据，x轴，data数据
  // 数据的顺序 要对应图例的顺序  chartsOptions
  // chartsOpt.legendData = ['今日'];
  // chartsOpt.showLegend = true;
  // chartsOpt.xAxisData = ['00:00', '01:00'];
  // chartsOpt.seriesData = [
  //   [0, 132],
  //   [220, 182],
  // ];
  // refreshData  刷新数据
  //
  props: ['pieOptions', 'refreshPiedata'],
  mixins: [debounce],
  data () {
    return {
      seriesOption: {
        name: '',
        type: 'pie',
        data: [],
        radius: '',
        center: [],
        label: {
          normal: {
            show: false,
            position: 'left',
          },
          emphasis: {
            show: false,
            textStyle: {
              fontSize: '30',
              fontWeight: 'bold',
            },
          },
        },
        labelLine: {
          normal: {
            show: false,
          },
        },
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        // data: [0, 132, 301, 834, 80, 230, 210, 120, 132, 101, 634, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210],
      },
      option: {
        title: {
          text: '某站点用户访问来源',
          subtext: '纯属虚构',
          x: 'center',
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          left: 580,
          top: 50,
          bottom: 20,
          itemHeight: 10,
          itemWidth: 10,
          itemGap: 20,
        },
        series: [],
      },
    };
  },
  methods: {
    drawLine () {
      if (this.refreshPiedata > 0) {
        const opt = JSON.parse(JSON.stringify(this.option));
        const pieOpt = JSON.parse(JSON.stringify(this.pieOptions));
        if (this.refreshPiedata > 1 && this.piechart) {
          this.piechart.clear();
        }
        opt.legend.data = pieOpt.legendData;

        if (pieOpt.seriesData.length) {
          let obj = JSON.parse(JSON.stringify(this.seriesOption));// 直接等于 浅拷贝 会出问题
          pieOpt.seriesData.forEach((vv, index) => {
            obj.data.push(vv);
          });
          obj.name = pieOpt.name;
          obj.radius = pieOpt.radius;
          obj.color = pieOpt.color;
          obj.center = pieOpt.center;
          opt.series.push(obj);
        }
        opt.series.data = pieOpt.seriesData;
        this.piechart = echarts.init(this.$refs.myChart);
        this.piechart.showLoading();
        this.piechart.setOption(opt);
        this.piechart.hideLoading();
      }
    },
  },
  mounted () {
    this.drawLine();
  },
  created () {

  },
  watch: {
    refreshPiedata (curVal, oldVal) {
      this.drawLine();
    },
  },
};
</script>

<style lang="scss" scoped>
.myChart{
  height: 300px;
}
</style>
