function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg); //search,查询？后面的参数，并匹配正则
    if (r != null) return unescape(r[2]);
    return null;
}
if (GetQueryString("show")) {
    var show = true;
} else {
    show = false
}
var vm = new Vue({
    el: "#app",
    data: {
        show: show,
        host: 'http://bbssc.cloud.hoge.cn/',
        CityDataList: {},
        audioFlag: false,
        avatarImg: undefined,
        videoTip: undefined,
        audioTip: undefined,
        content: undefined,
        comentData: [],
        count: 3,
        page: 1,
        avatarFlag: undefined,
        showTips: false,
        tipMessage: undefined,
        flagMore: true,
        hasLogin: undefined,
        access_token: undefined,
        storage: window.localStorage,
        flag: false,
        videoList: [],
    },
    filters: {
        getTimeData(dataTime) {
            var currentTime = new Date().getTime();
            var forwardTime;
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
        GetQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
        showCont: function () {
            this.show = !this.show;
        },
        getComment() {
            this.show = !this.show;
            this.$nextTick(function () {
                this.$refs.textareaBox.focus()
            })
        },

        getDetailData() {
            const _this = this;
            param = {
                m: "Apibbs",
                a: "detail",
                c: "post",
                fid: 0,
                post_id: _this.GetQueryString("id"),
                site_Id: 10188,
                custom_appid: 352,
                custom_appkey: 'itFj7LkvywZBVaNuD7QQQGlheJ7eNbQV'
            }
            url = _this.host;

            axios.get(url, {
                    params: param
                })
                .then(
                    res => {
                        if (res.data.ErrorCode || res.data.ErrorText) {
                            return
                        }
                        console.log(res)
                        if (res.data.user_info.avatar != 0) {
                            _this.avatarImg = res.data.user_info.avatar;
                        }
                        // if(res.data.hasOwnProperty('videos')){
                        //     console.log(res.data.videos[0])
                        //     if(res.data.videos[0].hasOwnProperty('mtype')){
                        //         _this.videoTip = res.data.videos[0].mtype;
                        //     }
                        //     if (res.data.videos[0].hasOwnProperty("is_audio")) {
                        //         _this.audioTip = res.data.videos[0].is_audio;
                        //     }
                        // }
                        if(res.data.is_have_video == 1 && res.data.hasOwnProperty('videos')){
                            if(res.data.videos[0].hasOwnProperty('mtype')){
                                _this.videoTip = res.data.videos[0].mtype;
                            }
                            if (res.data.videos[0].hasOwnProperty("is_audio")) {
                                _this.audioTip = res.data.videos[0].is_audio;
                            }
                        }
                        if (res.data.address == 0) {
                            _this.$refs.address.style.visibility = 'hidden';
                        }
                        _this.CityDataList = res.data;
                        _this.videoList = res.data.videos;
                        console.log(_this.videoList)
                        _this.getAllComment();
                    },
                )


        },

        sendComment() {
            const _this = this;
            // if (!_this.hasLogin) {
            //     console.log('login')
            //     SmartCity.goLogin();
            //     return
            // }
            _this.show = !_this.show;
            param = {
                status:1,
                m: "Apibbs",
                a: "comment",
                c: "post",
                post_id: this.GetQueryString("id"),
                content: this.content,
                site_Id: 10188,
                custom_appid: 352,
                custom_appkey: 'itFj7LkvywZBVaNuD7QQQGlheJ7eNbQV',
                // access_token: this.storage.getItem('access_token'),
                access_token:'ab47875ec2355ddf24516b94e8037cfe',
            }
            url = _this.host;
            axios.get(url, {
                params: param
            }).then(
                res => {
                    console.log(res)
                    // _this.sendCommentData();
                    setTimeout(() => {
                        _this.showTips = false;
                    }, 1500)

                    _this.showTips = true;

                    if (res.data.ErrorCode || res.data.ErrorText) {
                        _this.tipMessage = res.data.ErrorText
                        _this.content = '';
                        return
                    }
                    _this.content = '';
                    _this.tipMessage = "发布成功";
                    // _this.sendCommentData();
                    _this.comentData.push(res.data)
                }
            )
        },
        sendCommentData() {
            const _this = this;
            param = {
                m: 'Apibbs',
                c: 'comment',
                a: 'index',
                post_id: _this.GetQueryString("id"),
                count: _this.count,
                offset: (_this.page - 1) * _this.count,
                site_Id: 10188,
                custom_appid: 352,
                // access_token: storage.getItem('access_token'),
                access_token:'ab47875ec2355ddf24516b94e8037cfe',
                custom_appkey: 'itFj7LkvywZBVaNuD7QQQGlheJ7eNbQV'
            };
            url = _this.host;
            axios.get(url, {
                    params: param
                })
                .then(
                    res => {
                        _this.comentData = res.data;
                    }
                )
        },

        // 获取所有评论 base_url?m=Apibbs&c=comment&a=index
        getAllComment() {
            const _this = this;
            param = {
                m: 'Apibbs',
                c: 'comment',
                a: 'index',
                post_id: _this.GetQueryString("id"),
                count: _this.count,
                offset: (_this.page - 1) * _this.count,
                site_Id: 10188,
                custom_appid: 352,
                access_token: this.storage.getItem('access_token'),
                custom_appkey: 'itFj7LkvywZBVaNuD7QQQGlheJ7eNbQV'
            };
            url = _this.host;

            axios.get(url, {
                    params: param
                })
                .then(
                    res => { 
                            res.data.forEach(element => {
                                _this.comentData.push(element)
                            });
                        _this.flag = true
                        console.log(_this.comentData)
                    }

                )
        },

        goAllComment(id, index, ) {
            console.log(id)
            window.location.href = `comment.html?id=${id}`
        },
        changeColor() {
            if (this.content.length > 0) {
                this.$refs.sendBtn.style.color = "#333";
            } else {
                this.$refs.sendBtn.style.color = "#999";
            }
        },
        playVideo() {
            const _this = this;
            event.preventDefault();
            var audioEle = _this.$refs.audio;
            if (audioEle.paused) {
                audioEle.play(); 
                _this.audioFlag = true;
            } else {
                audioEle.pause(); 
                _this.audioFlag = false;
            }
            if (audioEle) {
                audioEle.loop = false;
                audioEle.addEventListener('ended', function () {
                    _this.audioFlag = false;
                }, false);
            }
        },

        _initUserInfo() {
            const _this = this;
               setTimeout(()=>{
                _this.getDetailData();
               },0)
                
            SmartCity.getUserInfo(function (res) {
                if (res && res.userInfo) {
                    _this.access_token = res.userInfo.userTokenKey;
                    _this.storage.setItem('access_token', _this.access_token)
                }
                _this.getDetailData();
                _this.hasLogin = new UserInfo().isLogin(_this.access_token)
            })
        },
        //获取滚动条当前的位置 
        getScrollTop() {
            var scrollTop = 0;
            if (document.documentElement && document.documentElement.scrollTop) {
                scrollTop = document.documentElement.scrollTop;
            } else if (document.body) {
                scrollTop = document.body.scrollTop;
            }
            return scrollTop;
        },

        //获取当前可视范围的高度 
        getClientHeight() {
            var clientHeight = 0;
            if (document.body.clientHeight && document.documentElement.clientHeight) {
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
        // new VConsole();
        this._initUserInfo();
        window.addEventListener('scroll', () => {
            if (this.getScrollTop() + this.getClientHeight() == this.getScrollHeight()) {
                if (this.comentData.length < (this.page) * this.count) {
                    return
                }else{
                    this.page++;
                    this.getAllComment()
                }
               
            }
            
        })
    },
})