$(document).ready(function (){
    $(".detail-ul").on('click','.img',function(){
        var __x = $(this).parent().attr("data-mapid");
        window.location.href = "/kmap/tip/#mapid="+__x;
    });

    $(".detail-ul").on('click','.addFouce',function (){
        var __id = $(this).attr("data-id"),
            __that = this;
        $.ajax({
            type : "POST",
            data : {map_id : __id},
            url : "http://121.199.47.141/check/collect_map/",
            success : function (data){
                //console.log(data);
                if(data.flag = "succeed"){
                    $(__that).html(" 已收藏");
                }
            },
            error : function (data){
                console.log(data);
            },
            dataType : "json"
        })
    })

    $(".detail-ul").on('click','.dislike',function (){
        var __id = $(this).attr("data-id"),
            __that = this;
        $.ajax({
            type : "POST",
            data : {map_id : __id},
            url : "http://121.199.47.141/check/push_map/",
            success : function (data){
                //console.log(data);
                if(data.flag = "succeed"){
                    $(__that).parent().parent().parent().animate({left:"-500px"},800,'swing',function (){
                        $(this).remove();
                    });
                }
            },
            error : function (data){
                console.log(data);
            },
            dataType : "json"
        })
    })

    $.ajax({
        type : "POST",
        data : {},
        url  : "http://121.199.47.141/check/get_all_map/",
        success : function (data){
            //console.log(data);
            if(data.flag == "succeed"){
                var html ='',
                    infor = data.info;
                for(var i = 0; i < infor.length; i++){
                    html += '<li class="detail-li-block" data-mapid="'+infor[i].map_id+'"><img class="img" src="'+(infor[i].image ? infor[i].image : "/static/img/versib.png")+'"><div class="detail-div"><h4>'+infor[i].map_name+'</h4><p><img class="img_title" src="/static/img/myface.jpg" width="30" heihgt="30">'+infor[i].username+'<span class="time">'+infor[i].map_time+'</span></p><div class="detail">'+infor[i].map_describe+'</div><p><span class="dislike " data-id="'+infor[i].map_id+'">- 不出现</span><span class="addFouce" data-id="'+infor[i].map_id+'">+ 收藏</span></p></div></li>'
                }

                $(".detail-ul").html(html);
            }
        },
        error : function (data){
            console.log(data);
        },
        dataType : "json"
    });

    

});