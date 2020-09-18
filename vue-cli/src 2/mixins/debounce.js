// 图表自适应
import debounce from 'lodash.debounce';
export default {
  data () {
    return {
      __resizeHanlder: '',
    };
  },
  beforeMount () {
    this.__resizeHanlder = debounce(() => {
      if (this.chart) {
        this.chart.resize();
      }
    }, 100);
    window.addEventListener('resize', this.__resizeHanlder);
  },
  beforeDestroy () {
    if (!this.chart) {
      return;
    }
    window.removeEventListener('resize', this.__resizeHanlder);
    this.chart.dispose();
    this.chart = null;
  },
};
