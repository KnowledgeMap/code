$(document).ready(function (){
    
    var __query = window.location.search.split("=")[1],
        __name = unescape(window.location.search.split("=")[2]);
    __query ? query() : "";

    function query(){
        var html = '\
            <li class="remind-li" data-url="0" data-name=""><span class="paddingRight glyphicon glyphicon-star"></span>'+__name+'关注的人</li>\
            <li class="remind-li" data-url="1" data-name=""><span class="paddingRight glyphicon glyphicon-star-empty"></span>关注'+__name+'的人</li>\
            <li class="remind-li" data-url="4" data-name=""><span class="paddingRight glyphicon glyphicon-inbox"></span>'+__name+'的仓库</li>';
        $(".remind-ul").html(html);
        $("<span class='addFocus addFocusYes' data-id='"+__query.split("&")[0]+"'>＋加关注</span><span class='addFocus commit' data-id='"+__query.split("&")[0]+"'>发站内信</span>").insertBefore("h2");

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
        $(".list").removeClass('listClick');        
        switch(__id){
            case '0' : $(".settings,.upload,.All,.deleteSelect,.readedSelect").remove();showTakeMe();break;
            case '1' : $(".settings,.upload,.All,.deleteSelect,.readedSelect").remove();showPerson();break;
            case '2' : $(".settings,.upload,.All,.deleteSelect,.readedSelect").remove();break;
            case '3' : $(".settings,.upload").remove();$("#infor").append($("<span class='All'><input name='selectall' type='checkbox' class='selectAll' id='all'/><label for='all' class='selectAll'>&nbsp;&nbsp;全选</label></span><span class='addFocus readedSelect'>已读选中</span><span class='addFocus deleteSelect'>删除选中</span>"));break;
            case '4' : $(".settings,.upload,.All,.deleteSelect,.readedSelect").remove();getLib();break;
            case '5' : $(".settings,.upload,.All,.deleteSelect,.readedSelect").remove();getCool();break;
            case '6' : $(".detail-uls").html('');setting(); break;
        }
    }

    function getCool(){
        $.ajax({
            type : "POST",
            data : {},
            // url  : "/check/get_collect_map/",
            url  : "http://121.199.47.141/check/get_collect_map/",
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
            // url : "/check/get_i_pay_attention/",
            url : "http://121.199.47.141/check/get_i_pay_attention/",
            success : function (data){
                if(data.flag == "succeed"){
                    var html = '',
                        infor = data.info;                   
                    for(var i = 0; i < infor.length; i++){
                        html += '<li class="detail-li"><a href="/kmap/infor/?persion='+infor[i].user_id+'&name='+escape(infor[i].username)+'#id=0"'+infor[i].username+'>'+infor[i].username+'</a><span class="time hisHome">Ta的主页</span></li>';
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
            // url : "/check/get_pay_attention_me/",
            url : "http://121.199.47.141/check/get_pay_attention_me/",
            success : function (data){
                //console.log(data);
                if(data.flag == "succeed"){
                    var html = '',
                        infor = data.info;
                    for(var i = 0; i < infor.length; i++){
                        html += '<li class="detail-li"><a href="/kmap/infor/?persion='+infor[i].user_id+'&name='+escape(infor[i].username)+'#id=0"'+infor[i].username+'>'+infor[i].username+'</a><span class="time hisHome">Ta的主页</span></li>';
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
                            <div class="head"><img class="headImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJwAAACcCAIAAAAF2lUaAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAd5SURBVHja7J3NTvM6EIYTJ1CxACSQ4H4q1Itui7geJCRUsUBUTfstrGPl2Ikzdmxn7L6zgv7EyTx+Z8aOndaXy6WClWUCLgBUGKDCABUGqDBABVQYoMIAFQaoMEAFVBigwgAVBqgwQIUBKqDCABUGqDBAhQEqoMIAFQaoMECFBbD2Sq6zruv+v2VvNqkLuzwNnpMV44pCoM5hWR7dvKGGZVkM3VyhuuLcbrf9fzebTcFoM4NKZKkhnDQi41x8lRNUO1FXkH6Ms3BXHlCT4SwDLXeoFpyRWBaAljXUMaJpcFLQ8vQeX6iDRNPjnETL0IFMoTIkakHLzYccoZpEmeDMhSs7qPyJjqHl40kBot6mnVvsOcssoeZFlDNXAaLlcRUgWh5XAaLlcRXMvZMv1+uFqvXofIlSItBVQOUzBigsCAu2HkEQzg9qeTLlc5kCHby8a1lm7tepPrLcpubcFfqnndjJbShIwc+bshhMfSYqXfNMmMeVMDCk8oiHosh0chFJ7CkLSpeabHEpsbLbSzN2q1JRlFFB+Ui9Lr84Hy19SXCaOLGwUon9sS8y+xprdbTj8bhardTrh8Ph4eEhxiTG2AnI439+fr68vFTkhRlLKTUw1Mmzt3jfcs/ZdOJgK5bu4o3TcnWUFLAI1/BDGvrIzJWo3aHaB5w2VmiuH/P+/f29Blj75GazcWrXdF2QcW14pdp75aCY7N25D7XrurZtJzu+k2SJrdODxFh/Jcaw+UTCKJXii7EX7T79/v7u/9s0jfzj7u7O0qnpkg0VHk3JOsWwsBNPEWeUKHslJn369PQk//j7++u//vv7S/fyGNfJ1uu6bppG9qTD4WDvTBSuCYhWsacJ6/9svkpub2/nqMd0MbH1ruu6rrtcLrLetncmD64xnlsQbCYo0r58M9PQK23vLD7WOj3taY2OpVV6LbKMUvtns91u6SOK2IW+d0kctdFQhW5cpVI0EVCpTdPIqOg910ERaxClaldqZ8lLqZaCyBSu9opHt6UQ1Q5rnoNH7qCkdsvwJgHRwFBdA52J1nJM+S7d+xrOwXTgwfV4PHpPmdkvn2/165HA/BRzOp38BOrRetM0dV1rI2ZKmrQTraJNIsYNv0G4Sn6vr6/9t9QshLdQKK1LR3dd1x8xE5No/7Da37Hv6oSH6jcGt6RYye/r62tyooAScl1b9xvOUZqOV4pHUao31zHnylnfsSLFKe65Jnh5Lappc6BpNu1BNOy4LtZNcq12p/dKLdmoNRWn00lO5Q/OQszBqX3dbPrv70/ezf35+bEnYGLrsTe2xl14NudJHK7RKf1yFqfWUz4KJPpqwvl6svs3XtHhUQ24Hi2S81MsEc16X1uQBaqJH+tyLQ9xnpNlsztnPG59GYsaIKNDnVztAMsM6pzlfWVb1I1TItPzzsj6YSlNzxZpiMqLgVj7TojX6UXKy7jytGr6IRJXEVumUGf6YdKSK/SvLaEmC8JiwS6JgU0eSp0MvFcVje11bzyxYkapwEpYpJQpInCW4ZdD7ZfXnEMMsYoFZQqxlqNUP7EKIWZu6U0zVnGSaSSximVlandQ//W3tzdFd+zDaj9yJIqsehXH6tfpZxL7wBRdzd1VVa3X68HjWHgMvm7npx4DQ+mLxC4ets4QC8rUievpdNrtdvv9fk4Y0JpQ/07ikX+o1i2nOvOeTJAInNM49XK5nM9nO6e2bc1339/fzV14m83m8fGRDriqqvP5nEXpLpaSKVGssj6yVE9VVT0/P8tD7ff7/h4bRVTumzBP73A4yLXXHx8fskOoy5ncijkWzL29EbBcmruaMMgNGc1Bgw61e9nyruXBPvv9Xkpfe2u320m3yFyuOorZytjB/VxBfI5LluHXdaHv2FakyX8VUWU3Nzd9n26328HtdeY9/7BV8UyxzlJqwPumFrH29aSirqqBlarMQw2ekvru2BfNb7Vtu16vLRc4dvJLiZULVFfXDMLmEFdCde5loMb4oYqwDsqOaCiuYXJqKO+bxTDnGRy2XTCDHxviyZVzUPEMv7GXlnF+wnmCc5sZgZnOKA3qdXHJDp4Dw8TPd5pwcJ/9glwHcfIs5XzCb+JlvfYppGJCbsAInMH+VPORQ1W4n0HIOrtnDFW50vJ413ilSnZEq7x2kg9KNizdTH+tam5OZbJPJsiPAQU8Dqu0muszHyiPnp1ZKue7lLX1lin/mHyFOPNWqgXDGODVaqX9ukIuIF1/H9Hx09h4mkNaxQapAk34yRSWPgJHVypibyFKhYUdRhcLFVveYkREKDWb/kpPq8LjiKESKmSKnFp+2ARU9A9+UJPd5b7CMhBKzcmItZJwPRamHZzC5iJiXUapqHsRfiH6bTZQEcmhVKTVcFCDV0lIqFAq7H9yooxqALXAap/LE89g6aBiCUuOfTe1Uq+2Spp/4fT+gZyan02GTxGjp8CucUiD/lEO1Cufdkh2+cipWYYle1oVGM+U1z9Esu6GKd/CCyWkVUCFsYeK8QyUCgPU0kc1lBurIs14BqUvO6UiCyL8on8sHLSQU6FUGKDCFrF/AwDWSw8iHgbvvAAAAABJRU5ErkJggg=="></div>\
                            <input type="password" class="pass"  placeholder="请输入原始密码"/>\
                            <input type="password" class="passAg" placeholder="请输入要修改的密码" />\
                            <input type="password" class="passAgs" placeholder="请确认要修改的密码" />\
                            <button class="submitButton">确认修改</button>\
                    </div>\
            ');
        $(".detail").append(__set);
    }

    $("body").on('click','.coverHead',function (){
        var __upload_box = $("<div class='upload'>\
                                <span class='glyphicon glyphicon-remove remove'></span>\
                                <input type='text' class='upload_text'>\
                                <input type='button' class='upload_input_block' value='浏览...'>\
                                <input type='file' class='upload_input_none'>\
                                <input type='button' class='upload_submit' value='上传'>\
                                <div class='min'></div>\
                                <div class='max'></div>\
                            </div>");
        $("body").append(__upload_box);
    }).on('click','.remove',function (){
        $(this).parent().remove();
    })

    $("body").on('click','.upload_input_block',function (){
        $(".upload_input_none").click();
    });

    $('body').on('change','.upload_input_none',function (e){
        var str = $(this).val()
        $(".upload_text").val(str);
        var resultFile = $(".upload_input_none")[0].files[0];
        if(resultFile){
            var reader = new FileReader();
            reader.readAsDataURL(resultFile);
            reader.onload = function (){
                urlData = this.result
                $(".min,.max").find('img').remove().end().append($("<img class='imgfaceOfUpload' src='"+urlData+"'>"));
            }
        }
    })

    $("body").on('click','.upload_submit',function (){
        $(".upload").remove();
        urlData ? $(".headImg").attr("src",urlData) : "";
    })

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
            // url  : "/check/get_user_map/",
            url  : "http://121.199.47.141/check/get_user_map/",
            success : function (data){
                //console.log(data);
                if(data.flag == "succeed"){
                    var html = '';
                    var infor = data.info;
                    for(var i = 0; i < infor.length; i++){
                        html += '<li class="detail-li-lib"><img class="libImg" src="'+(infor[i].image ? infor[i].image : "/static/img/versib.png")+'" alt="仓库" width="178" height="100"  data-id="'+infor[i].map_id+'"/><p>创建时间:'+infor[i].map_time+'</p><p>'+infor[i].map_name+'</p><p><span class="glyphicon glyphicon-trash '+ (__query ? "lookingFor" : "del" ) +'" data-id="'+infor[i].map_id+'">'+ (__query ? "查看" : "删除" ) + '</span><span class="glyphicon glyphicon-edit '+(__query ? "getCools" : "editThat")+'" data-id="'+infor[i].map_id+'">'+(__query ? "收藏" : "编辑")+'</span></p></li>'
                    }
                    if(!__query)
                        html += '<li class="detail-li-lib addLi">+</li><li class="detail-li-lib last"></li>';

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
            // url : "/check/delete_map/",
            url : "http://121.199.47.141/check/delete_map/",
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
            // url : "/check/cancel_collect/",
            url : "http://121.199.47.141/check/cancel_collect/",
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
            // url : "/check/collect_map/",
            url : "http://121.199.47.141/check/collect_map/",
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
    }).on('click','.libImg',function (){
        var __id = $(this).attr("data-id");
        window.location.href = "/kmap/tip/#mapid="+__id;
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

    $(".detail").on('click','button.submitButton',function (){
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
            data : {old_pass : __pass, new_pass : __passA, headImg : $(".headImg").attr("src")},
            // url  : "/check/update_pass/",
            url  : "http://121.199.47.141/check/update_pass/",
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
            // url  : "/check/pay_attention/",
            url  : "http://121.199.47.141/check/pay_attention/",
            success : function (data){
                console.log(data);
                if(data.flag == "succeed"){
                    $(that).html("以关注");
                }else{
                    $(that).html('关注失败');
                }
            },
            error : function (data){
                console.log(data);
            },
            dataType : "json"
        });
    }).on('click','.commit',function(){
        var __comm = $("<div class='submitComm'><span class='close'>x</span><textarea id='text' class='submitText' placeholder='输入消息,按下回车+ctrl发送'></textarea></div>"),
            __that = this;
            __id = $(this).attr("data-id");
        $("#infor").append(__comm);
        $("#infor").on('focus','.submitText',function (){
            $("body").on('keydown',function (e){
                var e = e || event;
                if(e.keyCode == 13 && e.ctrlKey){
                    $.ajax({
                            type : "POST",
                            data : {rec_user : __id, content : $("#text").val()},
                            // url : '/check/send_message/',
                            url : 'http://121.199.47.141/check/send_message/',
                            success : function (data){
                                //console.log(data);
                                    if(data.flag == "succeed"){
                                        $(".commit").html('已发送');
                                        $(".submitComm").remove();
                                    }else{
                                        $(".commit").html('发送失败');
                                        $(".submitComm").remove();
                                    }
                            },
                            error : function (data){
                                console.log(data);
                            },
                            dataType : "json"
                    });
                }
            })
        });
    }).on('click','.close',function (){
        $(".submitComm").remove();
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