//面包屑隐藏
$(".ul_house li:last span").hide();
//	评论状态

window.onload = function () {
    $('textarea').bind('input propertychange', function () {
        if ($("#w_input").val() != "") {
            $("#img_comment").removeClass("btn_disable");
            $("#img_comment").addClass("btn_a");
        } else {
            $("#img_comment").addClass("btn_disable");
            $("#img_comment").removeClass("btn_a");
        };
    });
}


//图片左右箭头
document.onkeydown = function (event) {
    if (event.keyCode == 39) {

        $(".right_btn").click();

    } else if (event.keyCode == 37) {

        $(".left_btn").click();
    }
}
//图片处理
function scalingImg(obj) {
    var $this = $(obj);

    var imgWidth = $this.width();
    var imgHeight = $this.height();

    var parent = $this.parent();
    var containerWidth = parent.width();
    var containerHeight = parent.height();

    var containerRatio = containerWidth / containerHeight;
    var imgRatio = imgWidth / imgHeight;

    if (imgRatio > containerRatio) {
        imgWidth = containerWidth;
        imgHeight = containerWidth / imgRatio;
    } else if (imgRatio < containerRatio) {
        imgHeight = containerHeight;
        imgWidth = containerHeight * imgRatio;
    } else {
        imgWidth = containerWidth;
        imgHeight = containerHeight;
    }

    //$this.attr('width', imgWidth);
    //$this.attr('height', imgHeight);
}


<
/script> <
script type = "text/babel" >
    //稿件id
    var cid = $('.value').val();
