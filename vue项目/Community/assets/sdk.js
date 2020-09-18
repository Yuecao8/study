(function(){
  function Plugin(){
		var _this = this;
  
		var _bridgeInit = false;
  
		_this.response = {};
  
		_this.cache = {};
  
		_this.entryPlat = '';
  
		var utils = {
  getMobileDevice : function(){
  var mbldevice = navigator.userAgent.toLowerCase();
  if (/iphone|ipod|ipad/gi.test( mbldevice ))
  {
  return "iOS";
  }
  else if (/android/gi.test( mbldevice ))
  {
  return "Android";
  }
  else
  {
  return "Unknow Device";
  }
  },
  
  connectWebViewJavascriptBridge : function( cb ) {								/*桥连*/
  if (window.WebViewJavascriptBridge) {
  cb(WebViewJavascriptBridge);
  }else{
  document.addEventListener('WebViewJavascriptBridgeReady', function() {
                            cb(WebViewJavascriptBridge);
                            }, false);
  }
  },
  
  callApiCenter : function( api, param , callback ){
  var mbldevice = utils.getMobileDevice();
  utils.connectWebViewJavascriptBridge(function( bridge ){
                                       if (!_bridgeInit) {
                                       if (bridge.init) {
                                       bridge.init(function(message, responseCallback) {});
                                       }
                                       _bridgeInit = true;
                                       }
                                       bridge.callHandler( api, param, function(response) {
                                                          response = typeof response == 'string' ? JSON.parse( response ) : response;
                                                          $.isFunction( callback ) && callback( response );
                                                          });
                                       
                                       if( api == 'getLocation'){
                                       bridge.registerHandler('getLocation', function( response, responseCallback) {
                                                              response = typeof response == 'string' ? JSON.parse( response ) : response;
                                                              _this.response[ api ] = response;
                                                              $.isFunction( callback ) && callback( response );
                                                              responseCallback('success');
                                                              });
                                       }
                                       
                                       });
  }
		}
  
		_this.callApiCenter = function( api, param , callback ){
  return utils.callApiCenter( api, param , callback );
		}
  }
  
  $.extend( Plugin.prototype , {
           constructor : Plugin,
           
           getClient : function( api, json ){
           this.entryPlat = this.entryPlat || 'app';
           this.response[ api ] = json;
           this.cache[ api ]( json );
           },
           
           getUserInfo : function( callback ){																/*获取用户信息*/
           return this.callApiCenter( 'getUserInfo', null , callback );
           },
           getSystemInfo : function( callback ){															/*获取设备信息*/
           return this.callApiCenter( 'getSystemInfo', null , callback );
           },
           getLocation : function( callback ){																/*获取定位信息*/
           return this.callApiCenter( 'getLocation', null , callback );
           },
           goLogin : function(){																		/*去登录*/
           return this.callApiCenter( 'goLogin' , null , null );
           },
           shareTo : function( param ){																	/*分享*/
           return this.callApiCenter( 'shareTo' , param , null );
           },
           linkTo : function( param ){																	/*跳内链*/
           return this.callApiCenter( 'linkTo' , param , null );
           },
           goBack : function(){																		/*后退*/
           return this.callApiCenter( 'goBack' , null , null );
           },
           goRoot : function(){
           return this.callApiCenter( 'goRoot' , null , null );												/*去根目录*/
           },
           goUcenter : function(){
           return this.callApiCenter( 'goUcenter' , null , null );											/*去用户中心*/
           },
           fullScreenPlay : function( param ){
           return this.callApiCenter( 'fullScreenPlay' , param , null );										/*播放全屏*/
           },
           openHardwareSpeed : function(){																			/*硬件加速*/
           return this.callApiCenter( 'openHardwareSpeed' , null , null );
           },
           appCommonPay : function( param ){																		/*支付调支付宝，微信等客户端*/
           return this.callApiCenter( 'appCommonPay', param , null );
           },
           getRequestHeader : function( callback ){
           return this.callApiCenter( 'getRequestHeader' , null , callback );					/*header加密信息*/
           },
           goVRPlayer : function( param ){															/*vr播放器*/
                return this.callApiCenter( 'goVRPlayer' , param , null );
           },
           /*正文模板 -------获取点赞信息*/
           getPraiseInfo : function( callback ){
                return this.callApiCenter( 'getPraiseInfo' , null , callback );
           },
           
           /*正文模板 -------获取点赞信息2*/
           getMyPraise : function( callback ){
                return this.callApiCenter( 'getMyPraise' , null , callback );
           }, 

           /*正文模板 -------获取顶踩信息*/
           getDiggInfo : function(  callback ){
                return this.callApiCenter( 'getDiggInfo' , null , callback );
           },
           
           /*正文模板 -------获取相关新闻*/
           getRelateNews : function(  callback ){
                return this.callApiCenter( 'getRelateNews' , null , callback );
           },
           
           /*正文模板 -------获取评论列表*/
           getCommentList : function( callback ){
                return this.callApiCenter( 'getCommentList' , null , callback );
           },
           
           /*正文模板 -------文稿点赞*/
           newsZan : function( callback ){
                return this.callApiCenter( 'newsZan' , null , callback );
           },

           /*正文模板 -------文稿点赞2*/
           goPraise : function( param , callback ){
                return this.callApiCenter( 'goPraise' , param , callback );
           },

           /*正文模板 -------顶踩*/
           digg : function( param , callback ){
                return this.callApiCenter( 'digg' , param , callback );
           },
           
           /*正文模板 -------评论点赞*/
           commentZan : function( param , callback ){
                return this.callApiCenter( 'commentZan' , param , callback );
           },
           
           /*正文模板 -------评论回复*/
           commentReply : function( param ){
                return this.callApiCenter( 'commentReply' , param , null );
           },

          /*正文模板 -------订阅号*/
          goSubscription : function( param,callback ){
              return this.callApiCenter( 'goSubscription' , param , callback );
          },

          /*正文模板 -------订阅号*/
          goSubscriptionOfPlus : function( param,callback ){
                return this.callApiCenter( 'goSubscriptionOfPlus' , param , callback );
          },

          /*正文模板 -------订阅号信息*/
          getSubsInfo : function( callback ){
              return this.callApiCenter( 'getSubsInfo' , null , callback );
          },
          /*正文模板 -------查看更多评论*/
          getMoreComment : function( ){
              return this.callApiCenter( 'getMoreComment' , null , null );
          },
          /*正文模板 -------跳转到订阅号*/
          getSubsInfoOfPlus : function( param ){
              return this.callApiCenter( 'getSubsInfoOfPlus' , param , null );
          },
          /*正文模板 -------获取是否是夜间模式*/
          getNightStatus : function( callback ){
            return this.callApiCenter( 'getNightStatus' , null , callback );
          },
          /*正文模板 -------正文图片放大*/
          showBigImage : function( param ){
            return this.callApiCenter( 'showBigImage' , param , null );
          },
          /*正文模板 -------正文获取信息流的正文点赞数*/
          getPraiseNum : function( callback ){
            return this.callApiCenter( 'getPraiseNum' , null , callback );
          },
          /*正文模板 -------正文获取信息流的正文点赞数*/
          appBroadcast : function(){
            return this.callApiCenter( 'appBroadcast' , null , null );
          },
          /*正文模板 -------正文获取评论详情*/
          goCommentDetail : function( param ){
               return this.callApiCenter( 'goCommentDetail' , param , null );
          },
          /** 活动详情 -------查看地图 */
          viewMap : function(){
            return this.callApiCenter( 'viewMap' , null , null );
          },

          //获取轮播控件的宽高以及相对于原点的位置
          getViewPagerInfo:function( param ){
               return this.callApiCenter( 'getViewPagerInfo' , param , null );
          },
           //隐藏头部
           hideTopView:function( param ){
               return this.callApiCenter( 'hideTopView' , param , null );
          },
          // 选择视频chooseVideo,shootVideo
          chooseVideo:function(callback){
               return this.callApiCenter( 'chooseVideo' , null , callback );
          },
          // 拍摄视频
          shootVideo:function(callback){
               return this.callApiCenter( 'shootVideo' , null , callback );
          },
          // 选择图片 chooseImage
          chooseImage:function(param,callback){
               return this.callApiCenter( 'chooseVideo' , param , callback );
          },
          // 调用摄像头 goToCamera
          goToCamera:function(callback){
               return this.callApiCenter( 'chooseVideo' , null , callback );
          }
           });
           
          
 
  
    window.SmartCity = new Plugin();
    window.goToCamera = function( json ){
     Plugin.prototype.getClient.call( SmartCity, 'goToCamera', json );
   };
  
  })();


