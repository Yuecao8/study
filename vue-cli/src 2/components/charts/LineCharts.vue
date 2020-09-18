/***折线图****/
<template>
  <div class="line-charts">
    <div ref="myChart" class="myChart flex-one" option></div>
  </div>
</template>

<script>
import debounce from './../../mixins/debounce.js';// 混入图表自适应
let echarts = require('echarts/lib/echarts');
require('echarts/lib/component/tooltip');
require('echarts/lib/component/legend'); // 图例
require('echarts/lib/chart/line');
require('echarts/lib/chart/bar');
export default {
  name: 'LineCharts',
  // 刚进来取阅读次数 将数据整理为以下格式 分别为 图例数据，x轴，data数据
  // 数据的顺序 要对应图例的顺序  chartsOptions
  // chartsOpt.legendData = ['今日','昨日'];图例的最后一个柱状图的
  // chartsOpt.showLegend = true;是否显示图例
  // chartsOpt.xAxisData = ['00:00', '01:00'];x轴刻度值
  // chartsOpt.barData: [[50, 75, 100]],柱状图数值 目前仅支持一组数据
  // chartsOpt.seriesData = [//折线图数据
  //   [0, 132],
  //   [220, 182],
  // ];
  // refreshData  刷新数据
  //
  props: ['chartsOptions', 'refreshData'],
  mixins: [debounce],
  data () {
    return {
      seriesOption: {
        symbolSize: 2, // 折现上小圆点大小
        smooth: 0.4,
        // name: '今日',
        name: '',
        type: 'line',
        // color: ['skyblue'], // 折现颜色
        data: [],
        color: [],
        // data: [0, 132, 301, 834, 80, 230, 210, 120, 132, 101, 634, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210],
      },
      color: [['#0191FF'], ['#6CBC36'], ['#F15151'], ['#9664e1'], ['#40cbca'], ['#f9d248'], ['#f8ac30'], ['#81a2c9']],
      option: {
        // 鼠标悬停后方框
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(0,0,0,0.7)', // 背景色
          borderRadius: 8, // 边框圆角
          padding: [10, 20, 10, 20], // [5, 10, 15, 20] 内边距
          formatter: function (params) {
            let result = `${params[0].axisValueLabel}</br>`;
            params.forEach(function (item) {
              result += `<span style='position:relative;top:-3px;display:inline-block;margin-right:2px;border-radius:10px;width:5px;height:5px;background-color:${item.color}'></span>
              <span style="display:inline-block;color:white">${item.seriesName}：</span><span style="color:white">${item.value}</span></br>`;
            });

            return result;
          },
        },
        // 图例
        legend: {
          right: '40',
          top: '0%',
          data: [], // 图例数据
          icon: 'circle', //  这个字段控制形状  类型包括 circle，rect ，roundRect，triangle，diamond，pin，arrow，none
          itemWidth: 8, // 图例的宽度
          itemHeight: 8, // 图例的高度
          itemGap: 20, // 设置间距
          textStyle: {// 图例文字的样式
            color: '#ccc',
            fontSize: 12,
          },
          show: false, // 图例是否显示
        },
        // 整个区域的位置
        grid: {
          left: '30',
          right: '40',
          bottom: '40',
          top: '35',
          containLabel: true,
        },
        // x轴
        xAxis: {
          type: 'category',
          boundaryGap: true, // 两侧留白
          axisTick: {
            show: false, // x轴刻度线
          },
          axisLine: {
            lineStyle: {// x轴最底部的坐标线
              color: '#dcdcdc', // 颜色
              width: 1, // 宽度
            },
          },
          axisLabel: {
            textStyle: {
              color: '#666666', // x轴 坐标值的颜色
            },
            // rotate: 45,
          },
          data: [],
        },
        // y轴
        yAxis: {
          type: 'value',
          axisLine: {
            show: false, // y轴竖线
          },
          axisTick: {
            show: false, // y轴刻度线
          },
          splitLine: {
            lineStyle: {
              color: ['#EDEDED'], // y轴网格线颜色
            },
          },
          axisLabel: {
            textStyle: {
              color: '#666666', // y轴 坐标值的颜色
            },
          },

        },
        series: [],
      },
    };
  },
  methods: {
    drawLine () {
      if (this.refreshData > 0) {
        const chartsOpt = JSON.parse(JSON.stringify(this.chartsOptions));
        const opt = JSON.parse(JSON.stringify(this.option));
        if (this.refreshData > 1 && this.chart) {
          this.chart.clear();
        }
        // 存入传入的数据 start
        opt.legend.data = chartsOpt.legendData;
        opt.xAxis.data = chartsOpt.xAxisData;
        opt.legend.show = true;
        if (chartsOpt.seriesData.length) {
          chartsOpt.seriesData.forEach((vv, index) => {
            let obj = JSON.parse(JSON.stringify(this.seriesOption));// 直接等于 浅拷贝 会出问题
            obj.data = vv;
            obj.color = this.color[index];
            obj.name = chartsOpt.legendData ? chartsOpt.legendData[index] : '';
            opt.series.push(obj);
          });
        }
        if (chartsOpt.barData && chartsOpt.barData.length) {
          chartsOpt.barData.forEach((vv, index) => {
            let obj = JSON.parse(JSON.stringify(this.seriesOption));// 直接等于 浅拷贝 会出问题
            obj.data = vv;
            obj.type = 'bar';
            obj.itemStyle = {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    { offset: 1, color: ' rgba(93,143,254,0.20)' },
                    { offset: 0, color: '#5D8FFE' },
                  ],
                ),
              },
            };
            obj.label = {
              normal: {
                show: true,
                position: 'top',
                textStyle: {
                  color: '#5D8FFE',
                  fontSize: 13,
                },
              },
            };
            obj.barMaxWidth = 50;
            obj.name = chartsOpt.legendData[chartsOpt.legendData.length - 1];
            opt.series.push(obj);
          });
        }
        // 存入传入的数据 end
        this.chart = echarts.init(this.$refs.myChart);
        this.chart.showLoading();
        this.chart.setOption(opt);
        this.chart.hideLoading();
      }
    },
  },
  mounted () {
    this.drawLine();
  },
  created () {

  },
  watch: {
    refreshData (curVal, oldVal) {
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