//详情页
var href = 'http://middle-api.plus.vinj.cn/api/gallery/detail/';
var href_xq = 'http://middle-api.plus.vinj.cn/api/gallery/photos/';
var urls = href + cid + '?member_id=' + getCookie("memberId");
var urls_xq = href_xq + cid;
var gallery_imgarr = [];
var gallery_imgarr2 = [];
var gallery_titlearr = [];
var gallery_nameArr = [];
var author = '';
var title = '';
var img_id = [];
var img_width = [];
var img_height = [];
$.ajax({
    url: urls_xq, // 请求的地址

    type: 'get', // 请求的类型（get post）
    data: {
        "per_num": 99,
    },
    dataType: "json", // 期望后端给你返回的数据类型
    timeout: 5000, // 如果5秒之后，数据还没有回来，则请求超时
    async: true, // 是否异步，默认为true（是异步）
    success: function (data) {

        //console.log("图集详情",data);
        $.each(data.data.data, function (index, item) {
            var photo_src = item.photo_url;
            photo_src = photo_src.replace('vinj.cn/', 'vinj.cn/812x/');
            gallery_imgarr.push(photo_src);
            img_id.push(item.id);
            img_width.push(item.width);
            img_height.push(item.height);
            gallery_nameArr.push(item.photo_name);
            gallery_titlearr.push(item.brief);
            var gallary_pic = item.photo_url.split('/');
            var gallary_arr = gallary_pic.splice(3, 0, '138x101');
            var gallary_arr2 = gallary_pic.join('/');
            gallery_imgarr2.push(gallary_arr2);
            if (item.updated_at.indexOf("2019") != 0) {
                $(".up_time").html("2019-04-15");
            } else {
                $(".up_time").html(item.updated_at.substring(0, 10));
            }

            $(".ul1").append(`<li class="li1">
                            <div style="height:594px;width:812px;line-height:592px;border: 1px solid #eee;text-align: center;">
                                <img class="yuan_img" style="vertical-align: middle;max-width: 100%;max-height: 100%" onload="scalingImg(this)"  src="${gallery_imgarr[index]}"  alt="" oncontextmenu="return false;" ondragstart="return false;">
                            </div>
                           <div class="main_intro" style="height:144px;">
                                <div class="intro_title">${gallery_titlearr[index]|| gallery_nameArr[index]}</div>
                                <div class="intro_txt"></div>
                                <div class="intro_canshu">
                                    <div>
                                      
                                    </div>
                                     <div>
                                        <span style="display:none" class="scan">点赞数：0</span>
                                        <span style="display:none" class="fav">下载数：0</span>
                                        <span class="size" style="margin-right: 50px;">尺寸:<span style="margin-left:10px">${img_width[index]}x${img_height[index]}px </span> </span>
                                        <span class="tupian">图片ID:<span style="margin-left:10px">00${img_id[index]} </span> </span>	
                                    </div>
                                </div>
                            </div>
                        </li>
                     
                        `);
            $(".ul2").append(`<li class="">
                                <img   src="${gallery_imgarr2[index]}"  alt="" oncontextmenu="return false;" ondragstart="return false;" data-img-id="${img_id[index]}" id="simg_${img_id[index]}" data-index ="${index}" data-img-url="${gallery_imgarr[index]}">
                                <div class="bun_bg"></div>
                            </li>`)

            if (item.height == 0) {
                $(".size").hide();
            }

        })



        /* 图片轮播图（带缩略图的轮播效果） */
        $(".banner_breviary").thumbnailImg({
            large_elem: ".large_box",
            small_elem: ".small_list",
            left_btn: ".left_btn",
            right_btn: ".right_btn",

        });
        $(".banner_breviary").changeImg({
            large_elem: ".large_box",
            small_elem: ".small_list",
            left_btn: ".left_btn",
            right_btn: ".right_btn",

        });


    }, // 成功的回调

    error: function (err) {

    }, // 失败回调
})
/* 图片详细信息 */
var gallery_name = '';
var gallear_brief = '';
var keywords = '';
var keywords_arr = [];
var gallery_id = '';
var cover_url = '';
var all_author = [];
var clicks = '';
var gallery_sign = ''; //图集标识
var bundle_id = '';
var content_time = '';
var content_id = '';
var content_title = '';
var content_fromid = '';
var content_column_id = '';
$.ajax({
    url: urls, // 请求的地址

    type: 'get', // 请求的类型（get post）
    data: "",
    dataType: "json", // 期望后端给你返回的数据类型
    timeout: 5000, // 如果5秒之后，数据还没有回来，则请求超时
    async: true, // 是否异步，默认为true（是异步）
    success: function (data) {
        if (data.data.can_score == 1) {
            $('.pinfeng').css('display', 'block');
        }
        if (data.data.score && data.data.score != null) {
            $('.pf_time').html(data.data.score.created_at)
            $('.scoreNum').html(data.data.score.score)
            $('.cover_qr').css('display', 'none');
            $('.pinfeng').css('display', 'none');
            $('.pfInfo').css('display', 'block')
        }
        //console.log("图片详细信息",data);
        var praise_num = data.data.praise_num;
        $(".click_num").text(praise_num);
        clicks = data.data.click_num + 1;
        gallery_sign = data.data.sign
        $(".liu_num").text(clicks);
        title = data.data.title;
        $(".r_mid_title").text(title);
        document.title = title;
        gallear_brief = data.data.brief;
        $(".r_mid_txt").text(gallear_brief);
        gallery_id = data.data.id;
        var gallert_id_num = gallery_id.toString();
        if (gallert_id_num.length == 1) {
            $(".id_num").html("000000" + gallert_id_num);
        } else if (gallert_id_num.length == 2) {
            $(".id_num").html("00000" + gallert_id_num);
        } else if (gallert_id_num.length == 3) {
            $(".id_num").html("0000" + gallert_id_num);
        } else if (gallert_id_num.length == 4) {
            $(".id_num").html("000" + gallert_id_num);
        } else if (gallert_id_num.length == 5) {
            $(".id_num").html("00" + gallert_id_num);
        } else if (gallert_id_num.length == 6) {
            $(".id_num").html("0" + gallert_id_num);
        } else {
            $(".id_num").html(gallert_id_num);
        }

        if (data.data.photo_count) {
            $('.photo_count').html(data.data.photo_count).parents('div').show();
        }

        if (!data.data.keywords == "") {
            keywords = data.data.keywords;
            keywords_arr = keywords.split(",");

            $.each(keywords_arr, function (index, item) {
                $(".tag_clss").append(`
                    <span style="margin-bottom:10px;"><a href="http://www.vinj.cn/folder78?search_text=${item}" target="_blank">${item}</a></span>
               
            `)
            })
        } else {
            $('.r_bot').css('display', 'none');
        }
        if (data.data.author_info) {
            $.each(data.data.author_info, function (i, n) {
                $(".r_person").append(`
                     <div class="float_box${i} cl"></div>
                    `)

                var x = ".float_box" + i;
                if (n.avatar && n.avatar != '') {
                    n.userImg = n.avatar
                } else {
                    n.userImg = "{{$TEMPLATE}}images/person_bg/avatar.png";
                }
                var tmp1 = ""
                var tmp2 = ""
                if (n.gallery_total) {
                    tmp1 = `<div class="txt">${n.gallery_total}个作品,${n.photo_total}张图片</div>`
                    tmp2 = `<div class="more rf link_common" data-user-id="${n.author_id}">
                              <a href="javascript:void(0)">查看更多</a>
                          </div>`
                } else {
                    tmp1 = ""
                    tmp2 = ""
                }
                if (n.author_id) {
                    $(x).append(`
                        <div class="proli lf link_common" data-user-id="${n.author_id}">
                        <div class="head">
                            <a href="javascript:void(0)"><img src="${n.userImg}" alt=""></a>
                        </div>
                        <div class="com_det">
                            <div>
                                <a href="javascript:void(0)" class="name">${n.author}</a>
                            </div>
                            ${tmp1}
                        </div>
                    </div>
                    ${tmp2}
                   `)
                } else {
                    $(x).append(`
                    <div class="proli lf link_common" data-user-id="${n.author_id}">
                    <div class="head">
                        <a href="javascript:void(0)" style="cursor:default"><img src="${n.userImg}" alt=""></a>
                    </div>
                    <div class="com_det">
                        <div>
                            <a href="javascript:void(0)" class="name" style="cursor:default">${n.author}</a>
                        </div>
                        ${tmp1}
                    </div>
                </div>
                ${tmp2}
                `)
                }
            })

        }
        //  console.log(data.data);
        cover_url = data.data.index_pic;
        bundle_id = data.data.type;
        content_time = data.data.publish_time;
        content_id = data.data.content_id;
        content_title = data.data.title;
        content_fromid = data.data.id;
        content_column_id = data.data.column_id;
        hoge_Websocket('click');
    }, // 成功的回调

    error: function (err) {

    }, // 失败回调
})
// 客户端里是获取的客户端的device_token，但是PC和H5无法获取到浏览器的device_token，所以需要根据浏览器的信息生成一个假的字符串作为device_token
function bin2hex(str) {
    var result = "";
    for (var i = 0; i < str.length; i++) {
        result += int16_to_hex(str.charCodeAt(i));
    }
    return result;
}

