(function (){
    var __x = $.cookie('yooyuName');
    if(__x){
        var __dom = $('<li class="navbar-li" data-id="2"><a href="/kmap/win/#navId=2" class="editLi">橱窗</a></li><li class="navbar-li" data-id="3"><a href="/kmap/admin/#navId=3" class="adminLi">管理台</a></li>'),
            __list = $('<ul class="navbar-text pull-right"><li class="list newList newList1" data-role="通知" data-url="2" data-name="notice"><a href="#"><span class="glyphicon glyphicon-volume-up"></span></a></li><li class="list newList newList2" data-role="站内信" data-url="3" data-name="message"><a href="#"><span class="glyphicon glyphicon-envelope"></span></a></li><li class="list" data-url="4"><a href="/kmap/infor#id=4"><span class="glyphicon glyphicon-inbox"></span></a></li><li class="dropdown list username"><a class="dropdown-toggle" data-toggle="dropdown" href="#"><img class="headLogo" src="'+localStorage.getItem("headImage")+'">'+__x+'<b class="caret"></b></a><ul class="dropdown-menu"><li class="setting"><a href="/kmap/infor#id=5"><span class="glyphicon glyphicon-folder-close padding"></span>收藏夹</a></li><li class="setting"><a href="/kmap/infor#id=6"><span class="glyphicon glyphicon-cog padding"></span>设置</a></li><li class="singOut"><a href="#"><span class="glyphicon glyphicon-off padding"></span>登出</a></li></ul></li></ul>')
        __dom.insertBefore('.insert');
        $(".rightList").remove();
        __list.insertAfter('.nav');
    }   
})()

