import axios from 'axios';
import { Message } from 'element-ui';
import router from '../router';
import { emptyStorage } from './../services/utils';
const http = axios.create({
  baseURL: process.env.NODE_ENV !== 'production' ? '/api/' : '/dev/',
  showErrorMessage: true,
});
http.interceptors.request.use(function (config) {
  config.headers.Authorization = window.localStorage.getItem('sta_access_token') ? `Bearer ${window.localStorage.getItem('sta_access_token')}` : '';
  // 在发送请求增加token字段
  // debugger;// eslint-disable-line
  if (config.method === 'post' || config.method === 'put' || config.method === 'delete') {
    config.data = {
      ...config.data,
    };
  } else if (config.method === 'get') {
    config.params = {
      ...config.params,
    };
  }

  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});
http.interceptors.response.use((response) => {
  const { code, msg } = response.data;
  // 未登录为100状态
  if (parseInt(code, 10) === 100 || parseInt(code, 10) === 1002) {
    // 跳转登录页 清空storage
    router.push('/error');
    emptyStorage();
  } else if (parseInt(code, 10) !== 200) {
    const { showErrorMessage } = response.config;
    if (showErrorMessage) Message.error(msg);
    const err = new Error(msg);
    err.code = code;
    if (parseInt(code, 10) === 400) {
      emptyStorage();
      router.push('/error');
    }
    return Promise.reject(err);
  }
  return response.data.data;
}, (err) => {
  if (status === 401 || status === 403 || status === 400) {
    // 跳转登录页
    emptyStorage();
    router.push('/error');
  }
  return Promise.reject(err);
});

export default http;