function int16_to_hex(i) {
    var result = i.toString(16);
    var j = 0;
    while (j + result.length < 6) {
        result = "0" + result;
        j++;
    }
    return result;
}

function cans() {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var txt = 'http://www.vjnj.cn/';
    ctx.textBaseline = "top";
    ctx.font = "14px 'Arial'";
    ctx.textBaseline = "vjnj";
    ctx.fillStyle = "#f60";
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = "#069";
    ctx.fillText(txt, 2, 15);
    ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
    ctx.fillText(txt, 4, 17);
    var b64 = canvas.toDataURL().replace("data:image/png;base64,", "");
    var bin = atob(b64);
    var crc = bin2hex(bin.slice(-16, -12));
    crc = crc.toUpperCase();
    return crc;
};

function hoge_Websocket(op_type) {
    var device_token = cans();
    console.log(content_id);
    if (content_id) {
        var serv = 'wss://ldas.cloud.hoge.cn/produce/pcontent/web/375/' + device_token + '?secret=d624e9f635a3dc1a2bcb99d47d88c281';
        // 123是客户授权ID，后面的secret不需要更改
        // 分享页的终端类型是h5，PC的终端类型是web
        var hg_Websocket = new WebSocket(serv);
        hg_Websocket.onopen = function (evt) {
            var text = '{';
            text = text + '"customer_id" : "375",';
            text = text + '"client_type" : "web",';
            text = text + '"device_token" : "' + device_token + '",';
            text = text + '"data_bundle_id" : "' + bundle_id + '",';
            text = text + '"site_id" : "1",';
            text = text + '"op_type" : "' + op_type + '",';
            text = text + '"create_time" : "' + content_time + '",';
            text = text + '"data_content_id" : "' + content_id + '",';
            text = text + '"data_title" : "' + content_title + '",';
            text = text + '"data_content_fromid" : "' + content_fromid + '",';
            text = text + '"data_column_id" : "' + content_column_id + '",';
            text = text + '"content_type" : "' + 'content' + '"';
            text = text + '}';
            // 可以打印出来传给接口的参数，检查是否有错误
            hg_Websocket.send(text);
        };
        hg_Websocket.onclose = function (evt) {};
        hg_Websocket.onmessage = function (evt) {
            var data = $.parseJSON(evt.data);
            var t;
            if (t = parseInt(data['k'])) {
                setTimeout(function () {
                    hg_Websocket.send(text);
                }, t * 1000);
            };
        };
        hg_Websocket.onerror = function (evt, e) {};

    } else {
        return true;
    }
};

