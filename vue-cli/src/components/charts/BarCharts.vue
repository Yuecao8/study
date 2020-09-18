ie/***折线图****/
<template>
  <div class="bar-charts" :style="{'height':heights||'300px','width':widths||'100%'}">
    <div ref="myChart" class="myChart flex-one" option ></div>
  </div>
</template>

<script>
import debounce from './../../mixins/debounce.js';// 混入图表自适应
let echarts = require('echarts/lib/echarts');
require('echarts/lib/component/tooltip');
require('echarts/lib/component/legend'); // 图例
require('echarts/lib/chart/bar');
export default {
  name: 'BarCharts',
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
  props: ['chartsOptions', 'refreshData', 'heights', 'widths'],
  mixins: [debounce],
  data () {
    return {
      seriesOption: {
        symbolSize: 2, // 折现上小圆点大小
        smooth: 0.4,
        // name: '今日',
        name: '',
        type: 'bar',
        // color: ['skyblue'], // 折现颜色
        data: [],
        color: [],
        // data: [0, 132, 301, 834, 80, 230, 210, 120, 132, 101, 634, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210],
      },
      color: [['#0191FF'], ['#6CBC36'], ['#F15151']],
      option: {
        // 鼠标悬停后方框
        tooltip: {
          formatter: function (params) {
            let result = `${params[0].axisValueLabel}</br>`;
            params.forEach(function (item) {
              result += `<span style='position:relative;top:-3px;display:inline-block;margin-right:2px;border-radius:10px;width:5px;height:5px;background-color:#5D8FFE'></span>
              <span style="display:inline-block;color:white">${item.seriesName}：</span><span style="color:white">${item.value}</span></br>`;
            });
            return result;
          },
          trigger: 'axis',
          backgroundColor: 'rgba(0,0,0,0.7)', // 背景色
          borderRadius: 8, // 边框圆角
          padding: [10, 20, 10, 20], // [5, 10, 15, 20] 内边距

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
          boundaryGap: [20, 20], // 两侧留白
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
            interval: 0,
            textStyle: {
              color: '#666666', // x轴 坐标值的颜色
            },
            // rotate: 45,
          },
          splitLine: {
            show: false,
          },

          data: ['1', '2', '3', '4', '5', '6'],
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
        if (chartsOpt.xAxisType === 'category') {
          opt.xAxis.type = 'category';
          opt.xAxis.data = chartsOpt.axisData;
          opt.yAxis.type = 'value';
        } else {
          opt.yAxis.type = 'category';
          opt.yAxis.data = chartsOpt.axisData;
          opt.xAxis.type = 'value';
          opt.xAxis.axisLine.show = false;
          opt.xAxis.splitLine.show = true;
          opt.xAxis.splitLine.lineStyle = {
            color: ['#EDEDED'], // y轴网格线颜色
          };
          opt.yAxis.axisLine.show = false;
          opt.yAxis.axisLine.lineStyle = {// x轴最底部的坐标线
            color: '#dcdcdc', // 颜色
            width: 1, // 宽度
          };
          opt.xAxis.axisLabel.show = true;// 底部坐标值
          opt.xAxis.boundaryGap = [0, 0];
        }
        opt.legend.show = true;
        if (chartsOpt.seriesData.length) {
          chartsOpt.seriesData.forEach((vv, index) => {
            let obj = JSON.parse(JSON.stringify(this.seriesOption));// 直接等于 浅拷贝 会出问题
            obj.data = vv;
            obj.barMaxWidth = 50;

            if (chartsOpt.xAxisType === 'category') {
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
            } else {
              obj.itemStyle = {
                normal: {
                  color: new echarts.graphic.LinearGradient(
                    1, 0, 0, 0,
                    [
                      { offset: 1, color: ' rgba(93,143,254,0.2)' },
                      { offset: 0, color: '#5D8FFE' },
                    ],
                  ),
                },
              };
              obj.label = {
                normal: {
                  show: true, // 上方的文字
                  position: 'right',
                  offset: [5, 0],
                  textStyle: {
                    color: '#5D8FFE',
                    fontSize: 13,
                  },
                },
              };
            }

            obj.name = chartsOpt.legendData ? chartsOpt.legendData[index] : '';
            opt.series.push(obj);
          });
        }
        // 存入传入的数据 end
        this.chart = echarts.init(this.$refs.myChart);
        this.chart.showLoading();
        this.chart.setOption(opt, true);
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
  height: 100%;
}
</style>
