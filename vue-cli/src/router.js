import Vue from 'vue';
import Router from 'vue-router';

import { emptyStorage, GetQueryString } from './../src/services/utils';
import store from './store.js';
Vue.use(Router);
// login
const loading = () => import('../src/views/Loading.vue');
const error = () => import('../src/views/Error.vue');
// layout
const layout = () => import('../src/components/layout/Layout.vue');
// 内容模块
const contentBasic = () => import('../src/views/content/Content.vue');
const contentOverview = () => import('../src/views/content/Overview.vue');
const contentHistory = () => import('../src/views/content/History.vue');
// 栏目
const column = () => import('../src/views/content/column/Column.vue');
const columnIndex = () => import('../src/views/content/column/Index.vue');
const columnDetail = () => import('../src/views/content/column/Detail.vue');
// 视听
// const contentMedia = () => import('../src/views/content/media/mediaContent.vue');
const mediaOverview = () => import('../src/views/content/media/mediaOverview.vue');
const mediaHistory = () => import('../src/views/content/media/mediaHistory.vue');
// 频道
const channelOverview = () => import('../src/views/content/channel/channelOverview.vue');
const channelHistory = () => import('../src/views/content/channel/channelHistory.vue');

// 终端数据
const terminalBasic = () => import('../src/views/terminal/Content.vue');
// 网站分析
const webToday = () => import('../src/views/terminal/webAnalysis/webOneDay.vue');
const webHistory = () => import('../src/views/terminal/webAnalysis/webHistory.vue');
const webAccess = () => import('../src/views/terminal/webAnalysis/webAccess.vue');
const webPeriodTime = () => import('../src/views/terminal/webAnalysis/webPeriodTime.vue');
const webEnvironment = () => import('../src/views/terminal/webAnalysis/webEnvironment.vue');
const webUserUrl = () => import('../src/views/terminal/webAnalysis/webUserUrl.vue');
const webLink = () => import('../src/views/terminal/webAnalysis/webLink.vue');
const webTraffic = () => import('../src/views/terminal/webAnalysis/webTraffic.vue');
const webEngine = () => import('../src/views/terminal/webAnalysis/webEngine.vue');
// app分析
const appToday = () => import('../src/views/terminal/appAnalysis/appToday.vue');
const appHistory = () => import('../src/views/terminal/appAnalysis/appHistory.vue');
const appAccess = () => import('../src/views/terminal/appAnalysis/appAccess.vue');
const appInstallation = () => import('../src/views/terminal/appAnalysis/appInstallation.vue');
const appEnvironment = () => import('../src/views/terminal/appAnalysis/appEnvironment.vue');
const appPeriodTime = () => import('../src/views/terminal/appAnalysis/appPeriodTime.vue');
const appHabit = () => import('../src/views/terminal/appAnalysis/appHabit.vue');
const appUserUrl = () => import('../src/views/terminal/appAnalysis/appUserUrl.vue');
// 用户数据
const userBasic = () => import('../src/views/user/Content.vue');
const userActive = () => import('../src/views/user/userData/userActive.vue');
const userNewRegister = () => import('../src/views/user/userData/userNewRegister.vue');
const userBackflow = () => import('../src/views/user/userData/userBackflow.vue');
const userPortrait = () => import('../src/views/user/userData/userPortrait.vue');
const userRegistered = () => import('../src/views/user/userData/userRegistered.vue');
const userRetained = () => import('../src/views/user/userData/userRetained.vue');
const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/loading',
      name: 'loading',
      component: loading,
    },
    {
      path: '/error',
      name: 'error',
      component: error,
    },
    // 内容
    {
      path: '/content',
      name: 'content',
      component: layout,
      redirect: { name: 'content.basic' },
      meta: { breadcrumbName: '内容数据' },
      children: [{
        path: 'basic',
        name: 'content.basic',
        component: contentBasic,
        meta: { breadcrumbName: '基础内容统计' },
        redirect: { name: 'content.basic.overview' },
        children: [
          {
            path: 'overview',
            name: 'content.basic.overview',
            component: contentOverview,
            meta: {
              breadcrumbName: '内容数据概览',
            },
          },
          {
            path: 'history',
            name: 'content.basic.history',
            component: contentHistory,
            meta: {
              breadcrumbName: '内容历史趋势',
            },
          },
          {
            path: 'column',
            name: 'content.basic.column',
            component: column,
            redirect: { name: 'content.basic.column.index' },
            meta: {
              breadcrumbName: '栏目统计',
            },
            children: [
              {
                path: 'index',
                name: 'content.basic.column.index',
                component: columnIndex,
              },
              {
                path: 'detail',
                name: 'content.basic.column.detail',
                component: columnDetail,
                meta: {
                  breadcrumbName: '栏目详情',
                },
              },
            ],
          },
        ],
      }, {
        path: 'media',
        name: 'content.media',
        component: contentBasic,
        meta: { breadcrumbName: '视听内容统计' },
        redirect: { name: 'content.media.overview' },
        children: [
          {
            path: 'overview',
            name: 'content.media.overview',
            component: mediaOverview,
            meta: {
              breadcrumbName: '视听数据概览',
            },
          },
          {
            path: 'history',
            name: 'content.media.history',
            component: mediaHistory,
            meta: {
              breadcrumbName: '视听历史趋势',
            },
          },
        ],
      }, {
        path: 'channel',
        name: 'content.channel',
        component: contentBasic,
        meta: { breadcrumbName: '频道收视统计' },
        redirect: { name: 'content.channel.overview' },
        children: [
          {
            path: 'overview',
            name: 'content.channel.overview',
            component: channelOverview,
            meta: {
              breadcrumbName: '频道数据概览',
            },
          },
          {
            path: 'history',
            name: 'content.channel.history',
            component: channelHistory,
            meta: {
              breadcrumbName: '频道历史趋势',
            },
          },
        ],
      }, {
        path: 'activity',
        name: 'content.activity',
        component: contentBasic,
        meta: { breadcrumbName: '云直播活动统计' },
        redirect: { name: 'content.activity.statistical' },
        children: [
          {
            path: 'overview',
            name: 'content.activity.statistical',
            component: mediaOverview,
            meta: {
              breadcrumbName: '活动统计',
            },
          },
        ],
      }],
    },
    // 终端
    {
      path: '/terminal',
      name: 'terminal',
      component: layout,
      redirect: { name: 'terminal.web' },
      meta: { breadcrumbName: '终端数据' },
      children: [{
        path: 'web',
        name: 'terminal.web',
        component: terminalBasic,
        meta: { breadcrumbName: '网站分析' },
        redirect: { name: 'terminal.web.today' },
        children: [
          {
            path: 'today',
            name: 'terminal.web.today',
            component: webToday,
            meta: {
              breadcrumbName: '当日概览',
            },
          }, {
            path: 'history',
            name: 'terminal.web.history',
            component: webHistory,
            meta: {
              breadcrumbName: '历史趋势',
            },
          }, {
            path: 'access',
            name: 'terminal.web.access',
            component: webAccess,
            meta: {
              breadcrumbName: '页面访问',
            },
          }, {
            path: 'periodTime',
            name: 'terminal.web.periodTime',
            component: webPeriodTime,
            meta: {
              breadcrumbName: '使用时段分析',
            },
          }, {
            path: 'traffic',
            name: 'terminal.web.traffic',
            component: webTraffic,
            meta: {
              breadcrumbName: '流量来源概览',
            },
          }, {
            path: 'link',
            name: 'terminal.web.link',
            component: webLink,
            meta: {
              breadcrumbName: '外部链接分析',
            },
          }, {
            path: 'engine',
            name: 'terminal.web.engine',
            component: webEngine,
            meta: {
              breadcrumbName: '搜索引擎引流分析',
            },
          }, {
            path: 'environment',
            name: 'terminal.web.environment',
            component: webEnvironment,
            meta: {
              breadcrumbName: '使用环境分析',
            },
          }, {
            path: 'userUrl',
            name: 'terminal.web.userUrl',
            component: webUserUrl,
            meta: {
              breadcrumbName: '用户路径',
            },
          }],
      }, {
        path: 'app',
        name: 'terminal.app',
        component: terminalBasic,
        meta: { breadcrumbName: 'APP分析' },
        redirect: { name: 'terminal.app.today' },
        children: [
          {
            path: 'today',
            name: 'terminal.app.today',
            component: appToday,
            meta: {
              breadcrumbName: '当日概览',
            },
          }, {
            path: 'history',
            name: 'terminal.app.history',
            component: appHistory,
            meta: {
              breadcrumbName: '历史趋势',
            },
          }, {
            path: 'access',
            name: 'terminal.app.access',
            component: appAccess,
            meta: {
              breadcrumbName: '页面访问',
            },
          }, {
            path: 'periodTime',
            name: 'terminal.app.periodTime',
            component: appPeriodTime,
            meta: {
              breadcrumbName: '使用时段分析',
            },
          }, {
            path: 'habit',
            name: 'terminal.app.habit',
            component: appHabit,
            meta: {
              breadcrumbName: '使用习惯',
            },
          }, {
            path: 'installation',
            name: 'terminal.app.installation',
            component: appInstallation,
            meta: {
              breadcrumbName: '安装统计',
            },
          }, {
            path: 'environment',
            name: 'terminal.app.environment',
            component: appEnvironment,
            meta: {
              breadcrumbName: '使用环境分析',
            },
          }, {
            path: 'userUrl',
            name: 'terminal.app.userUrl',
            component: appUserUrl,
            meta: {
              breadcrumbName: '用户路径',
            },
          }],
      }],
    },
    // 用户数据
    {
      path: '/user',
      name: 'user',
      component: layout,
      redirect: { name: 'user.data' },
      meta: { breadcrumbName: '用户数据' },
      children: [{
        path: 'data',
        name: 'user.data',
        component: userBasic,
        meta: { breadcrumbName: '用户数据' },
        redirect: { name: 'user.data.active' },
        children: [
          {
            path: 'active',
            name: 'user.data.active',
            component: userActive,
            meta: {
              breadcrumbName: '用户活跃度',
            },
          }, {
            path: 'newRegister',
            name: 'user.data.newRegister',
            component: userNewRegister,
            meta: {
              breadcrumbName: '新老用户',
            },
          }, {
            path: 'retained',
            name: 'user.data.retained',
            component: userRetained,
            meta: {
              breadcrumbName: '用户留存',
            },
          }, {
            path: 'backflow',
            name: 'user.data.backflow',
            component: userBackflow,
            meta: {
              breadcrumbName: '流失与回流',
            },
          }, {
            path: 'registered',
            name: 'user.data.registered',
            component: userRegistered,
            meta: {
              breadcrumbName: '注册渠道和方式',
            },
          }, {
            path: 'portrait',
            name: 'user.data.portrait',
            component: userPortrait,
            meta: {
              breadcrumbName: '用户画像',
            },
          }],
      }],
    },
  ],
});
// 请求接口前判断是否有access_token 如果没有 直接跳转登录页
router.beforeEach(async (to, from, next) => {
  if (to.path === '/error') {
    next();
    emptyStorage();
  } else if (!window.localStorage.getItem('sta_access_token') || to.path === '/loading') {
    if (from.path === '/error') {
      return;
    }
    await store.dispatch('checkToken', { code: GetQueryString('code'), state: GetQueryString('state') });
    next({
      path: '/content',
    });
  } else if (window.localStorage.getItem('sta_access_token')) {
    next();
  }
});
export default router;
