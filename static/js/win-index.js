$(document).ready(function (){
    $(".detail-ul").on('click','.img',function(){
        var __x = $(this).parent().attr("data-mapid");
        window.location.href = "/kmap/tip/#mapid="+__x;
    });

    $.ajax({
        type : "POST",
        data : {},
        url  : "http://121.199.47.141/check/get_all_map/",
        success : function (data){
            console.log(data);
            if(data.flag == "succeed"){
                var html ='',
                    infor = data.info;
                for(var i = 0; i < infor.length; i++){
                    html += '<li class="detail-li-block" data-mapid="'+infor[i].map_id+'"><img class="img" src="'+(infor[i].image ? infor[i].image : "/static/img/versib.png")+'"><div class="detail-div"><h4>'+infor[i].map_name+'</h4><p><img class="img_title" src="/static/img/myface.jpg" width="30" heihgt="30">'+infor[i].username+'<span class="time">'+infor[i].map_time+'</span></p><div class="detail">'+infor[i].map_describe+'</div><p><span class="dislike ">- 不出现</span><span class="addFouce">+ 收藏</span></p></div></li>'
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