 var vm = new Vue({
     el: '#app',
     data: {
         host: 'http://bbssc.cloud.hoge.cn/',
         flag:false,
         count: 10,
         page: 1,
         tipicsList: [],
         access_token:undefined,
         hasLogin:undefined,
         storage:window.localStorage
     },
     methods: {
         // 我的关注   ?m=Apibbs&c=care&a=showMyCareForum 
         // 空数组
         getMyfollowData() {
             const _this = this;
             if(!this.hasLogin){
                console.log('login')
                SmartCity.goLogin();
                return
            }
             param = {
                 m: "Apibbs",
                 c: "care",
                 a: "showMyCareForum",
                //  access_token:'ab47875ec2355ddf24516b94e8037cfe',
                 access_token: _this.storage.getItem('access_token'),
                 // is_second（是否是子集）：1
                 // is_second:1,
                 offset: (_this.page - 1) * _this.count,
                 count: _this.count,
                 site_Id: 10188,
                 custom_appid: 352,
                 custom_appkey: 'itFj7LkvywZBVaNuD7QQQGlheJ7eNbQV'
             }
             url = _this.host;
             return new Promise((resolve,reject)=>{
                 axios.get(url, {
                     params: param
                 })
                 .then(
                     res => {
                         // console.log(res.data);
                         if (res.data.ErrorCode || res.data.ErrorText) {
                             return
                         }
                         res.data.forEach((ele)=>{
                            ele.indexpic.filename = _this.imgAdaptation(ele.indexpic.filename,'114','114')
                        })
                         resolve(res.data)

                     },
                     err=>{
                         reject(err.data)
                     }
                 )
             })
             
         },
         imgAdaptation(filename, w, h) {
            var reg = RegExp(/\{\$hgPicSizeStart\}/);
            if (filename.match(reg)) {
                filename = filename.replace("{$hgPicSizeStart}", "");
                filename = filename.replace("{$hgPicSizeEnd}", "");
                filename = filename.replace("{$hgPicSizeWidth}", w);
                filename = filename.replace("{$hgPicSizeHeight}", h);
            }
            return filename
        },
         // 获取用户信息
        _initUserInfo() {
            var _this = this;
            SmartCity.getUserInfo(function (res) {
                if (res && res.userInfo) {
                    _this.access_token = res.userInfo.userTokenKey;
                    _this.storage.setItem('access_token', _this.storage.getItem('access_token'))
                }
                _this.promiseAll()
            })
        },
        promiseAll(){
            const _this = this;
            Promise.all([_this.getMyfollowData()])
            .then(function (result) {
                _this.tipicsList = result[0];
                _this.flag = true;
                _this._initUserInfo();
                _this.hasLogin = new UserInfo().isLogin(_this.access_token);
            });
        }

     },
     created() {
        this._initUserInfo();
        this.promiseAll()
     },
 })