$(document).ready(function (){
    var count = 0,__allData = {},NOTICE=[],MESSAGE=[];

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

    $("body").on('keydown',function (e){
        var e = e || event;
        if(e.keyCode == 27){
            $("#lateXContent").css({"display":"none"});
            $("#search").animate({"left":searchLeft + "px","width":"350px","height":"50px"},700).css("background-color","#f8f8f8");
            $(".scaleIcon").css("visibility","hidden");
            $(".search").css("border","none");
            $("#rightSearch").css("display","none");            
        }
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
        // url : "/check/get_message/",
        url : "http://121.199.47.141/check/get_message/",
        success : function (data){
            //console.log(data);
            if(data.flag == "succeed"){
                var __messages = '',html = '',count = 0;
                for(var i = 0, infor = data.info; i < infor.length; i++){
                    if(infor[i].rec_flag == '0'){
                        count++;
                        MESSAGE.push(infor[i].message_id);
                        if(count <= 5)
                            html += '<li><a href="/kmap/infor/#id=3">'+data.info[i].username+' <span class="grayColor">向您发来消息 </span>'+infor[i].content+'</a><span class="readed readedNotice readMess" data-id="'+infor[i].message_id+'">未读</span></li>';
                    }
                }

                if(count != 0){
                    setTimeout(function (){
                        $(".newList2").find('a').append($('<span class="red-circle">'+ (count > 99 ? "..." : count )+'</span>'))
                    },500);
                }

                showDetail($(".newList2"),html,'newList2');
                $(".All").remove();

                for(var i = 0; i < data.info.length; i++){
                    __messages += '<li class="detail-li"><p><input type="checkbox" class="checkbox"  data-id = "'+infor[i].message_id+'"/><a href="/kmap/infor/?persion='+infor[i].send_user+'&name='+escape(infor[i].username)+'#id=0" class="__username__mes">'+data.info[i].username+'</a> <span class="grayColor">向您发来消息</span>'+data.info[i].content+'<span class="readed readed_up deleteMes" data-id="'+infor[i].message_id+'">删除</span><span class="readed readed_up readMess" data-id="'+infor[i].message_id+'">'+(infor[i].rec_flag == '0' ? "未读" : "已读")+'</span><span class="readed readed_up resend" data-id="'+infor[i].send_user+'">回复</span><span class="time">'+data.info[i].send_time+'</span></p></li>';
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
        // url : "/check/get_notice/",
        url : "http://121.199.47.141/check/get_notice/",//send_notice为发送通知
        success : function (data){
            //console.log(data);
            if(data.flag == "succeed"){
                var html = '',__notices = '',count = 0;
                for(var i = 0, infor = data.info; i < infor.length; i++){
                    if(infor[i].flag == '0'){
                        count++;
                        NOTICE.push(infor[i].notice_id);
                        if(count <= 5)
                            html += '<li><a href="/kmap/infor/#id=2">'+infor[i].content+'</a><span class="readed readNotic" data-id="'+infor[i].notice_id+'">未读</span><span class="time_up">'+infor[i].send_time+'</span></li>';
                    }
                }
                if(count != 0){
                    setTimeout(function (){
                        $(".newList1").find('a').append($('<span class="red-circle">'+(count > 99 ? "..." : count )+'</span>'));
                    },500);
                }
                showDetail($(".newList1"),html,'newList1');

                for(var i = 0; i < data.info.length; i++){
                    __notices += '<li class="detail-li">'+data.info[i].content+'<span class="readed readed_up readNotic" data-id="'+infor[i].notice_id+'">'+ (infor[i].flag == '0' ? "未读" : "已读")  +'</span><span class="time">'+data.info[i].send_time+'</span></li>';
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

    function showDetail(dom,html,obj){
        dom.on('click',function (){
            $(".rec_con").html(html);  
        }).find(".red-circle").remove();
        switch(obj){
            case 'newList1' : change1() ;break;
            case 'newList2' : change2() ;break;
        }
    }

    var change1 = function (){
        //console.log("notice");

        //将通知全部标记为已读


    }

    var change2 = function (){
        //console.log("message");

        //将站内信全部标记为已读
    }

    $(".remind-li").on('click',function (){
        var __name = $(this).attr('data-name');
        $(".detail-uls").html(__allData[__name]);
    })

    $("body").on('click','.readNotic',function (){
        var __noticeId = $(this).attr("data-id"),
            that = this;
        $.ajax({
            type : "POST",
            data : {notice_id : __noticeId},
            // url : "/check/rec_notice/",
            url : "http://121.199.47.141/check/rec_notice/",
            success : function (data){
                //console.log(data);
                if(data.flag == "succeed"){
                    $(that).html("已读");
                }
            },
            error : function (data){
                console.log(data);
            },
            dataType : "json"
        });
    }).on('click','.readMess',function (){
        var __messId = $(this).attr("data-id"),
            that = this;
        $.ajax({
            type : "POST",
            data : {message_id : __messId},
            // url : "/check/rec_message/",
            url : "http://121.199.47.141/check/rec_message/",
            success : function (data){
                //console.log(data);
                if(data.flag == "succeed")
                    $(that).html("已读");
            },
            error : function (data){
                console.log(data);
            },
            dataType : "json"
        })
    }).on('click','.newList',function (){

        $(this).find("span.red-circle").remove();

    }).on('click','.notice',function (){

        $(".newList1").find("span.red-circle").remove();

    }).on('click','.message',function (){

        $(".newList2").find("span.red-circle").remove();

    }).on('click','.resend',function (){

        $(".__resend,.__resendButton").remove();
        var __resendModule = $("<textarea class='__resend sendMes' placeholder='ESC可退出回复'></textarea><button class='__resendButton send' data-id='"+$(this).attr('data-id')+"'>回复</button>");
        $(this).parent().parent().append(__resendModule);
        $("body").keydown(function (e){
            if(e.keyCode == 27){
                __resendModule.remove();
            }
        });

    }).on('click','.send',function (){
        var __user_id = $(this).attr("data-id"),
            __mes = $(".sendMes").val(),
            __that = this;
        $.ajax({
            type : "POST",
            data : {rec_user : __user_id, content : __mes},
            // url : '/check/send_message/',
            url : 'http://121.199.47.141/check/send_message/',
            success : function (data){
                //console.log(data);
                    if(data.flag == "succeed"){
                        $(__that).html("回复成功");
                   }
            },
            error : function (data){
                console.log(data);
            },
            dataType : "json"
        });
    }).on('click','.All',function (){

        var __bool = document.getElementById('all').checked;
        $(".checkbox").prop("checked",__bool);

    }).on('click','.checkbox',function (){

        var __length = $(".checkbox:checked").length;
        document.getElementById('all').checked = __length == $(".checkbox").length ? true : false;

    }).on('click','.deleteMes',function (){
        var __id = $(this).attr("data-id"),
            __that = this;
        $.ajax({
            type : "POST",
            url : "http://121.199.47.141/check/del_message/",
            data : {message_id : __id},
            success : function (data){
                if(data.flag == "succeed"){
                    var __li = $(__that).parent().parent().remove();
                }
            },
            error : function (data){

            },
            dataType : "json"
        });
    }).on('click','.deleteSelect',function (){
        var __id = '',
            __that = this;
        $(".checkbox:checked").each(function (){
            __id += $(this).attr("data-id") + "_";
        });
        if(__id != ''){
            __id = __id.substring(0,__id.length - 1);
            $.ajax({
                type : "POST",
                url : "http://121.199.47.141/check/del_message/",
                data : {message_id : __id},
                success : function (data){
                            if(data.flag == "succeed"){
                                var time = 200;
                                $(".checkbox:checked").each(function (){
                                    var __that = this;
                                    setTimeout(function (){
                                        $(__that).parent().parent().animate({opacity : 0},200).animate({height:0},300,function (){
                                            $(this).remove();
                                        });
                                    },time);
                                    time+=600;
                                });
                            }
                },
                error : function (data){

                },
                dataType : "json"
            });           
        }
    }).on('click','.readedSelect',function (){
        var __id = '',
            __that = this;
        $(".checkbox:checked").each(function (){
            __id += $(this).attr("data-id") + "_";
        });
        if(__id != ''){  
            __id = __id.substring(0,__id.length - 1);  
            $.ajax({
                type : "POST",
                data : {message_id : __id},
                // url : "/check/rec_message/",
                url : "http://121.199.47.141/check/rec_message/",
                success : function (data){
                    //console.log(data);
                    if(data.flag == "succeed"){
                             $(".checkbox:checked").each(function (){
                                var __that = this;
                                $(this).parent().find('.readMess').html('已读');
                            });   
                    }
                },
                error : function (data){
                    console.log(data);
                },
                dataType : "json"
            })
        }
    });

});