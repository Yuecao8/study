// 获取url上的参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg); //search,查询？后面的参数，并匹配正则
    if (r != null) return unescape(r[2]);
    return null;
}
//		console.log(GetQueryString('id'));
var id = GetQueryString('id');
var lunbo_id = GetQueryString('lunbo_id');
var bundle_id = GetQueryString('bundle_id');
var content_fromid = GetQueryString('content_fromid')
var vm = new Vue({
    el: '#app',
    data: {
        contentList: {},
        bundle_id: undefined,
        id: null,
        type: '',
        relateData: [],
        comentData: [],
        relateShow: false,
        show: false,
        // 显示数量
        count: 2,
        // 页数
        page: 1,
        host: "http://mapi.0561rtv.cn/api/v1",
        showAll: false,
        content: undefined,
        showTips: false,
        tipMessage: undefined
    },
    filters: {
        getTimeData(dataTime) {
            var currentTime = new Date().getTime();
            var forwardTime;
            // var dataTime = parseInt(val.publish_time_stamp) * 1000;
            var seconds = parseInt((currentTime - dataTime * 1000) / 60000);
            if (seconds < 1) {
                forwardTime = '1分钟前'
            } else if (seconds < 60 && seconds > 1) {
                forwardTime = seconds + '分钟前'
            } else if (seconds > 60 && seconds < 1440) {
                forwardTime = parseInt(seconds / 60) + '小时前'
            } else if (seconds > 1440) {
                forwardTime = parseInt(seconds / 1440) + '天以前'
            }
            return forwardTime
        }
    },
    methods: {
        //评论框
        showCont: function () {
            this.show = !this.show;
        },
        // 评论框  获取焦点
        cilikComment() {
            this.show = !this.show;
            this.$nextTick(function () {
                this.$refs.textareaBox.focus()
            })
        },
        goDetail: function (id) {
            window.location.href = "detail.html?id=" + id + "&content_fromid=" + content_fromid + "&bundle_id=" + bundle_id;
        },
        // 详情页内容
        getData() {
            const _this = this;
            return new Promise((resolve, reject) => {
                axios.get('http://mapi.0561rtv.cn/api/v1/item.php?id=' + id)
                    .then(
                        res => {
                            resolve(_this.contentList);
                            if (res.data && res.data.hasOwnProperty('content')) {
                                _this.contentList = res.data;
                                _this.bundle_id = res.data.bundle_id;
                                _this.type = res.data.type;
                                _this.content_id = res.data.content_id;
                            } else if (res.data) {
                                _this.contentList = res.data;
                                _this.bundle_id = res.data.bundle_id;
                                _this.type = res.data.type;
                                _this.content_id = res.data.content_id;
                            } else {
                                console.log(res.error)
                            }

                        },
                        err => {
                            reject(err.data)
                        }
                    )
            })

        },
        // 精彩推荐
        getRelate() {
            const _this = this;
            param = {
                id: id
                //bundle_id: _this.bundle_id,
                //type: _this.type
            }
            url = _this.host;
            return new Promise((resolve, reject) => {
                axios.get(url + '/related_content.php', {
                        params: param
                    })
                    .then(
                        res => {
                            //console.log(res.data);
                            if (res.data != '') {
                                _this.relateData = res.data;
                                _this.relateShow = true;
                            }
                            resolve(_this.relateData)
                        },
                        err => {
                            reject(err.data)
                        }
                    )
            })

        },
        // 热门评论
        getComment() {
            const _this = this;
            param = {
                app_uniqueid: bundle_id, //module_id
                content_id: _this.GetQueryString('content_fromid'),
                count: _this.count,
                offset: (_this.page - 1) * _this.count
            }
            url = _this.host;
            return new Promise((resolve, reject) => {
                axios.get(url + '/comment_hot.php', {
                        params: param
                    })
                    .then(
                        res => {
                            res.data.forEach(element => {
                                _this.comentData.push(element)
                            });
                            // _this.comentData = res.data;
                            resolve(_this.comentData);
                        },
                        err => {
                            reject(err.data)
                        }
                    )
            })

        },
        changeColor() {
            if (this.content.length > 0) {
                this.$refs.sendBtn.style.color = "#333";
            } else {
                this.$refs.sendBtn.style.color = "#999";
            }
        },
        // 加载更多 
        // getMore() {
        //     this.page++;
        //     this.getComment()
        // },
        // 创建评论   http://mapi.0561rtv.cn/api/v1/comment_create.php app_uniqueid	
        sendComment() {

            if (this.$refs.sendBtn.style.color != "rgb(51, 51, 51)") {
                return false
            }

            this.show = !this.show;
            const _this = this;
            const access_token = _this.getCookie('access_token')
            param = {
                app_uniqueid: bundle_id,
                content: _this.content,
                content_id: content_fromid,
                custom_appkey: 'itFj7LkvywZBVaNuD7QQQGlheJ7eNbQV',
                // access_token: 'c6fe9702d0c02487a1a6ee46a0ff3371'
                access_token:access_token
            }
            config = {
                header: {
                    'Content-Type': 'multipart/form-data'
                }
            }
            url = _this.host;
            axios.post('http://mapi.0561rtv.cn/api/v1/comment_create.php', param, config)
                .then(
                    res => {
                        setTimeout(() => {
                            _this.showTips = false;
                        }, 1500)
                        _this.showTips = true;
                        if (res.data.ErrorText || res.data.ErrorCode) {
                            _this.tipMessage = res.data.ErrorText;
                            _this.content = '';
                            return
                        }
                        _this.content = '';
                        _this.tipMessage = "评论待审核"

                    }
                )
        },

        // 评论点赞 http://mapi.0561rtv.cn/api/v1/comment_vote.php
        dianzan(index, id) {
            // console.log(index)
            const _this = this;
            const access_token = _this.getCookie('access_token')
            param = {
                id: id,
                custom_appkey: 'itFj7LkvywZBVaNuD7QQQGlheJ7eNbQV',
                // access_token: 'c6fe9702d0c02487a1a6ee46a0ff3371'
                access_token:access_token
            }
            axios.get('http://mapi.0561rtv.cn/api/v1/comment_vote.php', {
                    params: param
                })
                .then(
                    res => {
                        _this.updateComment()
                    }
                )
        },
        updateComment() {
            const _this = this;
            param = {
                app_uniqueid: bundle_id, //module_id
                content_id: _this.GetQueryString('content_fromid')
            }
            url = _this.host;
            axios.get(url + '/comment_hot.php', {
                    params: param
                })
                .then(
                    res => {
                        _this.comentData = res.data;
                    }

                )
        },

        // 获取url上的参数
        GetQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg); //search,查询？后面的参数，并匹配正则
            if (r != null) return r[2];
            return null;
        },
          //获取滚动条当前的位置 
          getScrollTop(){
            var scrollTop = 0;
              if(document.documentElement && document.documentElement.scrollTop) {
                   scrollTop = document.documentElement.scrollTop;
               } else if(document.body) {
                 scrollTop = document.body.scrollTop;
                }
              return scrollTop;
           },
   
         //获取当前可视范围的高度 
         getClientHeight() {
             var clientHeight = 0;
                if(document.body.clientHeight && document.documentElement.clientHeight) {
                   clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight);
                } else {
                   clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
               }
                return clientHeight;
            },
    
            //获取文档完整的高度 
            getScrollHeight() {
               return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
            },


    },
    created() {
        const _this = this;
        // this.getData()
        // this.getComment()
        Promise.all([_this.getData(), _this.getRelate(), _this.getComment()]).then((result) => {
            _this.showAll = true
        })
         //滚动事件触发
         window.addEventListener('scroll',()=>{
            if(_this.getScrollTop() + _this.getClientHeight() == _this.getScrollHeight()) {
                _this.page++;
                _this.getComment();
            }
            })
    }
})