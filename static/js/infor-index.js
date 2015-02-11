$(document).ready(function (){
    
    var __query = window.location.search.split("=")[1],
        __name = window.location.search.split("=")[2];
    __query ? query() : "";

    function query(){
        var html = '\
            <li class="remind-li" data-url="0" data-name=""><span class="paddingRight glyphicon glyphicon-star"></span>'+__name+'关注的人</li>\
            <li class="remind-li" data-url="1" data-name=""><span class="paddingRight glyphicon glyphicon-star-empty"></span>关注'+__name+'的人</li>\
            <li class="remind-li" data-url="4" data-name=""><span class="paddingRight glyphicon glyphicon-inbox"></span>'+__name+'的仓库</li>';
        $(".remind-ul").html(html);
        $("<span class='addFocus addFocusYes' data-id='"+__query.split("&")[0]+"'>＋加关注</span>").insertBefore("h2");

    }

    var __location = window.location.hash.split("=")[1];
    changeContent(__location);

    $(".remind-li").filter(function (){
        var x = $(this).attr("data-url");
        return x == __location;
    }).addClass("active-remind-li");

    $(".list").filter(function (){
        var x = $(this).attr("data-url");
        return x == __location;
    }).addClass("listClick");

    $("#content").click(function (){
        $(".getResult").css("display","none");
    });

    $(".remind-li").click(function(){
        var __id = $(this).attr("data-url");
        window.location.hash = "#id="+__id;
        $(".remind-li").removeClass("active-remind-li");
        $(this).addClass("active-remind-li");
        $("h2").html($(this).text());
        changeContent(__id);
    });

    function changeContent(__id){
        $(".detail-uls").html('<img class="loading" src="/static/img/loading.gif">');
        switch(__id){
            case '0' : $(".settings").remove();showTakeMe();break;
            case '1' : $(".settings").remove();showPerson();break;
            case '2' : $(".settings").remove();break;
            case '3' : $(".settings").remove();break;
            case '4' : $(".settings").remove();getLib();break;
            case '5' : $(".settings").remove();getCool();break;
            case '6' : $(".detail-uls").html('');setting(); break;
        }
    }

    function getCool(){
        $.ajax({
            type : "POST",
            data : {},
            url  : "/check/get_collect_map/",
            // url  : "http://121.199.47.141/check/get_collect_map/",
            success : function (data){
                //console.log(data);
                var html = '';
                var infor = data.info;
                for(var i = 0; i < infor.length; i++){
                    html += '<li class="detail-li-lib"><img src="'+(infor[i].image ? infor[i].image : "/static/img/versib.png")+'" alt="仓库" width="178" height="100" /><p>创建时间:'+infor[i].map_time+'</p><p>'+infor[i].map_name+'</p><p><span class="glyphicon glyphicon-trash delCollect" data-id="'+infor[i].map_id+'">取消</span><span class="glyphicon glyphicon-edit lookingFor" data-id="'+infor[i].map_id+'">查看</span></p></li>'
                }
                $(".detail-uls").html(html);
            },
            error : function (data){
                console.log(data);
            },
            dataType : "json"
        });
    }

    function showTakeMe(){
        $.ajax({
            type : "POST",
            data : {user_id : (__query ? __query.split("&")[0] : "login_user") },
            url : "/check/get_i_pay_attention/",
            // url : "http://121.199.47.141/check/get_i_pay_attention/",
            success : function (data){
                if(data.flag == "succeed"){
                    var html = '',
                        infor = data.info;                   
                    for(var i = 0; i < infor.length; i++){
                        html += '<li class="detail-li"><a href="/kmap/infor/?persion='+infor[i].user_id+'&name='+infor[i].username+'#id=0"'+infor[i].username+'>'+infor[i].username+'</a><span class="time hisHome">Ta的主页</span></li>';
                    }

                    $(".detail-uls").html(html);
                }
            },
            error : function (data){
                console.log(data);
            },
            dataType : "json"
        });
    }

    function showPerson(){
        $.ajax({
            type : "POST",
            data : {user_id : (__query ? __query.split("&")[0] : "login_user")},
            url : "/check/get_pay_attention_me/",
            //url : "http://121.199.47.141/check/get_pay_attention_me/",
            success : function (data){
                //console.log(data);
                if(data.flag == "succeed"){
                    var html = '',
                        infor = data.info;
                    for(var i = 0; i < infor.length; i++){
                        html += '<li class="detail-li"><a href="/kmap/infor/?persion='+infor[i].user_id+'&name='+infor[i].username+'#id=0"'+infor[i].username+'>'+infor[i].username+'</a><span class="time hisHome">Ta的主页</span></li>';
                    }

                    $(".detail-uls").html(html);                    
                }
            },
            error : function (data){
                console.log(data);
            },
            dataType : "json"
        })
    }

    function setting(){
        var __set = $('<div class="settings">\
                            <div class="head"><img class="headImg" src="/static/img/myface.jpg"></div>\
                            <input type="password" class="pass"  placeholder="请输入原始密码"/>\
                            <input type="password" class="passAg" placeholder="请输入要修改的密码" />\
                            <input type="password" class="passAgs" placeholder="请确认要修改的密码" />\
                            <button class="submitButton">确认修改</button>\
                    </div>\
            ');
        $(".detail").append(__set);
    }

    $(".detail").on("mouseenter",".head",function (){
        var __dom = $("<div class='coverHead'>点击修改头像</div>");
        $(this).append(__dom);
    }).on("mouseleave",".head",function (){
        $(".coverHead").remove();
    })

    function getLib(){
        $.ajax({
            type : "POST",
            data : {user_id : (__query ? __query.split("&")[0] : "login_user")},
            url  : "/check/get_user_map/",
            // url  : "http://121.199.47.141/check/get_user_map/",
            success : function (data){
                //console.log(data);
                if(data.flag == "succeed"){
                    var html = '';
                    var infor = data.info;
                    for(var i = 0; i < infor.length; i++){
                        html += '<li class="detail-li-lib"><img src="'+(infor[i].image ? infor[i].image : "/static/img/versib.png")+'" alt="仓库" width="178" height="100" /><p>创建时间:'+infor[i].map_time+'</p><p>'+infor[i].map_name+'</p><p><span class="glyphicon glyphicon-trash '+ (__query ? "lookingFor" : "del" ) +'" data-id="'+infor[i].map_id+'">'+ (__query ? "查看" : "删除" ) + '</span><span class="glyphicon glyphicon-edit '+(__query ? "getCools" : "editThat")+'" data-id="'+infor[i].map_id+'">'+(__query ? "收藏" : "编辑")+'</span></p></li>'
                    }
                    if(!__query)
                        html += '<li class="detail-li-lib addLi">+</li>';

                    $(".detail-uls").html(html);
                }
            },
            error : function (data){
                console.log(data);
            },
            dataType : "json"
        });
    }

    $(".detail").on('click','.addLi',function (){

        window.location.href = '/kmap/edit/';

    }).on('click','.editThat',function (){

        var __map_id = $(this).attr("data-id");
        window.location.href = '/kmap/edit/#mapid='+__map_id;

    }).on('click','.del',function (){

        var __map_id = $(this).attr("data-id"),
            that = this;    
//////////////////////////////////删除仓库
        $.ajax({
            type : "POST",
            data : {map_id : __map_id},
            url : "/check/delete_map/",
            // url : "http://121.199.47.141/check/delete_map/",
            success : function (data){
                //console.log(data);
                if(data.flag == "succeed"){
                    $(that).parent().parent().fadeOut(500,function (){
                        $(that).parent().parent().remove();
                    })
                }
            },
            error : function (data){
                console.log(data);
            },
            dataType : "json"
        })

    }).on('click','.lookingFor',function (){

        var __map_id = $(this).attr("data-id");
        window.location.href = '/kmap/tip/#mapid='+__map_id;

    }).on('click','.delCollect',function (){
///////////////////////////////取消收藏
        var __id = $(this).attr("data-id"),
            that = this;
        $.ajax({
            type : "POST",
            data : {map_id : __id},
            url : "/check/cancel_collect/",
            //url : "http://121.199.47.141/check/cancel_collect/",
            success : function (data){
                //console.log(data);
                if(data.flag == "succeed"){
                    $(that).parent().parent().fadeOut(500,function (){
                        $(that).parent().parent().remove();
                    });
                }
            },
            error : function (data){
                console.log(data);
            },
            dataType : "json"
        })
    }).on('click','.getCools',function (){
        var __id = $(this).attr("data-id"),
            __that = this; 
        $.ajax({
            type : "POST",
            data : {map_id : __id},
            url : "/check/collect_map/",
            // url : "http://121.199.47.141/check/collect_map/",
            success : function (data){
                //console.log(data);
                if(data.flag = "succeed"){
                    $(__that).html("已收藏");
                }
            },
            error : function (data){
                console.log(data);
            },
            dataType : "json"
        })
    });

    setTimeout(function(){
        $(".navbar-li").removeClass("active");
    },500);

    $(".detail-li-block").on('mouseenter',function (){

        $(this).find("div").animate({top:"0%",height:"100%"},200);

    }).on("mouseleave",function (){
        
        $(this).find("div").animate({top:"85%",height:"15%"},100);

    });

    $("h2").html($(".active-remind-li").text());    

    $(".detail").on('click','button',function (){
        var __pass = $(".pass").val(),
            __passA = $(".passAg").val(),
            __passAg = $(".passAgs").val();
        if(!__pass || !__passA || !__passAg){
            if(!$(this).hasClass('wrong')){
                $(".settings").append($('<p class="information">输入信息有误，请检查</p>'));
                $(this).addClass('wrong');
            }else{
                $('.information').html('输入信息有误，请检查');
            }
            return false;
        }
        if(__passA != __passAg){
            if(!$(this).hasClass('wrong')){
                $(".settings").append($('<p class="information">密码不一致</p>'));
                $(this).addClass('wrong');
            }else{
                $('.information').html('密码不一致');
            }
            return false;
        }
        //有一点点小问题后台sesion跨域问题，以和亮哥商讨过
        $.ajax({
            type : "POST",
            data : {old_pass : __pass, new_pass : __passA},
            url  : "/check/update_pass/",
            // url  : "http://121.199.47.141/check/update_pass/",
            success : function (data){
                console.log(data);
            },
            error : function (data){
                console.log(data);
            },
            dataType : "json"
        })
    });

    $("#infor").on('click','.addFocusYes',function (){
        var that = this;
        $.ajax({
            type : "POST",
            data : {attention_user : $(this).attr("data-id")},
            url  : "/check/pay_attention/",
            // url  : "http://121.199.47.141/check/pay_attention/",
            success : function (data){
                //console.log(data);
                if(data.flag == "succeed"){
                    $(that).html("以关注");
                }
            },
            error : function (data){
                console.log(data);
            },
            dataType : "json"
        });
    })

    $("body").on('mousewheel',function (){
        var __dom = $("#list-remind");
        var __top = __dom[0].getBoundingClientRect().top;
        if(__top <= 0){
            __dom.css({position:"fixed",top:0});
        }else{
            __dom.css({position:"absolute"});
        }
    })
});