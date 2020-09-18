
function padLeftZero (str) {
  return ('00' + str).substr(str.length);
}
// formatDate(new Date(), 'yyyy-MM-dd')
export const formatDate = (date, fmt) => {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
};
// cookie方法
function setCookie (name, val, day) {
  let expireDate = new Date();
  expireDate.setDate(expireDate.getDate() + day);
  document.cookie = `${name}=${val};expires=${expireDate.toGMTString()}`;
};
function getCookies (cName) {
  if (document.cookie.length > 0) {
    let cStart = document.cookie.indexOf(cName + '=');
    if (cStart !== -1) {
      cStart = cStart + cName.length + 1;
      let cEnd = document.cookie.indexOf(';', cStart);
      if (cEnd === -1) cEnd = document.cookie.length;
      return unescape(document.cookie.substring(cStart, cEnd));
    }
  }
  return '';
}
function delCookie (name) {
  setCookie(name, '', -1);
}

export const CookieManager = {
  setCookie,
  getCookies,
  delCookie,
};
// cookie方法 end

// 清空storage和用户token的cookie
export const emptyStorage = () => {
  window.sessionStorage.clear();
  window.localStorage.clear();
  delCookie('sta_access_token');
  delCookie('sta_access_token');
};

export const userInfo = () => {
  const user = JSON.parse(window.sessionStorage.getItem('hoge_cloud_user_info'));
  return user;
};
export const toZhCurrency = (n) => {
  if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n)) { return '数据非法'; }
  let unit = '仟佰拾亿仟佰拾万仟佰拾圆角分';
  let str = '';
  n += '00';
  var p = n.indexOf('.');
  if (p >= 0) { n = n.substring(0, p) + n.substr(p + 1, 2); }
  unit = unit.substr(unit.length - n.length);
  for (var i = 0; i < n.length; i++) { str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i); }
  return str.replace(/零(仟|佰|拾|角)/g, '零').replace(/(零)+/g, '零').replace(/零(万|亿|圆)/g, '$1').replace(/(亿)万|壹(拾)/g, '$1$2').replace(/^圆零?|零分/g, '').replace(/圆$/g, '圆整');
};

export const GetQueryString = (name) => {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  var r = window.location.search.substr(1).match(reg);// search,查询？后面的参数，并匹配正则
  if (r != null) return unescape(r[2]); return null;
};

export const DeepCopyArr = (arr) => {
  return JSON.parse(JSON.stringify(arr));
};
export const formatSeconds = (s) => {
  var t;
  if (s > -1) {
    var hour = Math.floor(s / 3600);
    var min = Math.floor(s / 60) % 60;
    var sec = s % 60;
    if (hour < 10) {
      t = '0' + hour + ':';
    } else {
      t = hour + ':';
    }

    if (min < 10) { t += '0'; }
    t += min + ':';
    if (sec < 10) { t += '0'; }
    t += sec;
  }
  return t;
};
