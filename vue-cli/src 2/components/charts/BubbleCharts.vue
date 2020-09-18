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
require('echarts/lib/chart/scatter');
export default {
  name: 'BubbleCharts',
  props: ['plantCap', 'refreshData'],
  mixins: [debounce],
  data () {
    return {
      data: [],
      detailList: [
        {
          offset: [56, 48],
          symbolSize: 130,
          opacity: 0.95,
          color: '#f467ce',
        }, {
          offset: [35, 80],
          symbolSize: 120,
          opacity: 0.88,
          color: '#7aabe2',
        }, {
          offset: [20, 43],
          symbolSize: 110,
          opacity: 0.84,
          color: '#ff7123',
        }, {
          offset: [83, 30],
          symbolSize: 100,
          opacity: 0.8,
          color: '#ffc400',
        }, {
          offset: [36, 20],
          symbolSize: 90,
          opacity: 0.75,
          color: '#5e333f',
        }, {
          offset: [64, 15],
          symbolSize: 80,
          opacity: 0.7,
          color: '#6b3442',
        }, {
          offset: [75, 75],
          symbolSize: 70,
          opacity: 0.68,
          color: '#8a3647',
        }, {
          offset: [88, 62],
          symbolSize: 60,
          opacity: 0.6,
          color: '#68333f',
        },
        {
          offset: [40, 45],
          symbolSize: 60,
          opacity: 0.8,
          color: '#46c8d6',
        },
        {
          offset: [72, 45],
          symbolSize: 60,
          opacity: 0.8,
          color: '#69bf8f',
        },
      ],
      option: {
        grid: {
          show: false,
          top: 10,
          bottom: 10,
        },
        xAxis: [{
          gridIndex: 0,
          type: 'value',
          show: false,
          min: 0,
          max: 100,
          nameLocation: 'middle',
          nameGap: 5,
        }],
        yAxis: [{
          gridIndex: 0,
          min: 0,
          show: false,
          max: 100,
          nameLocation: 'middle',
          nameGap: 30,
        }],
        series: [{
          type: 'scatter',
          symbol: 'circle',
          symbolSize: 120,
          label: {
            normal: {
              show: true,
              formatter: '{b}',
              color: '#fff',
              textStyle: {
                fontSize: '20',
              },
            },
          },
          itemStyle: {
            normal: {
              color: '#00acea',
            },
          },
          data: [],
        }],
        tooltip: {
          axisPointer: {
            type: 'none', // 悬浮的线
          },
          trigger: 'axis',
          backgroundColor: 'rgba(0,0,0,0.7)', // 背景色
          borderRadius: 8, // 边框圆角
          padding: [10, 20, 10, 20], // [5, 10, 15, 20] 内边距
          formatter: function (params) {
            let result = '';
            params.forEach(function (item) {
              result += `<span style='position:relative;top:-3px;display:inline-block;margin-right:2px;border-radius:10px;width:5px;height:5px;background-color:${item.color}'></span>
              <span style="display:inline-block;color:white">${item.name}</span>`;
            });

            return result;
          },
        },
      },
    };
  },
  methods: {
    drawLine () {
      if (this.refreshData > 0) {
        for (var i = 0; i < this.plantCap.length; i++) {
          var item = this.plantCap[i];
          var itemToStyle = this.detailList[i];
          this.data.push({
            name: item.value + '\n' + item.name,
            value: itemToStyle.offset,
            symbolSize: itemToStyle.symbolSize,
            label: {
              normal: {
                textStyle: {
                  fontSize: 11,
                },
              },
            },
            itemStyle: {
              normal: {
                color: itemToStyle.color,
                opacity: itemToStyle.opacity,
              },
            },
          });
          this.option.series[0].data = this.data;
        }
        if (this.refreshData > 1 && this.chart) {
          this.chart.clear();
        }
        // 存入传入的数据 start
        // 存入传入的数据 end
        this.chart = echarts.init(this.$refs.myChart);
        this.chart.showLoading();
        console.log(this.option, 'this.option');
        this.chart.setOption(this.option);
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