$(document).on("click", ".link_common", function () {
    var link_id = $(this).attr("data-user-id");
    if (link_id == 0) return
    window.open("http://sso.vinj.cn/otherhome?author_id=" + link_id);
})

$(".dot_zan i").click(function () {
    $(this).toggleClass("click_red");
    $('.newsTips .message').html("操作成功").removeClass('error').addClass('success');
    $('.newsTips').slideDown()
    setTimeout(function () {
        $('.newsTips').slideUp(2000)
    }, 1000);
    hoge_Websocket('like');
})
//评论列表

//创建评论
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    return (arr = document.cookie.match(reg)) ? unescape(arr[2]) : null;
};
var islogin = getCookie('accessToken');



$(".btn").click(function () {
    if (!islogin) {

        //alert("您还没有登录，不能评论");
        $('.newsTips .message').html("您还没有登录，不能评论").removeClass('success').addClass('error');
        $('.newsTips').slideDown()
        setTimeout(function () {
            $('.newsTips').slideUp(2000)
        }, 1000);
    } else {
        //创建评论
        $.ajax({
            url: "http://mapi.plus.vinj.cn/api/open/middle/comment_create?appid=m2oiacrr7knlqi869e&appkey=02523699ba0579628a1dc8d16defa699", // 请求的地址

            type: 'post', // 请求的类型（get post）
            data: {
                "app_uniqueid": "atlas",
                "content_id": cid,
                "content": $('.p_input textarea').val(),
                "access_token": islogin,
            },
            dataType: "json", // 期望后端给你返回的数据类型
            timeout: 5000, // 如果5秒之后，数据还没有回来，则请求超时
            async: true, // 是否异步，默认为true（是异步）
            success: function (data) {
                $('.p_input textarea').val("");
                //alert(data[0].copywriting);
                $('.newsTips .message').html("评论成功，审核中").removeClass('error').addClass('success');
                $('.newsTips').slideDown()
                setTimeout(function () {
                    $('.newsTips').slideUp(2000)
                }, 1000);
                $("#img_comment").addClass("btn_disable");


            }, // 成功的回调

            error: function (err) {

            }, // 失败回调
        });
    }
})
//评论列表

