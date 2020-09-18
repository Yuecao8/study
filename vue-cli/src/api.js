import Vue from 'vue';
import http from './services/http';
import { stringify } from 'qs';

// 示例
// 获取token
export const redirectToken = (data) => http.get(`/api/redirect/token?${stringify(data)}`);
// 站点列表
export const siteList = (data) => http.get('/api/statistics/site');
// 栏目列表
export const columnList = (data) => http.get(`/api/statistics/column?${stringify(data)}`);
// 获取内容历史趋势
export const contentList = (data) => http.get(`/api/statistics/content_list?${stringify(data)}`);
// 数据指标接
export const contentTarget = (data) => http.get(`/api/statistics/content_target?${stringify(data)}`);
// 内容分日数据
export const contentDay = (data) => http.get(`/api/statistics/content_day?${stringify(data)}`);
// 栏目列表趋势
export const getColumnList = (data) => http.get(`/api/statistics/column_list?${stringify(data)}`);
// 栏目分日数据
export const columnDay = (data) => http.get(`/api/statistics/column_day?${stringify(data)}`);
// 栏目累计指标
export const columnTarget = (data) => http.get(`/api/statistics/column_target?${stringify(data)}`);

// 频道列表数据
export const channelList = (data) => http.get(`/api/statistics/channel?${stringify(data)}`);
// 频道数据指标
export const indicatorsList = (data) => http.get(`/api/statistics/live_target?${stringify(data)}`);
// 频道分日
export const channelDayList = (data) => http.get(`/api/statistics/live_day?${stringify(data)}`);
/** * 终端数据 web***/
export const webSiteList = () => http.get('/api/tj/web/site');
export const webTrend = (data) => http.get(`/api/tj/web/trend?${stringify(data)}`);
// 网站历史趋势分时
export const webTrendHour = (data) => http.get(`/api/tj/web/trend_hour?${stringify(data)}`);
// 网站受访页面
export const webPage = (data) => http.get(`/api/tj/web/page?${stringify(data)}`);
Vue.mixin({
  beforeCreate () {
    const options = this.$options;
    if (options.api) {
      this.$api = options.api;
    } else if (options.parent && options.parent.$api) {
      this.$api = options.parent.$api;
    }
  },
});
