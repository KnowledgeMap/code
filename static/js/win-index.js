$(document).ready(function (){

    var collect = [],push = [];

    $(".detail-ul").on('click','.img',function(){
        var __x = $(this).parent().attr("data-mapid");
        window.location.href = "/kmap/tip/#mapid="+__x;
    });

    $.ajax({
        type : "POST",
        data : {},
        // url  : "/check/get_collect_map/",
        url  : "http://121.199.47.141/check/get_collect_map/",
        success : function (data){
            //console.log(data);
            if(data.flag == "succeed"){
                var infor = data.info;
                for(var i = 0; i < infor.length; i++){
                    collect.push(infor[i].map_id)
                }
            }
        },
        error : function (data){
            console.log(data);
        },
        dataType : "json"
    });

    $.ajax({
        type : "POST",
        data : {},
        // url  : "/check/get_push_map/",
        url  : "http://121.199.47.141/check/get_push_map/",
        success : function (data){
            //console.log(data);
            if(data.flag == "succeed"){
                var infor = data.info;
                for(var i = 0; i < infor.length; i++){
                    push.push(infor[i].map_id)
                }
            }

        },
        error : function (data){
            console.log(data);
        },
        dataType : "json"
    });

    $.ajax({
        type : "POST",
        data : {},
        //url  : "/check/get_all_map/",
        url  : "http://121.199.47.141/check/get_all_map/",
        success : function (data){
            //console.log(data);
            if(data.flag == "succeed"){
                var html ='',
                    infor = data.info;
                for(var i = 0; i < infor.length; i++){
                    var collectContent = collect.indexOf(infor[i].map_id) == -1 ? "+ 收藏" : "已收藏";
                    var pushContent = push.indexOf(infor[i].map_id) == -1 ? false : true;
                    if(pushContent) continue;
                    html += '<li class="detail-li-block" data-mapid="'+infor[i].map_id+'"><img class="img" src="'+(infor[i].image ? infor[i].image : "/static/img/versib.png")+'"><div class="detail-div"><h4>'+infor[i].map_name+'</h4><p><img class="img_title" src="data:image/jpeg;base64,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"" width="30" heihgt="30"><a href="/kmap/infor/?persion='+infor[i].person_id+'&name='+escape(infor[i].username)+'#id=0">'+infor[i].username+'</a><span class="time">'+infor[i].map_time+'</span></p><div class="detail">'+infor[i].map_describe+'</div><p><span class="dislike" data-id="'+infor[i].map_id+'">- 不喜欢</span><span class="addFouce" data-id="'+infor[i].map_id+'">'+collectContent+'</span></p></div></li>'
                }

                $(".detail-ul").html(html);
            }
        },
        error : function (data){
            console.log(data);
        },
        dataType : "json"
    });

    $(".detail-ul").on('click','.addFouce',function (){
        var __id = $(this).attr("data-id"),
            __that = this;
            
        $.ajax({
            type : "POST",
            data : {map_id : __id},
            //url : "/check/collect_map/",
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
            //url : "/check/push_map/",
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
        });
    })   

});