var common_time = [];
var common_title = [];
var common_img = [];
var num = '';
var common_author = [];
var common_author_img = [];
$.ajax({
    url: "http://mapi.plus.vinj.cn/api/open/middle/comment_list?appid=m2oiacrr7knlqi869e&appkey=02523699ba0579628a1dc8d16defa699", // 请求的地址

    type: 'get', // 请求的类型（get post）
    data: {
        "content_id": cid,
        "app_uniqueid": "atlas",
    },
    dataType: "json", // 期望后端给你返回的数据类型
    timeout: 5000, // 如果5秒之后，数据还没有回来，则请求超时
    async: true, // 是否异步，默认为true（是异步）
    success: function (data) {
        console.log('jayding', data)
        num = data.data.length;
        if (num == 0) {
            $('.more_scan').css('display', 'none');
        }
        $(".num").text(num);
        $.each(data.data, function (index, item) {
            common_time.push(item.created_at.substring(0, 16));
            common_title.push(item.content);
            common_author.push(item.username);
            common_author_img.push(item.member_info.avatar.host + item.member_info.avatar.filename);



            if (item.member_info.avatar == "") {

                $(".cntwrap").append(`
                    <div class="itm " style="margin-bottom:20px;">
                        <div class="head">
                           <img src="themes/default/images/grayhead.jpg" alt="">
                        </div>
                        <div class="com_det">
                            <div> <a href="" class="name">${common_author[index]}</a> <span class="time">${common_time[index]}</span></div>
                            <div class="txt">${common_title[index]}</div>
                        </div>
                    </div>
                    

                `)

            } else {
                $(".cntwrap").append(`
                    <div class="itm " style="margin-bottom:20px;">
                        <div class="head">
                           <img src="${common_author_img[index]}"  alt="">
                        </div>
                        <div class="com_det">
                            <div> <a href="" class="name">${common_author[index]}</a> <span class="time">${common_time[index]}</span></div>
                            <div class="txt">${common_title[index]}</div>
                        </div>
                    </div>
                    

                `)


            }
        })


    }, // 成功的回调

    error: function (err) {

    }, // 失败回调
});

//下载图片  获取可以下载的分辨率
var islogin = getCookie('accessToken');
if (islogin) {
    $.ajax({
        url: "http://middle-api.plus.vinj.cn/api/gallery/download/purview", // 请求的地址
        type: 'get', // 请求的类型（get post）
        data: {
            "access_token": islogin
        },
        dataType: "json", // 期望后端给你返回的数据类型
        timeout: 5000, // 如果5秒之后，数据还没有回来，则请求超时
        async: true, // 是否异步，默认为true（是异步）
        success: function (data) {
            $.each(data.data.reverse(), function (index, item) {
                $(".downGroup").append(`
            <div class="upload photoSize" data_type="${item.id}">${item.name}</div>
            `)
            })
        }, // 成功的回调
        error: function (err) {

        }, // 失败回调
    })
    $(".upload").click(function () {
        $(".downGroup").slideToggle()
        //$('.downGroup').slideDown()
    })
} else {
    $(".upload").click(function () {
        //alert("请先登录!");
        $('.newsTips .message').html("请先登录!").removeClass('success').addClass('error');
        $('.newsTips').slideDown()
        setTimeout(function () {
            $('.newsTips').slideUp(2000)
        }, 1000);
        $(".cover1").show();
    })
}
//根据权限 下载不同分辨率图片
$(".downGroup").on("click", '.photoSize', function () {
    var data_img_id = $(".ul2 li.on img").attr("data-img-id");
    var data_type = $(this).attr("data_type");
    location.href = 'http://middle-api.plus.vinj.cn/api/gallery/download?access_token=' + islogin + '&gallery_id=' + cid + '&id=' + data_img_id + '&photo_type=' + data_type;
});
$(document).on('click', function (e) {
    $('.downGroup').slideUp();
});
$('.upload').on('click', function (e) {
    e.stopPropagation();
})
//收藏
$(".cang i").click(function () {
    if (!islogin) {
        $('.newsTips .message').html("您还没有登录，不能收藏").removeClass('success').addClass('error');
        $('.newsTips').slideDown()
        setTimeout(function () {
            $('.newsTips').slideUp(2000)
        }, 1000);
        return
    }
    if (off) {
        $(".cang i").addClass('click_red');
        $.ajax({
            url: "http://middle-api.plus.vinj.cn/api/member/collect/add", // 请求的地址

            type: 'post', // 请求的类型（get post）
            data: {
                "access_token": islogin,
                "origin_id": cid,
                "title": title,
                "index_pic": cover_url,
                "type": 1,
            },
            dataType: "json", // 期望后端给你返回的数据类型
            timeout: 5000, // 如果5秒之后，数据还没有回来，则请求超时
            async: true, // 是否异步，默认为true（是异步）
            success: function (data) {
                $('.newsTips .message').html("操作成功").removeClass('error').addClass('success');
                $('.newsTips').slideDown()
                setTimeout(function () {
                    $('.newsTips').slideUp(2000)
                }, 1000);

            }, // 成功的回调

            error: function (err) {

            } // 失败回调
        })
        off = false;
    } else {
        $(".cang i").removeClass('click_red')
        $.ajax({
            url: "http://middle-api.plus.vinj.cn/api/member/collect/del",
            data: {
                "access_token": islogin,
                "origin_id": cid,
                "type": 1,
            },
            dataType: "json",
            timeout: 5000,
            async: true,
            type: "post",
            success: function (data) {
                $('.newsTips .message').html("操作成功").removeClass('error').addClass('success');
                $('.newsTips').slideDown()
                setTimeout(function () {
                    $('.newsTips').slideUp(2000)
                }, 1000);

            },
            error: function (err) {

            }
        });

        off = true;
    }
})

