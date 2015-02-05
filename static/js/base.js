(function (){
    var __x = $.cookie('yooyuName');
    if(__x){
        var __dom = $('<li class="navbar-li" data-id="2"><a href="/kmap/win/#navId=2" class="editLi">橱窗</a></li><li class="navbar-li" data-id="3"><a href="/kmap/admin/#navId=3" class="adminLi">管理台</a></li>'),
            __list = $('<ul class="navbar-text pull-right"><li class="list newList newList1" data-role="通知" data-url="2" data-name="notice"><a href="#"><span class="glyphicon glyphicon-volume-up"></span></a></li><li class="list newList newList2" data-role="站内信" data-url="3" data-name="message"><a href="#"><span class="glyphicon glyphicon-envelope"></span></a></li><li class="list" data-url="4"><a href="/kmap/infor#id=4"><span class="glyphicon glyphicon-inbox"></span></a></li><li class="dropdown list username"><a class="dropdown-toggle" data-toggle="dropdown" href="#"><img class="headLogo" src="/static/img/myface.jpg">'+__x+'<b class="caret"></b></a><ul class="dropdown-menu"><li class="setting"><a href="/kmap/infor#id=5"><span class="glyphicon glyphicon-folder-close padding"></span>收藏夹</a></li><li class="setting"><a href="/kmap/infor#id=6"><span class="glyphicon glyphicon-cog padding"></span>设置</a></li><li class="singOut"><a href="#"><span class="glyphicon glyphicon-off padding"></span>登出</a></li></ul></li></ul>')
        __dom.insertBefore('.insert');
        $(".rightList").remove();
        __list.insertAfter('.nav');
    }   
})()

$(document).ready(function (){
    var count = 0,__allData = {};
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?  
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    var csrftoken = getCookie('csrftoken');

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

    $(".loadingModule").animate({"width":"100%"},500,function (){
       $(this).fadeOut();
    });


    $(".searchIcon").click(function (){
        $.ajax({
            type : "POST",
            url : "/kmap/search",
            data : {searchContent : $(".search").val()},
            success : function (data){

            },
            error : function (err){

            },
            dataType : "json" 
        });
    });

    $(".lateX-list-liContent").click(function (){

        $(".lateX-list-liContent").removeClass("actives");
        $(this).addClass("actives");
        var x = $(this).attr("data-name");
        $(".showTableContent").removeClass('show').css("display","none");
        $(".showTableContent").filter(function (){
            return $(this).hasClass(x);
        }).css("display","block");

    });

    $("#lateXContent img").click(function (){
        var x = $(this).attr("alt");
        $("#MathInputSearch").val($("#MathInputSearch").val() + "$" + x + "$").trigger("input").focus();
    });

    var searchLeft = Number($(".nav").css("width").replace(/px/,'')) + Number($(".navbar-header").css("width").replace(/px/,'')) + 20 ;
    $("#search").css("left",searchLeft+ "px");

    $(".sum").click(function (){
       var x = $(window).height();
       $("#search").css({"position":"absolute","zIndex":333}).animate({"left":0,"width":"100%","height":"500px"},700).css("background-color","#eee");
       $(".scaleIcon").css("visibility","visible");
       $("#lateXContent").css("left","100px").css("display","inline-block");
       $("#rightSearch").css('display',"inline-block");
       var content = $(".search").val();
        $("#MathInputSearch").val(content).on('input',function (){
             Preview.Update();
             $(".search").val($(this).val());
        });
    });

    $(".scaleIcon,.searchIcon").click(function (){
        $("#lateXContent").css({"display":"none"});
        $("#search").animate({"left":searchLeft + "px","width":"350px","height":"50px"},700).css("background-color","#f8f8f8");
        $(".scaleIcon").css("visibility","hidden");
        $(".search").css("border","none");
       $("#rightSearch").css("display","none");
    });

    $(".singOut").click(function (){
        $.cookie('yooyuName', '', {expires: 7,path : '/'});
        $.cookie('yooyuNameId', '', {expires: 7,path : '/'});
        setTimeout(function (){
            window.location.href = "/";            
        },500);
    });

    $(".newList").click(function (){
        var __content = $(this).attr("data-role"),
            __urlId   = $(this).attr("data-url"),
            __x = this.getBoundingClientRect().left + document.documentElement.scrollLeft - 300 + 50,
            __y = this.getBoundingClientRect().top + document.documentElement.scrollTop + 50;
        $(".newList").removeClass("listClick");
        $(this).addClass("listClick");
        $(".titles").html(__content);
        $(".remind").html("全部"+__content).attr("href","/kmap/infor#id="+__urlId);
        $(".getResult").css({"left":__x+"px","display":"block"});
    });

    $("svg,.know-button,#content").click(function (){
        $(".newList").removeClass("listClick");
        $(".getResult").css("display","none");
    });  

    var __contentId = window.location.hash.split("=")[1];

    if(!__contentId){
        $(".navbar-li").first().addClass("active");
    }else{
        $(".navbar-li").filter(function (){
            var x = $(this).attr("data-id");
            return x == __contentId;
        }).addClass("active");
    }

//获取站内信
    $.ajax({
        type : "GET",
        data : {},
        url : "http://121.199.47.141/check/get_message/",
        success : function (data){
            //console.log(data);
            if(data.flag == "succeed"){
                var __messages = '',html = '';
                $(".newList2").find('a').append($('<span class="red-circle">'+data.info.length+'</span>'));
                for(var i = 0, infor = data.info; i < (infor.length > 5 ? 5 : infor.length); i++){
                    html += '<li><a href="/kmap/infor/#id=3">'+infor[i].content+'</a></li>';
                }
                showDetail($(".newList2"),html);

                for(var i = 0; i < data.info.length; i++){
                    __messages += '<li class="detail-li">'+data.info[i].username+' 向您发来消息 '+data.info[i].content+'<span class="time">'+data.info[i].send_time+'</span></li>';
                }

                __allData.message = __messages;

                if(window.location.hash.split("=")[1]){
                    var __id = window.location.hash.split("=")[1];
                    if(__id == 3){
                        $(".detail-uls").html(__messages);
                    }
                }
            }
        },
        error : function (data){
            console.log(data);
        },
        dataType : "json"
    });
//获取通知
    $.ajax({
        type : "POST",
        data : {},
        url : "http://121.199.47.141/check/get_notice/",//send_notice为发送通知
        success : function (data){
            //console.log(data);
            if(data.flag == "succeed"){
                var html = '',__notices = '';
                $(".newList1").find('a').append($('<span class="red-circle">'+data.info.length+'</span>'));
                for(var i = 0, infor = data.info; i < (infor.length > 5 ? 5 : infor.length); i++){
                    html += '<li><a href="/kmap/infor/#id=3">'+infor[i].content+'</a></li>';
                }

                showDetail($(".newList1"),html);

                for(var i = 0; i < data.info.length; i++){
                    __notices += '<li class="detail-li">'+data.info[i].content+'<span class="time">'+data.info[i].send_time+'</span></li>';
                }
                __allData.notice = __notices;

                if(window.location.hash.split("=")[1]){
                    var __id = window.location.hash.split("=")[1],html = '';
                    if(__id == 2){
                        $(".detail-uls").html(__notices);
                    }
                }
            }
        },
        error : function (data){
            console.log(data);
        },
        dataType : "json"
    }); 

    function showDetail(dom,html){
        dom.on('click',function (){
            $(".rec_con").html(html);  
        })
    }

    $(".remind-li").on('click',function (){
        var __name = $(this).attr('data-name');
        $(".detail-uls").html(__allData[__name]);
    })

});