<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=1400">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>视觉南京</title>
	<link rel="icon" type="image/x-icon" sizes="16x16" href="{$TEMPLATE}images/logo3x.ico"/>
    <link rel="stylesheet" href="{$TEMPLATE}css/base.css">
     <link rel="stylesheet" href="{$TEMPLATE}css/font/iconfont.css">
    <link rel="stylesheet" href="{$TEMPLATE}css/index_main.css">
    <link rel="stylesheet" href="{$TEMPLATE}css/common_css/header.css">
    <link rel="stylesheet" href="{$TEMPLATE}css/common_css/share.css">
    <link rel="stylesheet" href="{$TEMPLATE}css/common_css/footer.css">
    <link rel="stylesheet" href="{$TEMPLATE}css/common_css/login.css">
    <link rel="stylesheet" href="{$TEMPLATE}css/common_css/sign.css">
    <script src="{{$TEMPLATE}}js/jquery.min.js"></script>
    <script src="{{$TEMPLATE}}js/jquery.SuperSlide.2.1.3.js"></script>
	<script src="{{$TEMPLATE}}js/cheet.min.js"></script>
	
</head>

<body>
    <div class="back_top"><i class="iconfont">&#xe61e;</i></div>
    <div class="index_main">
      
        <div class="index_header">
            <div class="header_nav pr">
               
                 <!-- 头部 -->
                {include $TEMPLATE ."common/header"}
                <!-- 头部 -->
                <!-- 大标题 -->
                <div class="advertise pr">
                    <span class="adv_first">捕获瞬间之美</span>
                    <span>邂逅最美南京</span>
					<span class="pr"><i id="search_pointer" class="iconfont">&#xe63e;</i></span>
                </div>
                <!-- 搜索 -->
                <div class="search" style="display:none">
                    <div class="search_box">


                        <div class="view_box pr">
                           <span class="seek_close"><i class="iconfont">&#xe61d;</i></span>
                            <span class="search_view">
                                    <input type="text" id="search_text" placeholder="搜索你喜欢的" name="" class="sou_like">
                                    </span>
                            <span class="search_icon">
                            <span class="icon_camera" style="display:none"></span>
                            <span class="icon_line1" style="display:none"><i class="iconfont">&#xe615;</i> </span>
                            <span class="icon_sweep" style="cursor: pointer;"></span>
                            <span class="icon_line2" ><i class="iconfont">&#xe615;</i></span>
                            <span class="icon_seek" style="cursor: pointer;"></span>
                            </span>
                        </div>


                        <script type="text/javascript">
                            $(function() {
                                $("body").on("click", ".icon_seek", function() {

                                    var search_text = $(".sou_like").val();
                                    if (search_text == "") {
                                        alert("请输入信息");
                                        return false;
                                    }
                                    location.href = "http://www.vinj.cn/folder78?search_text=" + search_text;
                                });
                            });

                            $('#search_text').bind('keypress', function(event) {
                                if (event.keyCode == "13") {
                                    $(".icon_seek").click();
                                    return false;
                                }
                            })

							//搜索隐藏
							$("#search_pointer").click(function(){
                            	$(this).hide();
                              	$(".advertise").hide();
                              	$(".search").show(500);
                            })
							$(".seek_close").click(function(){
                            $(".search").hide();
                            $(".advertise").show();
                            $("#search_pointer").show();
                           })
                        </script>
                    </div>
                   
                    <!-- 默认不显示，点击搜索框显示 -->
                    <div class="hot_board" style="display:none;">
                      
                        <!-- 当点击图片时显示的内容 -->
                        <div class="sweep_board" >
                            <div class="drag_box">
                                <div class="drag" id="drag1">
                                  	
									<img style="width: auto;height: 100%;" src="" alt="" class="panel" id="addImg">
								</div>
								
                            </div>
                            <div class="adb_file">
                                <div class="fileContainer">
                                    <input class="fileInput" id="add" type="file" name="">
                                </div>
                                <div class="file_txt"> <img src="{$TEMPLATE}images/uplode_file.png" alt=""> 上传本地图片</div>
                            </div>
                        </div>

                    </div>
					<script>
                           	$("#add").on("change",function() {
							  var pic_id='';
                              var files = $("#add").get(0).files[0]; //获取file控件中的内容

                              var reader = new FileReader();
                              reader.readAsDataURL(files);
                              reader.onload = function(f) {

                                  document.getElementById("addImg").src = this.result;
                              }

                              var formData = new FormData();
                              formData.append("image", files);
                              
                              $.ajax({
                                  type:"POST",
                                  url:"http://middle-api.plus.vinj.cn/api/gallery/photos/upload",//接口请求地址
                                  contentType:false,
                                  processData: false,
                                  data:formData,
                                  success:function(data){
                                      console.log(data);
                                        pic_id=data.data.id;
										console.log(pic_id);
                                    	location.href = "http://www.vinj.cn/folder108?pic_id=" + pic_id;
                                    	
                                    }
                              });
                                  this.value=null;

                           });
							   
                    </script>
                </div>
                <!-- 我要发片 -->
                <div class="deliver" style="display:none">
                    <a href="#"  class="deliver_photo">
							我要发片
					</a>
                </div>

            </div>
        </div>
        <!--  专题分类图  -->
        <div class="main_content">
            <!--  今日图片  -->
            <div class="today_pic">
                <div class="container pr">
                    <div class="title">最新图片 
					<span class="statistical" style="display:none;position: absolute;right: 0;top: 0;font-size: 16px;">共<b class="nitems"></b>个作品</span>					</div>
                    <div id="slideBox" class="slideBox  pr">
                        <div class="hd">
                            <ul>
                                <li></li>
                                <li></li>
								<li></li>
                                <li></li>
                            </ul>
                        </div>
                        <div class="bd">
                            <ul class="today_ul">
                                <li class="wrapper  cl  pr ">

                                    <div class="today_top today_top1">

                                    </div>

                                </li>
                                <li class="wrapper  cl  pr">
                                    <div class="today_top today_top2">

                                    </div>

                                </li>
								 <li class="wrapper  cl  pr">
                                    <div class="today_top today_top3">

                                    </div>

                                </li>
								 <li class="wrapper  cl  pr">
                                    <div class="today_top today_top4">

                                    </div>

                                </li>
                            </ul>
                        </div>
                        <span class="com arrow_left prev"><i class="iconfont">&#xe60d;</i></span>
                        <span class="com arrow_right next"><i class="iconfont">&#xe6b7;</i></span>
                    </div>

                    <div class="more">
                       
                       
                       
                    </div>
                </div>
            </div>
			<div class="banner nj_week" style="height:120px;width:1200px;margin:0 auto;background:url({$TEMPLATE}images/banner_bar1.png);background-size:cover;cursor: pointer;">
              
              </div>
			 <!-- 新闻图片 -->
            <div class="news_pic">
                <div class="container">
                    <!--{hoge:column_list column_id="17" }-->
                    <div class="title"><a style="color: #4F4F4F;" href="{$_column_url}">新闻图片</a></div>
                   <!--{/hoge:column_list}-->
                    <div id="slideBox" class="slideBox pr">
                        <div class="bd">
                            <ul class="news_ul">
                                <li class="wrapper cl pr">
                                    <div class="news_top">
                                        <div class="news_left news_big_img">

                                        </div>
                                        <div class="news_right news_small_img">

                                            <div class="news_right_box">

                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li class="wrapper cl pr">
                                    <div class="news_top">
                                        <div class="news_left news_big_img1">

                                        </div>
                                        <div class="news_right news_small_img1">

                                            <div class="news_right_box">

                                            </div>
                                        </div>
                                    </div>
                                </li>
                        	   <li class="wrapper cl pr">
                                    <div class="news_top">
                                        <div class="news_left news_big_img2">

                                        </div>
                                        <div class="news_right news_small_img2">

                                            <div class="news_right_box">

                                            </div>
                                        </div>
                                    </div>
                                </li>
                              <li class="wrapper cl pr">
                                    <div class="news_top">
                                        <div class="news_left news_big_img3">

                                        </div>
                                        <div class="news_right news_small_img3">

                                            <div class="news_right_box">

                                            </div>
                                        </div>
                                    </div>
                                </li>

                            </ul>
                        </div>
                        <span class="com arrow_left prev"><i class="iconfont">&#xe60d;</i></span>
                        <span class="com arrow_right next"><i class="iconfont">&#xe6b7;</i></span>

                    </div>
                      <div class="adver" style="cursor: pointer;"><img src="{$TEMPLATE}images/index_tastefully.jpg" alt="" oncontextmenu="return false;" ondragstart="return false;"></div>
                    <div class="more" style="display:none">
                        <!--{hoge:column_list column_id="17" }-->
                        <a  href="{$_column_url}">查看更多</a>
                        <!--{/hoge:column_list}-->
                    </div>
                </div>
            </div>
            <!-- 专题图片 -->
            <div class="special_pic">
                <div class="container">
                     
                  	 <!--{hoge:column_list column_id="18" }-->
                    <div class="title"><a style="color: #4F4F4F;" href="{$_column_url}">专题图片</a></div>
					 <!--{/hoge:column_list}-->
                    <div id="slideBox" class="slideBox pr">
                        <div class="bd">
                            <ul class="special_ul">
                                <li class="wrapper topic_list cl pr">
                                    <div class="special_top special_top1"></div>
                                </li>
                                <li class="wrapper topic_list cl pr">
                                    <div class="special_top special_top2"></div>

                                </li>
                          		<li class="wrapper topic_list cl pr">
                                    <div class="special_top special_top3"></div>

                                </li>
                          		<li class="wrapper topic_list cl pr">
                                    <div class="special_top special_top4"></div>

                                </li>

                            </ul>
                        </div>
                        <span class="com arrow_left prev"><i class="iconfont">&#xe60d;</i></span>
                        <span class="com arrow_right next"><i class="iconfont">&#xe6b7;</i></span>

                    </div>
                    <div class="more">
                        <!--{hoge:column_list column_id="18" }-->
                        <a href="{$_column_url}">查看更多</a>
                        <!--{/hoge:column_list}-->
                    </div>
                </div>
            </div>
           
            <!-- 航拍频道 -->
            <div class="aerial_channel">
                <div class="container">
                    <!--{hoge:column_list column_id="24" }-->
                    <div class="title"><a style="color: #4F4F4F;" href="{$_column_url}">航拍频道</a></div>
					 <!--{/hoge:column_list}-->
                    <div id="slideBox" class="slideBox pr">
                        <div class="bd">
                            <ul class="aerial_ul">
                                <li class="wrapper cl pr">
                                    <div class="aerial_top aerial_top1">

                                    </div>
                                </li>
                                <li class="wrapper cl pr">
                                    <div class="aerial_top aerial_top2">

                                    </div>
                                </li>
                          <li class="wrapper cl pr">
                                    <div class="aerial_top aerial_top3">

                                    </div>
                                </li>
                                <li class="wrapper cl pr">
                                    <div class="aerial_top aerial_top4">

                                    </div>
                                </li>
                            </ul>
                        </div>
                        <span class="com arrow_left prev"><i class="iconfont">&#xe60d;</i></span>
                        <span class="com arrow_right next"><i class="iconfont">&#xe6b7;</i></span>
                    </div>
                    <div class="more">
                        <!--{hoge:column_list column_id="24" }-->
                        <a href="{$_column_url}">查看更多</a>
                        <!--{/hoge:column_list}-->
                    </div>
                </div>
            </div>
            <!-- 视频专区 -->
            <div class="video_zone">
                <div class="container">
                     <!--{hoge:column_list column_id="23" }--> 
                    <div class="title"> <a style="color: #fff;" href="{$_column_url}">视频专区</a></div>
					 <!--{/hoge:column_list}-->
                    <div id="slideBox" class="slideBox pr video_slide">
                     
                        <div class="hd">
                            <ul>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                            </ul>
                        </div>
                        <div class="bd">
                            <ul>
                                <li class="wrapper cl pr li_1">
                                    <div class="video_top">
                                       
                                        
                                       
                                    </div>
                                </li>
                                <li class="wrapper cl pr li_2">
                                    <div class="video_top">
                                        
                                       
                                        
                                    </div>
                                </li>
                                <li class="wrapper cl pr li_3">
                                    <div class="video_top">
                                        
                                       
                                        
                                    </div>
                                </li>
                                <li class="wrapper cl pr li_4">
                                    <div class="video_top">
                                        
                                        
                                        
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <span class="com arrow_left prev" style="top:33%"><i class="iconfont">&#xe60d;</i></span>
                        <span class="com arrow_right next"  style="top:33%"><i class="iconfont">&#xe6b7;</i></span>
                    </div>
                </div>
            </div>
            <!-- 活动摄影 -->
            <div class="event_photo">
                <div class="container">
                     <!--{hoge:column_list column_id="26" }-->
                    <div class="title"><a style="color: #4F4F4F;" href="{$_column_url}">活动摄影</a></div>
					  <!--{/hoge:column_list}-->
                    <div id="slideBox" class="slideBox pr">
                        <div class="bd">
                            <ul class="event_ul">
                                <li class="wrapper cl pr">
                                    <div class="event_top event_top1">

                                    </div>

                                </li>
                                <li class="wrapper cl pr">
                                    <div class="event_top event_top2">

                                    </div>

                                </li>
                            </ul>
                        </div>
                        <span class="com arrow_left prev"><i class="iconfont">&#xe60d;</i></span>
                        <span class="com arrow_right next"><i class="iconfont">&#xe6b7;</i></span>

                    </div>
                    <div class="more">
                        <!--{hoge:column_list column_id="26" }-->
                        <a href="{$_column_url}">查看更多</a>
                        <!--{/hoge:column_list}-->
                    </div>
                </div>
            </div>
            <!-- 名记名家 -->
            <div class="famous_art">
                <div class="container">
                     <!--{hoge:column_list column_id="27" }-->
                    <div class="title"> <a style="color: #4F4F4F;" href="{$_column_url}">摄影之家</a></div>
					 <!--{/hoge:column_list}-->
                    <div id="slideBox" class="slideBox pr art_slide">
                        <div class="bd">
                            <ul>
                                <li class="wrapper cl pr">
                                    <div class="famous_top1 famous_top">



                                    </div>
                                </li>
                           <li class="wrapper cl pr">
                                    <div class="famous_top2 famous_top">



                                    </div>
                                </li>
                           <li class="wrapper cl pr">
                                    <div class="famous_top3 famous_top">



                                    </div>
                                </li>
                           <li class="wrapper cl pr">
                                    <div class="famous_top4 famous_top">



                                    </div>
                                </li>
                            </ul>
                        </div>
                        <span class="com arrow_left prev"><i class="iconfont">&#xe60d;</i></span>
                        <span class="com arrow_right next"><i class="iconfont">&#xe6b7;</i></span>
                    </div>

                    <div class="more">
                         <!--{hoge:column_list column_id="27" }-->
                        <a href="{$_column_url}">查看更多</a>
						 <!--{/hoge:column_list}-->
                    </div>
                </div>
            </div>
        </div>
        <!--分享和底部--->
        {include $TEMPLATE ."common/share"} {include $TEMPLATE ."common/footer"}
        <!--分享和底部--->
    </div>

    <!----------------登录---------------------------------------------------------------------->

    <!------------------------------注册------------------------------------------------------>

    <script type="text/javascript">
     
	
        //首页轮播                       
        $(".slideBox").slide({
            mainCell: ".bd ul",
            autoPlay: false,
            effect: "leftLoop"
        });
		//账号 和验证码登录切换
        jQuery(".slide_login").slide({
            trigger: "click"
        });
        //视频滑上自动播放
        document.body.addEventListener('mouseover', function() {
            $('#video_control').muted = false;
        }, false);
        $(".video_top .item").mouseover(function() {
            $(this).find("#video_control").trigger('play');
            $(this).find(".play_icon").hide();


        }).mouseout(function() {
            $(this).find("#video_control").trigger('pause');
            $(this).find(".play_icon").show();

        })
		//返回顶部
		 var oBtn = document.getElementsByClassName('back_top')[0];
        var timer = null;

        // 滚动滚动条，返回顶部按钮显示和隐藏
        window.onscroll = function() {
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            if (scrollTop >= 666) {
                oBtn.style.display='block';
            } else {
                oBtn.style.display='none';
            }
        };

        oBtn.onclick = function() {
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            timer = setInterval(function() {
                scrollTop -= 50;

                document.documentElement.scrollTop = scrollTop; // 除谷歌之外的
                document.body.scrollTop = scrollTop; // 谷歌浏览器
                if (scrollTop <= 0) {
                    clearInterval(timer);
                }
            }, 10);
        };
    </script>
    <script type="text/babel">
        
        //今日图片
        window.onload = function() {　　
            var todayarr_img_big = [];
            var todayarr_img_small = [];
            var todayarr_title = [];
            var todayarr_id = [];
            var todayarr_gaosi_arr = [];
            $.ajax({
                url: 'http://middle-api.plus.vinj.cn/api/publish/newest_photos', // 请求的地址
                type: 'get', // 请求的类型（get post）
                data: {
                    "per_num": 24
                },
                dataType: "json", // 期望后端给你返回的数据类型
                timeout: 5000, // 如果5秒之后，数据还没有回来，则请求超时
                async: true, // 是否异步，默认为true（是异步）
                success: function(data) {
                    console.log(data);
					console.log(1);
                  	
                  	$.each(data.data, function(index, item) {
                      
                        var index_pic_big = item.index_pic.split('/');
                        var index_pic_small = item.index_pic.split('/');
                        var index_pic_gaosi = item.index_pic.split('/');
                        index_pic_gaosi.splice(3, 0, '5x');
            			var gaosi = index_pic_gaosi.join('/');
                        var pic_arr_big = index_pic_big.splice(3, 0, '596x210');
                        var pic_arr_small = index_pic_small.splice(3, 0, '293x210');
                        var pic_arr_big_2 = index_pic_big.join('/');
                        var pic_arr_small_2 = index_pic_small.join('/');
            
                        todayarr_gaosi_arr.push(gaosi);
                        todayarr_img_big.push(pic_arr_big_2);
                        todayarr_img_small.push(pic_arr_small_2);
                        todayarr_title.push(item.title);
                        todayarr_id.push(item.origin_id);
                        if (index == 0 || index == 1) {
                            $(".today_top1").append(`
                  <div class="pr com_p today_box tz_box" data-id="${todayarr_id[index]}">
                    <a href="javascript:;"><img data-src="${todayarr_img_big[index]}" src="${todayarr_gaosi_arr[index]}" alt="" width="596" height="210" oncontextmenu="return false;" ondragstart="return false;"></a>
                    <a href="javascript:;" class="hover_showtxt">
                      <p>${todayarr_title[index]}</p>
                    </a>
                  </div>
                `)
                        } else if (index < 6) {
                            $(".today_top1").append(`
                  <div class="pr com_p today_box tz_box" data-id="${todayarr_id[index]}">
                    <a href="javascript:;"><img  data-src="${todayarr_img_small[index]}" src="${todayarr_gaosi_arr[index]}" alt="" width="293" height="210" oncontextmenu="return false;" ondragstart="return false;"></a>
                    <a href="javascript:;" class="hover_showtxt">
                      <p>${todayarr_title[index]}</p>
                    </a>
                  </div>
                `)
                        } else if (index == 6 || index == 7) {
                            $(".today_top2").append(`
                  <div class="pr com_p today_box tz_box" data-id="${todayarr_id[index]}">
                    <a href="javascript:;"><img data-src="${todayarr_img_big[index]}" src="${todayarr_gaosi_arr[index]}" alt="" width="596" height="210" oncontextmenu="return false;" ondragstart="return false;"></a>
                    <a href="javascript:;" class="hover_showtxt">
                      <p>${todayarr_title[index]}</p>
                    </a>
                  </div>
                `)
                        } else if(index<12){
                            $(".today_top2").append(`
                  <div class="pr com_p today_box tz_box" data-id="${todayarr_id[index]}">
                    <a href="javascript:;"><img data-src="${todayarr_img_small[index]}" src="${todayarr_gaosi_arr[index]}" alt="" width="293" height="210" oncontextmenu="return false;" ondragstart="return false;"></a>
                    <a href="javascript:;" class="hover_showtxt">
                      <p>${todayarr_title[index]}</p>
                    </a>
                  </div>
                `)
                        }else if(index ==12 || index ==13){
                          $(".today_top3").append(`
                  <div class="pr com_p today_box tz_box" data-id="${todayarr_id[index]}">
                    <a href="javascript:;"><img data-src="${todayarr_img_big[index]}" src="${todayarr_gaosi_arr[index]}" alt="" width="596" height="210" oncontextmenu="return false;" ondragstart="return false;"></a>
                    <a href="javascript:;" class="hover_showtxt">
                      <p>${todayarr_title[index]}</p>
                    </a>
                  </div>
                `)
                        
                        }else if(index<18){
                          $(".today_top3").append(`
                  <div class="pr com_p today_box tz_box" data-id="${todayarr_id[index]}">
                    <a href="javascript:;"><img data-src="${todayarr_img_small[index]}" src="${todayarr_gaosi_arr[index]}" alt="" width="293" height="210" oncontextmenu="return false;" ondragstart="return false;"></a>
                    <a href="javascript:;" class="hover_showtxt">
                      <p>${todayarr_title[index]}</p>
                    </a>
                  </div>
                `)
                        }else if(index ==18 || index ==19){
                          $(".today_top4").append(`
                  <div class="pr com_p today_box tz_box" data-id="${todayarr_id[index]}">
                    <a href="javascript:;"><img data-src="${todayarr_img_big[index]}" src="${todayarr_gaosi_arr[index]}" alt="" width="596" height="210" oncontextmenu="return false;" ondragstart="return false;"></a>
                    <a href="javascript:;" class="hover_showtxt">
                      <p>${todayarr_title[index]}</p>
                    </a>
                  </div>
                `)
                        
                        }else{
                          $(".today_top4").append(`
                  <div class="pr com_p today_box tz_box" data-id="${todayarr_id[index]}">
                    <a href="javascript:;"><img  data-src="${todayarr_img_small[index]}" src="${todayarr_gaosi_arr[index]}" alt="" width="293" height="210" oncontextmenu="return false;" ondragstart="return false;"></a>
                    <a href="javascript:;" class="hover_showtxt">
                      <p>${todayarr_title[index]}</p>
                    </a>
                  </div>
                `)
                      
                        }
                   
                    })
                }, // 成功的回调

                error: function(err) {

                }, // 失败回调
            })

        }

        //航拍频道
        var aerialarr_img = [];
        var aerialarr_title = [];
        var aerialarr_id = [];
		var aerialarr_gaosi_arr = [];
        $.ajax({
            url: "http://middle-api.plus.vinj.cn/api/publish/column_content_list",
            type: 'get', // 请求的类型（get post）
            data: {
                "per_num": 16,
                "column_id": 24
            },
            dataType: "json", // 期望后端给你返回的数据类型
            timeout: 5000, // 如果5秒之后，数据还没有回来，则请求超时
            async: true, // 是否异步，默认为true（是异步）
            success: function(data) {
                $.each(data.data.data, function(index, item) {
                    var index_pic = item.gallery_pics.pics[0].split('/');
                  	var index_pic_gaosi = item.gallery_pics.pics[0].split('/');
                        index_pic_gaosi.splice(3, 0, '5x');
					var gaosi = index_pic_gaosi.join('/');
                  
                    var pic_arr = index_pic.splice(3, 0, '596x210');
                    var pic_arr2 = index_pic.join('/');
                  	aerialarr_gaosi_arr.push(gaosi);
                    aerialarr_img.push(pic_arr2);
                    aerialarr_title.push(item.title);
                    aerialarr_id.push(item.origin_id);
                    if (index < 4) {
                        $(".aerial_top1").append(`
                        <div class="pr com_p aerial_box tz_box" data-id="${aerialarr_id[index]}">
                          <a href="javascript:;"><img data-src="${aerialarr_img[index]}" src="${aerialarr_gaosi_arr[index]}"  width="596" height="210" alt="" oncontextmenu="return false;" ondragstart="return false;"></a>
                          <div>
                            <a href="javascript:;" class="hover_showtxt">
                              <p>${aerialarr_title[index]}</p>
                            </a>
                          </div>
                        </div>
                        `)
                    } else if(index>=4&&index<8){
                        $(".aerial_top2").append(`
                          <div class="pr com_p aerial_box tz_box" data-id="${aerialarr_id[index]}">
                            <a href="javascript:;"><img data-src="${aerialarr_img[index]}" src="${aerialarr_gaosi_arr[index]}" width="596" height="210" alt="" oncontextmenu="return false;" ondragstart="return false;"></a>
                            <div>
                              <a href="javascript:;" class="hover_showtxt">
                                <p>${aerialarr_title[index]}</p>
                              </a>
                            </div>
                          </div>
                        `)
                    }else if(index>=8&&index<12){
                        $(".aerial_top3").append(`
                          <div class="pr com_p aerial_box tz_box" data-id="${aerialarr_id[index]}">
                            <a href="javascript:;"><img data-src="${aerialarr_img[index]}" src="${aerialarr_gaosi_arr[index]}" width="596" height="210" alt="" oncontextmenu="return false;" ondragstart="return false;"></a>
                            <div>
                              <a href="javascript:;" class="hover_showtxt">
                                <p>${aerialarr_title[index]}</p>
                              </a>
                            </div>
                          </div>
                        `)
                    }else{
                        $(".aerial_top4").append(`
                          <div class="pr com_p aerial_box tz_box" data-id="${aerialarr_id[index]}">
                            <a href="javascript:;"><img data-src="${aerialarr_img[index]}" src="${aerialarr_gaosi_arr[index]}" width="596" height="210" alt="" oncontextmenu="return false;" ondragstart="return false;"></a>
                            <div>
                              <a href="javascript:;" class="hover_showtxt">
                                <p>${aerialarr_title[index]}</p>
                              </a>
                            </div>
                          </div>
                        `)
                    }
                })
            }, // 成功的回调
            error: function(err) {}, // 失败回调
        })

        //活动摄影
        var all_img_title = [];
        var all_img_id = [];
        var all_img_time = [];
        var all_total_num = '';
		var time_cut=[]; 
		//var all_gaosi_arr = [];
        $.ajax({
            url: "http://middle-api.plus.vinj.cn/api/topic/list", // 请求的地址
            type: "get", // 请求的类型（get post）
            data: {
                "column_id": 26,
                "per_num": 30,
                "type":"topic",
            },
            dataType: "json", // 期望后端给你返回的数据类型
            timeout: 5000, // 如果5秒之后，数据还没有回来，则请求超时
            async: true, // 是否异步，默认为true（是异步）
            success: function(data) {
                $.each(data.data.data,function(index,item){
                  var gaosi = [];
                     if(item.index_pic){
                       		gaosi = item.index_pic.replace("vinj.cn/","vinj.cn/5x/");
                          item.index_pic=item.index_pic.replace("vinj.cn/","vinj.cn/293x210/");
                      } else{
                          item.index_pic="http://m2o-api.plus.vinj.cn/themes/nanjing_news/images/activity_bcg.png"
                         
                      }   
                  	all_img_title.push(item.title.substring(0,13));
                  	all_img_id.push(item.id);
                  	time_cut=item.updated_at.substring(0,10);
                   	all_img_time.push(time_cut);
                  	 if (index < 8) {
                        $(".event_top1").append(`
               <div class="item pr">
                            <div class="single_item active_box" data-id="${all_img_id[index]}" style="width:293px;height:210px">
                                <img  style="width:293px;height:210px"  data-src="${item.index_pic}" src="${gaosi}" alt="" oncontextmenu="return false;" ondragstart="return false;">
                            </div>
                           <a href="javascript:;" class="hover_showtxt">
                                <p class="p_title">${all_img_title[index]}</p>
                            </a>
                        </div>
              `)
                    } else {
                        $(".event_top2").append(`
                <div class="item pr">
                            <div class="single_item active_box" data-id="${all_img_id[index]}" style="width:293px;height:210px">
                                <img  style="width:293px;height:210px" data-src="${item.index_pic}" src="${gaosi}" alt="" oncontextmenu="return false;" ondragstart="return false;">
                            </div>
                           <a href="javascript:;" class="hover_showtxt">
                                <p class="p_title">${all_img_title[index]}</p>
                             </a>
                        </div>
              `)
                    }
                })
				
            }, // 成功的回调

            error: function(err) {

            }, // 失败回调
        })

        //新闻图片

        var newsarr_img_big = [];
        var newsarr_img_small = [];
        var newsarr_title = [];
        var newsarr_id = [];
		var newsarr_gaosi_arr = [];
        $.ajax({
            url: "http://middle-api.plus.vinj.cn/api/publish/column_content_list",
            type: 'get', // 请求的类型（get post）
            data: {
                "per_num": 20,
                "column_id": 17,
            },
            dataType: "json", // 期望后端给你返回的数据类型
            timeout: 5000, // 如果5秒之后，数据还没有回来，则请求超时
            async: true, // 是否异步，默认为true（是异步）
            success: function(data) {
              	console.log(data);
              	console.log("新闻图片");
                $.each(data.data.data, function(index, item) {
                    var index_pic_big = item.gallery_pics.pics[0].split('/');
                    var index_pic_small = item.gallery_pics.pics[0].split('/');
                  	var index_pic_gaosi = item.gallery_pics.pics[0].split('/');
                    index_pic_gaosi.splice(3, 0, '5x');
					var gaosi = index_pic_gaosi.join('/');
                    var pic_arr_big = index_pic_big.splice(3, 0, '600x436');
                    var pic_arr_small = index_pic_small.splice(3, 0, '292x214');
                    var pic_arr_big_2 = index_pic_big.join('/');
                    var pic_arr_small_2 = index_pic_small.join('/');

                  	newsarr_gaosi_arr.push(gaosi);
                    newsarr_img_big.push(pic_arr_big_2);
                    newsarr_img_small.push(pic_arr_small_2);
                    newsarr_title.push(item.title);
                    newsarr_id.push(item.origin_id);
                    if (index == 0) {
                        $(".news_big_img").append(`
								<div class="pr com_p news_box tz_box"  data-id="${newsarr_id[index]}">
									<a href="javascript:;"><img width='600' height='436'  data-src="${newsarr_img_big[index]}" src="${newsarr_gaosi_arr[index]}" alt="" oncontextmenu="return false;" ondragstart="return false;"></a>
									<a href="javascript:;" class="hover_showtxt">
										<p>${newsarr_title[index]}</p>
									</a>
								</div>
							`)
                    } else if (index > 0 && index < 5) {
                        $(".news_small_img >div").append(`
								<div class="pr com_p news_box tz_box" data-id="${newsarr_id[index]}">
									<a href="javascript:;"><img width='292' height='214'  data-src="${newsarr_img_small[index]}" src="${newsarr_gaosi_arr[index]}" alt="" oncontextmenu="return false;" ondragstart="return false;"></a>
									<a href="javascript:;" class="hover_showtxt">
										<p>${newsarr_title[index]}</p>
									</a>
								</div>
							`)
                    } else if (index == 5) {
                        $(".news_big_img1").append(`
								<div class="pr com_p news_box" data-id="${newsarr_id[index]}">
									<a href="javascript:;"><img width='600' height='436'  data-src="${newsarr_img_big[index]}" src="${newsarr_gaosi_arr[index]}" alt="" oncontextmenu="return false;" ondragstart="return false;"></a>
									<a href="javascript:;" class="hover_showtxt">
										<p>${newsarr_title[index]}</p>
									</a>
								</div>
							`)
                    } else if(index > 5 && index < 10) {
                        $(".news_small_img1 >div").append(`
								<div class="pr com_p news_box tz_box" data-id="${newsarr_id[index]}">
									<a href="javascript:;"><img width='292' height='214'  data-src="${newsarr_img_small[index]}" src="${newsarr_gaosi_arr[index]}" alt="" oncontextmenu="return false;" ondragstart="return false;"></a>
									<a href="javascript:;" class="hover_showtxt">
										<p>${newsarr_title[index]}</p>
									</a>
								</div>
							`)
                    }else if(index == 10){
                    		 $(".news_big_img2").append(`
								<div class="pr com_p news_box tz_box"  data-id="${newsarr_id[index]}">
									<a href="javascript:;"><img width='600' height='436'  data-src="${newsarr_img_big[index]}" src="${newsarr_gaosi_arr[index]}" alt="" oncontextmenu="return false;" ondragstart="return false;"></a>
									<a href="javascript:;" class="hover_showtxt">
										<p>${newsarr_title[index]}</p>
									</a>
								</div>
							`)
                    
                    }else if(index > 10 && index < 15){
                    	$(".news_small_img2 >div").append(`
								<div class="pr com_p news_box tz_box" data-id="${newsarr_id[index]}">
									<a href="javascript:;"><img width='292' height='214'  data-src="${newsarr_img_small[index]}" src="${newsarr_gaosi_arr[index]}" alt="" oncontextmenu="return false;" ondragstart="return false;"></a>
									<a href="javascript:;" class="hover_showtxt">
										<p>${newsarr_title[index]}</p>
									</a>
								</div>
							`)
                    
                    }else if(index == 15){
                    		 $(".news_big_img3").append(`
								<div class="pr com_p news_box tz_box"  data-id="${newsarr_id[index]}">
									<a href="javascript:;"><img width='600' height='436'  data-src="${newsarr_img_big[index]}" src="${newsarr_gaosi_arr[index]}" alt="" oncontextmenu="return false;" ondragstart="return false;"></a>
									<a href="javascript:;" class="hover_showtxt">
										<p>${newsarr_title[index]}</p>
									</a>
								</div>
							`)
                    
                    }else{
                    	$(".news_small_img3 >div").append(`
								<div class="pr com_p news_box tz_box" data-id="${newsarr_id[index]}">
									<a href="javascript:;"><img width='292' height='214'  data-src="${newsarr_img_small[index]}" src="${newsarr_gaosi_arr[index]}" alt="" oncontextmenu="return false;" ondragstart="return false;"></a>
									<a href="javascript:;" class="hover_showtxt">
										<p>${newsarr_title[index]}</p>
									</a>
								</div>
							`)
                    
                    }
                })

            }, // 成功的回调

            error: function(err) {

            }, // 失败回调
        })

        //专题图片special_top1
        var special_arr = [];
        var special_title = [];
        var special_id = [];
		var special_gaosi_arr = [];

        $.ajax({
                url: "http://middle-api.plus.vinj.cn/api/publish/column_content_list", // 请求的地址
                type: "get", // 请求的类型（get post）
                data: {
                    "per_num": 32,
                   
                    "column_id": 18,
                },
                dataType: "json", // 期望后端给你返回的数据类型
                timeout: 5000, // 如果5秒之后，数据还没有回来，则请求超时
                async: true, // 是否异步，默认为true（是异步）
                success: function(data) {
                   
                    $.each(data.data.data, function(index, item) {
                        var index_pic = item.gallery_pics.pics[0].split('/');
                        var pic_arr = index_pic.splice(3, 0, '293x210');
                        var pic_arr2 = index_pic.join('/');
                      	var index_pic_gaosi = item.gallery_pics.pics[0].split('/');
                    	index_pic_gaosi.splice(3, 0, '5x');
						var gaosi = index_pic_gaosi.join('/');

                      	special_gaosi_arr.push(gaosi);
                        special_arr.push(pic_arr2);
                        special_title.push(item.title);
                        special_id.push(item.origin_id);
                        if (index < 8) {
                            $(".special_top1").append(`
									<div class="pr com_p special_box tz_box" data-id="${special_id[index]}">
								<a href="javascript:;"><img   data-src="${special_arr[index]}" src="${special_gaosi_arr[index]}" width="293" height="210" alt="" oncontextmenu="return false;" ondragstart="return false;"></a>
								<a href="javascript:;" class="hover_showtxt">
									<p>${special_title[index]}</p>
								</a>
							</div>
							`)

                        } else if(index >= 8 && index < 16){
                            $(".special_top2").append(`
								<div class="pr com_p special_box tz_box" data-id="${special_id[index]}">
								<a href="javascript:;"><img  data-src="${special_arr[index]}"  src="${special_gaosi_arr[index]}" width="293" height="210" alt="" oncontextmenu="return false;" ondragstart="return false;"></a>
								<a href="javascript:;" class="hover_showtxt">
									<p>${special_title[index]}</p>
								</a>
							</div>
							`)
                        }else if(index >= 16 && index < 24){
                            $(".special_top3").append(`
								<div class="pr com_p special_box tz_box" data-id="${special_id[index]}">
								<a href="javascript:;"><img data-src="${special_arr[index]}"  src="${special_gaosi_arr[index]}" width="293" height="210" alt="" oncontextmenu="return false;" ondragstart="return false;"></a>
								<a href="javascript:;" class="hover_showtxt">
									<p>${special_title[index]}</p>
								</a>
							</div>
							`)
                        }else{
                            $(".special_top4").append(`
								<div class="pr com_p special_box tz_box" data-id="${special_id[index]}">
								<a href="javascript:;"><img data-src="${special_arr[index]}"  src="${special_gaosi_arr[index]}" width="293" height="210" alt="" oncontextmenu="return false;" ondragstart="return false;"></a>
								<a href="javascript:;" class="hover_showtxt">
									<p>${special_title[index]}</p>
								</a>
							</div>
							`)
                        }

                    })

                }, // 成功的回调

                error: function(err) {

                }, // 失败回调
            })
            //名记名家
        var famous_art_img = [];
        var famous_art_title = [];
        var famous_art_id = [];
		var famous_brief=[];
        $.ajax({
            url: "http://middle-api.plus.vinj.cn/api/publish/column_content_list",
            type: 'get', // 请求的类型（get post）
            data: {
                "per_num": 16,
                "column_id": 97,
            },
            dataType: "json", // 期望后端给你返回的数据类型
            timeout: 5000, // 如果5秒之后，数据还没有回来，则请求超时
            async: true, // 是否异步，默认为true（是异步）
            success: function(data) {
               
                $.each(data.data.data, function(index, item) {
                  	var index_pic = item.index_pic.split('/');
                    var pic_arr = index_pic.splice(3, 0, '130x130');
                    var pic_arr2 = index_pic.join('/');
                    famous_art_img.push(pic_arr2);
                    famous_art_title.push(item.title);
                    famous_art_id.push(item.origin_id);
                  	famous_brief.push(item.brief.substring(0,85)+"...");
                  if(index<4){
                   $(".famous_top1").append(`
								<div class="pr famous_art" data-id="${famous_art_id[index]}">
												<div class="peo">
													<div class="peo_box">
														<div class="peo_pic"><img style="width:130px;height:130px;border-radius:50%" src="${famous_art_img[index]}"  alt=""></div>
														<div class="peo_name">${famous_art_title[index]}</div>
														<div class="peo_line"></div>
													</div>
												</div>
											 <!-- 遮罩层 -->
                                              <a href="javascript:;">
                                                  <div class="cover">
                                                      <div class="cover_box">
                                                          <div class="cover_title">${famous_art_title[index]}</div>
                                                          <div class="cover_line"></div>
                                                          <div class="cover_txt" style="text-align: left;
    text-indent: 2em;">${famous_brief[index]}</div>
                                                      </div>
                                                  </div>
                                              </a>

											</div>

						  `)
                  }else if(index>=4&&index<8){
                  $(".famous_top2").append(`
								<div class="pr famous_art" data-id="${famous_art_id[index]}">
												<div class="peo">
													<div class="peo_box">
														<div class="peo_pic"><img style="width:130px;height:130px;border-radius:50%" src="${famous_art_img[index]}" alt=""></div>
														<div class="peo_name">${famous_art_title[index]}</div>
														<div class="peo_line"></div>
													</div>
												</div>
											 <!-- 遮罩层 -->
                                              <a href="javascript:;">
                                                  <div class="cover">
                                                      <div class="cover_box">
                                                          <div class="cover_title">${famous_art_title[index]}</div>
                                                          <div class="cover_line"></div>
                                                          <div class="cover_txt" style="text-align: left;
    text-indent: 2em;">${famous_brief[index]}</div>
                                                      </div>
                                                  </div>
                                              </a>

											</div>

						  `)
                  
                  
                  
                  }else if(index>=8&&index<12){
                  $(".famous_top3").append(`
								<div class="pr famous_art" data-id="${famous_art_id[index]}">
												<div class="peo">
													<div class="peo_box">
														<div class="peo_pic"><img style="width:130px;height:130px;border-radius:50%" src="${famous_art_img[index]}" alt=""></div>
														<div class="peo_name">${famous_art_title[index]}</div>
														<div class="peo_line"></div>
													</div>
												</div>
											 <!-- 遮罩层 -->
                                              <a href="javascript:;">
                                                  <div class="cover">
                                                      <div class="cover_box">
                                                          <div class="cover_title">${famous_art_title[index]}</div>
                                                          <div class="cover_line"></div>
                                                          <div class="cover_txt" style="text-align: left;
    text-indent: 2em;">${famous_brief[index]}</div>
                                                      </div>
                                                  </div>
                                              </a>

											</div>

						  `)
                  
                  
                  
                  }else{
                  $(".famous_top4").append(`
								<div class="pr famous_art" data-id="${famous_art_id[index]}">
												<div class="peo">
													<div class="peo_box">
														<div class="peo_pic"><img style="width:130px;height:130px;border-radius:50%" src="${famous_art_img[index]}" alt=""></div>
														<div class="peo_name">${famous_art_title[index]}</div>
														<div class="peo_line"></div>
													</div>
												</div>
											 <!-- 遮罩层 -->
                                              <a href="javascript:;">
                                                  <div class="cover">
                                                      <div class="cover_box">
                                                          <div class="cover_title">${famous_art_title[index]}</div>
                                                          <div class="cover_line"></div>
                                                          <div class="cover_txt" style="text-align: left;
    text-indent: 2em;">${famous_brief[index]}</div>
                                                      </div>
                                                  </div>
                                              </a>

											</div>

						  `)
                  
                  
                  
                  }
                   
                })
            }, // 成功的回调
            error: function(err) {}, // 失败回调
        })

        //视频
        var video_src = [];
        var video_title = [];
        var video_id = [];
        var video_time=[];
		var video_link='';
		var video_link1='';
        var video_total_num='';
		var video_index_pic=[];
        $.ajax({
                url: "http://mapi.plus.vinj.cn/api/open/middle/column_content_list",
                type: 'get', // 请求的类型（get post）
                data: {
                    "per_num": 12,
                    "column_id": 23,
                  	
                  	"page":1,
                  	"type":"video",
                  	"appkey":"02523699ba0579628a1dc8d16defa699",
                  	"appid":"m2oiacrr7knlqi869e",
                },
                dataType: "json", // 期望后端给你返回的数据类型
                timeout: 5000, // 如果5秒之后，数据还没有回来，则请求超时
                async: true, // 是否异步，默认为true（是异步）
                success: function(data) {
                 
                 	$.each(data,function(index,item){
						
                      	
                     	video_link=item.video.host+item.video.filepath+item.video.filename;
                      	video_link1=video_link.replace(/.m3u8/, ".mp4");
                      	video_src.push(video_link1);
                      	video_time.push(item.duration_format);
                      	video_title.push(item.title);
                      	video_id.push(item.origin_id);
                      	video_index_pic.push(item.index_pic);
                      	if(index <=2 ){
                            $(".li_1 .video_top").append(`
                           
                                        <div class="item pr tz_box" data-id="${video_id[index]}">
                                            <!-- 视频、播放图标-->
                                            <a href="javascript:;">
                                                <div class="video_box">
                                                    <video src="${video_src[index]}" id="video_control" muted poster="${video_index_pic[index]}" oncontextmenu="return false;"></video>
                                                    <div class="play_icon"></div>
                                                </div>
                                            </a>
                                            <!-- 作者、时长 -->
                                            <a href="javascript:;"  class="scene_block">
                                                <span class="video_title">${video_title[index]}</span>
                                                <span class="video_time">${video_time[index]}</span>
                                            </a>
                                        </div>
                                       
                                       
                                
                            `)
                          }
                        else if(index>2 && index<=5){
                            $(".li_2 .video_top").append(`
                           
                                        <div class="item pr tz_box" data-id="${video_id[index]}">
                                            <!-- 视频、播放图标-->
                                            <a href="javascript:;" >
                                                <div class="video_box">
                                                    <video src="${video_src[index]}" id="video_control" muted poster="${video_index_pic[index]}" oncontextmenu="return false;"></video>
                                                    <div class="play_icon"></div>
                                                </div>
                                            </a>
                                            <!-- 作者、时长 -->
                                            <a href="javascript:;"  class="scene_block">
                                                <span class="video_title">${video_title[index]}</span>
                                                <span class="video_time">${video_time[index]}</span>
                                            </a>
                                        </div>
                                        
                                        

                            `)
                        }else if(index>5 && index<=8){
                            $(".li_3 .video_top").append(`
                            
                                        <div class="item pr tz_box"  data-id="${video_id[index]}">
                                            <!-- 视频、播放图标-->
                                            <a href="javascript:;">
                                                <div class="video_box">
                                                    <video src="${video_src[index]}" id="video_control" muted oncontextmenu="return false;" poster="${video_index_pic[index]}"></video>
                                                    <div class="play_icon"></div>
                                                </div>
                                            </a>
                                            <!-- 作者、时长 -->
                                            <a href="javascript:;"  class="scene_block">
                                                <span class="video_title">${video_title[index]}</span>
                                                <span class="video_time">${video_time[index]}</span>
                                            </a>
                                        </div>
                                      
                                        
                              
                            `)

                        }
                        else {
                            $(".li_4 .video_top").append(`
                           
                                        <div class="item pr tz_box"  data-id="${video_id[index]}">
                                            <!-- 视频、播放图标-->
                                            <a href="javascript:;">
                                                <div class="video_box">
                                                    <video src="${video_src[index]}" id="video_control" muted poster="${video_index_pic[index]}" oncontextmenu="return false;"></video>
                                                    <div class="play_icon"></div>
                                                </div>
                                            </a>
                                            <!-- 作者、时长 -->
                                            <a href="javascript:;" class="scene_block">
                                                <span class="video_title">${video_title[index]}</span>
                                                <span class="video_time">${video_time[index]}</span>
                                            </a>
                                        </div>
                                        
                                        
                                 
                            `)

                        }
					})
                   
					$(".item").mouseover(function() {
                        $(this).find("#video_control").trigger('play');
                        $(this).find(".play_icon").hide();


                    }).mouseout(function() {
                        $(this).find("#video_control").trigger('pause');
                        $(this).find(".play_icon").show();

                    })
                }, // 成功的回调
                error: function(err) {}, // 失败回调
            })
       
           //今日图片跳转
        $(".today_ul").delegate(".today_box", "click", function(event) {
                var cid = $(this).attr("data-id");
                window.open('http://www.vinj.cn/folder77?id=' + cid);
            })
            //新闻图片跳转
        $(".news_ul").delegate(".news_box", "click", function(event) {
                var cid = $(this).attr("data-id");
                window.open('http://www.vinj.cn/folder77?id=' + cid);
            })
            //航拍频道跳转
        $(".aerial_ul").delegate(".aerial_box", "click", function(event) {
                var cid = $(this).attr("data-id");
                window.open('http://www.vinj.cn/folder82?id=' + cid);
            })
            //活动摄影跳转
			$(".event_ul").delegate(".active_box", "click", function(event) {
				var cid = $(this).attr("data-id");
				window.open('http://www.vinj.cn/folder81?id=' + cid);
		})
            //专题图片跳转
        $(".special_ul").delegate(".special_box", "click", function(event) {
                var cid = $(this).attr("data-id");
                window.open('http://www.vinj.cn/folder82?id=' + cid);
            })
            //名记名家
        $(".famous_top").delegate(".famous_art", "click", function(event) {
            var cid = $(this).attr("data-id");
            window.open('http://www.vinj.cn/folder77?id=' + cid);
        })
		//视频
		$(".video_top").delegate(".tz_box", "click", function(event) {
				var cid = $(this).attr("data-id");
				window.open('http://www.vinj.cn/folder102?id=' + cid);
			})
		$(".nj_week").click(function(){
				
				window.open('http://www.vinj.cn/folder81?id=126');
			})
		$(".adver").click(function(){
        	window.open('http://www.vinj.cn/folder81?id=127');
        })
		

		// 以图搜图------------------------------------------------------------------------
		$(".icon_sweep").click(function(){
        	$(".hot_board").show();
        	
        })
		$(".event_top").on("mouseover",".item",function(){
          $(this).find(".hover_showtxt").css("opacity","1"); 
          
        })
		$(".event_top").on("mouseout",".item",function(){
          $(this).find(".hover_showtxt").css("opacity","0"); 
          
        })
		// 先进行一次检查
          lazyRender();
          //为了不在滚轮滚动过程中就一直判定，设置个setTimeout,等停止滚动后再去判定是否出现在视野中。
          var clock; //这里的clock为timeID， 返回一个 ID（数字），可以将这个ID传递给 clearTimeout() 来取消执行。
          $(window).on('scroll', function() {
              //        lazyRender();
              if (clock) { //只要在300毫秒内触发滚动事件，都会被clearTimeout掉，setTimeout不会执行。
                  //如果有300毫秒外的操作，会得到一个新的timeID即clock，会执行一次setTimeout,然后保存这次setTimeout的ID，
                  //对于300毫秒内的scroll事件，不会生成新的timeID值，所以会一直被clearTimeout掉，不会执行setTimeout.

                  clearTimeout(clock);
                  // console.log(clock, 1111);
              }

              clock = setTimeout(function() {
                 
                  lazyRender();
              }, 300)
          });
          //懒加载
          function lazyRender() {
              $('.today_pic img').each(function() {
                  if (checkShow($(this)) && !isLoaded($(this))) {
                      loadImg($(this));
                  }
              })
			$('.news_pic .slideBox img').each(function() {
                  if (checkShow($(this)) && !isLoaded($(this))) {
                      loadImg($(this));
                  }
              })
            $('.special_pic .special_ul img').each(function() {
                  if (checkShow($(this)) && !isLoaded($(this))) {
                      loadImg($(this));
                  }
              })
            $('.aerial_channel .aerial_ul img').each(function() {
                  if (checkShow($(this)) && !isLoaded($(this))) {
                      loadImg($(this));
                  }
              })
             $('.event_photo .event_ul img').each(function() {
                  if (checkShow($(this)) && !isLoaded($(this))) {
                      loadImg($(this));
                  }
              })
            
          }

          function checkShow($img) { // 传入一个img的jq对象 
              var scrollTop = $(window).scrollTop(); //即页面向上滚动的距离 
              var windowHeight = $(window).height(); // 浏览器自身的高度
              var offsetTop = $img.offset().top; //目标标签img相对于document顶部的位置 
              if (offsetTop < (scrollTop + windowHeight) && offsetTop > scrollTop) { //在2个临界状态之间的就为出现在视野中的 
                  return true;
              }
              return false;
          }

          function isLoaded($img) {
              return $img.attr('data-src') === $img.attr('src'); //如果data-src和src相等那么就是已经加载过了 
          }

          function loadImg($img) {
              $img.attr('src', $img.attr('data-src')); // 加载就是把自定义属性中存放的真实的src地址赋给src属性 
          }



    </script>
		 <script src="{{$TEMPLATE}}js/browser.min.js"></script>
</body>

</html>