//保存状态
function save() {
    $.ajax({
        url: "http://middle-api.plus.vinj.cn/api/member/collect/is_collect",
        data: {
            "access_token": islogin,
            "origin_id": cid,
            "type": 1,
        },
        dataType: "json",
        timeout: 5000,
        async: true,
        type: "get",
        success: function (data) {
            if (data.data.is_collect == 1) {
                $(".cang i").addClass('click_red');
            } else {}
        },
        error: function (err) {

        }
    });
};
save();

//评分按钮点击
var pfValue;
$('.pf_btn').click(function () {
    pfValue = $('#pf_value').val()
    if (!pfValue) {
        //alert('请输入评分数')
        $('.newsTips .message').html("请输入评分数").removeClass('success').addClass('error');
        $('.newsTips').slideDown()
        setTimeout(function () {
            $('.newsTips').slideUp(2000)
        }, 1000);
        return
    }
    if (isNaN(pfValue)) {
        //alert('请输入数字');
        $('.newsTips .message').html("请输入数字").removeClass('success').addClass('error');
        $('.newsTips').slideDown()
        setTimeout(function () {
            $('.newsTips').slideUp(2000)
        }, 1000);
        $('#pf_value').val('');
        return
    }
    if (pfValue > 10) {
        //alert('评分数不能大于10');
        $('.newsTips .message').html("评分数不能大于10").removeClass('success').addClass('error');
        $('.newsTips').slideDown()
        setTimeout(function () {
            $('.newsTips').slideUp(2000)
        }, 1000);
        $('#pf_value').val('');
        return
    }
    $('.cover_qr').css('display', 'block')
    console.log(pfValue)
})
//取消评分
$('.qx_btn').click(function () {
    $('.cover_qr').css('display', 'none');
    $('#pf_value').val('')
})
//确认提交评分 /api/score/create
$('.qr_btn').click(function () {
    $.ajax({
        url: 'http://middle-api.plus.vinj.cn/api/score/create',
        type: 'post',
        data: {
            "score": pfValue,
            "type": "atlas",
            "origin_id": gallery_id,
            "sign": gallery_sign,
            "access_token": islogin
        },
        dataType: "json", // 期望后端给你返回的数据类型
        timeout: 5000, // 如果5秒之后，数据还没有回来，则请求超时
        async: true, // 是否异步，默认为true（是异步）
        success: function (res) {
            //alert('评分成功');
            $('.newsTips .message').html("评分成功").removeClass('error').addClass('success');
            $('.newsTips').slideDown()
            setTimeout(function () {
                $('.newsTips').slideUp(2000)
            }, 1000);
            $('#pf_value').val('');
            $('.pf_time').html(res.data.created_at)
            $('.scoreNum').html(res.data.score)
            $('.cover_qr').css('display', 'none');
            $('.pinfeng').css('display', 'none');
            $('.pfInfo').css('display', 'block')
        }
    })
})